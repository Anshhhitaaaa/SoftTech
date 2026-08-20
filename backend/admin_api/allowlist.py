"""
Allowlist Specification & Schema Security Rules
Restricts all executed queries to approved analytics views, columns, metrics, and dimensions.
"""

# Approved Tables and Views that the query engine is permitted to query
ALLOWED_TABLES_AND_VIEWS = {
    "vw_admin_analytics_documents": {
        "description": "Denormalized analytics view for documents, users, departments, and timelines",
        "columns": {
            "document_id": "INTEGER",
            "title": "TEXT",
            "category": "TEXT",
            "status": "TEXT",
            "created_by_user_id": "INTEGER",
            "author_name": "TEXT",
            "department_id": "INTEGER",
            "department_name": "TEXT",
            "designation_id": "INTEGER",
            "designation_name": "TEXT",
            "reviewer_name": "TEXT",
            "approver_name": "TEXT",
            "created_at": "TIMESTAMP",
            "updated_at": "TIMESTAMP",
            "created_year": "INTEGER",
            "created_month": "INTEGER",
            "created_week": "INTEGER",
            "created_day_of_week": "TEXT"
        }
    },
    "vw_admin_analytics_user_activities": {
        "description": "Summary view of user document activities and status counts",
        "columns": {
            "user_id": "INTEGER",
            "user_name": "TEXT",
            "department_name": "TEXT",
            "designation_name": "TEXT",
            "total_documents_created": "INTEGER",
            "approved_documents_count": "INTEGER",
            "pending_documents_count": "INTEGER",
            "documents_reviewed_count": "INTEGER",
            "documents_approved_count": "INTEGER",
            "last_activity_timestamp": "TIMESTAMP"
        }
    }
}

# Allowed SQL Aggregations
ALLOWED_AGGREGATIONS = {
    "COUNT": "Count of records or non-null values",
    "COUNT_DISTINCT": "Count of distinct values",
    "AVG": "Average value of a numeric field",
    "SUM": "Sum of numeric field",
    "MIN": "Minimum value",
    "MAX": "Maximum value"
}

# Allowed Grouping Dimensions
ALLOWED_DIMENSIONS = [
    "author_name",
    "department_name",
    "category",
    "status",
    "designation_name",
    "created_year",
    "created_month",
    "created_week",
    "created_day_of_week"
]

# Allowed Filterable Fields
ALLOWED_FILTER_FIELDS = [
    "author_name",
    "department_name",
    "category",
    "status",
    "designation_name",
    "created_at",
    "created_year",
    "created_month",
    "created_week"
]

# Forbidden Keywords, Commands, & Injection Constructs
FORBIDDEN_KEYWORDS = [
    "INSERT", "UPDATE", "DELETE", "DROP", "ALTER", "CREATE", "TRUNCATE",
    "RENAME", "REPLACE", "GRANT", "REVOKE", "EXEC", "EXECUTE", "UNION",
    "INFORMATION_SCHEMA", "PG_CATALOG", "PG_TABLES", "SQLITE_MASTER",
    "SQLITE_SCHEMA", "ATTACH", "DETACH", "PRAGMA", "COPY", "LOAD_EXTENSION"
]
