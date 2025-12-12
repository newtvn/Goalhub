from pydantic_settings import BaseSettings
from functools import lru_cache

class Settings(BaseSettings):
    # App Config
    NODE_ENV: str = "development"
    PORT: int = 8000
    
    # Database
    DATABASE_URL: str
    
    # M-Pesa Credentials
    MPESA_CONSUMER_KEY: str
    MPESA_CONSUMER_SECRET: str
    MPESA_PASSKEY: str
    MPESA_SHORTCODE: str
    MPESA_ENV: str = "sandbox"
    
    class Config:
        env_file = ".env"

@lru_cache()
def get_settings():
    return Settings()

settings = get_settings()
