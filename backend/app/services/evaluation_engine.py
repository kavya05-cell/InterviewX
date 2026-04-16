import json
from app.services.llm_service import generate_response
from app.models.response_models import TurnEvaluation

async def evaluate_answer(question: str, context: str, user_answer: str) -> TurnEvaluation:
    """
    Evaluates a specific turn of dialogue.
    """
    system_prompt = (
        "You are an expert technical interviewer evaluator. You will be provided with the "
        "candidate's answer to a specific technical question based on a repository context.\n"
        "You MUST respond ONLY with a strict JSON object mapping to:\n"
        "{\n"
        "  \"clarity_score\": (0-100),\n"
        "  \"correctness_score\": (0-100),\n"
        "  \"technical_depth_score\": (0-100),\n"
        "  \"feedback\": \"A short 1-sentence specific analysis of their answer.\"\n"
        "}"
    )
    
    prompt = f"Context: {context}\nQuestion Asked: {question}\nCandidate Answer: {user_answer}\nEvaluate the answer."
    
    raw_response = await generate_response(prompt, system_prompt=system_prompt, json_mode=True)
    
    try:
        # Some LLMs might wrap JSON in backticks even in JSON mode
        clean_raw = raw_response.strip()
        if clean_raw.startswith("```json"):
             clean_raw = clean_raw[7:-3]
        
        parsed = json.loads(clean_raw)
        return TurnEvaluation(**parsed)
    except Exception as e:
        print(f"Error parsing evaluation json: {e} - Raw: {raw_response}")
        # Return fallback metrics on crash
        return TurnEvaluation(
            clarity_score=50,
            correctness_score=50,
            technical_depth_score=50,
            feedback="Could not confidently evaluate the response depth due to unexpected input."
        )
