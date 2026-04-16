import requests

res = requests.post(
    "http://127.0.0.1:11434/api/generate",
    json={
        "model": "tinyllama",
        "prompt": "Hello"
    }
)

print(res.status_code)
print(res.text)