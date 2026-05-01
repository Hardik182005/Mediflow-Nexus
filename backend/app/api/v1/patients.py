from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.database import get_db

router = APIRouter()


@router.get("/")
async def list_patients():
    return {"patients": [], "total": 0, "message": "Connect database to retrieve patients"}


@router.post("/")
async def create_patient(patient: dict):
    return {"id": "new", "message": "Patient created", **patient}


@router.get("/{patient_id}")
async def get_patient(patient_id: str):
    return {"id": patient_id, "message": "Patient details"}


@router.put("/{patient_id}")
async def update_patient(patient_id: str, patient: dict):
    return {"id": patient_id, "message": "Patient updated", **patient}


@router.get("/{patient_id}/readiness-score")
async def get_readiness_score(patient_id: str):
    return {"patient_id": patient_id, "score": 85, "document_completeness": 92}
