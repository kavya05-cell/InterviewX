# import requests

import httpx
import traceback
import json
import os
from dotenv import load_dotenv

load_dotenv()

OLLAMA_URL = os.getenv("OLLAMA_URL")
DEFAULT_MODEL = "phi3:mini" 
""

async def generate_response(prompt: str, json_mode: bool = False):
    try:
        payload = {
            "model": DEFAULT_MODEL,
            "prompt": prompt,
            "stream": False
        }

        async with httpx.AsyncClient(timeout=120.0) as client:
            response = await client.post(OLLAMA_URL, json=payload)

        data = response.json()
        result = data.get("response", "").strip()

        # 🔥 HANDLE EMPTY RESPONSE
        if not result:
            return default_response(json_mode)

        if json_mode:
            import json
            try:
                return json.loads(result)
            except:
                return default_response(json_mode)

        return result

    except Exception as e:
        print("❌ LLM ERROR:", e)
        return default_response(json_mode)


def default_response(json_mode):
    if json_mode:
        return {
            "clarity_score": 50,
            "correctness_score": 50,
            "technical_depth_score": 50,
            "feedback": "Average answer. Could be improved."
        }
    return "Can you explain your project architecture?"
