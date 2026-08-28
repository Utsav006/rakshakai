from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database.connection import engine, Base
import models.asset 
import models.vulnerability
from api import dashboard 
from api import remediation

from api import assets
from api import vulnerabilities 
from api import copilot 

# Create all tables in the database automatically
Base.metadata.create_all(bind=engine)

app = FastAPI(title="RakshakAI API", version="1.0")

# Allow our React frontend to communicate with the API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register the routes
app.include_router(assets.router)
app.include_router(vulnerabilities.router)
app.include_router(copilot.router)
app.include_router(dashboard.router)
app.include_router(remediation.router)

@app.get("/")
def read_root():
    return {"status": "RakshakAI Backend is online 🛡️"}

@app.get("/api/health")
def health_check():
    return {"score": 100, "status": "Secure"}