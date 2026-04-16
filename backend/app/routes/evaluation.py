from fastapi import APIRouter

router = APIRouter()

@router.get("/")
async def get_eval_health():
    return {"status": "Evaluation Router Online"}
