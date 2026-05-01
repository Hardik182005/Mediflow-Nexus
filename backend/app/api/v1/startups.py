from fastapi import APIRouter

router = APIRouter()


@router.get("/")
async def list_startups():
    return {"startups": [], "total": 0}


@router.post("/")
async def create_startup(startup: dict):
    return {"id": "new", "status": "onboarding", **startup}


@router.get("/{startup_id}")
async def get_startup(startup_id: str):
    return {"id": startup_id}


@router.post("/{startup_id}/analyze")
async def analyze_startup(startup_id: str):
    return {"startup_id": startup_id, "icp": "Generated ICP", "positioning": "Generated positioning"}


@router.get("/{startup_id}/competitors")
async def get_competitors(startup_id: str):
    return {"startup_id": startup_id, "competitors": []}
