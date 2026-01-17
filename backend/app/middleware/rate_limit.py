from fastapi import Request
from fastapi.responses import JSONResponse
from starlette.middleware.base import BaseHTTPMiddleware
from collections import defaultdict
import time


class RateLimitMiddleware(BaseHTTPMiddleware):
    """
    Rate limiting middleware for payment endpoints.
    Limits requests to max_requests per window_seconds per IP address.
    """

    def __init__(self, app, max_requests: int = 10, window_seconds: int = 900):
        super().__init__(app)
        self.max_requests = max_requests
        self.window_seconds = window_seconds
        self.requests = defaultdict(list)

    async def dispatch(self, request: Request, call_next):
        # Only apply to payment endpoints
        if not request.url.path.startswith("/api/stkpush"):
            return await call_next(request)

        client_ip = request.client.host
        now = time.time()

        # Clean old requests outside the time window
        self.requests[client_ip] = [
            req_time for req_time in self.requests[client_ip]
            if now - req_time < self.window_seconds
        ]

        # Check rate limit
        if len(self.requests[client_ip]) >= self.max_requests:
            return JSONResponse(
                status_code=429,
                content={"error": "Too many payment requests, please try again later."}
            )

        # Record this request
        self.requests[client_ip].append(now)

        return await call_next(request)
