import os

# Default Target Hosts
SYSTEM_CONFIG_API_HOST = os.getenv("SYSTEM_CONFIG_API_HOST", "http://localhost:5000")
ADMIN_API_HOST = os.getenv("ADMIN_API_HOST", "http://localhost:8000")

# Load Testing Default Parameters
DEFAULT_USERS = int(os.getenv("LOAD_TEST_USERS", "20"))
DEFAULT_SPAWN_RATE = int(os.getenv("LOAD_TEST_SPAWN_RATE", "5"))
DEFAULT_RUN_TIME = os.getenv("LOAD_TEST_RUN_TIME", "30s")

# Performance SLA Thresholds
MAX_ALLOWED_P95_LATENCY_MS = float(os.getenv("MAX_P95_LATENCY_MS", "500.0"))
MAX_ALLOWED_ERROR_RATE_PCT = float(os.getenv("MAX_ERROR_RATE_PCT", "1.0"))

# Report Output Directory
REPORTS_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "reports")
os.makedirs(REPORTS_DIR, exist_ok=True)
