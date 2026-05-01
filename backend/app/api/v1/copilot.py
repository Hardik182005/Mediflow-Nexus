from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter()


class ChatMessage(BaseModel):
    message: str
    context: str | None = None


@router.post("/chat")
async def chat(msg: ChatMessage):
    """AI Copilot chat endpoint — will integrate with Vertex AI Gemini."""
    responses = {
        "revenue": "📊 Revenue Analysis: Total revenue is $415K (+4.3% MoM). Revenue leakage detected at $32.1K.",
        "denial": "⚠️ 3 high-risk denial predictions detected. Top risk: James Rodriguez (82% probability).",
        "default": "I've analyzed your request. Current platform metrics look healthy. How can I help further?",
    }
    key = "revenue" if "revenue" in msg.message.lower() else "denial" if "denial" in msg.message.lower() else "default"
    return {"response": responses[key], "suggestions": ["Show revenue details", "View denial risks"]}


@router.post("/summarize")
async def summarize_case(case_id: str):
    return {"case_id": case_id, "summary": "AI-generated case summary..."}
