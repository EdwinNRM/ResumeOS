from fastapi import APIRouter, HTTPException
from ..models.resume_pydantic_model import ResumeRequest

router = APIRouter()

@router.post("/analyze")
async def analyze_resume(resume: ResumeRequest):
    # Re-implement TS logic or share logic if using something like PyO3 (out of scope)
    # For now, duplicate simple checks for backend validation
    
    score = 100
    feedback = []
    
    blocks = resume.blocks
    block_types = [b.type for b in blocks]
    
    # Check structure
    required_sections = ["experience", "education", "skills"]
    if all(s in block_types for s in required_sections):
        feedback.append("PASS: Good structure detected")
    else:
        score -= 10
        feedback.append("WARN: Missing core sections (Experience, Education, or Skills)")

    # Check content length (simplified)
    # ... more complex backend analysis could go here (keyword matching, etc.)
    
    return {
        "score": max(0, score),
        "feedback": feedback
    }
