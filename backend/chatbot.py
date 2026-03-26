from fastapi import FastAPI
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain.schema import SystemMessage, HumanMessage
import os

app = FastAPI()

# Initialize your AI (using Gemini 1.5 Flash for speed and cost)
llm = ChatGoogleGenerativeAI(model="gemini-1.5-flash", google_api_key="YOUR_API_KEY")

@app.get("/api/event-recap")
async def get_event_summary():
    # 1. Fetch data from your database
    # For example, fetching from your 'listings' or 'events' table
    # raw_data = db.query(Event).all() 
    
    # Placeholder for the data you've collected in your website
    mock_event_data = [
        {"session": "Opening Keynote", "highlights": "Discussed the future of AI in 2026.", "sentiment": "High energy"},
        {"session": "AI Triathlon", "highlights": "30 teams competed in coding and robotics.", "winner": "Team Alpha"},
        {"session": "Networking Lunch", "highlights": "Students met with mentors from top tech firms."}
    ]

    # 2. Construct the "Context" for the AI
    context_text = "\n".join([f"- {item['session']}: {item['highlights']}" for item in mock_event_data])

    # 3. The System Prompt (The Agent's "Personality")
    system_instruction = SystemMessage(
        content="""You are a professional Event Reporter. 
        Your goal is to provide a concise, engaging, and FOMO-inducing summary 
        for people who MISSED the event. Use bullet points for key takeaways 
        and end with an invitation for next year."""
    )
    
    user_prompt = HumanMessage(
        content=f"Here is the data from the website's database: {context_text}. Please summarize it."
    )

    # 4. Get the AI Response
    response = llm.invoke([system_instruction, user_prompt])
    
    return {"summary": response.content}
