# import httpx

# OLLAMA_URL = "http://localhost:11434/api/generate"
# DEFAULT_MODEL = "tinyllama"


# async def generate_response(
#     prompt: str,
#     system_prompt: str = "",
#     json_mode: bool = False
# ) -> str:
#     """
#     Calls local Ollama (LLaMA3) with improved reliability + control.
#     """

#     full_prompt = f"""
# You are an AI interviewer.

# {system_prompt}

# User Input:
# {prompt}

# Respond clearly and professionally.
# """

#     payload = {
#         "model": DEFAULT_MODEL,
#         "prompt": full_prompt,
#         "stream": False,
#         "options": {
#             "temperature": 0.3,   # 🔥 more deterministic (important)
#             "top_p": 0.9
#         }
#     }

#     if json_mode:
#         payload["format"] = "json"

#     try:
#         async with httpx.AsyncClient(timeout=30.0) as client:
#             response = await client.post(OLLAMA_URL, json=payload)

#             response.raise_for_status()
#             data = response.json()

#             result = data.get("response", "").strip()

#             # ✅ Handle empty response
#             if not result:
#                 return "AI returned an empty response."

#             return result

#     except httpx.RequestError as exc:
#         print("❌ Ollama connection error:", exc)
#         return "LLM connection failed."

#     except httpx.HTTPStatusError as exc:
#         print("❌ Ollama HTTP error:", exc.response.text)
#         return "LLM API error."

#     except Exception as e:
#         print("❌ Unexpected LLM error:", e)
#         return "Internal AI error."

# import httpx

# OLLAMA_URL = "http://127.0.0.1:11434/api/generate"
# DEFAULT_MODEL = "tinyllama"

# async def generate_response(prompt: str) -> str:
#     try:
#         async with httpx.AsyncClient(timeout=60.0) as client:
#             response = await client.post(
#                 OLLAMA_URL,
#                 json={
#                     "model": DEFAULT_MODEL,
#                     "prompt": prompt,
#                     "stream": False
#                 }
#             )

#             print("STATUS:", response.status_code)

#             data = response.json()
#             print("RESPONSE:", data)

#             return data.get("response", "")

#     except Exception as e:
#         print("ERROR CONNECTING TO OLLAMA:", str(e))
#         return "LLM connection failed."


# import httpx

# OLLAMA_URL = "http://127.0.0.1:11434/api/generate"
# DEFAULT_MODEL = "tinyllama"

# async def generate_response(prompt: str, json_mode: bool = False):
#     try:
#         payload = {
#             "model": DEFAULT_MODEL,
#             "prompt": prompt,
#             "stream": False
#         }

#         if json_mode:
#             payload["format"] = "json"   # 🔥 IMPORTANT

#         async with httpx.AsyncClient(timeout=60.0) as client:
#             response = await client.post(OLLAMA_URL, json=payload)

#             data = response.json()
#             return data.get("response", "")

#     except Exception as e:
#         print("LLM ERROR:", str(e))
#         return "LLM failed"

import httpx

OLLAMA_URL = "http://127.0.0.1:11434/api/generate"
DEFAULT_MODEL = "tinyllama"

async def generate_response(prompt: str, json_mode: bool = False):
    try:
        payload = {
            "model": DEFAULT_MODEL,
            "prompt": prompt,
            "stream": False
        }

        if json_mode:
            payload["format"] = "json"

        print("🚀 Sending request to Ollama...")
        print("MODEL:", DEFAULT_MODEL)

        async with httpx.AsyncClient(timeout=60.0) as client:
            response = await client.post(OLLAMA_URL, json=payload)

        print("✅ RAW RESPONSE STATUS:", response.status_code)
        print("📦 RAW RESPONSE TEXT:", response.text)

        data = response.json()
        return data.get("response", "")

    except Exception as e:
        print("❌ LLM ERROR:", str(e))
        return "LLM failed"