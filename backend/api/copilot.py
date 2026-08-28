from fastapi import APIRouter
from pydantic import BaseModel
import time

router = APIRouter(prefix="/api/copilot", tags=["Security Copilot"])

class ChatRequest(BaseModel):
    message: str
    context_cve: str = None

@router.post("/chat")
def ask_copilot(request: ChatRequest):
    # Simulate AI processing time for the demo
    time.sleep(1)
    
    user_msg = request.message.lower()
    
    # Simple rule-based responses for the hackathon prototype
    if "cve-2024-2100" in user_msg or (request.context_cve and "2100" in request.context_cve):
        reply = (
            "I see you're asking about CVE-2024-2100 (Authentication Bypass). "
            "Since this asset is Internet Exposed (Risk Score: 97), this is a CRITICAL priority. \n\n"
            "**Remediation Steps:**\n"
            "1. Immediately disable public access to the login module.\n"
            "2. Patch the React/Node.js authentication library to version >= 4.1.2.\n"
            "3. Rotate all existing session tokens."
        )
    elif "hello" in user_msg or "hi" in user_msg:
        reply = "Hello! I am Health Buddy's Security Copilot. Which vulnerability or asset would you like me to analyze?"
    else:
        reply = "I am analyzing your request against our current asset inventory. To give you the best advice, could you specify which CVE or Asset ID you are concerned about?"

    return {"reply": reply}