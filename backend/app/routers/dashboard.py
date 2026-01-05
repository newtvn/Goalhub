from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, desc
from typing import List, Dict, Any
from app.database import get_db
from app.models import Booking, User
from app.dependencies.auth import get_current_user

router = APIRouter(prefix="/api/dashboard", tags=["dashboard"])

@router.get("/stats")
async def get_dashboard_stats(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    # Only Admin or Manager should access this
    if current_user.role not in ["admin", "manager"]:
        raise HTTPException(status_code=403, detail="Not authorized to view dashboard stats")
        
    # 1. Total Revenue (Sum of confirmed bookings)
    revenue_query = select(func.sum(Booking.amount)).where(Booking.status == 'confirmed')
    revenue_result = await db.execute(revenue_query)
    total_revenue = revenue_result.scalar() or 0

    # 2. Total Bookings
    bookings_query = select(func.count(Booking.id)).where(Booking.status == 'confirmed')
    bookings_result = await db.execute(bookings_query)
    total_bookings = bookings_result.scalar() or 0

    # 3. Total Users
    users_query = select(func.count(User.id))
    users_result = await db.execute(users_query)
    total_users = users_result.scalar() or 0
    
    # 4. Recent Bookings (Last 5)
    recent_bookings_query = select(Booking).order_by(desc(Booking.created_at)).limit(5)
    recent_bookings_result = await db.execute(recent_bookings_query)
    recent_bookings = recent_bookings_result.scalars().all()

    return {
        "revenue": total_revenue,
        "bookings": total_bookings,
        "users": total_users,
        "recent_activity": recent_bookings
    }
@router.get("/chart-data")
async def get_dashboard_chart_data(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    if current_user.role not in ["admin", "manager"]:
        raise HTTPException(status_code=403, detail="Not authorized")

    # Get last 7 days metrics
    from datetime import datetime, timedelta
    today = datetime.utcnow().date()
    start_date = today - timedelta(days=6)
    
    # Query: Group by date, sum amount
    query = select(
        func.date(Booking.created_at).label('date'),
        func.sum(Booking.amount).label('revenue'),
        func.count(Booking.id).label('count')
    ).where(
        Booking.status == 'confirmed',
        func.date(Booking.created_at) >= start_date
    ).group_by(
        func.date(Booking.created_at)
    ).order_by(
        func.date(Booking.created_at)
    )
    
    result = await db.execute(query)
    rows = result.all()
    
    # Fill missing days with 0
    data_map = {row.date: {"revenue": row.revenue, "count": row.count} for row in rows}
    chart_data = []
    
    for i in range(7):
        date = start_date + timedelta(days=i)
        val = data_map.get(date, {"revenue": 0, "count": 0})
        chart_data.append({
            "date": date.strftime("%a"), # Mon, Tue, etc.
            "full_date": date.strftime("%Y-%m-%d"),
            "revenue": val["revenue"] or 0,
            "bookings": val["count"] or 0
        })
        
    return chart_data
