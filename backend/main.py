import os
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()
app = FastAPI(title="AI Club Event Agent")

# CORS Setup for React (.jsx)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_methods=["*"],
    allow_headers=["*"],
)

# AI Configuration
genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))
model = genai.GenerativeModel('gemini-1.5-flash')

class ChatRequest(BaseModel):
    message: str

# ---------------------------------------------------------
# UPDATE THIS BLOCK AFTER EVERY EVENT
# ---------------------------------------------------------
EVENT_OVERVIEW = """
Event: AI Triathlon 2026
Date: March 20, 2026
Activities: 
1. Robotics Challenge: Teams built remote-controlled dispensers.
2. Coding Sprint: Fast-paced competitive programming.
3. Data Science: 'Viral Vision' Kaggle challenge on variolation data.
Results: Team Alpha took 1st place in Robotics. Team Beta won the Coding Sprint.
Next Event: AI Workshop on Large Language Models (LLMs) next month.
"""
# ---------------------------------------------------------

@app.post("/api/club-chat")
async def club_chat(request: ChatRequest):
    system_prompt = f"""
    You are the AI Club's Event Reporter. Your job is to give an overview of 
    recent events to students who missed them.
    
    Context of the latest event:
    {EVENT_OVERVIEW}
    
    Guidelines:
    - Be enthusiastic and helpful.
    - If someone asks 'What did I miss?', give a bulleted summary of the 3 activities.
    - Mention the winners to celebrate their success.
    - If asked about something not in the list, invite them to the next club meeting.
    """
    
    try:
        response = model.generate_content(f"{system_prompt}\nUser: {request.message}")
        return {"reply": response.text}
    except Exception as e:
        raise HTTPException(status_code=500, detail="AI Service temporarily unavailable.")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
