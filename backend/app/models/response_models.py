from pydantic import BaseModel, Field
from typing import List, Optional

class TurnEvaluation(BaseModel):
    clarity_score: int = Field(ge=0, le=100)
    correctness_score: int = Field(ge=0, le=100)
    technical_depth_score: int = Field(ge=0, le=100)
    feedback: str

class DecisionResult(BaseModel):
    action: str = Field(..., description="Either 'drill_down', 'pivot', or 'conclude'")
    reasoning: str

class NextTurn(BaseModel):
    question: str
    expected_key_points: List[str]
