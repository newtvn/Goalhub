import firebase_admin
from firebase_admin import auth, credentials
from fastapi import Depends, HTTPException, status, Security
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.database import get_db
from app.models.user import User
import os
import json

# Initialize HTTP Bearer security scheme
security = HTTPBearer()

# Variable to track if Firebase Admin is legally initialized
firebase_app = None

def get_firebase_app():
    global firebase_app
    if firebase_app:
        return firebase_app

    # Path to service account key
    cred_path = "firebase-service-account.json"
    
    try:
        if os.path.exists(cred_path):
            cred = credentials.Certificate(cred_path)
            firebase_app = firebase_admin.initialize_app(cred)
            print(f"✅ Firebase Admin initialized with {cred_path}")
        else:
            print("⚠️ Firebase Service Account Key not found. Running in MOCK AUTH mode.")
            firebase_app = "MOCK_MODE"
    except ValueError:
        # App already initialized
        firebase_app = firebase_admin.get_app()
    
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
