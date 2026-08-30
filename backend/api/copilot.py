from fastapi import APIRouter
from pydantic import BaseModel
import requests

router = APIRouter(prefix="/api/copilot", tags=["Security Copilot"])

class ChatRequest(BaseModel):
    message: str
    context_cve: str = None

@router.post("/chat")
def ask_copilot(request: ChatRequest):
    system_context = (
        "You are RakshakAI, an elite cybersecurity assistant. "
        "Provide clear, concise, and highly technical remediation steps for the vulnerabilities the user asks about. "
        "Keep responses professional and formatted with bullet points."
    )
    
    full_prompt = f"{system_context}\n\nUser Question: {request.message}"
    
    try:
        # Pinging local Ollama engine at the default port
        response = requests.post(
            'http://localhost:11434/api/generate',
            json={
                "model": "phi3",
                "prompt": full_prompt,
                "stream": False
            },
            timeout=60
        )
        
        if response.status_code == 200:
            reply = response.json().get("response", "I could not generate a response.")
        else:
            reply = f"Error: Local AI engine returned status code {response.status_code}."
            
    except Exception as e:
        reply = f"System Error: Unable to connect to the local AI core. Is Ollama running? Error: {str(e)}"

    return {"reply": reply}