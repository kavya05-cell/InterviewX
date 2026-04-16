# import httpx
# import re
# import os
# import asyncio
# import base64
# from typing import List, Dict, Optional

# # Assuming this script is run from the `backend/` directory or higher context
# from app.services.llm_service import generate_response

# class RepositoryAnalyzer:
#     def __init__(self):
#         # Allow users to set GITHUB_TOKEN to bypass rate limits (60/hr -> 5000/hr)
#         self.github_token = os.getenv("GITHUB_TOKEN")
#         self.headers = {"Accept": "application/vnd.github.v3+json", "User-Agent": "Mock-Interview-Analyzer"}
#         if self.github_token:
#             self.headers["Authorization"] = f"Bearer {self.github_token}"
            
#         # Manifests that tell us about the tech stack
#         self.target_files = [
#             "package.json", "requirements.txt", "pyproject.toml", 
#             "go.mod", "pom.xml", "build.gradle", "docker-compose.yml"
#         ]

#     def _extract_owner_repo(self, repo_url: str) -> tuple[Optional[str], Optional[str]]:
#         match = re.search(r"github\.com/([^/]+)/([^/]+)", repo_url)
#         if not match:
#             return None, None
#         owner, repo = match.groups()
#         return owner, repo.replace(".git", "")

#     async def _fetch_tree(self, client: httpx.AsyncClient, owner: str, repo: str) -> List[str]:
#         """Fetches the repository's file tree to understand its structure."""
#         url = f"https://api.github.com/repos/{owner}/{repo}/git/trees/main?recursive=1"
#         response = await client.get(url, headers=self.headers)
        
#         # Fallback to master if main doesn't exist
#         if response.status_code == 404:
#             url = f"https://api.github.com/repos/{owner}/{repo}/git/trees/master?recursive=1"
#             response = await client.get(url, headers=self.headers)
            
#         if response.status_code == 200:
#             tree = response.json().get("tree", [])
#             # Return top paths or important structural paths (limit to 200 to prevent payload bloat)
#             paths = [item["path"] for item in tree if item["type"] == "tree" or item["path"].split("/")[-1] in self.target_files]
#             return paths[:200]
#         return []

#     async def _fetch_file_content(self, client: httpx.AsyncClient, owner: str, repo: str, filepath: str) -> str:
#         """Fetches the raw content of a specific file."""
#         url = f"https://api.github.com/repos/{owner}/{repo}/contents/{filepath}"
#         response = await client.get(url, headers=self.headers)
#         if response.status_code == 200:
#             content = response.json().get("content", "")
#             if content:
#                 # GitHub content is base64 encoded
#                 decoded = base64.b64decode(content).decode('utf-8', errors='ignore')
#                 # Truncate content to avoid crazy long package-lock.jsons if accidentally matched
#                 return decoded[:3000]
#         return ""

#     async def analyze(self, repo_url: str) -> str:
#         """
#         Full orchestration: fetches tree, extracts dependencies, leverages LLM for formatting.
#         """
#         owner, repo = self._extract_owner_repo(repo_url)
#         if not owner or not repo:
#             return "Invalid GitHub URL."
            
#         repo_data = {"owner": owner, "repo": repo, "structure": [], "manifests": {}}

#         async with httpx.AsyncClient(timeout=15.0) as client:
#             print(f"Fetching tree for {owner}/{repo}...")
#             paths = await self._fetch_tree(client, owner, repo)
#             repo_data["structure"] = paths

#             print("Hunting for key dependencies and configuration files...")
#             fetch_tasks = []
#             for path in paths:
#                 filename = path.split("/")[-1]
#                 if filename in self.target_files:
#                     fetch_tasks.append((path, self._fetch_file_content(client, owner, repo, path)))

#             results = await asyncio.gather(*(t[1] for t in fetch_tasks), return_exceptions=True)
            
#             for (path, _), content in zip(fetch_tasks, results):
#                 if isinstance(content, str) and content.strip():
#                     repo_data["manifests"][path] = content
                    
#             # Also quickly fetch the repo description and languages as supplementary
#             try:
#                 meta_res = await client.get(f"https://api.github.com/repos/{owner}/{repo}", headers=self.headers)
#                 if meta_res.status_code == 200:
#                     data = meta_res.json()
#                     repo_data["description"] = data.get("description", "")
#                     repo_data["topics"] = data.get("topics", [])
#             except:
#                 pass


#         print("Sending raw architecture to LLM to build a localized Tech Stack Profile...")
        
#         # Prepare context payload for LLM
#         context_payload = f"Repo: {owner}/{repo}\nDescription: {repo_data.get('description')}\nTopics: {', '.join(repo_data.get('topics', []))}\n\n"
#         context_payload += "Structure sample:\n" + "\n".join(repo_data["structure"][:50]) + "\n\n"
        
#         for k, v in repo_data["manifests"].items():
#             context_payload += f"--- File: {k} ---\n{v}\n\n"
            
#         system_prompt = (
#             "You are a Technical Architecture Expert. The user will provide raw file structures and manifest files from a GitHub repository. "
#             "Your job is to read them and output a concise, human-readable 'Technology Stack Profile'. "
#             "Identify the primary languages, frontend/backend frameworks, database drivers, and major libraries used. "
#             "Do not output code, just a comprehensive bulleted summary of the architecture to be used natively as context for an AI Interviewer."
#         )
        
#         profile = await generate_response(prompt=context_payload, system_prompt=system_prompt)
#         return profile


# # Standalone runner for testing locally
# if __name__ == "__main__":
#     async def test():
#         analyzer = RepositoryAnalyzer()
#         url = "https://github.com/tiangolo/fastapi"
#         print(f"Testing Repo Analyzer against {url}...")
#         result = await analyzer.analyze(url)
#         print("\n=== FINAL TECH STACK PROFILE ===\n")
#         print(result)
        
#     asyncio.run(test())

# import httpx
# import re
# import os
# import asyncio
# import base64
# from typing import List, Dict, Optional
# from app.services.llm_service import generate_response

# async def analyze_repo(repo_data: dict):
#     """
#     Convert raw repo data → structured summary using LLM
#     """

#     prompt = f"""
# Analyze this GitHub repository: \n{repo_data}
# Generate a concise, human-readable 'Technology Stack Profile' that would be used natively as context for an AI Interviewer.
# Return ONLY valid JSON in this format:

# {{
#   "project_summary": "...",
#   "tech_stack": ["..."],
#   "strengths": ["..."],
#   "weaknesses": ["..."],
#   "interview_questions": ["..."]
# }}

# Do not add any explanation.
# Do not add text outside JSON.
# """

#     summary = await generate_response(prompt, json_mode=True)
#     return summary

import json
import re
from app.services.llm_service import generate_response

async def analyze_repo(repo_data: dict):

    prompt = f"""
Analyze this GitHub repository: \n{repo_data}

Return ONLY valid JSON in this format:

{{
  "project_summary": "...",
  "tech_stack": ["..."],
  "strengths": ["..."],
  "weaknesses": ["..."],
  "interview_questions": ["..."]
}}

Do not add any explanation.
Do not add text outside JSON.
"""

    response = await generate_response(prompt, json_mode=True)

    try:
        # 🔥 extract JSON safely
        json_match = re.search(r"\{.*\}", response, re.DOTALL)

        if json_match:
            parsed = json.loads(json_match.group())
            return parsed
        else:
            return {"error": "No JSON found", "raw": response}

    except Exception as e:
        return {
            "error": "JSON parsing failed",
            "details": str(e),
            "raw": response
        }