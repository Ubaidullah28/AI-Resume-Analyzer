from dotenv import load_dotenv
import os

load_dotenv()

SECRET_KEY = os.getenv("SECRET_KEY")

DATABASE_URL = os.getenv("DATABASE_URL")

ALGORITHM = "HS256"

ACCESS_TOKEN_EXPIRE_MINUTES = 60


GROQ_API_KEY = os.getenv("GROQ_API_KEY")

GROQ_MODEL = os.getenv(
    "GROQ_MODEL",
    "openai/gpt-oss-20b"
)


if not DATABASE_URL:
    raise RuntimeError(
        "DATABASE_URL is not configured. Please set it in .env file"
    )

if not SECRET_KEY:
    raise RuntimeError(
        "SECRET_KEY is not configured. Please set it in .env file"
    )

if not GROQ_API_KEY:
    raise RuntimeError(
        "GROQ_API_KEY is not configured"
    )