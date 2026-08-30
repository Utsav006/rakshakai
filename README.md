# 🛡️ Rakshak AI

**Privacy-first, real-time endpoint security posture monitoring with an offline AI remediation copilot.**

Rakshak AI continuously scans your infrastructure for open ports and vulnerable dependencies, cross-references them against live CVE databases, and gives you instant, plain-language fixes — all without ever sending your code or network data to the cloud.

![Status](https://img.shields.io/badge/status-active-success)
![License](https://img.shields.io/badge/license-MIT-blue)
![Python](https://img.shields.io/badge/python-3.10%2B-blue)
![Node](https://img.shields.io/badge/node-18%2B-green)

---

## ✨ Features

- 🔍 **Continuous Fleet Telemetry Agent** — lightweight daemon that scans open ports and dependency manifests every 60 seconds
- 🛰️ **Live CVE Intelligence** — queries the Google OSV database in real time for known vulnerabilities
- 🤖 **Offline AI Security Copilot** — local LLM (Phi-3 via Ollama) generates step-by-step remediation guidance, no cloud calls
- 📊 **Posture Analytics Dashboard** — live risk index, active threats, and fleet-wide asset visibility
- 🖥️ **Multi-Asset Fleet Support** — monitor multiple machines/servers from a single dashboard
- ⚖️ **Dynamic CVSS Risk Scoring** — weighted scoring based on severity and exposed attack surface

## 🧱 Tech Stack

| Layer | Stack |
|---|---|
| Frontend | React (Vite), TypeScript, Tailwind CSS, Lucide Icons |
| Backend | Python, FastAPI, Uvicorn |
| AI Engine | Ollama + Microsoft Phi-3 Mini |
| Threat Intel | Google OSV API |
| Database | SQLite / SQLAlchemy |
| Runtime | Node.js, Python |

## 🏗️ Architecture

```
┌────────────────┐      scan payload       ┌──────────────────┐      poll / query      ┌──────────────────┐
│  Client Agent   │ ───────────────────────▶│  FastAPI Backend  │◀───────────────────────│  React Dashboard  │
│ (port + deps    │   POST /api/ingest/scan │  (SQLite storage) │                         │  (risk metrics,   │
│  scanner)        │                         │                    │   copilot prompt/reply  │   threat list)    │
└────────────────┘                          └────────┬──────────┘ ───────────────────────▶└──────────────────┘
        │                                             │
        ▼                                             ▼
   Google OSV API                              Ollama (Phi-3, local)
  (CVE lookups)                              (offline remediation AI)
```

**Flow:**
1. The agent discovers the host and probes defined ports (e.g. `22`, `8000`).
2. It parses `requirements.txt` and queries OSV for known CVEs.
3. Results are POSTed to `/api/ingest/scan` on the backend.
4. The backend persists assets/vulnerabilities and serves live metrics.
5. The dashboard polls the backend and renders risk index, threats, and alerts.
6. Copilot chat requests are routed to a local Ollama instance and streamed back.

## 🚀 Getting Started

### Prerequisites

- Python 3.10+
- Node.js 18+
- [Ollama](https://ollama.com) installed locally, with the `phi3` model pulled:
  ```bash
  ollama pull phi3
  ```

### 1. Clone the repository

```bash
git clone https://github.com/<your-username>/rakshak-ai.git
cd rakshak-ai
```

### 2. Set up the backend

```bash
cd backend
python -m venv venv
source venv/bin/activate      # Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

### 3. Set up the frontend

```bash
cd frontend
npm install
npm run dev
```

### 4. Start the scanner agent

```bash
cd agent
python scanner.py
```

### 5. Start Ollama (if not already running)

```bash
ollama serve
```

The dashboard will be available at `http://localhost:5173`, with the API served at `http://localhost:8000`.

## ⚙️ Configuration

Create a `.env` file in `backend/` with:

```env
DATABASE_URL=sqlite:///./rakshak.db
OSV_API_URL=https://api.osv.dev/v1/query
OLLAMA_HOST=http://localhost:11434
OLLAMA_MODEL=phi3
SCAN_INTERVAL_SECONDS=60
```

## 📡 API Overview

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/ingest/scan` | Receives telemetry payloads from client agents |
| `GET` | `/api/assets` | Lists all registered fleet assets |
| `GET` | `/api/threats` | Returns active vulnerabilities and risk scores |
| `POST` | `/api/copilot/chat` | Sends a prompt to the local AI Security Copilot |

## 🗺️ Roadmap

- [ ] Support for `npm` (`package.json`), Docker images, and Go modules
- [ ] One-click auto-generated pull requests for patches
- [ ] Multi-tenant support with Role-Based Access Control (RBAC)
- [ ] Network graph visualization for lateral attack paths

## ⚠️ Known Limitations

- Dependency scanning currently supports Python (`requirements.txt`) manifests only
- Local AI inference requires a minimum of 8 GB RAM
- Initial CVE lookups require network access to the OSV API (or a cached local mirror) — the AI remediation step itself remains fully offline

## 🤝 Contributing

Contributions are welcome. Please open an issue to discuss significant changes before submitting a pull request.

1. Fork the repo
2. Create your feature branch (`git checkout -b feature/my-feature`)
3. Commit your changes
4. Push to the branch and open a PR

## 📄 License

Released under the [MIT License](LICENSE). Built entirely on free and open-source components.