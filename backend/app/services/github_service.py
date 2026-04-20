import httpx
import base64
import asyncio


GITHUB_API = "https://api.github.com/repos"


import httpx

GITHUB_API = "https://api.github.com/repos"

async def fetch_repo_data(repo_url: str):
    try:
        parts = repo_url.rstrip("/").split("/")
        owner = parts[-2]
        repo = parts[-1]

        async with httpx.AsyncClient(timeout=5) as client:
            res = await client.get(f"{GITHUB_API}/{owner}/{repo}")

        if res.status_code != 200:
            return None

        data = res.json()

        return {
            "name": data.get("name"),
            "description": data.get("description"),
            "language": data.get("language"),
            "stars": data.get("stargazers_count"),
        }

    except Exception as e:
        print("GitHub error:", e)
        return None



def basic_analysis(data):
    readme = (data.get("readme") or "").lower()
    files = " ".join(data.get("files", [])).lower()

    techstack = set()

    if "react" in readme or "jsx" in files:
        techstack.add("React")
    if "node" in readme or "package.json" in files:
        techstack.add("Node.js")
    if ".py" in files:
        techstack.add("Python")
    if "flask" in readme:
        techstack.add("Flask")
    if "fastapi" in readme:
        techstack.add("FastAPI")
    if "tensorflow" in readme:
        techstack.add("TensorFlow")
    if "sklearn" in readme:
        techstack.add("Scikit-learn")
    if "pandas" in readme:
        techstack.add("Pandas")

    techstack.add(data.get("language"))

    techstack = list(filter(None, techstack))

    # 👇 FORCE MINIMUM QUALITY
    strengths = [
        "Well-structured repository",
        "Clear problem-focused implementation"
    ]

    weaknesses = [
        "Limited scalability considerations",
        "Documentation can be improved"
    ]

    return {
        "summary": data.get("description") or "Project based on repository",
        "techstack": techstack,
        "strengths": strengths,
        "weaknesses": weaknesses,
    }


    
def build_response(repo_data, ai_result=None):
    if not repo_data:
        return {"error": "Repo not found"}

    # 🔥 AI result available
    if ai_result:
        return {
            "name": repo_data.get("name"),
            "description": repo_data.get("description"),
            "stars": repo_data.get("stars"),
            "summary": ai_result.get("project_summary"),
            "techstack": ai_result.get("tech_stack"),
            "strengths": ai_result.get("strengths"),
            "weaknesses": ai_result.get("weaknesses"),
        }

    # 🔥 fallback
    basic = basic_analysis(repo_data)

    return {
        "name": repo_data.get("name"),
        "description": repo_data.get("description"),
        "stars": repo_data.get("stars"),
        "summary": basic["summary"],
        "techstack": basic["techstack"],
        "strengths": basic["strengths"],
        "weaknesses": basic["weaknesses"],
    }
