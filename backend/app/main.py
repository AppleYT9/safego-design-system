from __future__ import annotations

from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.database import engine, Base, SessionLocal
from app.models import User, UserRole
from app.utils.security import hash_password

# Import all route modules
from app.routes import auth, users, drivers, rides, safety, map, admin, websocket


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Startup and shutdown events."""
    # Create all tables
    Base.metadata.create_all(bind=engine)
    print("[OK] Database tables created/verified")

    # Auto-seed admin
    db = SessionLocal()
    try:
        existing_admin = db.query(User).filter(User.email == settings.ADMIN_EMAIL).first()
        if not existing_admin:
            admin_user = User(
                full_name="SafeGo Admin",
                email=settings.ADMIN_EMAIL,
                phone="+639000000000",
                hashed_password=hash_password(settings.ADMIN_PASSWORD),
                role=UserRole.admin,
                is_active=True,
                is_verified=True,
            )
            db.add(admin_user)
            db.commit()
            print(f"[OK] Default admin created: {settings.ADMIN_EMAIL}")
        else:
            print(f"[INFO] Admin user already exists: {existing_admin.email}")
    finally:
        db.close()

    yield

    # Shutdown
    print("[BYE] SafeGo backend shutting down")


app = FastAPI(
    title=settings.APP_NAME,
    description="SafeGo Ride Safety Platform — Backend API",
    version="1.0.0",
    lifespan=lifespan,
)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    # allow_origins=settings.allowed_origins_list,
    allow_origin_regex=".*",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

from fastapi import Request
@app.middleware("http")
async def log_origin(request: Request, call_next):
    origin = request.headers.get("origin")
    if origin:
        print(f"INFO: Origin header received: {origin}")
    response = await call_next(request)
    return response

# Include routers
app.include_router(auth.router)
app.include_router(users.router)
app.include_router(drivers.router)
app.include_router(rides.router)
app.include_router(safety.router)
app.include_router(map.router)
app.include_router(admin.router)
app.include_router(websocket.router)


@app.get("/")
def health_check():
    return {
        "status": "healthy",
        "app": settings.APP_NAME,
        "version": "1.0.0",
    }


@app.get("/api/modes")
def get_modes():
    """Serve mode metadata for the frontend home page."""
    return [
        {
            "id": "normal",
            "name": "Normal",
            "description": "Standard ride experience",
            "color": "#4CAF50",
            "icon": "car",
        },
        {
            "id": "pink",
            "name": "Pink",
            "description": "Women-only safe ride",
            "color": "#E91E63",
            "icon": "shield",
        },
        {
            "id": "pwd",
            "name": "PWD",
            "description": "Accessible ride for persons with disability",
            "color": "#2196F3",
            "icon": "accessible",
        },
        {
            "id": "elderly",
            "name": "Elderly",
            "description": "Comfortable ride for senior citizens",
            "color": "#FF9800",
            "icon": "elderly",
        },
    ]
