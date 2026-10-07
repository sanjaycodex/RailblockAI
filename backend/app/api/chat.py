"""
AI Chat API endpoint powered by Groq
"""
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional
import os
from pathlib import Path
from dotenv import load_dotenv
from groq import Groq

router = APIRouter(prefix="/api/chat", tags=["AI Chat"])

# Load from project root .env for local dev and Docker Compose env injection fallback
base_dir = Path(__file__).resolve().parents[3]
load_dotenv(dotenv_path=base_dir / ".env", override=True)

DEFAULT_MODEL = "qwen/qwen3.8-27b"
FALLBACK_MODELS = [
    "qwen/qwen3.8-27b",
    "openai/gpt-oss-120b",
    "openai/gpt-oss-20b",
    "qwen/qwen3.6-27b",
    "groq/compound-mini"
]

def get_groq_client():
    load_dotenv(dotenv_path=base_dir / ".env", override=True)
    api_key = os.getenv("GROQ_API_KEY")
    if not api_key or api_key.strip() in {"your_valid_groq_api_key_here", "replace_me", ""}:
        return None
    return Groq(api_key=api_key)

groq_model = os.getenv("GROQ_MODEL", DEFAULT_MODEL)
client = get_groq_client()
if client:
    print(f"[ChatService] Groq client initialized successfully using model {groq_model}")
else:
    print("[ChatService] WARNING: GROQ_API_KEY not found or still using placeholder value")


class ChatMessage(BaseModel):
    role: str  # 'user' or 'assistant'
    content: str


class ChatRequest(BaseModel):
    messages: List[ChatMessage]
    context: Optional[dict] = None


class ChatResponse(BaseModel):
    message: str
    context_used: bool


@router.post("/send", response_model=ChatResponse)
async def send_chat_message(request: ChatRequest):
    """
    Send a message to Groq AI and get a response with railway domain context
    """
    active_client = client or get_groq_client()
    if not active_client:
        raise HTTPException(
            status_code=503,
            detail="Groq AI service not configured. Please set GROQ_API_KEY in .env."
        )

    try:
        # Validate messages
        if not request.messages:
            raise HTTPException(status_code=400, detail="No messages provided")
        
        # Debug: Log received messages
        print(f"[ChatService] Received {len(request.messages)} messages:")
        for i, msg in enumerate(request.messages):
            print(f"  Message {i}: role={msg.role}, content={repr(msg.content)[:100]}")
        
        # Filter out messages with None or empty content
        valid_messages = []
        for msg in request.messages:
            if msg.content is not None and str(msg.content).strip():
                valid_messages.append(msg)
            else:
                print(f"[ChatService] Skipping message with no content: role={msg.role}, content={repr(msg.content)}")
        
        if not valid_messages:
            raise HTTPException(status_code=400, detail="No valid messages with content found")

        # Build system prompt with railway domain context
        system_prompt = """You are RailBlock AI Copilot, an expert assistant for Southern Railway's Tirunelveli-Madurai (TEN-MDU) corridor maintenance operations.

**Your Domain:**
- Railway: Southern Railway, Madurai Division
- Corridor: Tirunelveli Junction (TEN) → Madurai Junction (MDU)
- Distance: 157.1 KM double-line 25kV AC electrified trunk
- Sections: 6 sections (TEN-MEJ, MEJ-CVP, CVP-SRT, SRT-VPT, VPT-TMQ, TMQ-MDU)
- Key Trains: 20666 Vande Bharat Express, 12694 Pearl City Superfast

**Your Capabilities:**
- Analyze maintenance task priorities and suggest optimal block windows
- Detect train headway conflicts and recommend shadow slots
- Bundle multi-discipline tasks (Civil, Signal & Telecom, Electrical TRD)
- Explain ML risk predictions and OR-Tools optimization results
- Answer questions about asset health, sections, and operational metrics

**Tone:** Professional railway engineer. Use railway terminology (possession, shadow slot, headway, IMR, USFD, catenary, turnout). Keep responses concise (2-3 sentences max).

**Critical Safety Rules:**
- All maintenance blocks must avoid 20666 Vande Bharat (06:00 AM TEN departure)
- Night shadow windows: 01:00 - 04:30 AM are safest
- Critical IMR defects require immediate 120-min possession slots
"""

        # Add live context if provided
        if request.context:
            context_str = "\n\n**Live System Context:**\n"
            if "tasks" in request.context and request.context["tasks"] is not None:
                context_str += f"- Total Tasks: {request.context['tasks']}\n"
            if "critical_tasks" in request.context and request.context["critical_tasks"] is not None:
                context_str += f"- Critical Tasks: {request.context['critical_tasks']}\n"
            if "sections" in request.context and request.context["sections"] is not None:
                try:
                    sections_list = request.context["sections"]
                    if isinstance(sections_list, list):
                        sections_str = ', '.join(str(s) for s in sections_list if s is not None)
                        context_str += f"- Sections: {sections_str}\n"
                except Exception as e:
                    print(f"[ChatService] Warning: Could not format sections: {e}")
            system_prompt += context_str

        # Convert messages to Groq format (only valid messages)
        groq_messages = [{"role": "system", "content": system_prompt}]
        for msg in valid_messages:
            role = "assistant" if msg.role == "assistant" else "user"
            content = str(msg.content) if msg.content is not None else ""  # Handle None explicitly
            if not content.strip():  # Skip empty content
                print(f"[ChatService] Skipping message with empty content after str conversion: role={role}")
                continue
            groq_messages.append({"role": role, "content": content})

        if len(groq_messages) <= 1:  # Only system prompt, no user messages
            raise HTTPException(status_code=400, detail="No valid user messages to process")

        print(f"[ChatService] Sending {len(groq_messages)} messages to Groq API")
        
        # Try configured model, then fallback models
        configured_model = os.getenv("GROQ_MODEL", DEFAULT_MODEL)
        models_to_try = [configured_model] + [m for m in FALLBACK_MODELS if m != configured_model]
        
        chat_completion = None
        last_error = None
        
        for model_name in models_to_try:
            try:
                print(f"[ChatService] Attempting chat completion with model: {model_name}")
                chat_completion = active_client.chat.completions.create(
                    messages=groq_messages,
                    model=model_name,
                    temperature=0.7,
                    max_tokens=400,
                    top_p=0.9
                )
                if chat_completion and chat_completion.choices:
                    break
            except Exception as e:
                last_error = e
                print(f"[ChatService] Model {model_name} failed: {e}. Trying next fallback...")

        if not chat_completion or not chat_completion.choices:
            raise HTTPException(status_code=500, detail=f"All Groq models failed. Last error: {str(last_error)}")

        response_text = chat_completion.choices[0].message.content

        return ChatResponse(
            message=response_text,
            context_used=request.context is not None
        )

    except HTTPException:
        raise
    except Exception as e:
        print(f"[ChatService] Error calling Groq API: {e}")
        raise HTTPException(status_code=500, detail=f"AI chat error: {str(e)}")
