from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
    status,
    Body
)

from sqlalchemy.orm import Session

from app.schemas import (
    Token,
    UserLogin,
    UserRegister,
    UserResponse
)

from app.database import get_db

from app.services.auth_service import (
    login_user,
    register_user
)

from app.services.google_auth_service import (
    login_with_google
)


# router = APIRouter(
#     prefix="/auth",
#     tags=["Authentication"]
# )

router = APIRouter()

# -------------------------
# Auth Home
# -------------------------

@router.get("/")
def auth_home():

    return {
        "message":
            "Authentication Router Working"
    }


# -------------------------
# Register
# -------------------------

@router.post(
    "/register",
    response_model=UserResponse
)
def register(
    request: UserRegister,
    db: Session = Depends(get_db)
):

    user = register_user(
        db,
        request.name,
        request.email,
        request.password
    )


    if not user:

        raise HTTPException(
            status_code=400,
            detail=
                "User with this email already exists"
        )


    return user


# -------------------------
# Login
# -------------------------

@router.post(
    "/login",
    response_model=Token
)
def login(
    request: UserLogin,
    db: Session = Depends(get_db)
):

    result = login_user(
        db,
        request.email,
        request.password
    )


    if result is None:

        raise HTTPException(
            status_code=401,
            detail=
                "Invalid email or password"
        )


    return result


# -------------------------
# Google Login / Signup
# -------------------------

@router.post(
    "/google",
    response_model=Token
)
def google_login(
    credential: str=Body(...),
    db: Session = Depends(get_db)
):

    result = login_with_google(
        db,
        credential
    )


    if result is None:

        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=
                "Invalid Google authentication"
        )


    return result