import uuid
from typing import Dict, List, Any

# Simple In-Memory Store
sessions: Dict[str, Dict[str, Any]] = {}

def create_session(repo_context: str) -> str:
    session_id = str(uuid.uuid4())
    sessions[session_id] = {
        "repo_context": repo_context,
        "transcript": [],
        "overall_evaluation": {}
    }
    return session_id

def append_to_transcript(session_id: str, role: str, content: str, metadata: dict = None):
    if session_id in sessions:
        entry = {"role": role, "content": content}
        if metadata:
            entry["metadata"] = metadata
        sessions[session_id]["transcript"].append(entry)

def get_session(session_id: str) -> Dict[str, Any]:
    return sessions.get(session_id, {})
