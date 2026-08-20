import re
import json

from sqlalchemy.orm import Session
from fastapi import HTTPException, status

from app import models


# ---------------------------------------
# Common technical skills
# ---------------------------------------

SKILLS = {
    "python",
    "java",
    "c++",
    "c#",
    "javascript",
    "typescript",
    "react",
    "angular",
    "vue",
    "node.js",
    "nodejs",
    "django",
    "flask",
    "fastapi",
    "spring",
    "sql",
    "mysql",
    "postgresql",
    "mongodb",
    "redis",
    "firebase",
    "docker",
    "kubernetes",
    "aws",
    "azure",
    "gcp",
    "git",
    "github",
    "linux",
    "html",
    "css",
    "tailwind",
    "pytorch",
    "tensorflow",
    "scikit-learn",
    "pandas",
    "numpy",
    "opencv",
    "machine learning",
    "deep learning",
    "artificial intelligence",
    "rest api",
    "graphql",
    "microservices",
    "fastapi",
    "figma",
    "power bi",
    "tableau"
}


# ---------------------------------------
# Resume sections
# ---------------------------------------

IMPORTANT_SECTIONS = {
    "summary",
    "objective",
    "experience",
    "work experience",
    "education",
    "skills",
    "projects",
    "certifications"
}


# ---------------------------------------
# Text normalization
# ---------------------------------------

def normalize_text(text: str) -> str:

    text = text.lower()

    text = re.sub(
        r"\s+",
        " ",
        text
    )

    return text.strip()


# ---------------------------------------
# Extract skills
# ---------------------------------------

def extract_skills(text: str):

    normalized = normalize_text(text)

    found = set()

    for skill in SKILLS:

        if skill in normalized:
            found.add(skill)

    return found


# ---------------------------------------
# Extract meaningful keywords
# ---------------------------------------

def extract_keywords(job_description: str):

    text = normalize_text(job_description)

    words = re.findall(
        r"\b[a-zA-Z][a-zA-Z+#.-]{2,}\b",
        text
    )

    stop_words = {
        "the",
        "and",
        "for",
        "with",
        "that",
        "this",
        "from",
        "have",
        "will",
        "you",
        "your",
        "our",
        "are",
        "who",
        "job",
        "work",
        "years",
        "year",
        "using",
        "looking",
        "into",
        "about"
    }

    keywords = set()

    for word in words:

        word = word.lower()

        if word not in stop_words:
            keywords.add(word)

    return keywords


# ---------------------------------------
# Section detection
# ---------------------------------------

def calculate_section_score(resume_text: str):

    normalized = normalize_text(resume_text)

    found_sections = set()

    for section in IMPORTANT_SECTIONS:

        if section in normalized:
            found_sections.add(section)

    score = int(
        (len(found_sections) / len(IMPORTANT_SECTIONS))
        * 100
    )

    return score, found_sections


# ---------------------------------------
# Keyword matching
# ---------------------------------------

def calculate_keyword_match(
    resume_text: str,
    job_description: str
):

    resume_normalized = normalize_text(resume_text)

    keywords = extract_keywords(
        job_description
    )

    matched = set()
    missing = set()

    for keyword in keywords:

        if keyword in resume_normalized:
            matched.add(keyword)
        else:
            missing.add(keyword)

    if not keywords:
        score = 0

    else:
        score = int(
            (len(matched) / len(keywords))
            * 100
        )

    return score, matched, missing


# ---------------------------------------
# Complete ATS analysis
# ---------------------------------------

def calculate_ats_score(
    resume_text: str,
    job_description: str
):

    resume_skills = extract_skills(
        resume_text
    )

    job_skills = extract_skills(
        job_description
    )

    matched_skills = (
        resume_skills.intersection(
            job_skills
        )
    )

    missing_skills = (
        job_skills - resume_skills
    )

    if job_skills:

        skills_score = int(
            (
                len(matched_skills)
                / len(job_skills)
            ) * 100
        )

    else:

        skills_score = 0


    # Keywords

    keyword_score, matched_keywords, missing_keywords = (
        calculate_keyword_match(
            resume_text,
            job_description
        )
    )


    # Sections

    section_score, sections = (
        calculate_section_score(
            resume_text
        )
    )


    # Final weighted score

    ats_score = int(
        skills_score * 0.50
        + keyword_score * 0.30
        + section_score * 0.20
    )

    return {
        "ats_score": ats_score,
        "skills_score": skills_score,
        "keyword_score": keyword_score,
        "section_score": section_score,

        "matched_skills": sorted(
            matched_skills
        ),

        "missing_skills": sorted(
            missing_skills
        ),

        "matched_keywords": sorted(
            matched_keywords
        ),

        "missing_keywords": sorted(
            missing_keywords
        ),

        "sections": sorted(
            sections
        )
    }



def analyze_resume(
    db: Session,
    resume_id: int,
    job_description: str,
    current_user
):

    # --------------------------------
    # Get resume
    # --------------------------------

    resume = (
        db.query(models.Resume)
        .filter(
            models.Resume.id == resume_id,
            models.Resume.owner_id == current_user.id
        )
        .first()
    )

    if not resume:

        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Resume not found"
        )


    # --------------------------------
    # Validate job description
    # --------------------------------

    if not job_description.strip():

        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Job description cannot be empty"
        )


    # --------------------------------
    # Run ATS engine
    # --------------------------------

    result = calculate_ats_score(
        resume.extracted_text or "",
        job_description
    )


    # --------------------------------
    # Store analysis
    # --------------------------------

    analysis = models.ATSAnalysis(

        resume_id=resume.id,

        job_description=job_description,

        ats_score=result["ats_score"],

        skills_score=result["skills_score"],

        keyword_score=result["keyword_score"],

        section_score=result["section_score"],

        matched_skills=json.dumps(
            result["matched_skills"]
        ),

        missing_skills=json.dumps(
            result["missing_skills"]
        ),

        matched_keywords=json.dumps(
            result["matched_keywords"]
        ),

        missing_keywords=json.dumps(
            result["missing_keywords"]
        )
    )


    db.add(analysis)

    db.commit()

    db.refresh(analysis)


    return {
        "id": analysis.id,
        "resume_id": analysis.resume_id,

        "ats_score": analysis.ats_score,

        "skills_score": analysis.skills_score,

        "keyword_score": analysis.keyword_score,

        "section_score": analysis.section_score,

        "matched_skills": result["matched_skills"],

        "missing_skills": result["missing_skills"],

        "matched_keywords": result["matched_keywords"],

        "missing_keywords": result["missing_keywords"],

        "created_at": analysis.created_at
    }