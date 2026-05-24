"""
auth/models.py
--------------
SQLAlchemy ORM model for the `users` table.

This file owns *only* the User model so it can be imported
independently by migrations, seeds, and the auth module without
pulling in the entire application.

Database schema
───────────────
users
  id            SERIAL PRIMARY KEY
  google_id     VARCHAR(255) UNIQUE NOT NULL   — Google's unique sub identifier
  name          VARCHAR(255) NOT NULL
  email         VARCHAR(255) UNIQUE NOT NULL
  profile_image VARCHAR(500)                   — URL to Google profile picture
  created_at    TIMESTAMPTZ DEFAULT NOW()
"""

from datetime import datetime, timezone
from sqlalchemy import Column, Integer, String, DateTime


def _utcnow() -> datetime:
    """Return an offset-aware UTC datetime (avoids deprecation warnings)."""
    return datetime.now(timezone.utc)


# ─── SQLAlchemy model (Base is injected at startup from db.py) ────────────────

def create_user_model(Base):
    """
    Factory so we can reuse the same declarative Base that is shared
    across the whole application instead of creating a second one here.
    """

    class User(Base):
        __tablename__ = "users"

        id = Column(Integer, primary_key=True, index=True)
        google_id = Column(String(255), unique=True, nullable=False, index=True)
        name = Column(String(255), nullable=False)
        email = Column(String(255), unique=True, nullable=False, index=True)
        profile_image = Column("picture", String(500), nullable=True)
        last_login = Column(DateTime(timezone=True), default=_utcnow, nullable=False)
        created_at = Column(DateTime(timezone=True), default=_utcnow, nullable=False)

        def __repr__(self) -> str:  # pragma: no cover
            return f"<User id={self.id} email={self.email!r}>"

    return User
