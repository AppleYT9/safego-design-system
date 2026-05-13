import sys
import os

# Add the backend directory to sys.path
sys.path.append(os.path.abspath("c:/Users/User/Music/safego-design-system/backend"))

from app.main import app

print("Listing all registered routes:")
for route in app.routes:
    if hasattr(route, "path"):
        print(f"{route.methods} {route.path}")
