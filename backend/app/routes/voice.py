from fastapi import APIRouter

router = APIRouter()

@router.get("/")
async def get_voice_health():
    return {"status": "Voice Pipeline Router Online"}
