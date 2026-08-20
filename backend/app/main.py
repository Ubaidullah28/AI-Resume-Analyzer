from fastapi import (
    FastAPI,
    Request,
    Depends
)

from fastapi.responses import JSONResponse

from fastapi.middleware.cors import CORSMiddleware

from sqlalchemy import text
from sqlalchemy.orm import Session

from app.database import get_db

from app.routers import (
    auth,
    users,
    resume,
    ats
)


app = FastAPI(
    title="AI Resume Analyzer API",
    version="1.0.0"
)


# -------------------------
# CORS
# -------------------------

app.add_middleware(
    CORSMiddleware,

    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173"
    ],

    allow_credentials=True,

    allow_methods=["*"],

    allow_headers=["*"]
)


# -------------------------
# Routers
# -------------------------

app.include_router(
    auth.router,
    prefix="/auth",
    tags=["Authentication"]
)

app.include_router(
    users.router,
    prefix="/users",
    tags=["Users"]
)

app.include_router(
    resume.router,
    prefix="/resume",
    tags=["Resume"]
)

app.include_router(
    ats.router,
    prefix="/ats",
    tags=["ATS Analysis"]
)


# -------------------------
# Home
# -------------------------

@app.get("/")
def home():

    return {
        "message": "AI Resume Analyzer API"
    }


# -------------------------
# Health
# -------------------------

@app.get("/health")
def health_check(
    db: Session = Depends(get_db)
):

    try:

        db.execute(
            text("SELECT 1")
        )

        return {
            "status": "ok",
            "database": "connected",
            "service": "AI Resume Analyzer API"
        }

    except Exception:

        return JSONResponse(
            status_code=503,
            content={
                "status": "error",
                "database": "disconnected"
            }
        )


# -------------------------
# Global error handler
# -------------------------

@app.exception_handler(Exception)
async def global_exception_handler(
    request: Request,
    exc: Exception
):

    print(
        f"Unhandled error: {exc}"
    )

    return JSONResponse(
        status_code=500,
        content={
            "detail": "Internal server error"
        }
    )