import json
import logging
from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession
from members.models import ClubMember, ClubProject

logger = logging.getLogger(__name__)

SEED_MEMBERS = [
    {
        "id": 1,
        "name": "Saumya Shah",
        "role": "Member",
        "photo": "https://drive.google.com/thumbnail?id=1kHcVHLCWTm5KfsO7rxtL7Hi-t4oAtAyY&sz=w400-h400",
        "description": "Passionate about AI/ML and full-stack development. Built an F1 prediction platform combining live standings with machine-learning-powered race forecasts.",
        "github": "https://github.com/saumyashah0510",
        "linkedin": "https://www.linkedin.com/in/saumya-shah-5bb8602b4/",
        "order_no": 1,
    },
    {
        "id": 2,
        "name": "Sanket Agarwal",
        "role": "Member",
        "photo": "https://drive.google.com/thumbnail?id=1-9NLV4J-Vb_gPlB6DKQFKeF6UmWkILfs&sz=w400-h400",
        "description": "Strong interest in problem-solving and competitive programming, now extending that mindset into AI. Excited to explore how AI can be used to build intelligent and impactful solutions.",
        "github": "",
        "linkedin": "https://www.linkedin.com/in/sanket-agarwal-2b606b3a3",
        "order_no": 2,
    },
    {
        "id": 3,
        "name": "Parth Garg",
        "role": "Member",
        "photo": "https://drive.google.com/thumbnail?id=14wJzfJ9thbBxZ5mKUCCFI5ouG_QmTQ2R&sz=w400-h400",
        "description": "Enthusiastic learner with interests across AI, mathematics, and programming. Active participant in a wide range of club events and competitions.",
        "github": "https://github.com/gargparth2406-creator",
        "linkedin": "https://www.linkedin.com/in/parth-garg-024b40379",
        "order_no": 3,
    },
    {
        "id": 4,
        "name": "Manal Patel",
        "role": "Core Member",
        "photo": "https://drive.google.com/thumbnail?id=1SIbjNc7hzjt7sYUAUcZNALAYCR3jG1Vq&sz=w400-h400",
        "description": "Keen learner actively involved in club activities spanning data analysis, Python, and emerging AI applications.",
        "github": "https://github.com/manalPatel2557",
        "linkedin": "https://www.linkedin.com/in/manal-patel-a87b11382/",
        "order_no": 4,
    },
    {
        "id": 5,
        "name": "Makavana Axit",
        "role": "Member",
        "photo": "",
        "description": "Curious about AI and its real-world applications. Engaged with foundational club sessions in data science and programming.",
        "github": "",
        "linkedin": "",
        "order_no": 5,
    },
    {
        "id": 6,
        "name": "Kush Ashvinbhai Patel",
        "role": "Member",
        "photo": "",
        "description": "Focused on computer vision and retail AI. Built ShelfMind AI — a real-time shelf monitoring system that detects products, generates planograms, and flags out-of-stock issues.",
        "github": "https://github.com/Kush5699",
        "linkedin": "https://www.linkedin.com/in/kush-patel-6a074b258",
        "order_no": 6,
    },
    {
        "id": 7,
        "name": "Rushil Dangar",
        "role": "Member",
        "photo": "https://drive.google.com/thumbnail?id=1dwvTHcgTlgdKJZLJCcrpu3-SwrjN-yQQ&sz=w400-h400",
        "description": "B.Tech ICT student with a strong interest in AI, Robotics, and programming. Experienced in C, C++, and Python, and committed to continuous learning in the field.",
        "github": "https://github.com/Cybernyte-31",
        "linkedin": "https://www.linkedin.com/in/rushil-dangar-42304632b",
        "order_no": 7,
    },
    {
        "id": 8,
        "name": "Aaditya Sarda",
        "role": "Core Member",
        "photo": "https://drive.google.com/thumbnail?id=1JNdHeervqQcR3F1YxM5_5mH_RSgceBVv&sz=w400-h400",
        "description": "Turns complex math, messy data, and a lot of curiosity into working AI systems.",
        "github": "https://github.com/Aadityasarda-25",
        "linkedin": "https://www.linkedin.com/in/aaditya-sarda-426357371",
        "order_no": 8,
    },
    {
        "id": 9,
        "name": "Vasani Sahil Rajeshbhai",
        "role": "Member",
        "photo": "https://drive.google.com/thumbnail?id=18F16o3BL8rTeK-i2fOXfQ7sfXR7_GcSR&sz=w400-h400",
        "description": "Interested in applying ML to real-world energy problems. Built models to predict solar/wind generation potential and forecast electricity bills.",
        "github": "https://github.com/sahil-vasani",
        "linkedin": "https://www.linkedin.com/in/sahil-vasani/",
        "order_no": 9,
    },
    {
        "id": 10,
        "name": "Vedant Shah",
        "role": "Convenor",
        "photo": "https://drive.google.com/thumbnail?id=1w-YzI438YZQ4TxCk0xP4g_VswuyaiW3i&sz=w400-h400",
        "description": "Convenor of the AI Club DAIICT. Builds multi-agent RL environments, edge AI systems, and blockchain backends — driven by a passion for research and real-world AI impact.",
        "github": "https://github.com/Vedant-1016",
        "linkedin": "https://www.linkedin.com/in/vedant-shah-07a87331a/",
        "order_no": 10,
    },
    {
        "id": 11,
        "name": "Parth Agrawal",
        "role": "Core Member",
        "photo": "https://drive.google.com/thumbnail?id=1cpqcCEhL-421d93Pms15ZEcpzAYAe6Ns&sz=w400-h400",
        "description": "Core member of the AI Club with a strong interest in AI-powered career guidance and data-driven problem solving. Built CareerPilot-AI, a conversational platform for personalized career recommendations.",
        "github": "https://github.com/ParthAgrawal-07",
        "linkedin": "https://www.linkedin.com/in/parth-agrawal-368869325/",
        "order_no": 11,
    },
    {
        "id": 12,
        "name": "Jugal Nirav Shah",
        "role": "Extended Core Member",
        "photo": "https://drive.google.com/thumbnail?id=1eWzxCETb_20BuzqBfLODuPkOb44dtZGz&sz=w400-h400",
        "description": "Extended core member of the AI Club. Builds AI-powered dashboards and intelligent email triage systems, with a cyberpunk-inspired design sensibility and a love for vibe coding.",
        "github": "https://github.com/jugalshahh",
        "linkedin": "https://www.linkedin.com/in/jugal-shah-a493b3368/",
        "order_no": 12,
    },
    {
        "id": 13,
        "name": "Bhagyashree Khemwani",
        "role": "Core Member",
        "photo": "https://drive.google.com/thumbnail?id=1k-3MwbfpE2I_1yPo76ikT5Bd5F7rQA3L&sz=w400-h400",
        "description": "Core member of the AI Club, actively participating in events and building foundational skills in Python, data science, and emerging AI applications.",
        "github": "https://github.com/bhagy-shr",
        "linkedin": "https://www.linkedin.com/in/bhagyashree-khemwani",
        "order_no": 13,
    },
    {
        "id": 14,
        "name": "Anmol Ghogare",
        "role": "Core Member",
        "photo": "https://drive.google.com/thumbnail?id=1QWs1UunTZomhZfPxHPHMhuoF4OVQPvGJ&sz=w400-h400",
        "description": "Passionate about AI/ML and competitive programming. Has built real-world projects including a talent assessment tool, real estate price predictor, and eco-drive analyzer. Experienced in hackathons and AI-driven development.",
        "github": "https://github.com/anmolghogare",
        "linkedin": "https://www.linkedin.com/in/anmol-ghogare-407244381",
        "order_no": 14,
    }
]

SEED_PROJECTS = [
    {
        "id": 1,
        "title": "F1-Prediction-Hub",
        "author": "Saumya Shah",
        "author_id": 1,
        "description": "A full-stack Formula 1 website featuring live standings, driver and team information, and ML-powered race predictions.",
        "tags": json.dumps(["Machine Learning", "Full Stack", "Data Science", "Sports Analytics", "Python"]),
        "github_link": "https://github.com/saumyashah0510/F1-Prediction-Hub"
    },
    {
        "id": 2,
        "title": "ShelfMind-AI",
        "author": "Kush Ashvinbhai Patel",
        "author_id": 6,
        "description": "An end-to-end computer-vision-driven retail intelligence app that automatically monitors shelves, detects products with high precision, generates planograms, and flags out-of-stock or compliance issues in real time.",
        "tags": json.dumps(["Computer Vision", "Object Detection", "Retail AI", "Deep Learning", "OpenCV", "Python"]),
        "github_link": "https://github.com/Kush5699/ShelfMind-AI"
    },
    {
        "id": 3,
        "title": "Renewable-Energy-Solar-and-Wind-Prediction",
        "author": "Vasani Sahil Rajeshbhai",
        "author_id": 9,
        "description": "Predicts the optimal location and potential output for solar panels by analysing sunlight data, helping users decide where to install renewable energy systems.",
        "tags": json.dumps(["Machine Learning", "Renewable Energy", "Regression", "Data Science", "Python"]),
        "github_link": "https://github.com/sahil-vasani/Renewable-Energy-Solar-and-Wind-Prediction"
    },
    {
        "id": 4,
        "title": "Electricity-Bill-Prediction-ML",
        "author": "Vasani Sahil Rajeshbhai",
        "author_id": 9,
        "description": "A machine-learning model that forecasts next month's electricity bill based on historical usage patterns, helping households plan energy consumption.",
        "tags": json.dumps(["Machine Learning", "Regression", "Forecasting", "Energy", "Python"]),
        "github_link": "https://github.com/sahil-vasani/Electricity-bill-prediction-ML"
    },
    {
        "id": 5,
        "title": "GAIA Agent",
        "author": "Jash Shah",
        "author_id": None,
        "description": "A LangGraph-powered multi-agent system with a supervisor that delegates real-world GAIA benchmark questions to specialized sub-agents for web search, code execution, file processing, and video analysis.",
        "tags": json.dumps(["Machine Learning", "LangGraph", "Multi-Agent", "Python"]),
        "github_link": "https://github.com/jash0803/gaia-agent"
    },
    {
        "id": 6,
        "title": "Financial Asset Recommender",
        "author": "Jash Shah",
        "author_id": None,
        "description": "A modular hybrid recommender system for financial assets combining 5 algorithms and 11 evaluation metrics with cold-start handling and an interactive Streamlit UI for personalized investment suggestions.",
        "tags": json.dumps(["Machine Learning", "Recommender System", "Data Science", "Python"]),
        "github_link": "https://github.com/jash0803/financial-asset-recommendation"
    },
    {
        "id": 7,
        "title": "NaFO RL Environment",
        "author": "Vedant Shah",
        "author_id": 10,
        "description": "A multi-agent reinforcement learning environment built on OpenEnv's framework that simulates an economy, optimizing profits for a shopkeeper by accounting for dynamic market factors.",
        "tags": json.dumps(["Machine Learning", "Reinforcement Learning", "Multi-Agent", "Python"]),
        "github_link": "https://github.com/Vedant-1016"
    },
    {
        "id": 8,
        "title": "ConcourMeet",
        "author": "Vedant Shah",
        "author_id": 10,
        "description": "A backend implementation of a video-conferencing platform inspired by Google Meet, built with a system-programming-oriented approach focusing on concurrency and backend architecture.",
        "tags": json.dumps(["Full Stack", "Backend", "Systems", "Python"]),
        "github_link": "https://github.com/Vedant-1016"
    },
    {
        "id": 9,
        "title": "AI-Powered Personal Command Centre",
        "author": "Jugal Nirav Shah",
        "author_id": 12,
        "description": "A highly customized, fully responsive personal dashboard centralizing academic, technical, and lifestyle tracking. Built with React and a cyberpunk aesthetic as a single pane of glass for developer workflows.",
        "tags": json.dumps(["Full Stack", "Machine Learning", "Data Science", "Python"]),
        "github_link": "https://github.com/jugalshahh"
    },
    {
        "id": 10,
        "title": "AI Email Classifier",
        "author": "Jugal Nirav Shah",
        "author_id": 12,
        "description": "A real-world OpenEnv environment simulating email triage — classifying incoming emails by spam status, category, and priority level, benchmarking AI agent capabilities on a practical knowledge-worker task.",
        "tags": json.dumps(["Machine Learning", "NLP", "Multi-Agent", "Python"]),
        "github_link": "https://github.com/jugalshahh"
    },
    {
        "id": 11,
        "title": "CareerPilot-AI",
        "author": "Parth Agrawal",
        "author_id": 11,
        "description": "A fully developed AI-powered career guidance platform that uses conversational AI to analyze student interests and deliver personalized career recommendations with financial and professional insights.",
        "tags": json.dumps(["Machine Learning", "Full Stack", "Data Science", "Python"]),
        "github_link": "https://github.com/ParthAgrawal-07"
    },
    {
        "id": 12,
        "title": "TalentLens",
        "author": "Anmol Ghogare",
        "author_id": 14,
        "description": "An AI-powered talent assessment tool that evaluates candidate skills and potential using machine learning models, helping organizations make data-driven hiring decisions.",
        "tags": json.dumps(["Machine Learning", "Data Science", "Python"]),
        "github_link": "https://github.com/anmolghogare"
    },
    {
        "id": 13,
        "title": "Real Estate Price Predictor",
        "author": "Anmol Ghogare",
        "author_id": 14,
        "description": "A machine learning model that predicts real estate property prices based on location, amenities, and market factors, enabling smarter investment and buying decisions.",
        "tags": json.dumps(["Machine Learning", "Regression", "Data Science", "Python"]),
        "github_link": "https://github.com/anmolghogare"
    }
]

async def seed_members_and_projects(session: AsyncSession):
    # Check members count
    count_member_res = await session.execute(select(func.count(ClubMember.id)))
    count_members = count_member_res.scalar_one()
    if count_members == 0:
        logger.info("Database is empty of club members. Seeding initial data...")
        for m in SEED_MEMBERS:
            member = ClubMember(
                name=m["name"],
                role=m["role"],
                photo=m["photo"] if m["photo"] else None,
                description=m["description"],
                github=m["github"] if m["github"] else None,
                linkedin=m["linkedin"] if m["linkedin"] else None,
                order_no=m["order_no"]
            )
            session.add(member)
        await session.commit()
        logger.info("Successfully seeded club members!")

    # Check projects count
    count_project_res = await session.execute(select(func.count(ClubProject.id)))
    count_projects = count_project_res.scalar_one()
    if count_projects == 0:
        logger.info("Database is empty of club projects. Seeding initial data...")
        for p in SEED_PROJECTS:
            project = ClubProject(
                title=p["title"],
                author=p["author"],
                author_id=p["author_id"],
                description=p["description"],
                tags=p["tags"],
                github_link=p["github_link"]
            )
            session.add(project)
        await session.commit()
        logger.info("Successfully seeded club projects!")
