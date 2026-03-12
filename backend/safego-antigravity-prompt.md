# SafeGo — Full Backend Build Prompt for Antigravity

---

## Project Overview

**SafeGo** is a ride safety platform built for the Philippines. The frontend is a React + TypeScript + Vite application. Your task is to build the **complete, production-ready backend** that powers every page, form, button, and data flow in this frontend.

**Frontend repository:** https://github.com/AppleYT9/safego-design-system.git

Clone and study the repository before writing any code. Pay close attention to every page, component, form field, API call pattern, and data shape used in the UI.

---

## Tech Stack (strictly required)

| Layer | Technology |
|-------|-----------|
| Language | Python 3.11+ |
| Framework | FastAPI |
| Database | MySQL 8+ |
| ORM | SQLAlchemy 2.0 (async-compatible) |
| Auth | JWT (python-jose) + bcrypt (passlib) |
| Realtime | WebSockets (built-in FastAPI) |
| Validation | Pydantic v2 |
| Migrations | Alembic |
| HTTP Client | httpx (for OSRM calls) |
| Server | Uvicorn |

---

## Frontend Pages & What the Backend Must Support

### 1. `/` — Splash Screen
- No auth required. Static.

### 2. `/home` — Landing / Mode Selection
- Serve mode metadata: `normal`, `pink`, `pwd`, `elderly`
- No auth required.

### 3. `/login` and `/signup` — Auth Page
- Fields on signup: `full_name`, `email`, `phone`, `password`, `confirm_password`
- Role toggle: `passenger` or `driver`
- POST `/api/auth/register` — register user with role
- POST `/api/auth/login` — return JWT access token + role + user_id
- GET `/api/auth/me` — return current user profile

### 4. `/book/:mode` — Booking Page
- Mode param: `normal | pink | pwd | elderly`
- Pickup + destination text inputs → route calculation
- Date + time picker for scheduled rides
- POST `/api/map/route` — accepts pickup/destination coords + mode, returns distance_km, duration_minutes, fare_amount (PHP), safety_score (0–100), route polyline
- POST `/api/rides/request` — creates ride, auto-matches nearest available driver
- POST `/api/rides/:id/confirm` — passenger confirms the matched driver
- GET `/api/map/nearby-drivers` — returns nearby online drivers with ETA

### 5. `/ride/tracking` — Live Ride Tracking
- Receive `rideId` via router state
- GET `/api/rides/:id` — fetch full ride details including driver info
- GET `/api/rides/active` — fetch currently active ride for logged-in user
- WebSocket `ws://host/ws/ride/:rideId/track?token=JWT` — passenger subscribes to live driver GPS updates
- POST `/api/safety/sos` — trigger SOS emergency alert (with GPS coords if available)
- POST `/api/safety/sos/:id/cancel` — cancel false alarm SOS
- PUT `/api/rides/:id/status` — update ride status (driver_arriving → in_progress → completed)

### 6. `/dashboard` — Passenger Dashboard
- GET `/api/users/me` — user profile
- GET `/api/rides/me` — full ride history with driver info, fare, mode, status, date
- Stats: total rides, safety score %, most used mode, rides this month
- Quick book links per mode
- POST `/api/rides/:id/rate` — submit rating (1–5 stars + comment) on completed rides
- GET `/api/users/me/emergency-contacts` — list emergency contacts
- POST `/api/users/me/emergency-contacts` — add emergency contact
- PUT `/api/users/me/emergency-contacts/:id` — update contact
- DELETE `/api/users/me/emergency-contacts/:id` — remove contact
- GET `/api/users/me/notifications` — notification list

### 7. `/driver` — Driver Portal
- GET `/api/drivers/me` — driver profile with status, rating, vehicle, certified modes
- GET `/api/drivers/me/earnings` — today_rides, today_earnings, total_rides, acceptance_rate, average_rating
- PUT `/api/drivers/me/online-status` — toggle online/offline
- GET `/api/drivers/me/available-rides` — list open ride requests matching driver's mode certifications
- POST `/api/drivers/me/rides/:id/accept` — accept a ride
- POST `/api/drivers/me/rides/:id/decline` — decline a ride
- GET `/api/drivers/me/documents` — list document records (national_id, drivers_license, vehicle_registration, nbi_clearance)
- PUT `/api/drivers/me/documents/:id/upload` — submit document file URL
- WebSocket `ws://host/ws/driver/:driverId/location?token=JWT` — driver streams live GPS to server; server persists to DB and broadcasts to subscribed passengers and admin

### 8. `/admin` — Admin Dashboard
- GET `/api/admin/stats` — total_users, total_drivers, active_drivers, pending_drivers, total_rides, active_rides, total_sos_alerts, active_sos_alerts
- GET `/api/admin/analytics/rides-by-mode` — `[{ mode, rides }]` for bar chart
- GET `/api/admin/analytics/safety-scores` — `[{ month, score }]` for last 6 months line chart
- GET `/api/admin/drivers/pending` — list drivers awaiting approval
- PUT `/api/admin/drivers/:id/approval` — approve or reject driver (body: `{ status, notes }`)
- PUT `/api/admin/drivers/:id/documents/:docId` — update document status (verified/rejected)
- GET `/api/admin/rides/live` — all in-progress rides
- GET `/api/admin/rides` — paginated ride history with filters (status, mode)
- GET `/api/admin/sos-alerts` — all SOS alerts filtered by status
- PUT `/api/safety/sos/:id/resolve` — mark SOS as resolved or false_alarm
- GET `/api/admin/users` — paginated user list with role filter
- PUT `/api/admin/users/:id/toggle-active` — enable/disable user account
- WebSocket `ws://host/ws/admin/live?token=JWT` — admin receives all driver location updates and SOS alerts in real time

### 9. `/drive-with-us` — Driver Application Page
- POST `/api/drivers/register` — body: `{ license_number, vehicle: { make, model, year, color, plate_number, is_wheelchair_accessible } }`
- This creates the driver profile + vehicle record + default document slots
- User must already have a `driver` role account (registered via /signup with role=driver)

---

## Database Schema — Required Tables

Design and implement all of the following with proper foreign keys, indexes, and constraints:

### `users`
- id, full_name, email (unique), phone (unique), hashed_password
- role: ENUM('passenger', 'driver', 'admin')
- preferred_mode: ENUM('normal', 'pink', 'pwd', 'elderly')
- profile_photo, is_active, is_verified, created_at, updated_at

### `drivers`
- id, user_id (FK → users, unique)
- license_number (unique)
- status: ENUM('pending', 'approved', 'rejected', 'suspended')
- is_online (bool), current_latitude, current_longitude
- average_rating, total_rides, today_rides, today_earnings, acceptance_rate
- certified_modes (JSON array e.g. ["pink", "pwd"])
- approved_at, created_at, updated_at

### `vehicles`
- id, driver_id (FK → drivers, unique)
- make, model, year, color, plate_number (unique)
- is_wheelchair_accessible, is_approved, created_at

### `driver_documents`
- id, driver_id (FK), document_type (national_id / drivers_license / vehicle_registration / nbi_clearance)
- file_url, status: ENUM('upload_required', 'pending', 'verified', 'rejected')
- reviewed_by (FK → users), reviewed_at, notes, created_at, updated_at

### `rides`
- id, passenger_id (FK → users), driver_id (FK → drivers, nullable)
- mode: ENUM('normal', 'pink', 'pwd', 'elderly')
- status: ENUM('pending', 'searching', 'matched', 'driver_arriving', 'in_progress', 'completed', 'cancelled')
- pickup_address, pickup_latitude, pickup_longitude
- destination_address, destination_latitude, destination_longitude
- distance_km, duration_minutes, fare_amount, safety_score
- route_polyline (TEXT), scheduled_at
- started_at, completed_at, cancelled_at, cancel_reason
- created_at, updated_at

### `ride_location_history`
- id, ride_id (FK → rides), latitude, longitude, recorded_at

### `ratings`
- id, ride_id (FK → rides, unique), rater_id (FK → users), driver_id (FK → drivers)
- score (1–5), comment, created_at

### `emergency_contacts`
- id, user_id (FK → users), name, phone, relationship, is_primary, created_at

### `sos_alerts`
- id, user_id (FK → users), ride_id (FK → rides, nullable)
- latitude, longitude, location_address
- severity: ENUM('critical', 'moderate', 'low') — default 'critical'
- status: ENUM('active', 'resolved', 'false_alarm')
- notes, resolved_by (FK → users), resolved_at, created_at

### `notifications`
- id, user_id (FK → users), title, message, type, is_read, data (JSON), created_at

---

## Required Project Structure

```
safego-backend/
├── app/
│   ├── main.py              # FastAPI app factory, CORS, startup
│   ├── config.py            # Pydantic settings from .env
│   ├── database.py          # SQLAlchemy engine, SessionLocal, get_db
│   ├── models/
│   │   └── __init__.py      # All SQLAlchemy ORM models
│   ├── schemas/
│   │   └── __init__.py      # All Pydantic v2 request/response schemas
│   ├── routes/
│   │   ├── __init__.py
│   │   ├── auth.py          # /api/auth/*
│   │   ├── users.py         # /api/users/*
│   │   ├── drivers.py       # /api/drivers/*
│   │   ├── rides.py         # /api/rides/*
│   │   ├── safety.py        # /api/safety/*
│   │   ├── map.py           # /api/map/*
│   │   ├── admin.py         # /api/admin/*
│   │   └── websocket.py     # /ws/*
│   ├── services/
│   │   ├── auth_service.py
│   │   ├── ride_service.py
│   │   ├── driver_service.py
│   │   ├── map_service.py
│   │   └── notification_service.py
│   └── utils/
│       ├── security.py      # JWT encode/decode, bcrypt hash/verify
│       ├── dependencies.py  # get_current_user, role guards
│       ├── fare.py          # Fare calculation (PHP) + safety score heuristic
│       └── websocket_manager.py  # ConnectionManager class
├── alembic/                 # Alembic migrations
├── schema.sql               # Raw MySQL DDL (also auto-created by app)
├── requirements.txt
├── .env.example
└── README.md
```

---

## Business Logic Requirements

### Fare Calculation (Philippine rates)
- Normal:  ₱40 flag-down + ₱18/km
- Pink:    ₱45 flag-down + ₱20/km
- PWD:     ₱35 flag-down + ₱16/km (discounted)
- Elderly: ₱35 flag-down + ₱16/km (discounted)

### Safety Score (0–100)
- Base score per mode: Normal=90, Pink=93, PWD=88, Elderly=89
- Deduct up to 10 points for longer distances
- Minimum score: 70
- In production this would integrate crime/incident map data per route

### Driver Matching
- When a ride is requested, query all online + approved drivers
- Filter by mode capability (certified_modes JSON field)
- Pick the nearest driver using Haversine distance formula
- If matched, set ride.status = 'matched' and ride.driver_id

### Route Calculation
- Call OSRM API: `http://router.project-osrm.org/route/v1/driving/{lng1},{lat1};{lng2},{lat2}?overview=full&geometries=geojson&steps=true`
- Parse distance (meters → km), duration (seconds → minutes), GeoJSON polyline
- Fall back to Haversine + rough time estimate if OSRM is unavailable

### Driver Stats Update
- On ride completion: increment driver.total_rides, driver.today_rides, driver.today_earnings
- On new rating: recalculate driver.average_rating from all ratings

### Auto-seed Admin on Startup
- On app startup, if no admin exists, create default admin:
  - Email: admin@safego.ph
  - Password: Admin@SafeGo2025
  - Role: admin

---

## WebSocket Architecture

### `ws://host/ws/driver/{driver_id}/location?token=JWT`
- Driver connects and sends JSON: `{ "latitude": float, "longitude": float, "ride_id": int|null }`
- Server: update drivers.current_latitude / current_longitude in DB
- Server: if driver has active ride → log to ride_location_history → broadcast to all passengers watching that ride
- Server: always broadcast to all connected admin sockets
- On disconnect: set driver.is_online = false

### `ws://host/ws/ride/{ride_id}/track?token=JWT`
- Passenger subscribes to real-time driver location for their ride
- Server pushes: `{ "type": "driver_location", "latitude": float, "longitude": float, "status": string, "driver_id": int }`
- Heartbeat: client sends "ping", server replies with `{ "type": "pong" }`

### `ws://host/ws/admin/live?token=JWT`
- Admin receives all driver location updates and SOS alert events
- Only accessible to users with role=admin

---

## Authentication & Security

- All private routes require `Authorization: Bearer <JWT>` header
- Role-based guards: `get_current_passenger`, `get_current_driver`, `get_current_admin`
- Passwords hashed with bcrypt (passlib)
- JWT payload: `{ "sub": user_id_string, "role": role_string, "exp": timestamp }`
- CORS: allow all origins in dev (configurable via ALLOWED_ORIGINS env var)
- Passengers can only view their own rides and SOS alerts
- Drivers can only manage their own profile and assigned rides
- Admin has full access to all resources

---

## Environment Configuration (.env)

```
DATABASE_URL=mysql+pymysql://root:password@localhost:3306/safego_db
SECRET_KEY=your-secret-key-minimum-32-characters
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=60
REFRESH_TOKEN_EXPIRE_DAYS=7
APP_NAME=SafeGo
DEBUG=True
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000
ADMIN_EMAIL=admin@safego.ph
ADMIN_PASSWORD=Admin@SafeGo2025
OSRM_BASE_URL=http://router.project-osrm.org
```

---

## Frontend API Integration Contract

The frontend will call these endpoints. All responses must match these shapes exactly:

### POST /api/auth/login → response
```json
{ "access_token": "string", "token_type": "bearer", "role": "passenger|driver|admin", "user_id": 123 }
```

### POST /api/rides/request → response
```json
{
  "id": 1, "passenger_id": 1, "driver_id": 2, "mode": "pink",
  "status": "matched", "pickup_address": "string", "pickup_latitude": 14.5,
  "pickup_longitude": 120.9, "destination_address": "string",
  "destination_latitude": 14.6, "destination_longitude": 121.0,
  "distance_km": 12.4, "duration_minutes": 25, "fare_amount": 268.2,
  "safety_score": 94, "created_at": "2025-01-01T00:00:00",
  "driver": { "id": 2, "average_rating": 4.9, "user": { "full_name": "James D." }, "vehicle": { "make": "Toyota", "model": "Vios", "plate_number": "ABC 123" } }
}
```

### POST /api/map/route → response
```json
{ "distance_km": 12.4, "duration_minutes": 25, "fare_amount": 268.2, "safety_score": 94, "route_polyline": "string|null", "steps": [] }
```

### GET /api/admin/stats → response
```json
{ "total_users": 12450, "total_drivers": 3200, "active_drivers": 847, "pending_drivers": 2, "total_rides": 9500, "active_rides": 847, "total_sos_alerts": 5, "active_sos_alerts": 3 }
```

---

## Output Required

1. **Complete project folder** with all files — no placeholders, no `# TODO` comments, no stub functions
2. Every route must be fully implemented with real DB queries
3. **requirements.txt** with all pinned dependencies
4. **schema.sql** — complete MySQL DDL that can be run directly
5. **alembic/** — configured and ready to use
6. **.env.example** — all required variables documented
7. **README.md** with:
   - Exact setup steps (virtualenv, pip install, DB create, alembic upgrade, uvicorn run)
   - All API endpoints listed with method, path, auth requirement
   - WebSocket connection examples
   - Default admin credentials
   - Frontend integration instructions (set VITE_API_URL=http://localhost:8000)

---

## Run Command

```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

---

## Critical Notes

- The backend must be a **standalone Python project** — completely separate from the React frontend folder
- Do NOT generate partial code. Every file must be complete and runnable
- The app must start successfully with `uvicorn app.main:app --reload` after following README setup
- Database tables must auto-create on first startup via `Base.metadata.create_all()`
- All Pydantic models must use `model_config = ConfigDict(from_attributes=True)` for ORM compatibility
- Use `from __future__ import annotations` where needed for circular import avoidance
- CORS must be configured to allow the frontend at `http://localhost:5173`
