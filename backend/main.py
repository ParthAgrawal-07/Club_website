import os
from fastapi import FastAPI, HTTPException, Request, Response
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr
from motor.motor_asyncio import AsyncIOMotorClient
from google import genai
from dotenv import load_dotenv
from datetime import datetime

load_dotenv()

# --- CRITICAL: Vercel specifically looks for this 'app' variable ---
app = FastAPI()

# --- CORS SETUP ---
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

# --- DATABASE SETUP ---
MONGO_URI = os.getenv("DATABASE_URL")
# Renamed to db_client so it doesn't conflict with the AI client
db_client = AsyncIOMotorClient(MONGO_URI)
db = db_client.test 
events_collection = db.Events 
apps_collection = db.applications

# --- GEMINI SETUP (NEW SDK) ---
ai_client = genai.Client(api_key=os.getenv("GOOGLE_API_KEY"))

# --- DATA MODELS ---
class ChatRequest(BaseModel):
    message: str

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

# --- ROUTES ---

# 1. Preflight CORS Handler for Vercel
@app.options("/api/admin/events")
async def options_admin_events(request: Request):
    return Response(status_code=200)

# 2. Add New Event
@app.post("/api/admin/events")
async def add_event(event: EventData):
    try:
        new_event = event.dict()
        new_event["created_at"] = datetime.utcnow()
        result = await events_collection.insert_one(new_event)
        return {"status": "Success", "id": str(result.inserted_id)}
    except Exception as e:
        raise HTTPException(status_code=500, detail="Failed to save event")

# 3. Get Applications
@app.get("/api/admin/applications")
async def get_applications():
    try:
        apps = await apps_collection.find().sort("created_at", -1).to_list(100)
        for app_item in apps:
            app_item["_id"] = str(app_item["_id"])
        return apps
    except Exception as e:
        raise HTTPException(status_code=500, detail="Could not fetch applications")

# 4. Submit Application
@app.post("/api/apply")
async def apply_to_club(application: ApplicationData):
    try:
        app_dict = application.dict()
        app_dict["created_at"] = datetime.utcnow()
        result = await apps_collection.insert_one(app_dict)
        return {"message": "Application submitted successfully!", "id": str(result.inserted_id)}
    except Exception as e:
        raise HTTPException(status_code=500, detail="Submission failed")

# 5. AI Chatbot
@app.post("/api/club-chat")
async def club_chat(request: ChatRequest):
    try:
        # Fetch the latest event
        latest_event = await events_collection.find().sort("event_date", -1).to_list(1)
        
        if not latest_event:
            context = "We haven't uploaded the details for the latest event yet. Check back soon!"
        else:
            ev = latest_event[0]
            context = f"Event: {ev.get('event_name', 'Unknown')} | Highlights: {ev.get('key_highlights', 'None')}"

        system_prompt = f"You are the AI Club Reporter. Context: {context}"
        
        # Call Gemini using the new SDK syntax
        response = ai_client.models.generate_content(
            model='gemini-1.5-flash',
            contents=f"{system_prompt}\nUser: {request.message}"
        )
        
        return {"reply": response.text}
    except Exception as e:
        print(f"CRITICAL CHAT ERROR: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Backend Crash: {str(e)}")

# Used only for local testing
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
