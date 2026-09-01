import random
from locust import HttpUser, task, between

class AdminApiUser(HttpUser):
    """
    Locust user simulating operations against FastAPI Admin Analytics API.
    Covers authentication, analytics data retrieval, and natural language query processing.
    """
    wait_time = between(0.5, 2.0)
    token = None

    def on_start(self):
        """Authenticate user on start to acquire JWT token if required."""
        response = self.client.post(
            "/api/admin/auth/login",
            json={"username": "admin@softtech.com", "password": "AdminPass123!"},
            name="/api/admin/auth/login"
        )
        if response.status_code == 200:
            data = response.json()
            self.token = data.get("access_token")

    @task(3)
    def check_root_health(self):
        """Service health check endpoint."""
        self.client.get("/", name="/ [Health]")

    @task(3)
    def run_analytics_query(self):
        """Fetch analytics metrics."""
        headers = {"Authorization": f"Bearer {self.token}"} if self.token else {}
        self.client.get("/api/admin/analytics/overview", headers=headers, name="/api/admin/analytics/overview")

    @task(2)
    def run_natural_language_query(self):
        """Execute natural language query search."""
        queries = [
            "Show total users per department",
            "List all approved documents in last month",
            "Get user group counts by office category",
            "Find documents pending review"
        ]
        headers = {"Authorization": f"Bearer {self.token}"} if self.token else {}
        payload = {"query": random.choice(queries)}
        self.client.post(
            "/api/admin/query/natural-language",
            json=payload,
            headers=headers,
            name="/api/admin/query/natural-language"
        )
