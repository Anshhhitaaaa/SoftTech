import os
import sys
import argparse
import subprocess
import csv
import time

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')
if hasattr(sys.stderr, 'reconfigure'):
    sys.stderr.reconfigure(encoding='utf-8')
from config import (
    SYSTEM_CONFIG_API_HOST,
    ADMIN_API_HOST,
    DEFAULT_USERS,
    DEFAULT_SPAWN_RATE,
    DEFAULT_RUN_TIME,
    MAX_ALLOWED_P95_LATENCY_MS,
    MAX_ALLOWED_ERROR_RATE_PCT,
    REPORTS_DIR
)

def run_locust_suite(locust_file, host, target_name, users, spawn_rate, run_time):
    print("\n" + "="*80)
    print(f"🚀 RUNNING API LOAD TEST: [{target_name.upper()}]")
    print(f"Target Host: {host}")
    print(f"Users: {users} | Spawn Rate: {spawn_rate}/s | Duration: {run_time}")
    print("="*80 + "\n")

    timestamp = int(time.time())
    report_prefix = os.path.join(REPORTS_DIR, f"{target_name}_{timestamp}")
    html_report = f"{report_prefix}.html"
    csv_prefix = f"{report_prefix}_csv"

    cmd = [
        sys.executable, "-m", "locust",
        "-f", locust_file,
        "--host", host,
        "--users", str(users),
        "--spawn-rate", str(spawn_rate),
        "--run-time", run_time,
        "--stop-timeout", "2",
        "--headless",
        "--html", html_report,
        "--csv", csv_prefix
    ]

    print(f"Executing Command: {' '.join(cmd)}")
    result = subprocess.run(cmd, capture_output=True, text=True)

    print("\n" + "-"*80)
    print("LOG OUTPUT:")
    print(result.stdout or result.stderr)
    print("-"*80)

    stats_csv = f"{csv_prefix}_stats.csv"
    sla_passed = verify_sla_performance(stats_csv, target_name, html_report)
    return sla_passed

def safe_float(val, default=0.0):
    try:
        return float(val)
    except (ValueError, TypeError):
        return default

def verify_sla_performance(stats_csv_path, target_name, html_report):
    if not os.path.exists(stats_csv_path):
        print(f"⚠️ Warning: Stats CSV file {stats_csv_path} not found.")
        return False

    print("\n" + "="*80)
    print(f"📊 PERFORMANCE SLA VERIFICATION REPORT: [{target_name.upper()}]")
    print("="*80)

    total_requests = 0
    total_failures = 0
    p95_latency = 0.0
    p50_latency = 0.0
    p90_latency = 0.0
    p99_latency = 0.0
    total_rps = 0.0

    with open(stats_csv_path, "r", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        for row in reader:
            if row.get("Name") == "Aggregated":
                total_requests = int(safe_float(row.get("Request Count", 0)))
                total_failures = int(safe_float(row.get("Failure Count", 0)))
                total_rps = safe_float(row.get("Requests/s", 0.0))
                p50_latency = safe_float(row.get("50%", 0.0))
                p90_latency = safe_float(row.get("90%", 0.0))
                p95_latency = safe_float(row.get("95%", 0.0))
                p99_latency = safe_float(row.get("99%", 0.0))
                break

    error_rate = (total_failures / total_requests * 100.0) if total_requests > 0 else 0.0

    print(f"• Total Requests Processed : {total_requests}")
    print(f"• Total Failed Requests     : {total_failures}")
    print(f"• Error Rate               : {error_rate:.2f}% (Threshold: < {MAX_ALLOWED_ERROR_RATE_PCT}%)")
    print(f"• Requests / Second (RPS)   : {total_rps:.2f}")
    print(f"• Median Latency (p50)      : {p50_latency:.2f} ms")
    print(f"• 90th Percentile (p90)     : {p90_latency:.2f} ms")
    print(f"• 95th Percentile (p95)     : {p95_latency:.2f} ms (Threshold: < {MAX_ALLOWED_P95_LATENCY_MS} ms)")
    print(f"• 99th Percentile (p99)     : {p99_latency:.2f} ms")
    print(f"• HTML Performance Report   : file:///{os.path.abspath(html_report).replace('\\', '/')}")
    print("="*80)

    sla_passed = True
    if p95_latency > MAX_ALLOWED_P95_LATENCY_MS:
        print(f"❌ SLA FAILURE: 95th percentile latency ({p95_latency:.2f}ms) exceeded maximum threshold ({MAX_ALLOWED_P95_LATENCY_MS}ms)")
        sla_passed = False

    if error_rate > MAX_ALLOWED_ERROR_RATE_PCT:
        print(f"❌ SLA FAILURE: Error rate ({error_rate:.2f}%) exceeded maximum threshold ({MAX_ALLOWED_ERROR_RATE_PCT}%)")
        sla_passed = False

    if sla_passed:
        print("✅ PERFORMANCE SLA VERIFICATION PASSED SUCCESSFULLY!")
    
    return sla_passed

def main():
    parser = argparse.ArgumentParser(description="API Load Test Orchestrator & SLA Verifier")
    parser.add_argument("--target", choices=["system-config", "admin-api", "all"], default="system-config", help="Target API service")
    parser.add_argument("--host", type=str, help="Override target host URL")
    parser.add_argument("--users", type=int, default=DEFAULT_USERS, help="Concurrent user count")
    parser.add_argument("--spawn-rate", type=int, default=DEFAULT_SPAWN_RATE, help="User spawn rate per second")
    parser.add_argument("--run-time", type=str, default=DEFAULT_RUN_TIME, help="Test duration (e.g. 30s, 1m)")

    args = parser.parse_args()

    base_dir = os.path.dirname(os.path.abspath(__file__))
    overall_success = True

    if args.target in ("system-config", "all"):
        locust_file = os.path.join(base_dir, "locustfile_system_config.py")
        host = args.host or SYSTEM_CONFIG_API_HOST
        success = run_locust_suite(locust_file, host, "system-config", args.users, args.spawn_rate, args.run_time)
        if not success:
            overall_success = False

    if args.target in ("admin-api", "all"):
        locust_file = os.path.join(base_dir, "locustfile_admin_api.py")
        host = args.host or ADMIN_API_HOST
        success = run_locust_suite(locust_file, host, "admin-api", args.users, args.spawn_rate, args.run_time)
        if not success:
            overall_success = False

    if not overall_success:
        print("\n❌ Load Test Suite Failed SLA Assertions.")
        sys.exit(1)
    else:
        print("\n🎉 All Load Test Suites Completed Successfully!")
        sys.exit(0)

if __name__ == "__main__":
    main()
