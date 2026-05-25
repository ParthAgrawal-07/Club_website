import asyncio
import sys
from sqlalchemy import text

sys.path.insert(0, "/Users/meetvirugama/AI CLUB WEBSITE/backend")

from db import engine

async def main():
    async with engine.connect() as conn:
        res = await conn.execute(text("""
            SELECT column_name, data_type 
            FROM information_schema.columns 
            WHERE table_name = 'club_events';
        """))
        columns = res.fetchall()
        print("COLUMNS IN club_events:")
        for col in columns:
            print(f" - {col[0]}: {col[1]}")

asyncio.run(main())
