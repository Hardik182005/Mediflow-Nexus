from fastapi import APIRouter

router = APIRouter()


@router.get("/")
async def get_revenue_overview():
    return {"monthly_revenue": 415000, "leakage": 32100, "collection_rate": 94.2}


@router.get("/predictions")
async def get_reimbursement_predictions():
    return {"predictions": []}


@router.get("/leakage")
async def get_revenue_leakage():
    return {"total_leakage": 32100, "sources": [
        {"source": "Unbilled CPT codes", "amount": 12400},
        {"source": "Undercoded visits", "amount": 8200},
    ]}


@router.get("/cpt-profitability")
async def get_cpt_profitability():
    return {"cpt_codes": []}
