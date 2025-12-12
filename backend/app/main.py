from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.routers import payments, turfs, bookings, users, events

app = FastAPI(
    title="Goalhub API",
    description="Backend API for Goalhub Turf Booking Platform",
    version="1.0.0",
)

# Configure CORS
origins = [
    "http://localhost:5173",
    "http://localhost:5174",
    "http://127.0.0.1:5173",
    "http://127.0.0.1:5174",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(payments.router)
app.include_router(turfs.router)
app.include_router(bookings.router)
app.include_router(users.router)
app.include_router(events.router)

@app.get("/health")
def health_check():
    return {
        "status": "healthy",
        "environment": settings.NODE_ENV,
        "mpesa_env": settings.MPESA_ENV
    }

@app.get("/")
def read_root():
    return {"message": "Welcome to Goalhub API"}
