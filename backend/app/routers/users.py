from fastapi import APIRouter, Depends

from app.schemas import UserResponse
from app.services.user_service import get_current_user

router = APIRouter(
    tags=["Users"]
)


@router.get("/me", response_model=UserResponse)
def me(current_user = Depends(get_current_user)):
    return current_user
