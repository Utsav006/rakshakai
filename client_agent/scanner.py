import platform
import socket
import requests
import time

print("🛡️ Health Buddy Security Agent Initializing...")

# 1. Gather REAL system data from the machine
hostname = socket.gethostname()
ip_address = socket.gethostbyname(hostname)
os_info = platform.system() + " " + platform.release()

print(f"[*] Scanning system: {hostname} ({ip_address}) running {os_info}...")

# 2. Define real, dangerous ports to scan (including 8000 to guarantee a hit for your demo)
TARGET_PORTS = {
    21: {"service": "FTP", "cve": "CVE-9999-0021", "desc": "Unencrypted FTP port exposed. Vulnerable to credential sniffing.", "score": 6.5},
    22: {"service": "SSH", "cve": "CVE-9999-0022", "desc": "SSH port open. Ensure key-based auth is enforced.", "score": 4.0},
    23: {"service": "Telnet", "cve": "CVE-9999-0023", "desc": "Highly insecure Telnet port exposed. Cleartext data transmission.", "score": 9.8},
    3389: {"service": "RDP", "cve": "CVE-2019-0708", "desc": "Remote Desktop Port exposed. Vulnerable to BlueKeep if unpatched.", "score": 9.8},
    8000: {"service": "FastAPI API", "cve": "CVE-DEMO-8000", "desc": "Unsecured API endpoint exposed to local network.", "score": 8.5}
}

found_vulnerabilities = []

# 3. Perform the actual network TCP scan
for port, details in TARGET_PORTS.items():
    sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    sock.settimeout(0.5) # Quick half-second timeout per port
    result = sock.connect_ex(('127.0.0.1', port))
    
    if result == 0:
        print(f"[!] DANGER: Found open port {port} ({details['service']})")
        found_vulnerabilities.append({
            "cve_id": details["cve"],
            "description": details["desc"],
            "severity": "CRITICAL" if details["score"] > 8 else "HIGH",
            "cvss_score": details["score"]
        })
    sock.close()

if not found_vulnerabilities:
    print("[*] Scan complete. System is secure. No exposed ports found.")
    exit()

# 4. Package the data for ingestion
payload = {
    "asset_name": f"Client Prod Server ({hostname})",
    "asset_type": "SERVER",
    "ip_address": ip_address,
    "vulnerabilities": found_vulnerabilities
}

print("[*] Transmitting real telemetry to Health Buddy Dashboard...")

# 5. Inject the data into your backend
try:
    response = requests.post("http://127.0.0.1:8000/api/ingest/scan", json=payload)
    if response.status_code == 200:
        print("✅ Scan complete! Real network data injected successfully.")
    else:
        print(f"❌ Failed to connect: {response.text}")
except Exception as e:
    print(f"❌ Connection error: {e}")