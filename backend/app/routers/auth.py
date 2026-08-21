from fastapi import APIRouter

from fastapi import Depends
from fastapi import HTTPException

from sqlalchemy.orm import Session

from app.schemas import Token
from app.schemas import UserLogin
from app.schemas import UserRegister
from app.schemas import UserResponse

from app.database import get_db

from app.services.auth_service import login_user, register_user

router = APIRouter(
    tags=["Authentication"]
)

@router.get("/")
def auth_home():
    return {
        "message":"Authentication Router Working"
    }


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
            detail="User with this email already exists"
        )

    return user


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
            detail="Invalid email or password"
        )

    return result