from app.services.session_manager import get_session, append_to_transcript
from app.services.evaluation_engine import evaluate_answer
from app.services.decision_engine import determine_next_step
from app.services.llm_service import generate_response
import json

async def process_turn(session_id: str, user_answer: str) -> dict:
    """
    The orchestrator. Takes the raw answer, pipes it through eval, decision, and generation.
    Returns the final AI response to speak back to the user.
    """
    session = get_session(session_id)
    if not session:
        return {"error": "Invalid session"}
    
    # 1. Figure out what question the user just answered
    transcript = session.get("transcript", [])
    last_question = "Explain your project."
    for entry in reversed(transcript):
         if entry["role"] == "ai":
             last_question = entry["content"]
             break
             
    # 2. Evaluate the Answer
    eval_metrics = await evaluate_answer(
         question=last_question, 
         context=session.get("repo_context", ""), 
         user_answer=user_answer
    )
    
    # We append user's response AND its evaluation immediately as metadata
    append_to_transcript(session_id, "user", user_answer, metadata=eval_metrics.model_dump())
    
    # 3. Decision 
    turn_number = len([t for t in transcript if t["role"] == "user"])
    decision = await determine_next_step(eval_metrics, turn_number)
    
    if decision.action == "conclude":
         response_text = "Thank you, that is all the questions I have for today. We will review your evaluation and get back to you."
         append_to_transcript(session_id, "ai", response_text)
         return {"response": response_text, "action": "conclude"}
         
    # 4. Generate next question via LLM
    sys_prompt = "You are a technical interviewer reacting to a candidate's answer."
    prompt = (
        f"Context: {session.get('repo_context', '')}\n\n"
        f"Past Question: {last_question}\n"
        f"Candidate Answer: {user_answer}\n"
        f"Evaluation Feedback: {eval_metrics.feedback}\n\n"
        f"Your instruction based on the evaluation: {decision.reasoning}\n\n"
        "Generate your next verbal response or question."
    )
    
    next_question = await generate_response(prompt, system_prompt=sys_prompt)
    
    # 5. Session update
    append_to_transcript(session_id, "ai", next_question)
    
    return {
        "response": next_question,
        "action": decision.action,
        "metrics": eval_metrics.model_dump()
    }
