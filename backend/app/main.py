from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import interview, github, voice, evaluation

app = FastAPI(title="InterviewX API", description="Backend for the AI Mock Interview SaaS")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"status": "InterviewX Engine is running."}

# Include routers here
app.include_router(interview.router, prefix="/api/interview", tags=["Interview"])
app.include_router(github.router, prefix="/api/github", tags=["GitHub"])
app.include_router(voice.router, prefix="/api/voice", tags=["Voice Pipeline"])
app.include_router(evaluation.router, prefix="/api/evaluation", tags=["Evaluation"])
