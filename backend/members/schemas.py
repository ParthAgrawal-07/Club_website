import json
from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel, Field

class MemberCreateRequest(BaseModel):
    name:        str = Field(..., min_length=1, max_length=255)
    role:        str = Field(..., description="'Convenor' | 'Deputy Convenor' | 'Core Member' | 'Extended Core Member' | 'Member'")
    photo:       Optional[str] = None
    description: Optional[str] = None
    github:      Optional[str] = None
    linkedin:    Optional[str] = None
    order_no:    int = 0

class MemberUpdateRequest(BaseModel):
    name:        Optional[str] = None
    role:        Optional[str] = None
    photo:       Optional[str] = None
    description: Optional[str] = None
    github:      Optional[str] = None
    linkedin:    Optional[str] = None
    order_no:    Optional[int] = None

class MemberResponse(BaseModel):
    id:          int
    name:        str
    role:        str
    photo:       Optional[Optional[str]]
    description: Optional[Optional[str]]
    github:      Optional[Optional[str]]
    linkedin:    Optional[Optional[str]]
    order_no:    int
    created_at:  datetime

    model_config = {"from_attributes": True}


class ProjectCreateRequest(BaseModel):
    title:       str = Field(..., min_length=1, max_length=255)
    author:      str = Field(..., min_length=1, max_length=255)
    author_id:   Optional[int] = None
    description: str
    tags:        List[str] = Field(default_factory=list)
    github_link: str

class ProjectUpdateRequest(BaseModel):
    title:       Optional[str] = None
    author:      Optional[str] = None
    author_id:   Optional[int] = None
    description: Optional[str] = None
    tags:        Optional[List[str]] = None
    github_link: Optional[str] = None


class ProjectResponse(BaseModel):
    id:          int
    title:       str
    author:      str
    author_id:   Optional[int]
    description: str
    tags:        List[str]
    github_link: str
    created_at:  datetime

    @classmethod
    def from_orm(cls, obj) -> "ProjectResponse":
        tags_list = []
        if obj.tags:
            try:
                tags_list = json.loads(obj.tags)
                if not isinstance(tags_list, list):
                    tags_list = [str(tags_list)]
            except Exception:
                tags_list = [t.strip() for t in obj.tags.split(",") if t.strip()]
        return cls(
            id=obj.id,
            title=obj.title,
            author=obj.author,
            author_id=obj.author_id,
            description=obj.description,
            tags=tags_list,
            github_link=obj.github_link,
            created_at=obj.created_at
        )

    model_config = {"from_attributes": True}
