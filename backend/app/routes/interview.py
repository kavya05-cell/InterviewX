from fastapi import APIRouter, WebSocket, WebSocketDisconnect
import asyncio
from pydantic import BaseModel

from app.services.session_manager import (
    create_session,
    append_to_transcript,
    get_session
)
from app.services.github_service import fetch_repo_data
from app.services.interview_engine import process_turn

router = APIRouter()

class StartRequest(BaseModel):
    repo_url: str


@router.post("/start")
async def start_interview(req: StartRequest):
    """
    Initializes interview session using repo context
    """
    repo_context = await fetch_repo_data(req.repo_url)
    session_id = create_session(repo_context)

    first_question = "Tell me about your project."

    append_to_transcript(session_id, "ai", first_question)

    return {
        "session_id": session_id,
        "first_question": first_question
    }


class AnswerRequest(BaseModel):
    session_id: str
    answer: str


@router.post("/answer")
async def answer_question(req: AnswerRequest):
    """
    Handles user answer and returns next AI response
    """
    result = await process_turn(req.session_id, req.answer)
    return result


@router.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()

    print("✅ WebSocket connected")

    # 1. Receive repo URL from frontend
    config = await websocket.receive_json()
    repo_url = config.get("repoUrl")

    print("📦 Repo:", repo_url)

    # 2. Fetch GitHub context
    repo_context = await fetch_repo_data(repo_url)

    # 3. Send first question
    await websocket.send_json({
        "response": "Tell me about your project."
    })

    # 4. Interview loop
    while True:
        user_answer = await websocket.receive_text()

        print("🧑 User:", user_answer)

        result = await process_turn(user_answer, repo_context)

        print("🤖 AI:", result)

        await websocket.send_json(result)
