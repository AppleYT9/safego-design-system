# SafeGo Demo Integration & Performance Logic

This document describes the end-to-end logic, optimizations, and flows implemented to ensure robust, persistent, and fast behavior for passenger bookings, driver portals, and admin dashboards during mentor/client presentations.

---

## 1. Passenger Booking & Dashboard Persistence
- **Flow**: A passenger books a ride (e.g., to Namakkal) which is saved in the backend MongoDB database.
- **Cache Persistence**: Fetched rides are cached in `localStorage` under the key `safego_passenger_rides`. On page refreshes, the passenger dashboard loads this cache immediately, preventing blank lists while the API completes.
- **Status Badges**: Added lowercase fallback support for all ride statuses (`completed`, `cancelled`, `in_progress`, `driver_arriving`, `matched`, `searching`) mapped to appropriate visual color indicators.

---

## 2. Driver Portal Performance & Demo Mode
- **Zero-State Defaults**: To prevent a flash of fake details on first load, the portal initializes to empty lists and `"Loading Pilot..."` for the driver profile name, with statistics set to `0`.
- **Auto-Retry Loop**: If the initial load fails or times out, the portal enters a 2-second auto-retry loop to query the API until the server resolves, ensuring real data loads smoothly.
- **Performance Optimization (N+1 Query Resolution)**:
  - Previously, fetching available rides queried the database for passenger details separately for each ride. With 80+ rides, this took 10+ seconds, causing request timeouts.
  - **Batch Queries**: The backend now collects all unique passenger IDs and queries them in a single batch.
  - **15-Ride Query Limit**: The available requests endpoint is limited to the last **15 rides**, sorted by creation time descending (`-Ride.created_at`).
  - **Result**: Load times dropped from **10+ seconds to under 0.1 seconds**, ensuring the last requested ride by the user is instantly visible at the very top.
- **Demo Matching**: Drivers automatically transition to "Online" status when loading `/me`. The accept status constraint has been bypassed so that any driver can manually accept any ride (even completed ones) for presentation purposes.
- **Immediate Completion**: When a driver accepts a ride request, the backend immediately calls `complete_ride` to sync state instantly for the presentation.

---

## 3. Admin Hub & Live Polling
- **Dynamic Metrics**: The Admin Hub is configured to poll `/api/admin/stats` periodically, dynamically updating the active driver, pending application, active ride, and SOS counters.
- **Status Badges**: Hardcoded badges are replaced with dynamic statuses and colors indicating the real live state of operations.
- **Performance Optimization (N+1 Query Resolution)**:
  - Previously, loading the admin user list endpoint `/api/admin/users` queried the database for driver profiles sequentially for each driver, causing a bottleneck of up to 100 sequential queries per page.
  - **Batch Queries**: The backend now batch-fetches all driver profiles at once using `$in`, reducing database query time to under 0.05 seconds and enabling the admin operations panel to render instantly.

---

## 4. Session Integrity (Logout Cache Clearing)
- **Problem**: Logging out and switching accounts previously leaked cached details from the previous user due to stale local storage.
- **Solution**: The "Sign Out" / "Logout Account" actions in the Navbar (mobile/desktop) and Admin Dashboard clear all session keys:
  ```typescript
  "token", "userRole", "safego_passenger_rides", "safego_driver_profile",
  "safego_driver_requests", "safego_driver_available", "safego_driver_history",
  "safego_driver_activity", "safego_accepted_rides", "safego_declined_rides",
  "safego_current_ride_id", "safego_new_booking", "safego_admin_stats"
  ```
