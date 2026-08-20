import os
import uuid

from fastapi import UploadFile, HTTPException, status
from sqlalchemy.orm import Session

from app import models

from app.utils.pdf_parser import (
    extract_text_from_pdf,
    clean_text
)


UPLOAD_DIR = "app/uploads"
MAX_FILE_SIZE = 5 * 1024 * 1024  # 5 MB
ALLOWED_CONTENT_TYPE = "application/pdf"


def upload_resume(
    db: Session,
    file: UploadFile,
    current_user
):
    # --------------------------------
    # 1. Validate filename
    # --------------------------------

    if not file.filename:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No file selected"
        )

    # --------------------------------
    # 2. Validate extension
    # --------------------------------

    extension = os.path.splitext(file.filename)[1].lower()

    if extension != ".pdf":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Only PDF files are allowed"
        )

    # --------------------------------
    # 3. Validate content type
    # --------------------------------

    if file.content_type != ALLOWED_CONTENT_TYPE:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid file type. Please upload a PDF"
        )

    # --------------------------------
    # 4. Read first bytes
    # --------------------------------

    first_bytes = file.file.read(4)

    if first_bytes != b"%PDF":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid PDF file"
        )

    # Move file pointer back to beginning
    file.file.seek(0)

    # --------------------------------
    # 5. Create upload directory
    # --------------------------------

    os.makedirs(UPLOAD_DIR, exist_ok=True)

    # --------------------------------
    # 6. Generate unique filename
    # --------------------------------

    unique_filename = f"{uuid.uuid4()}.pdf"

    file_path = os.path.join(
        UPLOAD_DIR,
        unique_filename
    )

    # --------------------------------
    # 7. Save file with size limit
    # --------------------------------

    total_size = 0

    try:

        with open(file_path, "wb") as buffer:

            while True:

                chunk = file.file.read(1024 * 1024)

                if not chunk:
                    break

                total_size += len(chunk)

                if total_size > MAX_FILE_SIZE:

                    buffer.close()

                    os.remove(file_path)

                    raise HTTPException(
                        status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
                        detail="File size must not exceed 5 MB"
                    )

                buffer.write(chunk)

    except HTTPException:
        raise

    except Exception:
        if os.path.exists(file_path):
            os.remove(file_path)

        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to save resume"
        )

    # --------------------------------
    # 8. Extract and clean text
    # --------------------------------


    try:
        raw_text = extract_text_from_pdf(file_path)

        extracted_text = clean_text(raw_text)

    except Exception:

        if os.path.exists(file_path):
            os.remove(file_path)

        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Could not extract text from PDF"
        )

    # --------------------------------
    # 9. Create database record
    # --------------------------------

    resume = models.Resume(
        filename=file.filename,
        filepath=file_path,
        extracted_text=extracted_text,
        owner_id=current_user.id
    )

    try:

        db.add(resume)
        db.commit()
        db.refresh(resume)

    except Exception:

        db.rollback()

        if os.path.exists(file_path):
            os.remove(file_path)

        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to save resume information"
        )

    return resume


def get_user_resumes(
    db: Session,
    current_user
):
    resumes = (
        db.query(models.Resume)
        .filter(
            models.Resume.owner_id == current_user.id
        )
        .order_by(
            models.Resume.uploaded_at.desc()
        )
        .all()
    )

    return resumes


def delete_resume(
    db: Session,
    resume_id: int,
    current_user
):
    # --------------------------------
    # Find resume belonging to user
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
    # Delete physical file
    # --------------------------------

    if os.path.exists(resume.filepath):
        os.remove(resume.filepath)

    # --------------------------------
    # Delete database record
    # --------------------------------

    db.delete(resume)
    db.commit()

    return {
        "message": "Resume deleted successfully"
    }



def get_resume_details(
    db: Session,
    resume_id: int,
    current_user
):
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

    return resume