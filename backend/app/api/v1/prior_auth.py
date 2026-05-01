from fastapi import APIRouter

router = APIRouter()


@router.get("/")
async def list_prior_auth_cases():
    return {"cases": [], "total": 0}


@router.post("/")
async def create_prior_auth(case: dict):
    return {"id": "new", "status": "required", **case}


@router.get("/{case_id}")
async def get_prior_auth(case_id: str):
    return {"id": case_id}


@router.post("/{case_id}/generate-packet")
async def generate_packet(case_id: str):
    return {"case_id": case_id, "packet_url": "/generated/pa-packet.pdf", "message": "PA packet generated"}


@router.get("/{case_id}/approval-probability")
async def predict_approval(case_id: str):
    return {"case_id": case_id, "probability": 78, "risk_factors": ["Missing MRI report"]}
