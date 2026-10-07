import os
from pathlib import Path
from dotenv import load_dotenv

# Load from project root .env
env_path = Path(__file__).resolve().parent.parent.parent.parent / ".env"
load_dotenv(dotenv_path=env_path)

class Settings:
    PROJECT_NAME: str = "RailBlockAI Intelligence Service"
    VERSION: str = "1.0.0"
    API_V1_STR: str = ""
    
    SUPABASE_URL: str = os.getenv("VITE_SUPABASE_URL", "https://pmvjhnnjftbhnleymzqb.supabase.co")
    SUPABASE_KEY: str = os.getenv("VITE_SUPABASE_ANON_KEY", "")
    SUPABASE_SERVICE_KEY: str = os.getenv("SUPABASE_SERVICE_KEY", os.getenv("VITE_SUPABASE_ANON_KEY", ""))
    
    HOST: str = os.getenv("BACKEND_HOST", "127.0.0.1")
    PORT: int = int(os.getenv("BACKEND_PORT", "8000"))
    
    CORS_ORIGINS: list[str] = [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "*"
    ]

settings = Settings()
