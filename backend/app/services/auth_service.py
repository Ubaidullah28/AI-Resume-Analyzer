from sqlalchemy.orm import Session

from app import models
from app.auth import create_access_token, hash_password, verify_password


def register_user(db: Session, name: str, email: str, password: str):
    existing = db.query(models.User).filter(
    models.User.email == email
).first()
    if existing:
        return None  # User already exists

    hashed = hash_password(password)
    user = models.User(
        name=name,
        email=email,
        hashed_password=hashed
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user

def login_user(db, email, password):
    user = db.query(models.User).filter(
        models.User.email == email
    ).first()

    if not user:
        return None  # User not found

    verified = verify_password(password, user.hashed_password)
    if not verified:
        return None  # Password does not match

    token = create_access_token({"sub": user.email})
    return {
        "access_token": token,
        "token_type": "bearer"
    }

