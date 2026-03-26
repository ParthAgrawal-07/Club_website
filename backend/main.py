import os
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from motor.motor_asyncio import AsyncIOMotorClient
import google.generativeai as genai
from dotenv import load_dotenv
from datetime import datetime

load_dotenv()
app = FastAPI()

# CORS for your React (.jsx) site
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# 1. MongoDB Configuration
MONGO_URI = os.getenv("DATABASE_URL")
client = AsyncIOMotorClient(MONGO_URI)

# This selects the 'ai_club_db' database
db = client.Cluster0

# This selects the 'events' collection (your "event folder")
# You can also use db.application for your other data
events_collection = db.Events 

# 2. Gemini AI Setup
genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))
model = genai.GenerativeModel('gemini-1.5-flash')

# 3. Data Models
class ChatRequest(BaseModel):
    message: str

class EventData(BaseModel):
    event_name: str
    event_date: str
    summary: str
    winners: str
    key_highlights: str

# 4. Route: Add New Event to the 'events' collection
@app.post("/api/admin/add-event")
async def add_event(event: EventData):
    new_event = event.dict()
    new_event["created_at"] = datetime.utcnow()
    try:
        # Specifically inserting into the events collection
        result = await events_collection.insert_one(new_event)
        return {"status": "Success", "id": str(result.inserted_id)}
    except Exception as e:
        raise HTTPException(status_code=500, detail="Failed to save to events collection")

# 5. Route: AI Agent Recap (Reads from 'events' collection)
@app.post("/api/club-chat")
async def club_chat(request: ChatRequest):
    try:
        # Fetches only from the 'events' collection
        latest_event = await events_collection.find().sort("event_date", -1).to_list(1)
        
        if not latest_event:
            context = "We haven't uploaded the details for the latest event yet. Check back soon!"
        else:
            ev = latest_event[0]
            context = f"""
            Event: {ev['event_name']}
            Summary: {ev['summary']}
            Highlights: {ev['key_highlights']}
            Winners: {ev['winners']}
            """

        system_prompt = f"""
        You are the AI Club Event Reporter. 
        Your goal is to give a summary to someone who missed the event.
        Information: {context}
        """
        
        response = model.generate_content(f"{system_prompt}\nUser: {request.message}")
        return {"reply": response.text}
    except Exception as e:
        raise HTTPException(status_code=500, detail="Could not connect to the events database.")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
