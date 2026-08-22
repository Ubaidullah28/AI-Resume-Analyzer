from sqlalchemy.orm import Session

from google.oauth2 import id_token
from google.auth.transport import requests

from app import models

from app.auth import (
    create_access_token,
    hash_password
)

from app.config import GOOGLE_CLIENT_ID


def login_with_google(
    db: Session,
    credential: str
):

    # -------------------------
    # Verify Google ID token
    # -------------------------

    try:

        google_user = (
            id_token.verify_oauth2_token(
                credential,
                requests.Request(),
                GOOGLE_CLIENT_ID
            )
        )

    except ValueError:

        return None


    # -------------------------
    # Extract Google data
    # -------------------------

    email = google_user.get(
        "email"
    )

    name = google_user.get(
        "name"
    )

    email_verified = google_user.get(
        "email_verified",
        False
    )


    # -------------------------
    # Basic validation
    # -------------------------

    if not email:

        return None


    if not email_verified:

        return None


    # -------------------------
    # Find existing user
    # -------------------------

    user = db.query(
        models.User
    ).filter(
        models.User.email == email
    ).first()


    # -------------------------
    # Create new user
    # -------------------------

    if not user:

        # Google users don't need
        # a normal password.
        #
        # We still store a random
        # unusable password hash
        # because our current User
        # model expects hashed_password.

        random_password = (
            "GOOGLE_AUTH_"
            + email
            + "_"
            + GOOGLE_CLIENT_ID[-8:]
        )

        hashed_password = hash_password(
            random_password
        )


        user = models.User(
            name=name or email.split("@")[0],
            email=email,
            hashed_password=hashed_password
        )


        db.add(user)

        db.commit()

        db.refresh(user)


    # -------------------------
    # Create our JWT
    # -------------------------

    access_token = create_access_token(
        {
            "sub": user.email
        }
    )


    return {
        "access_token": access_token,
        "token_type": "bearer"
    }