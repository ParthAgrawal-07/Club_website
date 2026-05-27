import logging
from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession
from members.models import ClubMember, ClubProject

logger = logging.getLogger(__name__)

SEED_MEMBERS = []
SEED_PROJECTS = []

async def seed_members_and_projects(session: AsyncSession):
    # No-op since we want a clean database for production
    pass
