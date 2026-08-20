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

        select_clause = ", ".join(group_by_cols) + ", COUNT(document_id) AS document_count"
        group_clause = ", ".join(group_by_cols)
        
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

        sql = (
            f"SELECT {select_clause} "
            f"FROM {view_name}"
            f"{where_clause} "
            f"GROUP BY {group_clause} "
            f"ORDER BY document_count DESC "
            f"LIMIT 100;"
        )

        return sql, params

generator_service = SQLGenerator()
