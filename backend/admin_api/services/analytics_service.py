from typing import Dict, Any, List, Optional
from datetime import datetime
from admin_api.database import execute_readonly_query

class AnalyticsService:
    """
    Service providing standard Admin Dashboard KPI calculations, time series trends,
    categorical breakdowns, and multi-dimensional filter handling.
    """

    def _build_filter_conditions(
        self,
        user_id: Optional[int] = None,
        category: Optional[str] = None,
        department_name: Optional[str] = None,
        status: Optional[str] = None,
        date_preset: Optional[str] = None,
        date_from: Optional[str] = None,
        date_to: Optional[str] = None
    ) -> tuple[str, list]:
        conditions = []
        params = []

        if user_id:
            conditions.append("created_by_user_id = ?")
            params.append(user_id)

        if category:
            conditions.append("category = ?")
            params.append(category)

        if department_name:
            conditions.append("department_name = ?")
            params.append(department_name)

        if status:
            conditions.append("status = ?")
            params.append(status)

        current_year = datetime.now().year

        if date_preset == "last_7_days":
            conditions.append("created_at >= date('now', '-7 days')")
        elif date_preset == "last_30_days":
            conditions.append("created_at >= date('now', '-30 days')")
        elif date_preset == "this_month":
            conditions.append("created_year = ? AND created_month = ?")
            params.extend([current_year, datetime.now().month])
        elif date_preset == "this_year":
            conditions.append("created_year = ?")
            params.append(current_year)
        elif date_preset == "last_year":
            conditions.append("created_year = ?")
            params.append(current_year - 1)
        elif date_from and date_to:
            conditions.append("date(created_at) BETWEEN date(?) AND date(?)")
            params.extend([date_from, date_to])

        where_clause = f" WHERE {' AND '.join(conditions)}" if conditions else ""
        return where_clause, params

    def get_filter_options(self) -> Dict[str, Any]:
        users = execute_readonly_query("SELECT DISTINCT created_by_user_id AS id, author_name AS name FROM vw_admin_analytics_documents ORDER BY name;")
        departments = execute_readonly_query("SELECT DISTINCT department_name AS name FROM vw_admin_analytics_documents WHERE department_name IS NOT NULL ORDER BY name;")
        categories = execute_readonly_query("SELECT DISTINCT category AS name FROM vw_admin_analytics_documents ORDER BY name;")
        statuses = execute_readonly_query("SELECT DISTINCT status AS name FROM vw_admin_analytics_documents ORDER BY name;")

        return {
            "users": users,
            "departments": [d["name"] for d in departments],
            "categories": [c["name"] for c in categories],
            "statuses": [s["name"] for s in statuses]
        }

    def get_kpis(self, **kwargs) -> Dict[str, Any]:
        where_clause, params = self._build_filter_conditions(**kwargs)
        
        query = f"""
        SELECT
            COUNT(document_id) AS total_documents,
            SUM(CASE WHEN status = 'Approved' THEN 1 ELSE 0 END) AS approved_count,
            SUM(CASE WHEN status LIKE 'Pending%' THEN 1 ELSE 0 END) AS pending_count,
            SUM(CASE WHEN status = 'Draft' THEN 1 ELSE 0 END) AS draft_count,
            COUNT(DISTINCT created_by_user_id) AS active_authors,
            COUNT(DISTINCT department_id) AS active_departments
        FROM vw_admin_analytics_documents
        {where_clause};
        """
        rows = execute_readonly_query(query, tuple(params))
        row = rows[0] if rows else {}
        
        total = row.get("total_documents", 0) or 0
        approved = row.get("approved_count", 0) or 0
        approval_rate = round((approved / total * 100), 1) if total > 0 else 0.0

        return {
            "total_documents": total,
            "approved_count": approved,
            "pending_count": row.get("pending_count", 0) or 0,
            "draft_count": row.get("draft_count", 0) or 0,
            "approval_rate": approval_rate,
            "active_authors": row.get("active_authors", 0) or 0,
            "active_departments": row.get("active_departments", 0) or 0
        }

    def get_trends(self, granularity: str = "monthly", **kwargs) -> List[Dict[str, Any]]:
        where_clause, params = self._build_filter_conditions(**kwargs)
        
        if granularity == "weekly":
            query = f"""
            SELECT
                created_year || '-W' || printf('%02d', created_week) AS period_label,
                COUNT(document_id) AS document_count
            FROM vw_admin_analytics_documents
            {where_clause}
            GROUP BY period_label
            ORDER BY period_label ASC
            LIMIT 52;
            """
        elif granularity == "yearly":
            query = f"""
            SELECT
                CAST(created_year AS TEXT) AS period_label,
                COUNT(document_id) AS document_count
            FROM vw_admin_analytics_documents
            {where_clause}
            GROUP BY period_label
            ORDER BY period_label ASC;
            """
        else:  # monthly
            query = f"""
            SELECT
                created_year || '-' || printf('%02d', created_month) AS period_label,
                COUNT(document_id) AS document_count
            FROM vw_admin_analytics_documents
            {where_clause}
            GROUP BY period_label
            ORDER BY period_label ASC
            LIMIT 24;
            """
            
        return execute_readonly_query(query, tuple(params))

    def get_by_type(self, **kwargs) -> List[Dict[str, Any]]:
        where_clause, params = self._build_filter_conditions(**kwargs)
        query = f"""
        SELECT
            category,
            COUNT(document_id) AS count
        FROM vw_admin_analytics_documents
        {where_clause}
        GROUP BY category
        ORDER BY count DESC;
        """
        return execute_readonly_query(query, tuple(params))

    def get_by_user(self, **kwargs) -> List[Dict[str, Any]]:
        where_clause, params = self._build_filter_conditions(**kwargs)
        query = f"""
        SELECT
            author_name AS name,
            department_name AS department,
            COUNT(document_id) AS count
        FROM vw_admin_analytics_documents
        {where_clause}
        GROUP BY author_name, department_name
        ORDER BY count DESC
        LIMIT 10;
        """
        return execute_readonly_query(query, tuple(params))

    def get_drilldown_documents(self, dimension_type: str, dimension_value: str, **kwargs) -> List[Dict[str, Any]]:
        where_clause, params = self._build_filter_conditions(**kwargs)
        
        extra_cond = []
        if dimension_type in ["created_month", "month_name"]:
            val_lower = str(dimension_value).lower()
            month_names = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"]
            target_month = None
            for idx, m in enumerate(month_names, start=1):
                if m in val_lower:
                    target_month = idx
                    break
            
            import re
            year_match = re.search(r'\b(202[0-9])\b', val_lower)
            target_year = int(year_match.group(1)) if year_match else None

            if target_year and target_month:
                extra_cond.append("created_year = ? AND created_month = ?")
                params.extend([target_year, target_month])
            elif target_month:
                extra_cond.append("created_month = ?")
                params.append(target_month)
            else:
                extra_cond.append("(created_year || '-' || printf('%02d', created_month) LIKE ?)")
                params.append(f"%{dimension_value}%")
        elif dimension_type in ["author_name", "user"]:
            extra_cond.append("author_name LIKE ?")
            params.append(f"%{dimension_value}%")
        elif dimension_type in ["department_name", "department"]:
            extra_cond.append("department_name LIKE ?")
            params.append(f"%{dimension_value}%")
        elif dimension_type in ["category", "type"]:
            extra_cond.append("category LIKE ?")
            params.append(f"%{dimension_value}%")
        elif dimension_type == "status":
            extra_cond.append("status LIKE ?")
            params.append(f"%{dimension_value}%")

        if extra_cond:
            connector = " AND " if where_clause else " WHERE "
            where_clause += f"{connector}{' AND '.join(extra_cond)}"

        query = f"""
        SELECT
            document_id AS id,
            title,
            category,
            status,
            author_name,
            department_name,
            created_at
        FROM vw_admin_analytics_documents
        {where_clause}
        ORDER BY created_at DESC
        LIMIT 100;
        """
        return execute_readonly_query(query, tuple(params))

analytics_service = AnalyticsService()
