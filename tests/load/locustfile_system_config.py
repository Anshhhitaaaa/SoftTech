import random
from locust import HttpUser, task, between, events

class SystemConfigApiUser(HttpUser):
    """
    Locust user simulating real-world operations against ASP.NET Core SystemConfigApi.
    Covers Document CQRS workflow transitions, Lookups, User registration, and UserGroups.
    """
    wait_time = between(0.5, 2.0)
    created_doc_ids = []

    def on_start(self):
        """Warm-up by fetching initial lookups and existing documents."""
        self.client.get("/api/Lookup/all", name="/api/Lookup/all [Warmup]")

    @task(4)
    def fetch_all_lookups(self):
        """Read-heavy endpoint: fetch office categories, offices, departments, designations."""
        self.client.get("/api/Lookup/all", name="/api/Lookup/all")

    @task(3)
    def fetch_documents(self):
        """Read documents by status filter."""
        statuses = [None, "Draft", "Pending Review", "Pending Approval", "Approved"]
        status = random.choice(statuses)
        url = "/api/Documents" if not status else f"/api/Documents?status={status}"
        self.client.get(url, name="/api/Documents [List]")

    @task(2)
    def fetch_single_document(self):
        """Fetch details of a specific document."""
        if self.created_doc_ids:
            doc_id = random.choice(self.created_doc_ids)
        else:
            doc_id = random.randint(1, 5)
        self.client.get(f"/api/Documents/{doc_id}", name="/api/Documents/{id}")

    @task(2)
    def create_document(self):
        """Write operation: Create a new compliance report draft."""
        payload = {
            "title": f"Load Test Report - {random.randint(10000, 99999)}",
            "category": "Audit & Compliance Report",
            "contentHtml": "<p>Automated load testing sample content generated during performance run.</p>",
            "createdByUserId": random.randint(1, 6)
        }
        response = self.client.post("/api/Documents", json=payload, name="/api/Documents [Create]")
        if response.status_code in (200, 201):
            data = response.json()
            if isinstance(data, dict) and "id" in data:
                self.created_doc_ids.append(data["id"])

    @task(1)
    def update_document_workflow_status(self):
        """Write operation: Transition document through review/approval state machine."""
        if not self.created_doc_ids:
            return
        doc_id = random.choice(self.created_doc_ids)
        transitions = [
            {"status": "Pending Review", "reviewedByUserId": 2, "notes": "Forwarded for review"},
            {"status": "Pending Approval", "approvedByUserId": 1, "notes": "Verified and forwarded to approver"},
            {"status": "Approved", "approvedByUserId": 1, "notes": "Approved and published"}
        ]
        payload = random.choice(transitions)
        self.client.put(f"/api/Documents/{doc_id}/status", json=payload, name="/api/Documents/{id}/status [Transition]")

    @task(2)
    def fetch_users(self):
        """Read users list."""
        self.client.get("/api/Users", name="/api/Users [List]")

    @task(1)
    def create_user(self):
        """Register a new user."""
        payload = {
            "fullName": f"Test User {random.randint(100, 999)}",
            "departmentId": random.randint(1, 5),
            "designationId": random.randint(1, 5)
        }
        self.client.post("/api/Users", json=payload, name="/api/Users [Create]")

    @task(2)
    def fetch_user_groups(self):
        """Read user groups."""
        self.client.get("/api/UserGroups", name="/api/UserGroups [List]")
