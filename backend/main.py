from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import google.generativeai as genai
import os

app = FastAPI()

# Enable CORS for React communication
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configuration (Use Environment Variables for security)
genai.configure(api_key="YOUR_GEMINI_API_KEY")
model = genai.GenerativeModel('gemini-1.5-flash')

class ChatRequest(BaseModel):
    message: str

@app.post("/chat")
async def chat_with_agent(request: ChatRequest):
    # This string should eventually be replaced by a DB Query
    event_context = """
    Event Name: AI Triathlon 2026.
    Summary: A high-stakes competition involving robotics and coding.
    Winners: Team Alpha (Robotics Hardware), Team Beta (Full-Stack AI).
    Key Highlight: The 'Viral Vision' Kaggle challenge winners were announced.
    Atmosphere: Highly collaborative and innovative.
    """

    prompt = f"""
    You are an AI assistant specialized in summarizing college events.
    Context: {event_context}
    User Query: {request.message}
    
    Instructions: Provide a concise, engaging summary. Use bullet points 
    where appropriate. If the user asks about something not in the context, 
    politely state that the information isn't available.
    """

    response = model.generate_content(prompt)
    return {"reply": response.text}
