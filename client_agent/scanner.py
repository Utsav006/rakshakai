import platform
import socket
import requests
import os
import time

print("🛡️ Rakshak Ai Security Agent Initializing (Daemon Mode)...")

def check_osv_api(package_name, version, ecosystem="PyPI"):
    """Queries the global OSV database for real vulnerabilities."""
    url = "https://api.osv.dev/v1/query"
    payload = {
        "version": version,
        "package": {"name": package_name, "ecosystem": ecosystem}
    }
    
    try:
        response = requests.post(url, json=payload, timeout=5)
        if response.status_code == 200 and "vulns" in response.json():
            return response.json()["vulns"]
    except Exception as e:
        print(f"  [!] OSV API Error: {e}")
    return []

def run_scan_cycle():
    hostname = socket.gethostname()
    ip_address = socket.gethostbyname(hostname)
    os_info = platform.system() + " " + platform.release()
    print(f"\n[*] Scanning system: {hostname} ({ip_address}) running {os_info}...")

    found_vulnerabilities = []

    # PHASE 1: INFRASTRUCTURE SCAN
    print("[*] Phase 1: Scanning network infrastructure for exposed ports...")
    TARGET_PORTS = {
        22: {"service": "SSH", "cve": "CVE-9999-0022", "desc": "SSH port open.", "score": 4.0},
        8000: {"service": "FastAPI API", "cve": "CVE-DEMO-8000", "desc": "Unsecured API endpoint.", "score": 8.5}
    }

    for port, details in TARGET_PORTS.items():
        sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        sock.settimeout(0.5) 
        if sock.connect_ex(('127.0.0.1', port)) == 0:
            print(f"  [!] DANGER: Found open port {port} ({details['service']})")
            found_vulnerabilities.append({
                "cve_id": details["cve"],
                "description": details["desc"],
                "severity": "CRITICAL" if details["score"] > 8 else "HIGH",
                "cvss_score": details["score"]
            })
        sock.close()

    # PHASE 2: REAL SOFTWARE DEPENDENCY SCAN
    print("[*] Phase 2: Scanning dependencies via Google OSV API...")
    seen_cves = set() # Tracking seen IDs locally with a set
    
    if os.path.exists("requirements.txt"):
        with open("requirements.txt", "r") as f:
            for line in f:
                if "==" in line:
                    pkg, ver = line.strip().split("==")
                    print(f"  [*] Checking {pkg}@{ver}...")
                    vulns = check_osv_api(pkg, ver)
                    
                    for v in vulns:
                        cve_id = v.get("aliases", [v.get("id")])[0]
                        if cve_id in seen_cves:
                            continue
                        seen_cves.add(cve_id)
                        
                        summary = v.get("summary", "Known vulnerability detected.")
                        print(f"    🚨 VULN FOUND: {cve_id} - {summary}")
                        found_vulnerabilities.append({
                            "cve_id": cve_id,
                            "description": f"OSV Hit: {pkg} - {summary}",
                            "severity": "HIGH",
                            "cvss_score": 7.5
                        })

    # PHASE 3: TRANSMISSION
    if not found_vulnerabilities:
        print("[*] Scan complete. System is secure.")
        return

    payload = {
        "asset_name": f"Client Prod Server ({hostname})",
        "asset_type": "SERVER",
        "vulnerabilities": found_vulnerabilities
    }

    print("[*] Transmitting real telemetry to Local Dashboard...")
    try:
        # ⚠️ UPDATED: Pointing to Localhost instead of Render
        response = requests.post("http://localhost:8000/api/ingest/scan", json=payload)
        if response.status_code == 200:
            print("✅ Scan complete! Threat data injected successfully.")
    except Exception as e:
        print(f"❌ Connection error: {e}")

# Pillar 4: Background Service Execution
if __name__ == "__main__":
    while True:
        run_scan_cycle()
        print("\n[*] Scan cycle complete. Health Buddy agent sleeping for 60 seconds...")
        time.sleep(60)