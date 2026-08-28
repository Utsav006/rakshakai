from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="RakshakAI API", version="1.0")

# Allow our React frontend to communicate with the API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"status": "RakshakAI Backend is online 🛡️"}

@app.get("/api/health")
def health_check():
    return {"score": 100, "status": "Secure"}