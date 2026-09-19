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
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
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

