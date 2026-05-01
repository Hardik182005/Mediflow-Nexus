from fastapi import APIRouter

router = APIRouter()


@router.get("/")
async def get_dashboard():
    return {
        "kpis": {
            "revenue_at_risk": 47200,
            "pending_pa": 23,
            "denial_risk": 14.2,
            "startup_leads": 156,
            "active_buyers": 48,
            "marketplace_matches": 32,
        },
        "revenue_trend": [
            {"month": "Jul", "revenue": 285000, "predicted": 290000},
            {"month": "Aug", "revenue": 302000, "predicted": 310000},
            {"month": "Sep", "revenue": 298000, "predicted": 305000},
            {"month": "Oct", "revenue": 325000, "predicted": 330000},
            {"month": "Nov", "revenue": 340000, "predicted": 345000},
            {"month": "Dec", "revenue": 358000, "predicted": 365000},
        ],
    }
