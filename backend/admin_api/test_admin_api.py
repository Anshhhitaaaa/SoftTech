import unittest
import sys
import os

# Ensure backend root is in sys.path for test runner
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from admin_api.database import init_db, execute_readonly_query
from admin_api.services.interpreter import interpreter_service
from admin_api.services.generator import generator_service
from admin_api.services.validator import validator_service, SQLValidationError
from admin_api.services.analytics_service import analytics_service

class TestAdminAnalyticsBackend(unittest.TestCase):

    @classmethod
    def setUpClass(cls):
        # Initialize test database tables, views, and seed data
        init_db()

    def test_01_interpreter_last_year_user(self):
        question = "Give me last year's documents uploaded by each user."
        intent = interpreter_service.interpret(question)
        self.assertEqual(intent["period"], "previous_calendar_year")
        self.assertIn("author_name", intent["group_by"])

    def test_02_interpreter_status_department(self):
        question = "Show approved documents in IT department by status."
        intent = interpreter_service.interpret(question)
        self.assertEqual(intent["filters"].get("status"), "Approved")
        self.assertEqual(intent["filters"].get("department_name"), "Information Technology")

    def test_03_sql_generator(self):
        intent = {
            "period": "previous_calendar_year",
            "group_by": ["author_name"],
            "filters": {"status": "Approved"}
        }
        sql, params = generator_service.generate(intent)
        self.assertIn("SELECT author_name, COUNT(document_id) AS document_count FROM vw_admin_analytics_documents", sql)
        self.assertIn("WHERE created_year = ? AND status = ?", sql)

    def test_04_validator_valid_query(self):
        valid_sql = "SELECT author_name, COUNT(document_id) AS document_count FROM vw_admin_analytics_documents GROUP BY author_name;"
        res = validator_service.validate(valid_sql)
        self.assertTrue(res["valid"])
        self.assertEqual(res["status"], "APPROVED")

    def test_05_validator_blocks_forbidden_ddl(self):
        malicious_sql = "DROP TABLE documents; SELECT * FROM users;"
        with self.assertRaises(SQLValidationError):
            validator_service.validate(malicious_sql)

    def test_06_validator_blocks_unauthorized_table(self):
        unauthorized_sql = "SELECT * FROM users;"
        with self.assertRaises(SQLValidationError):
            validator_service.validate(unauthorized_sql)

    def test_07_analytics_kpis(self):
        kpis = analytics_service.get_kpis()
        self.assertIn("total_documents", kpis)
        self.assertGreater(kpis["total_documents"], 0)
        self.assertIn("approval_rate", kpis)

    def test_08_analytics_trends(self):
        monthly = analytics_service.get_trends("monthly")
        self.assertIsInstance(monthly, list)
        self.assertGreater(len(monthly), 0)

if __name__ == "__main__":
    unittest.main()
