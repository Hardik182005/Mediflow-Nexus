from fastapi import APIRouter
from app.api.v1 import patients, insurance, prior_auth, denials, revenue, startups, buyers, sales, marketplace, copilot, dashboard

router = APIRouter()

router.include_router(dashboard.router, prefix="/dashboard", tags=["Dashboard"])
router.include_router(patients.router, prefix="/patients", tags=["Patients"])
router.include_router(insurance.router, prefix="/insurance", tags=["Insurance"])
router.include_router(prior_auth.router, prefix="/prior-auth", tags=["Prior Authorization"])
router.include_router(denials.router, prefix="/denials", tags=["Denials"])
router.include_router(revenue.router, prefix="/revenue", tags=["Revenue"])
router.include_router(startups.router, prefix="/startups", tags=["Startups"])
router.include_router(buyers.router, prefix="/buyers", tags=["Buyers"])
router.include_router(sales.router, prefix="/sales", tags=["Sales Pipeline"])
router.include_router(marketplace.router, prefix="/marketplace", tags=["Marketplace"])
router.include_router(copilot.router, prefix="/copilot", tags=["AI Copilot"])
