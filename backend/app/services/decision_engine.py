import json
from app.services.llm_service import generate_response
from app.models.response_models import DecisionResult, TurnEvaluation

async def determine_next_step(evaluation: TurnEvaluation, turn_number: int) -> DecisionResult:
    """
    Decides the pedagogical next step for the interview logic.
    For simplicity we use raw threshold metrics, but it can be piped to an LLM for complex rules.
    """
    if turn_number >= 5:
        return DecisionResult(action="conclude", reasoning="Reached maximum interview turn length.")
        
    avg_score = (evaluation.clarity_score + evaluation.correctness_score + evaluation.technical_depth_score) / 3
    
    if avg_score < 60:
        return DecisionResult(
            action="drill_down", 
            reasoning="The candidate struggled with correctness or depth. Ask a clarifying or simpler fundamental question on the same topic."
        )
    else:
        return DecisionResult(
            action="pivot", 
            reasoning="The candidate answered well. Move on to a new challenging topic related to the repository."
        )
