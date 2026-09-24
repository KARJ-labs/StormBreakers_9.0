"""
<<<<<<< Updated upstream
GET /health
=======
GET /rag
>>>>>>> Stashed changes
"""

from __future__ import annotations

from fastapi import APIRouter

router = APIRouter()


<<<<<<< Updated upstream
@router.get("/health")
=======
@router.get("/rag")
>>>>>>> Stashed changes
def health_check() -> dict:
    return {"status": "ok", "service": "rag-fastapi"}
