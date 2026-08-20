from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from typing import Dict, Any, List
from admin_api.auth import get_current_admin
from admin_api.services.interpreter import interpreter_service
from admin_api.services.generator import generator_service
from admin_api.services.validator import validator_service, SQLValidationError
from admin_api.database import execute_readonly_query

router = APIRouter(prefix="/nl-query", tags=["Natural Language Analytics Query Engine"])

class NLQueryRequest(BaseModel):
    question: str

class NLQueryResponse(BaseModel):
    question: str
    interpretation: Dict[str, Any]
    generated_sql: str
    sql_parameters: List[Any]
    validation_status: Dict[str, Any]
    results: List[Dict[str, Any]]
    recommended_chart: str

@router.post("", response_model=NLQueryResponse)
def process_natural_language_query(
    request: NLQueryRequest,
    current_admin: dict = Depends(get_current_admin)
):
    if not request.question or not request.question.strip():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Question prompt cannot be empty."
        )

    # Step 1: Natural Language Interpretation
    intent = interpreter_service.interpret(request.question)

    # Step 2: Safe Controlled Query Generation
    sql, params = generator_service.generate(intent)

    # Step 3: Strict SQL Allowlist & Security Validation
    try:
        validation_result = validator_service.validate(sql)
    except SQLValidationError as err:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Query Security Validation Failed: {str(err)}"
        )

    # Step 4: Execute Read-Only Query Against Approved Database Views
    try:
        query_results = execute_readonly_query(sql, tuple(params))
    except Exception as ex:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Database execution error: {str(ex)}"
        )

    # Step 5: Determine Recommended Visualization Type
    recommended_chart = "bar"
    group_by = intent.get("group_by", [])
    if "created_month" in group_by or "created_year" in group_by or "created_week" in group_by:
        recommended_chart = "line"
    elif "category" in group_by or "status" in group_by:
        recommended_chart = "pie"

    return {
        "question": request.question,
        "interpretation": intent,
        "generated_sql": sql,
        "sql_parameters": params,
        "validation_status": validation_result,
        "results": query_results,
        "recommended_chart": recommended_chart
    }
