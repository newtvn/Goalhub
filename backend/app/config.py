from pydantic_settings import BaseSettings
from pydantic import field_validator, Field
from functools import lru_cache
from typing import Optional

class Settings(BaseSettings):
    # App Config
    NODE_ENV: str = "development"
    PORT: int = 8000

    # CORS Configuration
    ALLOWED_ORIGINS: str = "http://localhost:5173,http://localhost:5174"

    # Database
    DATABASE_URL: str
    DB_POOL_SIZE: int = 20
    DB_MAX_OVERFLOW: int = 40
    DB_POOL_RECYCLE: int = 3600

    # Firebase Credentials (for backend admin SDK)
    FIREBASE_PROJECT_ID: Optional[str] = None
    FIREBASE_PRIVATE_KEY: Optional[str] = None
    FIREBASE_CLIENT_EMAIL: Optional[str] = None
    FIREBASE_SERVICE_ACCOUNT_PATH: Optional[str] = "firebase-service-account.json"

    # M-Pesa Credentials
    MPESA_CONSUMER_KEY: str
    MPESA_CONSUMER_SECRET: str
    MPESA_PASSKEY: str
    MPESA_SHORTCODE: str
    MPESA_ENV: str = "sandbox"
    CALLBACK_URL: Optional[str] = None  # Required in production

    @field_validator('CALLBACK_URL')
    @classmethod
    def validate_callback_url(cls, v: Optional[str], info) -> Optional[str]:
        """Ensure CALLBACK_URL is set in production and is HTTPS"""
        node_env = info.data.get('NODE_ENV', 'development')

        if node_env == 'production':
            if not v:
                raise ValueError('CALLBACK_URL is required in production environment')
            if not v.startswith('https://'):
                raise ValueError('CALLBACK_URL must use HTTPS in production')

        return v

    @field_validator('MPESA_ENV')
    @classmethod
    def validate_mpesa_env(cls, v: str) -> str:
        """Validate M-Pesa environment"""
        if v not in ['sandbox', 'production']:
            raise ValueError('MPESA_ENV must be either "sandbox" or "production"')
        return v

    @field_validator('ALLOWED_ORIGINS')
    @classmethod
    def validate_origins(cls, v: str) -> str:
        """Validate allowed origins format"""
        if not v:
            raise ValueError('ALLOWED_ORIGINS cannot be empty')
        return v

    @field_validator('FIREBASE_SERVICE_ACCOUNT_PATH')
    @classmethod
    def validate_firebase_config(cls, v: Optional[str], info) -> Optional[str]:
        """Ensure Firebase is configured in production"""
        import os
        node_env = info.data.get('NODE_ENV', 'development')

        if node_env == 'production':
            # In production, require either service account file or individual credentials
            firebase_key = info.data.get('FIREBASE_PRIVATE_KEY')

            if not firebase_key and (not v or not os.path.exists(v)):
                raise ValueError(
                    'Firebase configuration required in production. '
                    'Provide either FIREBASE_SERVICE_ACCOUNT_PATH or individual credentials '
                    '(FIREBASE_PROJECT_ID, FIREBASE_PRIVATE_KEY, FIREBASE_CLIENT_EMAIL)'
                )

        return v

    def get_allowed_origins_list(self) -> list[str]:
        """Parse ALLOWED_ORIGINS string into list"""
        return [origin.strip() for origin in self.ALLOWED_ORIGINS.split(',')]

    class Config:
        env_file = ".env"

@lru_cache()
def get_settings():
    return Settings()

settings = get_settings()
