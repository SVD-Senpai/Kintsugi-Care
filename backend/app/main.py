from fastapi import FastAPI
from app.models.case_history import CaseHistory

from app.appdatabase import Base, engine
from app.models.case import Case
from app.routes.case import router as cases_router

Base.metadata.create_all(bind=engine)


app = FastAPI(
    title="Kintsugi Care API",
    description="Backend API for livestock health surveillance and disease management",
    version="1.0.0",
)


app.include_router(cases_router)


@app.get("/")
def root():
    return {
        "message": "Kintsugi Care API is running",
        "status": "healthy",
    }


@app.get("/api/health")
def health_check():
    return {
        "status": "ok",
        "service": "Kintsugi Care Backend",
    }