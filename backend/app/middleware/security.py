"""
Security Headers Middleware
Adds security-related HTTP headers to all responses
"""
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.requests import Request
from starlette.responses import Response
from app.config import settings


class SecurityHeadersMiddleware(BaseHTTPMiddleware):
    """
    Add security headers to all HTTP responses
    """

    async def dispatch(self, request: Request, call_next):
        response: Response = await call_next(request)

        # Strict Transport Security (HSTS) - enforce HTTPS
        # Only add in production to avoid issues in development
        if settings.NODE_ENV == "production":
            response.headers["Strict-Transport-Security"] = "max-age=31536000; includeSubDomains"

        # Prevent browsers from MIME-sniffing
        response.headers["X-Content-Type-Options"] = "nosniff"

        # Prevent clickjacking attacks
        response.headers["X-Frame-Options"] = "DENY"

        # Enable browser XSS protection
        response.headers["X-XSS-Protection"] = "1; mode=block"

        # Control what information is sent in Referer header
        response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"

        # Content Security Policy
        # Note: Adjust this based on your frontend needs
        if settings.NODE_ENV == "production":
            response.headers["Content-Security-Policy"] = (
                "default-src 'self'; "
                "script-src 'self'; "
                "style-src 'self' 'unsafe-inline'; "
                "img-src 'self' data: https:; "
                "font-src 'self' data:; "
                "connect-src 'self' https://sandbox.safaricom.co.ke https://api.safaricom.co.ke; "
                "frame-ancestors 'none'; "
                "base-uri 'self'; "
                "form-action 'self'"
            )

        # Permissions Policy (formerly Feature Policy)
        response.headers["Permissions-Policy"] = (
            "geolocation=(), "
            "microphone=(), "
            "camera=()"
        )

        return response
