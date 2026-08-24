from datetime import datetime
from typing import Dict, Any, Tuple, List
from admin_api.allowlist import ALLOWED_DIMENSIONS, ALLOWED_FILTER_FIELDS

class SQLGenerator:
    """
    Generates controlled, parameterized SQL queries strictly matching the approved
    schema and allowlist from an interpreted analytical intent object.
    """
    
    def generate(self, intent: Dict[str, Any]) -> Tuple[str, List[Any]]:
        view_name = "vw_admin_analytics_documents"
        group_by_cols = [col for col in intent.get("group_by", []) if col in ALLOWED_DIMENSIONS]
        
        if not group_by_cols:
            group_by_cols = ["author_name"]

        select_cols = list(group_by_cols)
        if "created_month" in select_cols and "created_year" not in select_cols:
            select_cols.insert(0, "created_year")

        select_clause = ", ".join(select_cols) + ", COUNT(document_id) AS document_count"
        group_clause = ", ".join(select_cols)
        
        where_conditions = []
        params = []

        # Process Period Filter
        period = intent.get("period", "all_time")
        current_year = datetime.now().year

        if period == "previous_calendar_year":
            where_conditions.append("created_year = ?")
            params.append(current_year - 1)
        elif period == "this_year":
            where_conditions.append("created_year = ?")
            params.append(current_year)
        elif period == "last_30_days":
            where_conditions.append("created_at >= date('now', '-30 days')")
        elif period == "last_7_days":
            where_conditions.append("created_at >= date('now', '-7 days')")
        elif period.startswith("year_"):
            try:
                y = int(period.replace("year_", ""))
                where_conditions.append("created_year = ?")
                params.append(y)
            except ValueError:
                pass

        # Process Explicit Filters
        for field, value in intent.get("filters", {}).items():
            if field in ALLOWED_FILTER_FIELDS:
                where_conditions.append(f"{field} = ?")
                params.append(value)

        where_clause = f" WHERE {' AND '.join(where_conditions)}" if where_conditions else ""

        # Chronological ordering for time-series, count ranking for categorical dimensions
        is_time_dimension = any(c in select_cols for c in ["created_month", "created_year", "created_week"])
        if is_time_dimension:
            order_clause = "ORDER BY " + ", ".join(f"{col} ASC" for col in select_cols)
        else:
            order_clause = "ORDER BY document_count DESC"

        sql = (
            f"SELECT {select_clause} "
            f"FROM {view_name}"
            f"{where_clause} "
            f"GROUP BY {group_clause} "
            f"{order_clause} "
            f"LIMIT 100;"
        )

        return sql, params

generator_service = SQLGenerator()
