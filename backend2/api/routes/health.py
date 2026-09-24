"""
GET /rag
"""

from __future__ import annotations

from fastapi import APIRouter

router = APIRouter()


@router.get("/rag")
def health_check() -> dict:
    return {"status": "ok", "service": "rag-fastapi"}
