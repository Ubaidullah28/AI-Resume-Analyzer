import json

from fastapi import (
    APIRouter,
    Depends,
    HTTPException
)

from sqlalchemy.orm import Session
from app import models

from app.database import get_db

from app.schemas import (
    ATSAnalysisRequest,
    ATSAnalysisResponse,
    AIFeedbackResponse
)



from app.services.ats_service import (
    analyze_resume
)

from app.services.user_service import (
    get_current_user
)

from app.services.ai_service import (
    generate_resume_feedback
)


router = APIRouter(
    tags=["ATS Analysis"]
)


@router.post(
    "/analyze/{resume_id}",
    response_model=ATSAnalysisResponse
)




def analyze(
    resume_id: int,
    data: ATSAnalysisRequest,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):

    return analyze_resume(
        db,
        resume_id,
        data.job_description,
        current_user
    )


@router.post(
    "/ai-feedback/{analysis_id}",
    response_model=AIFeedbackResponse
)
def ai_feedback(
    analysis_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):

    analysis = (
        db.query(models.ATSAnalysis)
        .join(
            models.Resume,
            models.ATSAnalysis.resume_id == models.Resume.id
        )
        .filter(
            models.ATSAnalysis.id == analysis_id,
            models.Resume.owner_id == current_user.id
        )
        .first()
    )

    if not analysis:
        raise HTTPException(
            status_code=404,
            detail="Analysis not found"
        )

    if analysis.ai_feedback:
        return json.loads(
            analysis.ai_feedback
        )

    ats_result = {
        "ats_score": analysis.ats_score,

        "skills_score": analysis.skills_score,

        "keyword_score": analysis.keyword_score,

        "section_score": analysis.section_score,

        "matched_skills": json.loads(
            analysis.matched_skills
        ) if analysis.matched_skills else [],

        "missing_skills": json.loads(
            analysis.missing_skills
        ) if analysis.missing_skills else []
    }

    resume = analysis.resume

    feedback = generate_resume_feedback(
        resume_text=resume.extracted_text or "",
        job_description=analysis.job_description,
        ats_result=ats_result
    )

    analysis.ai_feedback = json.dumps(
        feedback
    )

    db.commit()

    return feedback



@router.get("/history")
def get_analysis_history(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):

    analyses = (
        db.query(models.ATSAnalysis)
        .join(
            models.Resume,
            models.ATSAnalysis.resume_id
            == models.Resume.id
        )
        .filter(
            models.Resume.owner_id
            == current_user.id
        )
        .order_by(
            models.ATSAnalysis.created_at.desc()
        )
        .all()
    )

    return [
        {
            "id": analysis.id,
            "resume_id": analysis.resume_id,
            "ats_score": analysis.ats_score,
            "skills_score": analysis.skills_score,
            "keyword_score": analysis.keyword_score,
            "section_score": analysis.section_score,
            "created_at": analysis.created_at
        }
        for analysis in analyses
    ]




@router.get("/{analysis_id}")
def get_analysis(
    analysis_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):

    analysis = (
        db.query(models.ATSAnalysis)
        .join(
            models.Resume,
            models.ATSAnalysis.resume_id
            == models.Resume.id
        )
        .filter(
            models.ATSAnalysis.id == analysis_id,
            models.Resume.owner_id == current_user.id
        )
        .first()
    )

    if not analysis:
        raise HTTPException(
            status_code=404,
            detail="Analysis not found"
        )

    return {
        "id": analysis.id,

        "resume_id":
            analysis.resume_id,

        "job_description":
            analysis.job_description,

        "ats_score":
            analysis.ats_score,

        "skills_score":
            analysis.skills_score,

        "keyword_score":
            analysis.keyword_score,

        "section_score":
            analysis.section_score,

        "matched_skills":
            json.loads(
                analysis.matched_skills
            )
            if analysis.matched_skills
            else [],

        "missing_skills":
            json.loads(
                analysis.missing_skills
            )
            if analysis.missing_skills
            else [],

        "matched_keywords":
            json.loads(
                analysis.matched_keywords
            )
            if analysis.matched_keywords
            else [],

        "missing_keywords":
            json.loads(
                analysis.missing_keywords
            )
            if analysis.missing_keywords
            else [],

        "ai_feedback":
            json.loads(
                analysis.ai_feedback
            )
            if analysis.ai_feedback
            else None,

        "created_at":
            analysis.created_at
    }