import json
from app.services.llm_service import generate_response
from app.models.response_models import TurnEvaluation


async def evaluate_answer(question: str, context: str, answer: str) -> TurnEvaluation:

    prompt = f"""
Evaluate the answer.

Return ONLY JSON:
{{
"clarity_score": number,
"correctness_score": number,
"technical_depth_score": number,
"feedback": "short feedback"
}}

Context:
{context}

Question:
{question}

Answer:
{answer}
"""

    res = await generate_response(prompt, json_mode=True)

    try:
        if isinstance(res, str):
            res = json.loads(res)

        return TurnEvaluation(
            clarity_score=res.get("clarity_score", 0),
            correctness_score=res.get("correctness_score", 0),
            technical_depth_score=res.get("technical_depth_score", 0),
            feedback=res.get("feedback", "")
        )

    except Exception as e:
        return TurnEvaluation(
            clarity_score=0,
            correctness_score=0,
            technical_depth_score=0,
            feedback=f"Parsing error: {str(e)} | Raw: {res}"
        )