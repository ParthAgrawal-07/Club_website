import json
import logging
from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from db import async_session
from events.admin import require_admin
from members.models import ClubMember, ClubProject
from members.schemas import (
    MemberCreateRequest,
    MemberResponse,
    MemberUpdateRequest,
    ProjectCreateRequest,
    ProjectResponse,
    ProjectUpdateRequest,
)

logger = logging.getLogger(__name__)
router = APIRouter(tags=["Club Members & Projects"])

async def get_db():
    async with async_session() as session:
        yield session

# ─── Public Endpoints ─────────────────────────────────────────────────────────

@router.get("/api/members", response_model=List[MemberResponse])
async def get_members(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(ClubMember).order_by(ClubMember.order_no.asc(), ClubMember.id.asc()))
    members = result.scalars().all()
    return members

@router.get("/api/projects", response_model=List[ProjectResponse])
async def get_projects(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(ClubProject).order_by(ClubProject.id.desc()))
    projects = result.scalars().all()
    return [ProjectResponse.from_orm(p) for p in projects]

# ─── Admin Member Management Endpoints ────────────────────────────────────────

@router.post("/api/admin/members", response_model=MemberResponse, status_code=status.HTTP_201_CREATED)
async def create_member(
    data: MemberCreateRequest,
    admin=Depends(require_admin),
    db: AsyncSession = Depends(get_db)
):
    member = ClubMember(
        name=data.name,
        role=data.role,
        photo=data.photo,
        description=data.description,
        github=data.github,
        linkedin=data.linkedin,
        order_no=data.order_no
    )
    db.add(member)
    await db.commit()
    await db.refresh(member)
    return member

@router.put("/api/admin/members/{member_id}", response_model=MemberResponse)
async def update_member(
    member_id: int,
    data: MemberUpdateRequest,
    admin=Depends(require_admin),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(select(ClubMember).where(ClubMember.id == member_id))
    member = result.scalars().first()
    if not member:
        raise HTTPException(status_code=404, detail="Member not found")
    
    for field, val in data.model_dump(exclude_unset=True).items():
        setattr(member, field, val)
        
    await db.commit()
    await db.refresh(member)
    return member

@router.delete("/api/admin/members/{member_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_member(
    member_id: int,
    admin=Depends(require_admin),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(select(ClubMember).where(ClubMember.id == member_id))
    member = result.scalars().first()
    if not member:
        raise HTTPException(status_code=404, detail="Member not found")
        
    await db.delete(member)
    await db.commit()
    return None

# ─── Admin Project Management Endpoints ────────────────────────────────────────

@router.post("/api/admin/projects", response_model=ProjectResponse, status_code=status.HTTP_201_CREATED)
async def create_project(
    data: ProjectCreateRequest,
    admin=Depends(require_admin),
    db: AsyncSession = Depends(get_db)
):
    project = ClubProject(
        title=data.title,
        author=data.author,
        author_id=data.author_id,
        description=data.description,
        tags=json.dumps(data.tags),
        github_link=data.github_link
    )
    db.add(project)
    await db.commit()
    await db.refresh(project)
    return ProjectResponse.from_orm(project)

@router.put("/api/admin/projects/{project_id}", response_model=ProjectResponse)
async def update_project(
    project_id: int,
    data: ProjectUpdateRequest,
    admin=Depends(require_admin),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(select(ClubProject).where(ClubProject.id == project_id))
    project = result.scalars().first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
        
    update_data = data.model_dump(exclude_unset=True)
    if "tags" in update_data:
        project.tags = json.dumps(update_data.pop("tags"))
        
    for field, val in update_data.items():
        setattr(project, field, val)
        
    await db.commit()
    await db.refresh(project)
    return ProjectResponse.from_orm(project)

@router.delete("/api/admin/projects/{project_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_project(
    project_id: int,
    admin=Depends(require_admin),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(select(ClubProject).where(ClubProject.id == project_id))
    project = result.scalars().first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
        
    await db.delete(project)
    await db.commit()
    return None
