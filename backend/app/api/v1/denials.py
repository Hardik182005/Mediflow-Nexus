from fastapi import APIRouter

router = APIRouter()


@router.get("/")
async def list_denials():
    return {"denials": [], "total": 0}


@router.get("/predictions")
async def get_denial_predictions():
    return {"predictions": [], "high_risk_count": 3}


@router.get("/{denial_id}")
async def get_denial(denial_id: str):
    return {"id": denial_id}


@router.post("/{denial_id}/generate-appeal")
async def generate_appeal(denial_id: str):
    return {"denial_id": denial_id, "appeal_letter": "Generated appeal content...", "message": "Appeal generated"}


@router.get("/{denial_id}/fix-recommendations")
async def get_fix_recommendations(denial_id: str):
    return {"denial_id": denial_id, "recommendations": ["Submit PA", "Include documentation"]}
