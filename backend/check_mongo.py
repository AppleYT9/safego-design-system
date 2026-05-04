import sys
import socket

# 1. Check if port 27017 is open
print("=== MongoDB Health Check ===")
print()

# Port check
try:
    sock = socket.create_connection(("localhost", 27017), timeout=3)
    sock.close()
    print("✅ Port 27017 is OPEN - MongoDB is listening")
    port_open = True
except (socket.timeout, ConnectionRefusedError) as e:
    print(f"❌ Port 27017 is CLOSED - MongoDB is NOT running")
    print(f"   Error: {e}")
    port_open = False

# 2. Try pymongo if port is open
if port_open:
    try:
        from pymongo import MongoClient
        client = MongoClient("mongodb://localhost:27017/", serverSelectionTimeoutMS=3000)
        info = client.server_info()
        print(f"✅ MongoDB version: {info.get('version')}")
        dbs = client.list_database_names()
        print(f"✅ Databases: {dbs}")
        
        # Check safego_db specifically
        db = client["safego_db"]
        collections = db.list_collection_names()
        print(f"✅ safego_db collections: {collections if collections else '(empty - no collections yet)'}")
        client.close()
    except Exception as e:
        print(f"❌ pymongo error: {e}")
else:
    print()
    print("👉 Fix: Start MongoDB service with one of these:")
    print("   - Run: net start MongoDB")
    print("   - Or run: mongod --dbpath C:\\data\\db")
    print("   - Or open Services (services.msc) and start 'MongoDB'")
