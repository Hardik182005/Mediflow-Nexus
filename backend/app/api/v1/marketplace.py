from fastapi import APIRouter

router = APIRouter()


@router.get("/")
async def list_matches():
    return {"matches": [], "total": 0}


@router.post("/find-matches")
async def find_matches(startup_id: str = None, clinic_id: str = None):
    return {"matches": [], "message": "AI matchmaking in progress"}


@router.get("/{match_id}")
async def get_match(match_id: str):
    return {"id": match_id}


@router.put("/{match_id}/status")
async def update_match_status(match_id: str, status: str):
    return {"id": match_id, "status": status, "message": "Match status updated"}


@router.get("/recommendations")
async def get_recommendations():
    return {"recommendations": []}
