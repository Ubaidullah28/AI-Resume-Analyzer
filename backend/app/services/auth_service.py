from sqlalchemy.orm import Session

from app import models
from app.auth import (
    create_access_token,
    hash_password,
    verify_password
)


def normalize_email(email: str) -> str:
    """
    Email ko consistent format mein convert karta hai.

    Example:
    UBAID@Test.com
    ubaid@test.com
    ubaid@test.com

    teeno same treat honge.
    """
    return email.strip().lower()


def register_user(
    db: Session,
    name: str,
    email: str,
    password: str
):
    email = normalize_email(email)

    # Check if email already exists
    existing = (
        db.query(models.User)
        .filter(models.User.email == email)
        .first()
    )

    if existing:
        return None

    # Password ko hash karo
    hashed = hash_password(password)

    user = models.User(
        name=name.strip(),
        email=email,
        hashed_password=hashed
    )

    try:
        db.add(user)
        db.commit()
        db.refresh(user)

    except Exception:
        db.rollback()
        raise

    return user


def login_user(
    db: Session,
    email: str,
    password: str
):
    email = normalize_email(email)

    # User find karo
    user = (
        db.query(models.User)
        .filter(models.User.email == email)
        .first()
    )

    if not user:
        return None

    # Password verify
    if not verify_password(
        password,
        user.hashed_password
    ):
        return None

    # JWT token
    token = create_access_token(
        {
            "sub": user.email
        }
    )

    return {
        "access_token": token,
        "token_type": "bearer"
    }