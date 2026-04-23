from app.services.llm_service import generate_response


async def generate_first_question(summary,difficulty):
    try:
        prompt = f"""
Ask ONE {difficulty} level technical interview question.

Rules:
- Only question
- No explanation
- Max 15 words

Project:
{summary}
"""
        print("PROMPT:", prompt)

        res = await generate_response(prompt)
        print("LLM RESPONSE:", res)
        if not res:
           return "What problem does your project solve?"
# Clean garbage
        question = res.strip().replace("Question:", "").strip()

        if len(question) > 200:
           question = question[:200]

        return question

    except Exception as e:
        print("❌ LLM ERROR:", str(e))
        return f"LLM ERROR: {str(e)}"


async def generate_next_question(summary, history, weak_areas, difficulty):
    prompt = f"""
Generate ONE {difficulty} level question.

Focus:
- Weak Areas: {weak_areas}
- Previous Questions: {history}

Rules:
- Only question
- No explanation

Project:
{summary}
"""

    res = await generate_response(prompt)

    print("NEXT Q RAW:", res)

    # 🔥 FIX
    if not res or res == "LLM failed":
        return "Can you explain your project architecture?"

    return res.strip()
    