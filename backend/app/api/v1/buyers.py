from fastapi import APIRouter

router = APIRouter()


@router.get("/")
async def list_buyers():
    return {"buyers": [], "total": 0}


@router.get("/discover")
async def discover_buyers(specialty: str = None, location: str = None):
    return {"buyers": [], "filters": {"specialty": specialty, "location": location}}


@router.get("/{buyer_id}")
async def get_buyer(buyer_id: str):
    return {"id": buyer_id}


@router.post("/{buyer_id}/generate-outreach")
async def generate_outreach(buyer_id: str):
    return {"buyer_id": buyer_id, "message": "Generated outreach message...", "subject": "Generated subject"}


@router.post("/{buyer_id}/generate-pitch")
async def generate_pitch(buyer_id: str):
    return {"buyer_id": buyer_id, "pitch": "Generated pitch..."}
