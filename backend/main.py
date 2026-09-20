import sys
import os

# Ensure backend directory is in sys.path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import engine, Base, upgrade_db_schema
import models

# Import routers
from routers import auth, students, applications, passes, routes, qr_tokens, notifications, admin, verifier, rto

# Create database tables automatically
Base.metadata.create_all(bind=engine)
upgrade_db_schema()

app = FastAPI(
    title="YAATHRI (യാത്രി) — Student Concession Mobility API",
    description="Backend API services for Kerala Student Concession Pass verification, application, and transit tokens.",
    version="2.0.0"
)

# Configure CORS
base_origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://localhost:8000",
    "http://127.0.0.1:8000",
]
env_origins = os.environ.get("ALLOWED_ORIGINS", os.environ.get("CORS_ORIGINS", ""))
if env_origins:
    extra_origins = [orig.strip() for orig in env_origins.split(",") if orig.strip()]
    base_origins.extend(extra_origins)

app.add_middleware(
    CORSMiddleware,
    allow_origins=base_origins,
    allow_origin_regex=r"^(https?://(localhost|127\.0\.0\.1)(:\d+)?|https://.*\.vercel\.app)$",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount API Routers under /api
app.include_router(auth.router, prefix="/api")
app.include_router(students.router, prefix="/api")
app.include_router(applications.router, prefix="/api")
app.include_router(passes.router, prefix="/api")
app.include_router(routes.router, prefix="/api")
app.include_router(qr_tokens.router, prefix="/api")
app.include_router(notifications.router, prefix="/api")
app.include_router(admin.router, prefix="/api")
app.include_router(verifier.router, prefix="/api")
app.include_router(rto.router, prefix="/api")

@app.get("/api/health")
def health_check():
    return {
        "service": "YAATHRI Backend API",
        "status": "HEALTHY",
        "version": "2.0.0",
        "db": "SQLite persistent"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)

