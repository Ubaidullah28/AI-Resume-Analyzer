from pydantic import BaseModel, EmailStr
from datetime import datetime

class UserRegister(BaseModel):
    name: str
    email: EmailStr
    password: str


class UserLogin(BaseModel):
    email: EmailStr
    password: str



class UserResponse(BaseModel):
    id: int
    name: str
    email: EmailStr

    class Config:
        from_attributes = True


class Token(BaseModel):
    access_token: str
    token_type: str


class ResumeResponse(BaseModel):

    id: int

    filename: str

    uploaded_at: datetime

    class Config:
        from_attributes = True


class ResumeDetailResponse(BaseModel):
    id: int
    filename: str
    extracted_text: str | None
    uploaded_at: datetime

    class Config:
        from_attributes = True



class ATSAnalysisRequest(BaseModel):
    job_description: str


class ATSAnalysisResponse(BaseModel):

    id: int

    resume_id: int

    ats_score: int

    skills_score: int

    keyword_score: int

    section_score: int

    matched_skills: list[str]

    missing_skills: list[str]

    matched_keywords: list[str]

    missing_keywords: list[str]

    created_at: datetime

    class Config:
        from_attributes = True


class AIFeedbackResponse(BaseModel):

    summary: str

    strengths: list[str]

    weaknesses: list[str]

    missing_skills: list[str]

    improvement_suggestions: list[str]

    rewritten_summary: str