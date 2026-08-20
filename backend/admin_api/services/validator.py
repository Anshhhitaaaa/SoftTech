import re
from typing import Dict, Any
from admin_api.allowlist import ALLOWED_TABLES_AND_VIEWS, FORBIDDEN_KEYWORDS

class SQLValidationError(Exception):
    pass

class SQLValidator:
    """
    Strict SQL Security & Sandbox Validator.
    Enforces allowlist checks, statement single-selection rules, and anti-injection policies.
    """
    
    def validate(self, sql_query: str) -> Dict[str, Any]:
        cleaned = sql_query.strip()
        
        # 1. Reject empty queries
        if not cleaned:
            raise SQLValidationError("Query cannot be empty.")

        # 2. Must start with SELECT
        if not cleaned.upper().startswith("SELECT"):
            raise SQLValidationError("Security Violation: Only SELECT queries are permitted.")

        # 3. Reject multiple statements / chained semicolons
        semicolon_count = cleaned.count(";")
        if semicolon_count > 1 or (semicolon_count == 1 and not cleaned.endswith(";")):
            raise SQLValidationError("Security Violation: Chained or multiple SQL statements are forbidden.")

        # 4. Keyword Blacklist Inspection
        upper_query = cleaned.upper()
        for forbidden in FORBIDDEN_KEYWORDS:
            pattern = rf"\b{forbidden}\b"
            if re.search(pattern, upper_query):
                raise SQLValidationError(f"Security Violation: Forbidden SQL operation or catalog reference detected: '{forbidden}'")

        # 5. Table/View Allowlist Inspection
        # Extract tables referenced in FROM / JOIN clauses
        from_matches = re.findall(r"\bFROM\s+([a-zA-Z0-9_]+)", upper_query, re.IGNORECASE)
        join_matches = re.findall(r"\bJOIN\s+([a-zA-Z0-9_]+)", upper_query, re.IGNORECASE)
        referenced_tables = [tbl.lower() for tbl in (from_matches + join_matches)]

        if not referenced_tables:
            raise SQLValidationError("Security Violation: Query must reference a target table/view.")

        allowed_table_names = [tbl.lower() for tbl in ALLOWED_TABLES_AND_VIEWS.keys()]
        for tbl in referenced_tables:
            if tbl not in allowed_table_names:
                raise SQLValidationError(
                    f"Security Violation: Access denied to table/view '{tbl}'. "
                    f"Queries are strictly restricted to approved analytics views ({', '.join(ALLOWED_TABLES_AND_VIEWS.keys())})."
                )

        return {
            "valid": True,
            "status": "APPROVED",
            "referenced_tables": referenced_tables,
            "validation_message": "Query passed strict schema allowlist and anti-injection security validation."
        }

validator_service = SQLValidator()
