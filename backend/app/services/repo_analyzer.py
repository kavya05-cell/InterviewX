import json
import re
import asyncio
from app.services.llm_service import generate_response


async def analyze_repo(repo_data: dict):

    prompt = f"""
You are a senior software engineer reviewing a GitHub project.

Analyze the repository and return STRICT JSON.

Project Name: {repo_data.get("name")}
Description: {repo_data.get("description")}
Primary Language: {repo_data.get("language")}

Your task:
1. Write a clear 2-3 line summary
2. Identify MULTIPLE technologies (not just language)
3. Give at least 2 strengths
4. Give at least 2 weaknesses

Rules:
- Do NOT be generic
- Do NOT repeat "structured project"
- Be specific and technical
- Always return minimum 2 items in strengths and weaknesses

Return ONLY JSON:

{{
  "project_summary": "...",
  "tech_stack": ["..."],
  "strengths": ["...", "..."],
  "weaknesses": ["...", "..."]
}}
"""

    try:
        response = await asyncio.wait_for(
            generate_response(prompt, json_mode=True),
            timeout=25  # 🔥 increased timeout
        )

        match = re.search(r"\{.*\}", response, re.DOTALL)

        if match:
            parsed = json.loads(match.group())

            # 🔥 SAFETY LAYER (VERY IMPORTANT)
            parsed["tech_stack"] = parsed.get("tech_stack") or [repo_data.get("language")]

            if len(parsed.get("strengths", [])) < 2:
                parsed["strengths"] = [
                    "Implements core functionality effectively",
                    "Clear problem-solving approach"
                ]

            if len(parsed.get("weaknesses", [])) < 2:
                parsed["weaknesses"] = [
                    "Lacks detailed documentation",
                    "Scalability considerations are limited"
                ]

            return parsed

        return fallback(repo_data)

    except:
        return fallback(repo_data)


def fallback(repo_data):
    return {
        "project_summary": repo_data.get("description") or "Project analysis unavailable",
        "tech_stack": [repo_data.get("language")],
        "strengths": [
            "Core functionality implemented",
            "Project structure is understandable"
        ],
        "weaknesses": [
            "Limited documentation",
            "Needs optimization and scalability improvements"
        ]
    }