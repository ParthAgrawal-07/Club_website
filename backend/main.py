import os
from fastapi import FastAPI, HTTPException, Request, Response, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security.api_key import APIKeyHeader
from pydantic import BaseModel, EmailStr, field_validator
from google import genai
from dotenv import load_dotenv
from datetime import datetime, timezone
from contextlib import asynccontextmanager
import asyncpg

load_dotenv()

# ─── PostgreSQL Pool ────────────────────────────────────────────────────────────
DATABASE_URL = os.getenv("DATABASE_URL", "")
if not DATABASE_URL:
    raise RuntimeError("DATABASE_URL environment variable is not set")

# asyncpg needs postgresql:// not postgresql+asyncpg://
_PG_DSN = DATABASE_URL.replace("postgresql+asyncpg://", "postgresql://") \
                       .replace("postgres+asyncpg://", "postgresql://")

db_pool: asyncpg.Pool | None = None

# ─── App lifespan — create pool + tables ───────────────────────────────────────
@asynccontextmanager
async def lifespan(application: FastAPI):
    global db_pool
    db_pool = await asyncpg.create_pool(
        dsn=_PG_DSN,
        min_size=1,
        max_size=10,
        command_timeout=30,
        ssl="require" if "localhost" not in _PG_DSN else None,
    )
    # Create tables if they don't exist
    async with db_pool.acquire() as conn:
        await conn.execute("""
            CREATE TABLE IF NOT EXISTS events (
                id             SERIAL PRIMARY KEY,
                event_name     VARCHAR(500)  NOT NULL,
                event_date     VARCHAR(100)  NOT NULL,
                summary        TEXT          NOT NULL,
                winners        TEXT          DEFAULT '',
                key_highlights TEXT          DEFAULT '',
                created_at     TIMESTAMPTZ   DEFAULT NOW()
            );

            CREATE TABLE IF NOT EXISTS applications (
                id         SERIAL PRIMARY KEY,
                name       VARCHAR(255)  NOT NULL,
                email      VARCHAR(255)  NOT NULL UNIQUE,
                branch     VARCHAR(255)  NOT NULL,
                interest   VARCHAR(255)  NOT NULL,
                reason     TEXT          DEFAULT '',
                applied_at TIMESTAMPTZ   DEFAULT NOW()
            );

            CREATE TABLE IF NOT EXISTS kaggle_registrations (
                id            SERIAL PRIMARY KEY,
                google_id     VARCHAR(255)  NOT NULL UNIQUE,
                name          VARCHAR(255)  NOT NULL,
                email         VARCHAR(255)  NOT NULL UNIQUE,
                picture       TEXT          DEFAULT '',
                kaggle_id     VARCHAR(255)  NOT NULL UNIQUE,
                registered_at TIMESTAMPTZ   DEFAULT NOW()
            );
        """)
    print("✅ PostgreSQL pool ready, tables verified")
    yield
    await db_pool.close()


# ─── FastAPI app ────────────────────────────────────────────────────────────────
app = FastAPI(title="AI Club DAIICT API", version="2.0.0", lifespan=lifespan)

# ─── CORS ───────────────────────────────────────────────────────────────────────
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:8080",
        "http://localhost:3000",
        "https://aiclubdau.vercel.app",
        "https://club-website-7aay.vercel.app",
        "https://club-website-eta.vercel.app",
        "https://ai-club-website-mu.vercel.app",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ─── Gemini ─────────────────────────────────────────────────────────────────────
GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")
if not GOOGLE_API_KEY:
    raise RuntimeError("GOOGLE_API_KEY environment variable is not set")
ai_client = genai.Client(api_key=GOOGLE_API_KEY)

# ─── Admin auth ─────────────────────────────────────────────────────────────────
ADMIN_API_KEY = os.getenv("ADMIN_API_KEY", "")
admin_key_header = APIKeyHeader(name="X-Admin-Key", auto_error=False)

async def verify_admin(api_key: str = Depends(admin_key_header)):
    if not ADMIN_API_KEY:
        if os.getenv("ENVIRONMENT", "development") == "production":
            raise HTTPException(status_code=503, detail="Admin not configured")
        return True
    if api_key != ADMIN_API_KEY:
        raise HTTPException(status_code=401, detail="Invalid or missing admin API key")
    return True


# ---------------------------------------------------------------------------
# STATIC KNOWLEDGE BASE — mirrors everything displayed on the website
# ---------------------------------------------------------------------------
CLUB_KNOWLEDGE = """
=== AI CLUB DAIICT — COMPLETE KNOWLEDGE BASE ===

ABOUT THE CLUB:
AI Club DAIICT is the Artificial Intelligence and Machine Learning club at DA-IICT (Dhirubhai Ambani Institute of Information and Communication Technology), Gandhinagar, Gujarat, India.
The club runs events, workshops, hackathons, and collaborative projects to help students explore AI/ML.

SOCIAL LINKS:
- Discord: https://discord.gg/yB3Huet5
- Instagram: https://www.instagram.com/aiclub_daiict/
- GitHub: https://github.com/ai-club-daiict
- LinkedIn: https://www.linkedin.com/company/ai-club-daiict/

HOW TO JOIN:
Fill out the Join Form on the website with your name, email, branch, interest area, and reason for joining.

---

MEMBERS (Academic Year 2025-2026):

1. Saumya Shah — Member
   GitHub: https://github.com/saumyashah0510
   LinkedIn: https://www.linkedin.com/in/saumya-shah-5bb8602b4/
   Project: F1-Prediction-Hub — Full-stack Formula 1 site with live standings and ML-powered race predictions.
   Events: EDA Session, Linear Regression, Wearable AI

2. Sanket Agarwal — Member
   LinkedIn: https://www.linkedin.com/in/sanket-agarwal-2b606b3a3
   Interests: Problem-solving, competitive programming, AI applications.
   Events: Worldquant

3. Parth Garg — Member
   GitHub: https://github.com/gargparth2406-creator
   LinkedIn: https://www.linkedin.com/in/parth-garg-024b40379
   Events: Worldquant, Integration Bee, EDA Session, Intro To Python, Linear Regression, Wearable AI

4. Manal Patel — Extended Core Member
   GitHub: https://github.com/manalPatel2557
   LinkedIn: https://www.linkedin.com/in/manal-patel-a87b11382/
   Events: Worldquant, Integration Bee, EDA Session, Intro To Python, Linear Regression, Wearable AI

5. Makavana Axit — Member
   Events: EDA Session, Intro To Python, Linear Regression, Wearable AI

6. Kush Ashvinbhai Patel — Member
   GitHub: https://github.com/Kush5699
   LinkedIn: https://www.linkedin.com/in/kush-patel-6a074b258
   Project: ShelfMind-AI — Real-time computer-vision shelf monitoring for retail (product detection, planograms, OOS detection).
   Events: Linear Regression

7. Rushil Dangar — Member
   GitHub: https://github.com/Cybernyte-31
   LinkedIn: https://www.linkedin.com/in/rushil-dangar-42304632b
   Background: B.Tech ICT, interests in AI, Robotics, C/C++/Python.
   Events: Integration Bee, Intro To Python, Wearable AI

8. Aaditya Sarda — Core Member
   GitHub: https://github.com/Aadityasarda-25
   LinkedIn: https://www.linkedin.com/in/aaditya-sarda-426357371
   Quote: "Turning complex math, messy data, and a lot of curiosity into working AI systems."
   Events: Worldquant, Integration Bee, EDA Session, Intro To Python, Linear Regression, Wearable AI

9. Vasani Sahil Rajeshbhai — Member
   GitHub: https://github.com/sahil-vasani
   LinkedIn: https://www.linkedin.com/in/sahil-vasani/
   Projects: Renewable-Energy-Solar-and-Wind-Prediction, Electricity-Bill-Prediction-ML
   Events: Linear Regression, Wearable AI

---

PROJECTS:

1. F1-Prediction-Hub — by Saumya Shah
   Full-stack Formula 1 website with live standings, driver/team info, and ML-powered race predictions.
   Tags: Machine Learning, Full Stack, Data Science, Sports Analytics, Python
   GitHub: https://github.com/saumyashah0510/F1-Prediction-Hub

2. ShelfMind-AI — by Kush Ashvinbhai Patel
   End-to-end computer-vision retail intelligence app: monitors shelves, detects products, generates planograms, flags out-of-stock issues.
   Tags: Computer Vision, Object Detection, Retail AI, Deep Learning, OpenCV, Python
   GitHub: https://github.com/Kush5699/ShelfMind-AI

3. Renewable-Energy-Solar-and-Wind-Prediction — by Vasani Sahil Rajeshbhai
   Predicts optimal location and output for solar panels using sunlight data.
   Tags: Machine Learning, Renewable Energy, Regression, Data Science, Python
   GitHub: https://github.com/sahil-vasani/Renewable-Energy-Solar-and-Wind-Prediction

4. Electricity-Bill-Prediction-ML — by Vasani Sahil Rajeshbhai
   Forecasts next month's electricity bill based on historical usage patterns.
   Tags: Machine Learning, Regression, Forecasting, Energy, Python
   GitHub: https://github.com/sahil-vasani/Electricity-bill-prediction-ML

---

EVENTS (Academic Year 2025-2026):

Upcoming:
- GenAI Hackathon 2026 (April 5, 2026): 48-hour hackathon building with the latest generative AI APIs. Open to all branches. Prizes, mentors, and free pizza.

Past Events:
- AI Triathlon (Late 2025): Multi-stage club event combining coding challenges, model optimization, and rapid prototyping. 50+ participants.
- Transformers Deep-Dive Talk (Feb 10, 2026): Prof. Aryan Mehta covered attention mechanisms and the Transformer architecture. 80 attendees.
- EDA Session: Exploratory Data Analysis hands-on session.
- Linear Regression Workshop: Fundamentals of linear regression with code.
- Wearable AI: Session on AI in wearable devices.
- Worldquant: Participation in WorldQuant quantitative finance challenge.
- Integration Bee: Mathematics competition.
- Intro To Python: Beginner Python programming session.

Upcoming Workshops:
- Intro to PyTorch: Hands-on workshop on tensors, autograd, and building neural networks from scratch.

---

BLOG POSTS (by Jash Shah — https://medium.com/@jashshah780):

1. "Self-Host n8n for Free: Docker + ngrok Setup That Beats n8n Cloud"
   Run n8n locally with Docker, expose it publicly via ngrok, and integrate with Telegram, Gmail, Google Drive, Stripe — all for free.
   Read: https://medium.com/@jashshah780

2. "Mem0: Building AI Agents with Scalable Long-Term Memory"
   Mem0 solves LLM memory loss by extracting key facts from conversations and storing them as a knowledge graph using vector embeddings and Neo4j.
   Read: https://medium.com/@jashshah780

3. "Social Vault — Stop Hunting for Your Own Links Every Time You Fill a Form"
   A browser extension (available on Microsoft Edge Add-ons) that stores your personal links and lets you copy them with one click.
   Read: https://medium.com/@jashshah780

---

RESOURCES:
The club provides curated learning resources for AI/ML topics including Python, Deep Learning, Computer Vision, and NLP.

---

FREQUENTLY ASKED QUESTIONS:

Q: How do I join AI Club DAIICT?
A: Fill out the Join Form on the website at the bottom of the page. Provide your name, email, branch, area of interest, and reason for joining.

Q: Who can join?
A: Any DA-IICT student interested in AI/ML can apply. All branches are welcome.

Q: What events does the club run?
A: The club runs hackathons, workshops, deep-dive talks, and competitions. Past events include AI Triathlon, EDA Sessions, Linear Regression workshops, Intro to Python, Wearable AI, and more.

Q: What projects has the club built?
A: Members have built F1-Prediction-Hub (ML + full-stack), ShelfMind-AI (computer vision for retail), Solar/Wind energy prediction models, and Electricity bill forecasting ML models.

Q: Who are the core members?
A: Aaditya Sarda is the Core Member. Manal Patel is an Extended Core Member.

Q: Where can I find the club on social media?
A: Discord: https://discord.gg/yB3Huet5 | Instagram: @aiclub_daiict | GitHub: ai-club-daiict | LinkedIn: AI Club DAIICT
"""


# ─── Pydantic Models ────────────────────────────────────────────────────────────
class ChatRequest(BaseModel):
    message: str

    @field_validator('message')
    @classmethod
    def message_must_not_be_empty(cls, v: str) -> str:
        v = v.strip()
        if not v:
            raise ValueError('Message cannot be empty')
        if len(v) > 1000:
            raise ValueError('Message too long (max 1000 characters)')
        return v


class EventData(BaseModel):
    event_name: str
    event_date: str
    summary: str
    winners: str = ""
    key_highlights: str = ""

    @field_validator('event_name', 'event_date', 'summary')
    @classmethod
    def required_not_empty(cls, v: str) -> str:
        v = v.strip()
        if not v:
            raise ValueError('Field cannot be empty')
        return v


class ApplicationData(BaseModel):
    name: str
    email: EmailStr
    branch: str
    interest: str
    reason: str = ""

    @field_validator('name', 'branch', 'interest')
    @classmethod
    def fields_must_not_be_empty(cls, v: str) -> str:
        v = v.strip()
        if not v:
            raise ValueError('Field cannot be empty')
        return v


# ─── Routes ─────────────────────────────────────────────────────────────────────

# Preflight CORS handlers for Vercel
# Preflight CORS handlers for Vercel
@app.options("/api/admin/events")
async def options_admin_events(request: Request):
    return Response(status_code=200)

@app.options("/api/admin/applications")
async def options_admin_applications(request: Request):
    return Response(status_code=200)

@app.options("/api/admin/kaggle-registrations")
async def options_admin_kaggle_registrations(request: Request):
    return Response(status_code=200)

@app.options("/api/admin/events/{event_id}")
async def options_admin_events_id(request: Request, event_id: str):
    return Response(status_code=200)

@app.options("/api/admin/applications/{app_id}")
async def options_admin_applications_id(request: Request, app_id: str):
    return Response(status_code=200)

@app.options("/api/admin/kaggle-registrations/{reg_id}")
async def options_admin_kaggle_registrations_id(request: Request, reg_id: str):
    return Response(status_code=200)


# POST /api/admin/events — add a new event (protected)
@app.post("/api/admin/events")
async def add_event(event: EventData, _: bool = Depends(verify_admin)):
    try:
        row = await db_pool.fetchrow(
            """INSERT INTO events (event_name, event_date, summary, winners, key_highlights)
               VALUES ($1, $2, $3, $4, $5)
               RETURNING id""",
            event.event_name, event.event_date, event.summary,
            event.winners, event.key_highlights,
        )
        return {"status": "Success", "id": row["id"]}
    except HTTPException:
        raise
    except Exception as e:
        print(f"Add event error: {e}")
        raise HTTPException(status_code=500, detail="Failed to save event")


# GET /api/admin/events — list all events (protected)
@app.get("/api/admin/events")
async def get_events(_: bool = Depends(verify_admin)):
    try:
        rows = await db_pool.fetch(
            "SELECT * FROM events ORDER BY created_at DESC LIMIT 500"
        )
        return [dict(r) for r in rows]
    except HTTPException:
        raise
    except Exception as e:
        print(f"Get events error: {e}")
        raise HTTPException(status_code=500, detail="Could not fetch events")


# DELETE /api/admin/events/{event_id} — delete an event (protected)
@app.delete("/api/admin/events/{event_id}")
async def delete_event(event_id: int, _: bool = Depends(verify_admin)):
    try:
        result = await db_pool.execute(
            "DELETE FROM events WHERE id = $1", event_id
        )
        if result == "DELETE 0":
            raise HTTPException(status_code=404, detail="Event not found")
        return {"status": "Success", "message": f"Event {event_id} deleted"}
    except HTTPException:
        raise
    except Exception as e:
        print(f"Delete event error: {e}")
        raise HTTPException(status_code=500, detail="Could not delete event")


# GET /api/admin/applications — list all membership applications (protected)
@app.get("/api/admin/applications")
async def get_applications(_: bool = Depends(verify_admin)):
    try:
        rows = await db_pool.fetch(
            "SELECT * FROM applications ORDER BY applied_at DESC LIMIT 500"
        )
        return [dict(r) for r in rows]
    except HTTPException:
        raise
    except Exception as e:
        print(f"Get applications error: {e}")
        raise HTTPException(status_code=500, detail="Could not fetch applications")


# DELETE /api/admin/applications/{app_id} — delete an application (protected)
@app.delete("/api/admin/applications/{app_id}")
async def delete_application(app_id: int, _: bool = Depends(verify_admin)):
    try:
        result = await db_pool.execute(
            "DELETE FROM applications WHERE id = $1", app_id
        )
        if result == "DELETE 0":
            raise HTTPException(status_code=404, detail="Application not found")
        return {"status": "Success", "message": f"Application {app_id} deleted"}
    except HTTPException:
        raise
    except Exception as e:
        print(f"Delete application error: {e}")
        raise HTTPException(status_code=500, detail="Could not delete application")


# GET /api/admin/kaggle-registrations — list all registered participants (protected)
@app.get("/api/admin/kaggle-registrations")
async def get_kaggle_registrations(_: bool = Depends(verify_admin)):
    try:
        rows = await db_pool.fetch(
            "SELECT * FROM kaggle_registrations ORDER BY registered_at DESC LIMIT 500"
        )
        return [dict(r) for r in rows]
    except HTTPException:
        raise
    except Exception as e:
        print(f"Get kaggle-registrations error: {e}")
        raise HTTPException(status_code=500, detail="Could not fetch kaggle registrations")


# DELETE /api/admin/kaggle-registrations/{reg_id} — delete a registration (protected)
@app.delete("/api/admin/kaggle-registrations/{reg_id}")
async def delete_kaggle_registration(reg_id: int, _: bool = Depends(verify_admin)):
    try:
        result = await db_pool.execute(
            "DELETE FROM kaggle_registrations WHERE id = $1", reg_id
        )
        if result == "DELETE 0":
            raise HTTPException(status_code=404, detail="Registration not found")
        return {"status": "Success", "message": f"Registration {reg_id} deleted"}
    except HTTPException:
        raise
    except Exception as e:
        print(f"Delete registration error: {e}")
        raise HTTPException(status_code=500, detail="Could not delete registration")


# POST /api/club-chat — AI chatbot powered by the full knowledge base
@app.post("/api/club-chat")
async def club_chat(request: ChatRequest):
    try:
        # Pull recent events from the DB to supplement static knowledge
        dynamic_context = ""
        try:
            rows = await db_pool.fetch(
                "SELECT * FROM events ORDER BY created_at DESC LIMIT 10"
            )
            if rows:
                events_str = ""
                for idx, r in enumerate(rows, 1):
                    events_str += f"""
{idx}. Event Name: {r['event_name']}
   Date: {r['event_date']}
   Summary: {r['summary']}
   Highlights: {r['key_highlights']}
   Winners: {r['winners']}
"""
                dynamic_context = f"\nRECENT DYNAMIC EVENTS FROM DATABASE:\n{events_str}\n"
        except Exception as e:
            print(f"Error fetching dynamic events context: {e}")

        system_prompt = f"""You are NeuralNode, the official AI assistant of AI Club DAIICT — a friendly, knowledgeable, and enthusiastic chatbot embedded on the club's website.

Your job is to help visitors learn about the club — its members, projects, events, blogs, how to join, and anything else related to AI Club DAIICT.

RULES:
- Be warm, concise, and helpful. Use a conversational but professional tone.
- Only answer questions related to AI Club DAIICT, its members, projects, events, AI/ML topics, or the website content.
- If asked something completely unrelated (e.g., unrelated coding questions, personal advice), politely redirect: "I'm best at answering questions about AI Club DAIICT! Ask me about our members, projects, events, or how to join."
- When listing members, projects, or events, be specific and accurate — use ONLY the data below.
- If you don't know something, say so honestly rather than making up information.
- Format responses clearly. Use short paragraphs or bullet points where helpful.
- Always encourage visitors to join the club or explore the website!

{CLUB_KNOWLEDGE}
{dynamic_context}
"""

        response = ai_client.models.generate_content(
            model='gemini-1.5-flash',
            contents=f"{system_prompt}\n\nUser question: {request.message}"
        )

        return {"reply": response.text}

    except HTTPException:
        raise
    except Exception as e:
        print(f"CRITICAL CHAT ERROR: {type(e).__name__}: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail="AI assistant is temporarily unavailable. Please try again in a moment."
        )


# Local development entrypoint
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
