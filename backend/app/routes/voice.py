# from fastapi import APIRouter

# router = APIRouter()

# @router.get("/")
# async def get_voice_health():
#     return {"status": "Voice Pipeline Router Online"}

from fastapi import APIRouter, UploadFile, File
import os
from app.services.voice_service import speech_to_text

router = APIRouter()

@router.post("/stt")
async def speech_to_text_api(file: UploadFile = File(...)):
    file_path = f"temp_{file.filename}"

    with open(file_path, "wb") as f:
        f.write(await file.read())

    text = speech_to_text(file_path)

    os.remove(file_path)

    return {"text": text}
