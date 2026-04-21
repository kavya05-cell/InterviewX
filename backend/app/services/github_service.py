import httpx
import base64

GITHUB_API = "https://api.github.com/repos"


async def fetch_repo_data(repo_url: str):
    try:
        parts = repo_url.rstrip("/").split("/")
        owner = parts[-2]
        repo = parts[-1]

        async with httpx.AsyncClient() as client:
            repo_res = await client.get(f"{GITHUB_API}/{owner}/{repo}")
            readme_res = await client.get(f"{GITHUB_API}/{owner}/{repo}/readme")
            files_res = await client.get(f"{GITHUB_API}/{owner}/{repo}/contents")

        if repo_res.status_code != 200:
            return None

        repo_data = repo_res.json()

        readme_text = ""
        if readme_res.status_code == 200:
            readme_json = readme_res.json()
            readme_text = base64.b64decode(readme_json["content"]).decode("utf-8")

        files = []
        if files_res.status_code == 200:
            files = [f["name"] for f in files_res.json()]

        return {
            "name": repo_data.get("name"),
            "description": repo_data.get("description"),
            "language": repo_data.get("language"),
            "stars": repo_data.get("stargazers_count"),
            "readme": readme_text[:2000],
            "files": files[:30]
        }

    except Exception as e:
        print("GitHub fetch error:", e)
        return None


def format_repo_summary(data):
    return f"""
Project: {data.get("name")}

Description:
{data.get("description")}

Tech: {data.get("language")}
"""