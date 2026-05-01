from fastapi import APIRouter

router = APIRouter()


@router.get("/")
async def list_insurance_cases():
    return {"cases": [], "total": 0}


@router.post("/verify")
async def verify_insurance(case: dict):
    return {"id": "new", "status": "pending", "message": "Verification initiated", **case}


@router.get("/{case_id}")
async def get_insurance_case(case_id: str):
    return {"id": case_id, "status": "verified"}


@router.get("/{case_id}/vob")
async def get_vob_result(case_id: str):
    return {"case_id": case_id, "benefits": {"deductible": 2000, "copay": 35, "coinsurance": 20}}


@router.post("/{case_id}/cost-estimate")
async def generate_cost_estimate(case_id: str):
    return {"case_id": case_id, "estimated_patient_cost": 450, "estimated_reimbursement": 1200}
