from fastapi import APIRouter
from pydantic import BaseModel
from app.services.github_service import fetch_repo_data
from app.services.repo_analyzer import analyze_repo

router = APIRouter()

class RepoRequest(BaseModel):
    repo_url: str


@router.post("/analyze")
async def analyze(repo: RepoRequest):
    data = await fetch_repo_data(repo.repo_url)

    if not data:
        return {"error": "Failed to fetch repo"}

    summary = await analyze_repo(data)

    return {
        "summary": summary
    }