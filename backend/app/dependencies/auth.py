import firebase_admin
from firebase_admin import auth, credentials
from fastapi import Depends, HTTPException, status, Security
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.database import get_db
from app.models.user import User
from app.config import settings
import os
import json

# Initialize HTTP Bearer security scheme
security = HTTPBearer()

# Variable to track if Firebase Admin is initialized
firebase_app = None

def get_firebase_app():
    global firebase_app
    if firebase_app:
        return firebase_app

    try:
        # Option 1: Use individual environment variables
        if settings.FIREBASE_PRIVATE_KEY and settings.FIREBASE_PROJECT_ID:
            cred_dict = {
                "type": "service_account",
                "project_id": settings.FIREBASE_PROJECT_ID,
                "private_key": settings.FIREBASE_PRIVATE_KEY.replace('\\n', '\n'),
                "client_email": settings.FIREBASE_CLIENT_EMAIL,
            }
            cred = credentials.Certificate(cred_dict)
            firebase_app = firebase_admin.initialize_app(cred)
            print("✅ Firebase Admin initialized with environment variables")

        # Option 2: Use service account file
        elif settings.FIREBASE_SERVICE_ACCOUNT_PATH and os.path.exists(settings.FIREBASE_SERVICE_ACCOUNT_PATH):
            cred = credentials.Certificate(settings.FIREBASE_SERVICE_ACCOUNT_PATH)
            firebase_app = firebase_admin.initialize_app(cred)
            print(f"✅ Firebase Admin initialized with {settings.FIREBASE_SERVICE_ACCOUNT_PATH}")

        # Fallback: Mock mode (ONLY in development)
        else:
            if settings.NODE_ENV == "production":
                raise RuntimeError(
                    "❌ Firebase credentials required in production. "
                    "Set FIREBASE_PRIVATE_KEY, FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL "
                    "or provide FIREBASE_SERVICE_ACCOUNT_PATH"
                )
            print("⚠️ Firebase Service Account not configured. Running in MOCK AUTH mode (development only).")
            firebase_app = "MOCK_MODE"

    except ValueError:
        # App already initialized
        firebase_app = firebase_admin.get_app()
    except Exception as e:
        if settings.NODE_ENV == "production":
            raise RuntimeError(f"❌ Failed to initialize Firebase in production: {str(e)}")
        print(f"⚠️ Firebase initialization failed, falling back to MOCK MODE: {str(e)}")
        firebase_app = "MOCK_MODE"

    return firebase_app

async def get_current_user(
    token: HTTPAuthorizationCredentials = Security(security),
    db: AsyncSession = Depends(get_db)
) -> User:
    """
    Verifies the Firebase ID Token and returns the corresponding User from the database.
    If the user doesn't exist in DB, creates a new record.
    """
    app = get_firebase_app()
    id_token = token.credentials
    
    firebase_user = None

    # 1. Verify Token with Firebase
    if app == "MOCK_MODE":
        # DEVELOPMENT ONLY: Decode token slightly or trust it for local dev if needed
        # For now, we'll assume a dummy user structure if it's a specific mock token
        # or just fail if we want to be strict.
        # Let's support a "mock" token for easy testing without internet/keys
        if id_token.startswith("mock-token-"):
            firebase_user = {
                "uid": id_token.replace("mock-token-", ""),
                "email": f"{id_token.replace('mock-token-', '')}@example.com",
                "name": "Mock User",
                "picture": None
            }
        else:
             # In mock mode, basic JWT decoding could vary, but let's just error 
             # if it's not our special mock token, to avoid confusion.
             raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Backend in Mock Mode. Use a token starting with 'mock-token-'",
            )
    else:
        try:
            firebase_user = auth.verify_id_token(id_token)
        except Exception as e:
            print(f"Error verifying token: {e}")
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid authentication credentials",
                headers={"WWW-Authenticate": "Bearer"},
            )

    if not firebase_user:
        raise HTTPException(status_code=401, detail="User could not be authenticated")

    uid = firebase_user.get('uid')
    email = firebase_user.get('email')
    
    # 2. Sync with Database
    # Check if user exists by email (or ideally add a firebase_uid column)
    # For now, we will query by email as it's cleaner without schema migration, 
    # but strictly we should use UID. Let's assume email is unique and stable for now.
    
    result = await db.execute(select(User).where(User.email == email))
    user = result.scalars().first()
    
    if not user:
        # Create new user
        new_user = User(
            email=email,
            name=firebase_user.get('name', 'New User'),
            avatar=firebase_user.get('picture'),
            role="user" # Default role
            # firebase_uid=uid # TODO: Add this column to model
        )
        db.add(new_user)
        try:
            await db.commit()
            await db.refresh(new_user)
            user = new_user
        except Exception as e:
            await db.rollback()
            # Handle race condition if user created in parallel
            result = await db.execute(select(User).where(User.email == email))
            user = result.scalars().first()
            if not user:
                 raise HTTPException(status_code=500, detail="Could not create user record")

    return user
