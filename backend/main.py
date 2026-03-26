import os
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import google.generativeai as genai
import psycopg2
from psycopg2.extras import RealDictCursor
from dotenv import load_dotenv

load_dotenv()
app = FastAPI()

# CORS for your React (.jsx) site
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# AI Setup
genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))
model = genai.GenerativeModel('gemini-1.5-flash')

class ChatRequest(BaseModel):
    message: str

# Database Connection Helper
def get_db_connection():
    return psycopg2.connect(
        os.getenv("DATABASE_URL"), # e.g., postgresql://user:pass@localhost:5432/club_db
        cursor_factory=RealDictCursor
    )

@app.post("/api/club-chat")
async def club_chat(request: ChatRequest):
    try:
        # 1. Fetch the LATEST event from your new database
        conn = get_db_connection()
        cur = conn.cursor()
        cur.execute("SELECT * FROM club_events ORDER BY event_date DESC LIMIT 1")
        latest_event = cur.fetchone()
        cur.close()
        conn.close()

        if not latest_event:
            event_info = "No recent events recorded yet. Stay tuned for the next AI Club meeting!"
        else:
            event_info = f"""
            Event: {latest_event['event_name']}
            Date: {latest_event['event_date']}
            Summary: {latest_event['summary']}
            Highlights: {latest_event['key_highlights']}
            Winners: {latest_event['winners']}
            """

        # 2. Feed that database data to the AI
        system_prompt = f"""
        You are the AI Club Reporter. Use this DATABASE INFO to summarize the event:
        {event_info}
        
        Guidelines:
        - Provide a friendly recap for students who missed it.
        - Mention winners to celebrate them.
        - If the user asks about something not listed, invite them to join the next event.
        """
        
        response = model.generate_content(f"{system_prompt}\nUser: {request.message}")
        return {"reply": response.text}

    except Exception as e:
        print(f"Error: {e}")
        raise HTTPException(status_code=500, detail="Database or AI connection failed.")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
