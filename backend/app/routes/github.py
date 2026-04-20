from fastapi import APIRouter
from pydantic import BaseModel
import asyncio

from app.services.github_service import fetch_repo_data, build_response
from app.services.repo_analyzer import analyze_repo

router = APIRouter()

class RepoRequest(BaseModel):
    repo_url: str

AI_RESULTS = {}

# 🔥 ANALYZE (FAST RESPONSE)
# 
@router.post("/analyze")
async def analyze_repo_route(data: RepoRequest):
    repo_data = await fetch_repo_data(data.repo_url)

    if not repo_data:
        return {"error": "Repo not found"}

    try:
        ai_result = await asyncio.wait_for(
            analyze_repo(repo_data),
            timeout=30
        )
    except:
        ai_result = None

    # ✅ ALWAYS return stable response
    return build_response(repo_data, ai_result)
# async def run_ai(repo_url, repo_data):
#     print("STEP 3: AI started")

#     result = await analyze_repo(repo_data)

#     AI_RESULTS[repo_url] = result

#     print("STEP 4: AI finished")
async def run_ai(repo_url, repo_data):
    try:
        result = await asyncio.wait_for(analyze_repo(repo_data), timeout=8)

        AI_RESULTS[repo_url] = build_response(repo_data, result)

    except:
        AI_RESULTS[repo_url] = build_response(repo_data)

@router.get("/result")
async def get_result(repo_url: str):
    return AI_RESULTS.get(repo_url, {"status": "processing"})