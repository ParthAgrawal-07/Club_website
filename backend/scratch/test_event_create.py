import asyncio
import sys
from datetime import datetime, date, time, timezone

sys.path.insert(0, "/Users/meetvirugama/AI CLUB WEBSITE/backend")

from main import app
from fastapi.testclient import TestClient

client = TestClient(app)

# Mock admin bypass
from auth.middleware import get_current_user
from events.admin import require_admin

class MockUser:
    id = 9999
    google_id = "mock_google_id_9999"
    name = "Mock Admin User"
    email = "admin@example.com"
    profile_image = "http://example.com/image.png"
    last_login = datetime.now(timezone.utc)

app.dependency_overrides[get_current_user] = lambda: MockUser()
app.dependency_overrides[require_admin] = lambda: MockUser()

payload = {
    "title": "Kaggle",
    "description": "jhefawefuoqe",
    "category": "competition",
    "venue": "ONLINE",
    "contact_email": "aiclub@daiict.ac.in",
    "event_type": "individual",
    "min_team_size": None,
    "max_team_size": None,
    "event_date": "2026-05-31",
    "event_start_date": "2026-05-31",
    "event_end_date": "2026-05-31",
    "start_time": "18:00:00",
    "end_time": "21:00:00",
    "registration_start": "2026-05-25T15:00:00.000Z",
    "registration_end": "2026-05-28T15:00:00.000Z"
}

res = client.post("/api/admin/events", json=payload)
print("STATUS CODE:", res.status_code)
print("RESPONSE DETAIL:", res.json())
