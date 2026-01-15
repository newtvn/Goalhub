import asyncio
from app.database import AsyncSessionLocal
from app.models import Turf

async def seed_turfs():
    async with AsyncSessionLocal() as session:
        # Check if turfs already exist
        from sqlalchemy import select
        result = await session.execute(select(Turf))
        existing = result.scalars().all()
        
        if len(existing) > 0:
            print(f"✅ Database already has {len(existing)} turfs. Skipping seed.")
            return
            
        turfs = [
            Turf(
                name="Allianz Arena",
                location="Kitengela, Namanga Rd",
                type="5-a-side",
                price=2500,
                image="https://images.unsplash.com/photo-1556056504-5c7696c4c28d?auto=format&fit=crop&q=80&w=800",
                description="Professional 5-a-side turf with floodlights"
            ),
            Turf(
                name="Camp Nou",
                location="Kitengela, CBD",
                type="7-a-side",
                price=3500,
                image="https://images.unsplash.com/photo-1529900748604-07564a03e7a6?auto=format&fit=crop&q=80&w=800",
                description="Premium 7-a-side turf with changing rooms"
            )
        ]
        
        for turf in turfs:
            session.add(turf)
            
        await session.commit()
        print(f"✅ Seeded {len(turfs)} turfs successfully!")

if __name__ == "__main__":
    asyncio.run(seed_turfs())
