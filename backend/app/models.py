from sqlalchemy import Column
from sqlalchemy import Integer
from sqlalchemy import String
from sqlalchemy import DateTime
from datetime import datetime
from sqlalchemy.orm import relationship
from app.database import Base
from sqlalchemy import ForeignKey
from sqlalchemy import Text

class User(Base):

    __tablename__ = "users"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    name = Column(
        String,
        nullable=False
    )

    email = Column(
        String,
        unique=True,
        nullable=False,
        index=True
    )

    hashed_password = Column(
        String,
        nullable=False
    )

    created_at = Column(
        DateTime,
        default=datetime.utcnow
    )
    resumes = relationship(
    "Resume",
    back_populates="owner",
    cascade="all, delete"
)




class Resume(Base):

    __tablename__ = "resumes"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    filename = Column(
        String,
        nullable=False
    )

    filepath = Column(
        String,
        nullable=False
    )

    extracted_text = Column(
        Text,
        nullable=True
    )

    uploaded_at = Column(
        DateTime,
        default=datetime.utcnow
    )

    owner_id = Column(
        Integer,
        ForeignKey("users.id")
    )

    owner = relationship(
        "User",
        back_populates="resumes"
    )
    analyses = relationship(
    "ATSAnalysis",
    back_populates="resume",
    cascade="all, delete"
)


class ATSAnalysis(Base):
    __tablename__ = "ats_analyses"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    resume_id = Column(
        Integer,
        ForeignKey("resumes.id"),
        nullable=False
    )

    job_description = Column(
        Text,
        nullable=False
    )

    ats_score = Column(
        Integer,
        nullable=False
    )

    skills_score = Column(
        Integer,
        nullable=False
    )

    keyword_score = Column(
        Integer,
        nullable=False
    )

    section_score = Column(
        Integer,
        nullable=False
    )

    matched_skills = Column(
        Text,
        nullable=True
    )

    missing_skills = Column(
        Text,
        nullable=True
    )

    matched_keywords = Column(
        Text,
        nullable=True
    )

    missing_keywords = Column(
        Text,
        nullable=True
    )

    created_at = Column(
        DateTime,
        default=datetime.utcnow
    )

    resume = relationship(
        "Resume",
        back_populates="analyses"
    )

    ai_feedback = Column(
        Text,
        nullable=True
    )