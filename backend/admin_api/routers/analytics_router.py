from fastapi import APIRouter, Depends, Query
from typing import Optional
from admin_api.auth import get_current_admin
from admin_api.services.analytics_service import analytics_service

router = APIRouter(prefix="/analytics", tags=["Admin Dashboard Analytics"])

@router.get("/filters")
def get_filter_options(current_admin: dict = Depends(get_current_admin)):
    return analytics_service.get_filter_options()

@router.get("/kpis")
def get_kpis(
    user_id: Optional[int] = Query(None),
    category: Optional[str] = Query(None),
    department_name: Optional[str] = Query(None),
    status: Optional[str] = Query(None),
    date_preset: Optional[str] = Query(None),
    date_from: Optional[str] = Query(None),
    date_to: Optional[str] = Query(None),
    current_admin: dict = Depends(get_current_admin)
):
    return analytics_service.get_kpis(
        user_id=user_id,
        category=category,
        department_name=department_name,
        status=status,
        date_preset=date_preset,
        date_from=date_from,
        date_to=date_to
    )

@router.get("/trends")
def get_trends(
    granularity: str = Query("monthly", regex="^(weekly|monthly|yearly)$"),
    user_id: Optional[int] = Query(None),
    category: Optional[str] = Query(None),
    department_name: Optional[str] = Query(None),
    status: Optional[str] = Query(None),
    date_preset: Optional[str] = Query(None),
    date_from: Optional[str] = Query(None),
    date_to: Optional[str] = Query(None),
    current_admin: dict = Depends(get_current_admin)
):
    return analytics_service.get_trends(
        granularity=granularity,
        user_id=user_id,
        category=category,
        department_name=department_name,
        status=status,
        date_preset=date_preset,
        date_from=date_from,
        date_to=date_to
    )

@router.get("/by-type")
def get_by_type(
    user_id: Optional[int] = Query(None),
    category: Optional[str] = Query(None),
    department_name: Optional[str] = Query(None),
    status: Optional[str] = Query(None),
    date_preset: Optional[str] = Query(None),
    date_from: Optional[str] = Query(None),
    date_to: Optional[str] = Query(None),
    current_admin: dict = Depends(get_current_admin)
):
    return analytics_service.get_by_type(
        user_id=user_id,
        category=category,
        department_name=department_name,
        status=status,
        date_preset=date_preset,
        date_from=date_from,
        date_to=date_to
    )

@router.get("/by-user")
def get_by_user(
    user_id: Optional[int] = Query(None),
    category: Optional[str] = Query(None),
    department_name: Optional[str] = Query(None),
    status: Optional[str] = Query(None),
    date_preset: Optional[str] = Query(None),
    date_from: Optional[str] = Query(None),
    date_to: Optional[str] = Query(None),
    current_admin: dict = Depends(get_current_admin)
):
    return analytics_service.get_by_user(
        user_id=user_id,
        category=category,
        department_name=department_name,
        status=status,
        date_preset=date_preset,
        date_from=date_from,
        date_to=date_to
    )

@router.get("/drilldown")
def get_drilldown_documents(
    dimension_type: str = Query(...),
    dimension_value: str = Query(...),
    user_id: Optional[int] = Query(None),
    category: Optional[str] = Query(None),
    department_name: Optional[str] = Query(None),
    status: Optional[str] = Query(None),
    date_preset: Optional[str] = Query(None),
    date_from: Optional[str] = Query(None),
    date_to: Optional[str] = Query(None),
    current_admin: dict = Depends(get_current_admin)
):
    return analytics_service.get_drilldown_documents(
        dimension_type=dimension_type,
        dimension_value=dimension_value,
        user_id=user_id,
        category=category,
        department_name=department_name,
        status=status,
        date_preset=date_preset,
        date_from=date_from,
        date_to=date_to
    )
