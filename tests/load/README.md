# ⚡ Enterprise API Load Testing Infrastructure

Comprehensive, automated performance load testing suite powered by **Locust** for the **ASP.NET Core SystemConfigApi** and **FastAPI Admin API**.

---

## 📁 Architecture Overview

```text
tests/load/
├── config.py                     # Target URLs, SLA thresholds (p95 < 500ms, Error < 1%), report paths
├── locustfile_system_config.py   # SystemConfigApi user scenarios (Documents workflow, Lookups, Users, Groups)
├── locustfile_admin_api.py       # Admin API user scenarios (Auth, Analytics, NL Query engine)
├── run_load_tests.py             # CLI runner orchestrator, SLA verifier, and report generator
├── requirements.txt              # Dependencies (locust, requests, colorama)
└── reports/                      # Auto-generated HTML and CSV performance reports
```

---

## 🚀 Quickstart

### 1. Install Dependencies
```powershell
pip install -r tests/load/requirements.txt
```

### 2. Run Headless Load Tests with SLA Verification

**Run SystemConfigApi Load Test**:
```powershell
python tests/load/run_load_tests.py --target system-config --users 20 --spawn-rate 5 --run-time 30s
```

**Run Admin API Load Test**:
```powershell
python tests/load/run_load_tests.py --target admin-api --users 20 --spawn-rate 5 --run-time 30s
```

**Run All Load Tests**:
```powershell
python tests/load/run_load_tests.py --target all --users 30 --spawn-rate 5 --run-time 1m
```

---

## 🌐 Interactive Web UI Mode

Launch the Locust web dashboard to monitor live RPS charts, response time distributions, and errors interactively:

```powershell
locust -f tests/load/locustfile_system_config.py --host http://localhost:5000
```
Open **`http://localhost:8089`** in your browser.

---

## 📊 SLA Performance Criteria

The automated runner enforces the following SLAs:
- **95th Percentile Latency (p95)**: $< 500\text{ ms}$
- **Error Rate**: $< 1\%$

If any SLA threshold is exceeded, `run_load_tests.py` exits with code `1`, breaking CI builds automatically.
