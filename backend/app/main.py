from fastapi import FastAPI

from app.database import engine
from app.database import Base

import app.models

from app.routers import auth

Base.metadata.create_all(bind=engine)

app = FastAPI()

app.include_router(auth.router)

@app.get("/")
def home():
    return {"message":"AI Resume Analyzer API"}