from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List
from app.database import get_db
from app.models import Turf
from app.schemas import TurfResponse, TurfCreate

router = APIRouter(prefix="/api/turfs", tags=["turfs"])

@router.get("/", response_model=List[TurfResponse])
async def get_turfs(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Turf))
    return result.scalars().all()

@router.post("/", response_model=TurfResponse)
async def create_turf(turf: TurfCreate, db: AsyncSession = Depends(get_db)):
    new_turf = Turf(**turf.model_dump())
    db.add(new_turf)
    await db.commit()
    await db.refresh(new_turf)
    return new_turf
