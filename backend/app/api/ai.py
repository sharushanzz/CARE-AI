from fastapi import APIRouter
from pydantic import BaseModel
from app.services.ai import explain_report

router = APIRouter()


class ExplainRequest(BaseModel):
    text: str | None = None


@router.post("/explain")
def explain(req: ExplainRequest):
    return explain_report(req.text or "")
