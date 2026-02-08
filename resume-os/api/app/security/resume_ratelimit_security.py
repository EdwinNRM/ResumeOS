from fastapi import Request, HTTPException
from time import time
from collections import defaultdict

# Simple in-memory rate limiting for prototype
# In production, use Redis
RATE_LIMIT_WINDOW = 60  # seconds
MAX_REQUESTS = 20  # requests per window

request_counts = defaultdict(list)

async def rate_limit_middleware(request: Request, call_next):
    client_ip = request.client.host
    now = time()
    
    # Clean old requests
    request_counts[client_ip] = [t for t in request_counts[client_ip] if now - t < RATE_LIMIT_WINDOW]
    
    if len(request_counts[client_ip]) >= MAX_REQUESTS:
        raise HTTPException(status_code=429, detail="Too many requests")
        
    request_counts[client_ip].append(now)
    
    response = await call_next(request)
    return response
