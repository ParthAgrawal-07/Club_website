import os
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr
from motor.motor_asyncio import AsyncIOMotorClient
import google.generativeai as genai
from dotenv import load_dotenv
from datetime import datetime

load_dotenv()
app = FastAPI()

# Updated CORS to include both of your Vercel URLs
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "https://club-website-7aay.vercel.app",
        "https://club-website-eta.vercel.app"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# MongoDB Setup
MONGO_URI = os.getenv("DATABASE_URL")
client = AsyncIOMotorClient(MONGO_URI)
# Use your actual DB name here (check Atlas, usually 'test' or 'ai_club_db')
db = client.test 

events_collection = db.Events 
apps_collection = db.applications

# Gemini AI Setup
genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))
model = genai.GenerativeModel('gemini-1.5-flash')

# --- DATA MODELS ---
class EventData(BaseModel):
    event_name: str
    event_date: str
    summary: str
    winners: str
    key_highlights: str

class ApplicationData(BaseModel):
    name: str
    email: EmailStr
    branch: str
    interest: str
    reason: str

class ChatRequest(BaseModel):
    message: str

# --- ROUTES ---

@app.post("/api/admin/events")
async def add_event(event: EventData):
    try:
        new_event = event.dict()
        new_event["created_at"] = datetime.utcnow()
        result = await events_collection.insert_one(new_event)
        return {"status": "Success", "id": str(result.inserted_id)}
    except Exception as e:
        raise HTTPException(status_code=500, detail="Failed to save event")

@app.get("/api/admin/applications")
async def get_applications():
    try:
        apps = await apps_collection.find().sort("created_at", -1).to_list(100)
        for app_item in apps:
            app_item["_id"] = str(app_item["_id"])
        return apps
    except Exception as e:
        raise HTTPException(status_code=500, detail="Could not fetch applications")

@app.post("/api/apply")
async def apply_to_club(application: ApplicationData):
    try:
        app_dict = application.dict()
        app_dict["created_at"] = datetime.utcnow()
        result = await apps_collection.insert_one(app_dict)
        return {"message": "Application submitted successfully!", "id": str(result.inserted_id)}
    except Exception as e:
        raise HTTPException(status_code=500, detail="Submission failed")

@app.post("/api/club-chat")
async def club_chat(request: ChatRequest):
    try:
        latest_event = await events_collection.find().sort("event_date", -1).to_list(1)
        context = "No events found." if not latest_event else f"Event: {latest_event[0]['event_name']}..."
        system_prompt = f"You are the AI Club Reporter. Context: {context}"
        response = model.generate_content(f"{system_prompt}\nUser: {request.message}")
        return {"reply": response.text}
    except Exception as e:
        raise HTTPException(status_code=500, detail="AI Error")
