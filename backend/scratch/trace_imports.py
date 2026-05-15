
print("Starting import trace...")
import sys
print("Importing dotenv...")
from dotenv import load_dotenv
load_dotenv()
print("Importing FastAPI...")
from fastapi import FastAPI
print("Importing settings...")
from app.config import settings
print("Importing database...")
from app.database import init_db, close_db
print("Importing models...")
from app.models import User, UserRole
print("Importing security...")
from app.utils.security import hash_password
print("Importing routes...")
from app.routes import auth, users, drivers, rides, safety, map, admin, websocket, voice
print("All imports successful!")
