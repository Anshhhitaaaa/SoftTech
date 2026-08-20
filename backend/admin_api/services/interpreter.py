import re
from datetime import datetime
from typing import Dict, Any, List

class QueryInterpreter:
    """
    Interprets natural language question into a structured analytical intent object.
    Identifies metrics, groupings/dimensions, date periods, and explicit filters.
    """
    
    PERIOD_KEYWORDS = {
        "last year": "previous_calendar_year",
        "previous year": "previous_calendar_year",
        "this year": "this_year",
        "current year": "this_year",
        "last 30 days": "last_30_days",
        "past month": "last_30_days",
        "last month": "last_month",
        "previous month": "last_month",
        "this month": "this_month",
        "last 7 days": "last_7_days",
        "past week": "last_7_days"
    }

    DIMENSION_KEYWORDS = {
        "by user": "author_name",
        "uploaded by user": "author_name",
        "uploaded by each user": "author_name",
        "by author": "author_name",
        "by each user": "author_name",
        "per user": "author_name",
        "by department": "department_name",
        "per department": "department_name",
        "by category": "category",
        "by type": "category",
        "per type": "category",
        "by status": "status",
        "per status": "status",
        "by month": "created_month",
        "monthly": "created_month",
        "by year": "created_year",
        "yearly": "created_year",
        "by week": "created_week",
        "weekly": "created_week",
        "by day": "created_day_of_week"
    }

    STATUS_MAP = {
        "approved": "Approved",
        "draft": "Draft",
        "pending review": "Pending Review",
        "pending approval": "Pending Approval",
        "returned": "Returned to Author"
    }

    DEPARTMENT_MAP = {
        "it": "Information Technology",
        "information technology": "Information Technology",
        "hr": "Human Resources",
        "human resources": "Human Resources",
        "finance": "Finance & Accounts",
        "legal": "Legal & Compliance",
        "operations": "Operations & Supply Chain",
        "qa": "Quality Assurance",
        "quality assurance": "Quality Assurance"
    }

    def interpret(self, question: str) -> Dict[str, Any]:
        q_lower = question.lower().strip()
        
        # 1. Identify Period
        period = "all_time"
        for key, val in self.PERIOD_KEYWORDS.items():
            if key in q_lower:
                period = val
                break

        # Explicit year extraction (e.g. 2024, 2025, 2026)
        year_match = re.search(r'\b(202[0-9])\b', q_lower)
        explicit_year = int(year_match.group(1)) if year_match else None
        if explicit_year and period == "all_time":
            period = f"year_{explicit_year}"

        # 2. Identify Group By Dimensions
        group_by: List[str] = []
        for key, dim in self.DIMENSION_KEYWORDS.items():
            if key in q_lower and dim not in group_by:
                group_by.append(dim)
        
        # Fallback grouping defaults if unspecified
        if not group_by:
            if "department" in q_lower:
                group_by.append("department_name")
            elif "user" in q_lower or "author" in q_lower:
                group_by.append("author_name")
            elif "category" in q_lower or "type" in q_lower:
                group_by.append("category")
            elif "status" in q_lower:
                group_by.append("status")
            elif "trend" in q_lower or "monthly" in q_lower:
                group_by.append("created_month")
            else:
                group_by.append("author_name")  # default analytical breakdown

        # 3. Identify Filters
        filters = {}
        # Status filters
        for s_key, s_val in self.STATUS_MAP.items():
            if s_key in q_lower:
                filters["status"] = s_val
                break

        # Department filters
        for d_key, d_val in self.DEPARTMENT_MAP.items():
            if f"in {d_key}" in q_lower or f"{d_key} department" in q_lower:
                filters["department_name"] = d_val
                break

        # 4. Metric
        metric = "COUNT"
        if "average" in q_lower or "avg" in q_lower:
            metric = "AVG"

        return {
            "original_question": question,
            "target_view": "vw_admin_analytics_documents",
            "period": period,
            "explicit_year": explicit_year,
            "metric": metric,
            "group_by": group_by,
            "filters": filters
        }

interpreter_service = QueryInterpreter()
