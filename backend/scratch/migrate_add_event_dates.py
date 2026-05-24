import asyncio
import sys
from sqlalchemy import text

sys.path.insert(0, "/Users/meetvirugama/AI CLUB WEBSITE/backend")

from db import engine

async def main():
    print("=== STARTING DATABASE MIGRATION ===")
    async with engine.connect() as conn:
        # Step 1: Add columns as nullable first
        print("Adding columns event_start_date and event_end_date...")
        await conn.execute(text("ALTER TABLE club_events ADD COLUMN IF NOT EXISTS event_start_date DATE;"))
        await conn.execute(text("ALTER TABLE club_events ADD COLUMN IF NOT EXISTS event_end_date DATE;"))
        await conn.commit()

        # Step 2: Populate them with event_date for existing events
        print("Populating values for existing events...")
        await conn.execute(text("UPDATE club_events SET event_start_date = event_date WHERE event_start_date IS NULL;"))
        await conn.execute(text("UPDATE club_events SET event_end_date = event_date WHERE event_end_date IS NULL;"))
        await conn.commit()

        # Step 3: Enforce NOT NULL constraints
        print("Setting NOT NULL constraints...")
        await conn.execute(text("ALTER TABLE club_events ALTER COLUMN event_start_date SET NOT NULL;"))
        await conn.execute(text("ALTER TABLE club_events ALTER COLUMN event_end_date SET NOT NULL;"))
        await conn.commit()

        print("=== DATABASE MIGRATION COMPLETED SUCCESSFULLY ===")

asyncio.run(main())
