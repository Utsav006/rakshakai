from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database.connection import engine, Base
import models.asset  # Import models so SQLAlchemy knows about them

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

@app.get("/")
def read_root():
    return {"status": "RakshakAI Backend is online 🛡️"}

@app.get("/api/health")
def health_check():
    return {"score": 100, "status": "Secure"}