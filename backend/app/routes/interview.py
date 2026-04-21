from fastapi import APIRouter, UploadFile, File, Query
import base64

from app.services.github_service import fetch_repo_data, format_repo_summary
from app.services.interview_engine import generate_first_question, generate_next_question
from app.services.evaluation_engine import evaluate_answer
from app.services.session_manager import create_session, get_session, update_session
from app.services.voice_service import speech_to_text
from app.services.tts_service import text_to_speech

router = APIRouter()
from pydantic import BaseModel

class StartRequest(BaseModel):
    repo_url: str
    difficulty: str   # easy | medium | hard

@router.post("/start")
async def start_interview(data: StartRequest):
    repo_url = data.repo_url
    difficulty = data.difficulty

    if not repo_url:
        return {"error": "repo_url required"}

    repo_data = await fetch_repo_data(repo_url)

    if not repo_data:
        return {"error": "Failed to fetch repo"}

    summary = format_repo_summary(repo_data)

    question = await generate_first_question(summary,difficulty)

    session_id = create_session(summary, question, difficulty)

    return {
        "session_id": session_id,
        "question": question
    }


@router.post("/voice-next")
async def voice_next(
    session_id: str = Query(...),
    file: UploadFile = File(...)
):
    session = get_session(session_id)

    if not session:
        return {"error": "Invalid session_id"}

    # save temp file
    temp_path = f"temp_{file.filename}"
    with open(temp_path, "wb") as f:
        f.write(await file.read())

    # STT
    answer = speech_to_text(temp_path)

    question = session["current_question"]

    score = await evaluate_answer(question, session["summary"], answer)

    update_session(session_id, question, answer, score)

    next_q = await generate_next_question(
        session["summary"],
        session["history"],
        session["weak_areas"],
        session["difficulty"]
    )
    if not next_q:
       next_q = "Can you explain your project architecture?"

    session["current_question"] = next_q
    return {
    "answer_text": answer,
    "next_question": next_q,
    "score": score
    }