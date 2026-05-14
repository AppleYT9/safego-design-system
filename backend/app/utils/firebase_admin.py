import os
import firebase_admin
from firebase_admin import credentials, auth
from fastapi import HTTPException, Security
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer

# Get the path from environment variable
service_account_path = os.getenv("FIREBASE_SERVICE_ACCOUNT_PATH", "firebase-service-account.json")

# Initialize Firebase Admin SDK
try:
    # Avoid double initialization
    if not firebase_admin._apps:
        abs_path = os.path.abspath(service_account_path)
        print(f"[FIREBASE] Initializing with: {abs_path}")
        cred = credentials.Certificate(abs_path)
        firebase_admin.initialize_app(cred)
except Exception as e:
    print(f"[FIREBASE] Initialization Error: {e}")

security = HTTPBearer()

async def verify_firebase_token(auth_cred: HTTPAuthorizationCredentials = Security(security)):
    """Verifies a Firebase ID token and returns the decoded token."""
    token = auth_cred.credentials
    try:
        decoded_token = auth.verify_id_token(token)
        print(f"[FIREBASE] Token verified for: {decoded_token.get('email')}")
        return decoded_token
    except Exception as e:
        print(f"[FIREBASE] Token Verification Failed: {e}")
        raise HTTPException(
            status_code=401,
            detail=f"Invalid or expired Firebase token: {str(e)}",
            headers={"WWW-Authenticate": "Bearer"},
        )
