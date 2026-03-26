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

# CORS for React (.jsx)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# 1. Database Connection
MONGO_URI = os.getenv("DATABASE_URL")
client = AsyncIOMotorClient(MONGO_URI)
db = client.ai_club_db
events_collection = db.events

# 2. AI Setup
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

# 4. Admin Route: Add New Event
@app.post("/api/admin/add-event")
async def add_event(event: EventData):
    new_event = event.dict()
    new_event["created_at"] = datetime.utcnow()
    try:
        result = await events_collection.insert_one(new_event)
        return {"status": "Success", "id": str(result.inserted_id)}
    except Exception as e:
        raise HTTPException(status_code=500, detail="Failed to save to MongoDB")

# 5. AI Agent Route: Summarize Latest Event
@app.post("/api/club-chat")
async def club_chat(request: ChatRequest):
    try:
        # Fetch the latest event from MongoDB
        latest_event = await events_collection.find().sort("event_date", -1).to_list(1)
        
        if not latest_event:
            context = "No events found in the database yet."
        else:
            ev = latest_event[0]
            context = f"""
            Event: {ev['event_name']}
            Summary: {ev['summary']}
            Highlights: {ev['key_highlights']}
            Winners: {ev['winners']}
            """

        system_prompt = f"You are the AI Club Reporter. Use this info to help students who missed the event: {context}"
        response = model.generate_content(f"{system_prompt}\nUser: {request.message}")
        
        return {"reply": response.text}
    except Exception as e:
        raise HTTPException(status_code=500, detail="Error connecting to AI or Database")S
