from fastapi import APIRouter, HTTPException
from typing import List, Dict, Any
from ..schemas.bundling import (
    BundleCandidate, BundleEvaluationResult, BundleApprovalResult
)
from ..bundling.smart_bundling_service import smart_bundling_service

router = APIRouter(tags=["Cross-Department Smart Block Bundling"])

@router.post("/bundles/generate", response_model=List[BundleCandidate])
async def generate_smart_bundles(corridor_id: str = "CORR-SR-TEN-MDU"):
    """
    Scan pending tasks and generate candidate cross-discipline bundles
    (Civil + S&T + Electrical TRD) with compatibility scores.
    """
    try:
        bundles = await smart_bundling_service.generate_candidate_bundles(corridor_id)
        return bundles
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Smart bundle generation failed: {str(e)}")

@router.get("/bundles", response_model=List[BundleCandidate])
async def get_candidate_bundles(corridor_id: str = "CORR-SR-TEN-MDU"):
    """List current active candidate bundles."""
    if not smart_bundling_service.cached_bundles:
        return await smart_bundling_service.generate_candidate_bundles(corridor_id)
    return list(smart_bundling_service.cached_bundles.values())

@router.get("/bundles/{bundle_id}", response_model=BundleCandidate)
async def get_bundle_detail(bundle_id: str):
    """Retrieve details for a specific candidate bundle."""
    bundle = smart_bundling_service.cached_bundles.get(bundle_id)
    if not bundle:
        all_b = await smart_bundling_service.generate_candidate_bundles()
        bundle = next((b for b in all_b if b.bundle_id == bundle_id), None)
    if not bundle:
        raise HTTPException(status_code=404, detail="Bundle not found")
    return bundle

@router.post("/bundles/{bundle_id}/evaluate", response_model=BundleEvaluationResult)
async def evaluate_bundle_with_optimizer(bundle_id: str):
    """
    Compare Option A (Individual Scheduling) vs Option B (Bundled Scheduling)
    using the Phase 3 optimizer multi-objective criteria.
    """
    try:
        result = await smart_bundling_service.evaluate_bundle(bundle_id)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Bundle evaluation failed: {str(e)}")

@router.post("/bundles/{bundle_id}/approve", response_model=BundleApprovalResult)
async def approve_bundle(bundle_id: str):
    """
    Approve candidate bundle and persist as an approved maintenance block in Supabase.
    """
    try:
        result = await smart_bundling_service.approve_bundle(bundle_id)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Bundle approval failed: {str(e)}")
