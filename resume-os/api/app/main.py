from fastapi import FastAPI
from app.routes import resume_ats_route, resume_export_route
from app.security.resume_ratelimit_security import rate_limit_middleware
from app.security.resume_security_headers import configure_security_headers
from starlette.middleware.base import BaseHTTPMiddleware

app = FastAPI(title="ResumeOS API")

# Configure Security Headers (CORS, CSP, etc)
configure_security_headers(app)

# Rate Limiting
app.add_middleware(BaseHTTPMiddleware, dispatch=rate_limit_middleware)

app.include_router(resume_ats_route.router, prefix="/ats", tags=["ats"])
app.include_router(resume_export_route.router, prefix="/export", tags=["export"])

@app.get("/health")
def health_check():
    return {"status": "ok"}
