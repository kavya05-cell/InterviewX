# import sys
# import os
# import httpx

# # Append the parent directory to sys.path so we can import the Root level repo_analyzer
# parent_dir = os.path.dirname(os.path.dirname(os.path.dirname(__file__)))
# if parent_dir not in sys.path:
#     sys.path.append(parent_dir)

# from app.services.llm_service import generate_response
# from repo_analyzer import RepositoryAnalyzer

# async def fetch_github_repo_context(repo_url: str) -> str:
#     """
#     Given a GitHub URL wrapper function. Now uses the new AI-powered Repository Analyzer 
#     which fetches tree AST and keys manifests to build a complete Stack Profile.
#     """
#     analyzer = RepositoryAnalyzer()
#     print(f"Triggering deep architectural analysis for {repo_url}...")
#     profile = await analyzer.analyze(repo_url)
#     return profile
# async def analyze_repository(repo_url: str) -> str:
#     """
#     Fetches actual GitHub repository details to build rich context for the interview.
#     """
#     repo_context = await fetch_github_repo_context(repo_url)
    
#     prompt = f"Analyze this GitHub repository context and generate 1 tough technical interview question based on the tech stack or description:\n\n{repo_context}"
    
#     return await generate_response(prompt, "You are a senior engineering manager conducting a technical interview. Keep your response exactly to the interview question.")


import httpx

GITHUB_API = "https://api.github.com/repos"

async def fetch_repo_data(repo_url: str):
    """
    Extract owner/repo and fetch GitHub data
    """
    try:
        parts = repo_url.rstrip("/").split("/")
        owner = parts[-2]
        repo = parts[-1]

        async with httpx.AsyncClient() as client:
            repo_res = await client.get(f"{GITHUB_API}/{owner}/{repo}")
            readme_res = await client.get(f"{GITHUB_API}/{owner}/{repo}/readme")

        repo_data = repo_res.json()

        readme_text = ""
        if readme_res.status_code == 200:
            readme_json = readme_res.json()
            import base64
            readme_text = base64.b64decode(readme_json["content"]).decode("utf-8")

        return {
            "name": repo_data.get("name"),
            "description": repo_data.get("description"),
            "language": repo_data.get("language"),
            "stars": repo_data.get("stargazers_count"),
            "readme": readme_text[:3000]  # limit size
        }

    except Exception as e:
        print("GitHub fetch error:", e)
        return None