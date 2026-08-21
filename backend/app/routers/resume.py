from fastapi import (
    APIRouter,
    Depends,
    UploadFile,
    File,
    status
)

from sqlalchemy.orm import Session

from app.database import get_db
from app.schemas import ResumeResponse
from app.services.resume_service import (
    upload_resume,
    get_user_resumes,
    delete_resume
)

from app.services.resume_service import (
    upload_resume,
    get_user_resumes,
    delete_resume,
    get_resume_details
)
from app.services.user_service import get_current_user



from app.schemas import (
    ResumeResponse,
    ResumeDetailResponse
)

from fastapi import HTTPException

router = APIRouter(
    tags=["Resume"]
)


@router.post(
    "/upload",
    response_model=ResumeResponse
)
def upload(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    return upload_resume(
        db,
        file,
        current_user
    )


@router.get(
    "/history",
    response_model=list[ResumeResponse]
)
def history(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    return get_user_resumes(
        db,
        current_user
    )


@router.delete(
    "/{resume_id}",
    status_code=status.HTTP_200_OK
)
def delete(
    resume_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    return delete_resume(
        db,
        resume_id,
        current_user
    )



@router.get(
    "/{resume_id}",
    response_model=ResumeDetailResponse
)
def get_resume(
    resume_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    return get_resume_details(
        db,
        resume_id,
        current_user
    )