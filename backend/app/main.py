from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from sqlalchemy.ext.asyncio import AsyncSession
from app.config import settings
from app.routers import payments, turfs, bookings, users, events, notifications, dashboard
from app.middleware.rate_limit import RateLimitMiddleware
from app.middleware.security import SecurityHeadersMiddleware
from app.database import get_db

app = FastAPI(
    title="Goalhub API",
    description="Backend API for Goalhub Turf Booking Platform",
    version="1.0.0",
)

# Configure CORS - use settings from environment
origins = settings.get_allowed_origins_list()

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

print(f"🌐 CORS configured for origins: {origins}")

# Add security headers middleware
app.add_middleware(SecurityHeadersMiddleware)

# Add rate limiting for payment endpoints
app.add_middleware(RateLimitMiddleware, max_requests=10, window_seconds=900)

app.include_router(payments.router)
app.include_router(turfs.router)
app.include_router(bookings.router)
app.include_router(users.router)
app.include_router(events.router)
app.include_router(notifications.router)
app.include_router(dashboard.router)

@app.get("/health")
async def health_check(db: AsyncSession = Depends(get_db)):
    """
    Health check endpoint with database connectivity verification.
    Returns 200 if healthy, 503 if database is unreachable.
    """
    health_status = {
        "status": "healthy",
        "environment": settings.NODE_ENV,
        "mpesa_env": settings.MPESA_ENV,
        "database": "unknown"
    }

    # Check database connectivity
    try:
        await db.execute("SELECT 1")
        health_status["database"] = "connected"
    except Exception as e:
        health_status["status"] = "unhealthy"
        health_status["database"] = "disconnected"
        health_status["error"] = str(e)
        return JSONResponse(
            status_code=503,
            content=health_status
        )

    return health_status

@app.get("/")
def read_root():
    return {"message": "Welcome to Goalhub API"}
