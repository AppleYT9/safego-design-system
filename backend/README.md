# SafeGo Backend API

**SafeGo** is a ride safety platform built for the Philippines. This is the complete FastAPI backend that powers the React frontend.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Language | Python 3.11+ |
| Framework | FastAPI |
| Database | MySQL 8+ |
| ORM | SQLAlchemy 2.0 |
| Auth | JWT (python-jose) + bcrypt (passlib) |
| Realtime | WebSockets (built-in FastAPI) |
| Validation | Pydantic v2 |
| Migrations | Alembic |
| HTTP Client | httpx (for OSRM calls) |
| Server | Uvicorn |

---

## Setup Instructions

### 1. Prerequisites
- Python 3.11+
- MySQL 8+
- pip

### 2. Create and activate virtual environment

```bash
cd backend
python -m venv venv

# Windows
venv\Scripts\activate

# macOS/Linux
source venv/bin/activate
```

### 3. Install dependencies

```bash
pip install -r requirements.txt
```

### 4. Configure environment

```bash
# Copy the example env file
cp .env.example .env

# Edit .env with your MySQL credentials:
# DATABASE_URL=mysql+pymysql://root:YOUR_PASSWORD@localhost:3306/safego_db
```

### 5. Create the MySQL database

```sql
CREATE DATABASE safego_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

Or run the full schema:
```bash
mysql -u root -p < schema.sql
```

### 6. Run the server

```bash
uvicorn app.main:app --reload
```

The server will start at `http://localhost:8000`. Database tables are auto-created on first startup.

### 7. (Optional) Run Alembic migrations

```bash
alembic upgrade head
```

To generate a new migration after model changes:
```bash
alembic revision --autogenerate -m "describe change"
alembic upgrade head
```

---

## Default Admin Credentials

| Field | Value |
|-------|-------|
| Email | `admin@safego.ph` |
| Password | `Admin@SafeGo2025` |

The admin account is auto-created on first startup if no admin exists.

---

## Frontend Integration

Set this environment variable in the React frontend:
```
VITE_API_URL=http://localhost:8000
```

The backend CORS is configured to allow `http://localhost:5173` (Vite dev server) and `http://localhost:3000`.

---

## API Documentation

Interactive docs are available at:
- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

---

## API Endpoints

### Auth (`/api/auth`)

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/api/auth/register` | No | Register a new user (passenger/driver) |
| POST | `/api/auth/login` | No | Login, returns JWT + role + user_id |
| GET | `/api/auth/me` | Yes | Get current user profile |

### Users (`/api/users`)

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/api/users/me` | Yes | Get current user profile |
| GET | `/api/users/me/emergency-contacts` | Yes | List emergency contacts |
| POST | `/api/users/me/emergency-contacts` | Yes | Add emergency contact |
| PUT | `/api/users/me/emergency-contacts/:id` | Yes | Update emergency contact |
| DELETE | `/api/users/me/emergency-contacts/:id` | Yes | Delete emergency contact |
| GET | `/api/users/me/notifications` | Yes | List notifications |

### Rides (`/api/rides`)

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/api/rides/request` | Passenger | Request a new ride with auto-matching |
| POST | `/api/rides/:id/confirm` | Passenger | Confirm matched driver |
| GET | `/api/rides/active` | Yes | Get active ride for current user |
| GET | `/api/rides/me` | Yes | Get ride history |
| GET | `/api/rides/:id` | Yes | Get ride details |
| PUT | `/api/rides/:id/status` | Yes | Update ride status |
| POST | `/api/rides/:id/rate` | Passenger | Rate a completed ride (1-5 stars) |

### Map (`/api/map`)

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/api/map/route` | No | Calculate route, fare, safety score |
| GET | `/api/map/nearby-drivers` | Yes | Get nearby available drivers |

### Drivers (`/api/drivers`)

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/api/drivers/register` | Driver | Register driver profile + vehicle |
| GET | `/api/drivers/me` | Driver | Get driver profile |
| GET | `/api/drivers/me/earnings` | Driver | Get earnings stats |
| PUT | `/api/drivers/me/online-status` | Driver | Toggle online/offline |
| GET | `/api/drivers/me/available-rides` | Driver | List available ride requests |
| POST | `/api/drivers/me/rides/:id/accept` | Driver | Accept a ride |
| POST | `/api/drivers/me/rides/:id/decline` | Driver | Decline a ride |
| GET | `/api/drivers/me/documents` | Driver | List documents |
| PUT | `/api/drivers/me/documents/:id/upload` | Driver | Upload document URL |

### Safety (`/api/safety`)

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/api/safety/sos` | Yes | Trigger SOS emergency alert |
| POST | `/api/safety/sos/:id/cancel` | Yes | Cancel false alarm SOS |
| PUT | `/api/safety/sos/:id/resolve` | Admin | Resolve/close SOS alert |

### Admin (`/api/admin`)

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/api/admin/stats` | Admin | Dashboard statistics |
| GET | `/api/admin/analytics/rides-by-mode` | Admin | Rides count per mode |
| GET | `/api/admin/analytics/safety-scores` | Admin | Monthly safety scores |
| GET | `/api/admin/drivers/pending` | Admin | List pending driver approvals |
| PUT | `/api/admin/drivers/:id/approval` | Admin | Approve/reject driver |
| PUT | `/api/admin/drivers/:id/documents/:docId` | Admin | Review document |
| GET | `/api/admin/rides/live` | Admin | All in-progress rides |
| GET | `/api/admin/rides` | Admin | Paginated ride history |
| GET | `/api/admin/sos-alerts` | Admin | All SOS alerts |
| GET | `/api/admin/users` | Admin | Paginated user list |
| PUT | `/api/admin/users/:id/toggle-active` | Admin | Enable/disable user |

### Modes

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/api/modes` | No | Get ride mode metadata |

---

## WebSocket Endpoints

### Ride Tracking (Passenger)
```
ws://localhost:8000/ws/ride/{ride_id}/track?token=JWT_TOKEN
```
- Receives: `{ "type": "driver_location", "latitude": float, "longitude": float, "status": string, "driver_id": int }`
- Send `"ping"` to receive `{ "type": "pong" }`

### Driver Location (Driver)
```
ws://localhost:8000/ws/driver/{driver_id}/location?token=JWT_TOKEN
```
- Send: `{ "latitude": float, "longitude": float, "ride_id": int|null }`
- Server updates driver GPS, logs ride history, broadcasts to passengers and admins
- On disconnect: driver set to offline

### Admin Live Feed
```
ws://localhost:8000/ws/admin/live?token=JWT_TOKEN
```
- Receives all driver location updates and SOS alert events
- Admin role required
- Send `"ping"` to receive `{ "type": "pong" }`

---

## Business Logic

### Fare Rates (PHP — Philippine Peso)
| Mode | Flag-down | Per km |
|------|-----------|--------|
| Normal | ₱40 | ₱18/km |
| Pink | ₱45 | ₱20/km |
| PWD | ₱35 | ₱16/km |
| Elderly | ₱35 | ₱16/km |

### Safety Score
- Base: Normal=90, Pink=93, PWD=88, Elderly=89
- Deduct up to 10 points for longer distances
- Minimum score: 70

### Driver Matching
- Query online + approved drivers
- Filter by mode certification
- Select nearest driver via Haversine distance

---

## Project Structure

```
backend/
├── app/
│   ├── main.py              # FastAPI app, CORS, startup
│   ├── config.py            # Pydantic settings from .env
│   ├── database.py          # SQLAlchemy engine, session, get_db
│   ├── models/
│   │   └── __init__.py      # All SQLAlchemy ORM models
│   ├── schemas/
│   │   └── __init__.py      # All Pydantic v2 schemas
│   ├── routes/
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
│       ├── security.py      # JWT + bcrypt
│       ├── dependencies.py  # Auth guards
│       ├── fare.py          # Fare + safety score
│       └── websocket_manager.py
├── alembic/                 # Alembic migrations
├── schema.sql               # Raw MySQL DDL
├── requirements.txt
├── .env.example
└── README.md
```
