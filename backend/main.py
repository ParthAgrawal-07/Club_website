import os
from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import google.generativeai as genai
from dotenv import load_dotenv

# 1. Setup & Configuration
load_dotenv()
app = FastAPI(title="AI Club & Event Agent API", version="2.0.0")

# Configure CORS so your React (.jsx) frontend can communicate
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with your actual domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure Gemini AI
GEMINI_API_KEY = os.getenv("GOOGLE_API_KEY")
if not GEMINI_API_KEY:
    print("Warning: GOOGLE_API_KEY not found in environment variables.")
else:
    genai.configure(api_key=GEMINI_API_KEY)
    model = genai.GenerativeModel('gemini-1.5-flash')

# 2. Data Models (Pydantic)
class ChatRequest(BaseModel):
    message: str
    context_type: Optional[str] = "general" # e.g., "triathlon", "sts_project", "club"

class EventUpdate(BaseModel):
    title: str
    description: str
    winner: Optional[str] = None

# 3. AI Agent Logic (The "Brain")
def get_club_context(context_type: str):
    """
    This function simulates pulling data from your database.
    It provides the 'knowledge' the AI uses to summarize events.
    """
    contexts = {
        "triathlon": """
            Event: AI Triathlon 2026. 
            Activities: Coding Sprints, Robotics Hardware Lab, Data Science Kaggle.
            Winners: Team Alpha (Robotics), Team Beta (Software).
            Status: Completed. High student engagement from the AI Club.
        """,
        "sts_project": """
            Project: Variolation and its effects on Science, Technology, and Society (STS).
            Research: Focused on authentic historical sources and vaccination evolution.
            Status: Presented at the University Symposium.
        """,
        "general": "General info about the College AI Club. We focus on Full-stack, ML, and Robotics."
    }
    return contexts.get(context_type, contexts["general"])

# 4. API Routes
@app.get("/")
async def root():
    return {"message": "AI Club API is running", "status": "online"}

@app.post("/api/chat")
async def chat_with_agent(request: ChatRequest):
    """
    The main endpoint for your AI Agent summary chatbot.
    """
    if not GEMINI_API_KEY:
        raise HTTPException(status_code=500, detail="AI API Key not configured.")

    # Retrieve context based on what the user is looking at
    knowledge_base = get_club_context(request.context_type)

    system_prompt = f"""
    You are the official AI Club Assistant. 
    Use the following verified context to answer the user's question accurately:
    {knowledge_base}
    
    Guidelines:
    - If someone missed the event, give a high-energy summary.
    - Be professional yet encouraging (student-friendly).
    - If the info isn't in the context, say: 'I don't have the specific details on that yet, but I can tell you about our other club activities!'
    """

    try:
        response = model.generate_content(f"{system_prompt}\nUser: {request.message}")
        return {"reply": response.text}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"AI Error: {str(e)}")

# 5. Database Integration Placeholder 
# (Based on your previous SQLAlchemy/PostgreSQL work)
@app.get("/api/events")
async def get_all_events():
    # This would typically be: return db.query(Event).all()
    return [
        {"id": 1, "name": "AI Triathlon", "date": "2026-03-20"},
        {"id": 2, "name": "STS Variolation Presentation", "date": "2025-09-11"}
    ]

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
