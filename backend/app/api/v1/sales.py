from fastapi import APIRouter

router = APIRouter()


@router.get("/")
async def list_deals():
    return {"deals": [], "total": 0}


@router.post("/")
async def create_deal(deal: dict):
    return {"id": "new", "stage": "lead", **deal}


@router.get("/{deal_id}")
async def get_deal(deal_id: str):
    return {"id": deal_id}


@router.put("/{deal_id}/stage")
async def update_deal_stage(deal_id: str, stage: str):
    return {"id": deal_id, "stage": stage, "message": "Stage updated"}


@router.get("/{deal_id}/win-probability")
async def predict_win(deal_id: str):
    return {"deal_id": deal_id, "probability": 65}
