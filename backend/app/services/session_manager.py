import uuid

sessions = {}


def create_session(summary, first_question,difficulty):
    session_id = str(uuid.uuid4())

    sessions[session_id] = {
        "summary": summary,
        "difficulty": difficulty,
        "history": [],
        "weak_areas": [],
        "scores": [],
        "current_question": first_question
    }

    return session_id


def get_session(session_id):
    return sessions.get(session_id)


def update_session(session_id, question, answer, score):
    session = sessions.get(session_id)

    if not session:
        return

    session["history"].append({
        "question": question,
        "answer": answer
    })
    if score.technical_depth_score< 50:
        session["weak_areas"].append("low depth")

    if score.clarity_score< 50:
       session["weak_areas"].append("poor clarity")

    session["scores"].append(score)
    session["current_question"] = None