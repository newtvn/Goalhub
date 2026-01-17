from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks, Request
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.database import get_db
from app.models import Payment, Booking
from app.schemas import STKPushRequest, STKPushResponse, PaymentStatusResponse
from app.services.mpesa import initiate_stk_push
from app.utils.logger import log_payment_event
from datetime import datetime

router = APIRouter(prefix="/api", tags=["payments"])

@router.post("/stkpush", response_model=STKPushResponse)
async def trigger_stk_push(
    request: STKPushRequest,
    db: AsyncSession = Depends(get_db)
):
    # Log STK Push initiation
    log_payment_event("STK_PUSH_INITIATED", {"phone": request.phone, "amount": request.amount})

    # Initiate STK Push via Safaricom
    try:
        response = await initiate_stk_push(request.phone, request.amount)
    except Exception as e:
        log_payment_event("STK_PUSH_FAILED", {"phone": request.phone, "error": str(e)})
        raise HTTPException(status_code=500, detail=str(e))

    # Track payment in DB
    if response.get("ResponseCode") == "0":
        new_payment = Payment(
            checkout_request_id=response["CheckoutRequestID"],
            phone=request.phone,
            amount=request.amount,
            status="pending"
        )
        db.add(new_payment)
        await db.commit()
        log_payment_event("PAYMENT_TRACKED", {"checkout_request_id": response["CheckoutRequestID"], "status": "pending"})

    return response

@router.post("/callback")
async def mpesa_callback(request: Request, db: AsyncSession = Depends(get_db)):
    """Handle M-Pesa Callback"""
    data = await request.json()

    if not data.get("Body") or not data["Body"].get("stkCallback"):
        log_payment_event("INVALID_CALLBACK", {"data": data})
        return {"ResultCode": 0, "ResultDesc": "Invalid Callback"}

    callback = data["Body"]["stkCallback"]
    checkout_request_id = callback["CheckoutRequestID"]
    result_code = callback["ResultCode"]
    result_desc = callback["ResultDesc"]

    log_payment_event("CALLBACK_RECEIVED", {"checkout_request_id": checkout_request_id, "result_code": result_code})

    # Find payment
    result = await db.execute(select(Payment).where(Payment.checkout_request_id == checkout_request_id))
    payment = result.scalars().first()

    if payment:
        payment.callback_metadata = callback
        if result_code == 0:
            payment.status = "completed"
            payment.completed_at = datetime.utcnow()
            payment.reference = next((item["Value"] for item in callback["CallbackMetadata"]["Item"] if item["Name"] == "MpesaReceiptNumber"), None)
            log_payment_event("PAYMENT_COMPLETED", {"checkout_request_id": checkout_request_id, "reference": payment.reference})
        else:
            payment.status = "failed"
            payment.failure_reason = result_desc
            log_payment_event("PAYMENT_FAILED", {"checkout_request_id": checkout_request_id, "reason": result_desc})

        await db.commit()

    return {"ResultCode": 0, "ResultDesc": "Callback Received"}

@router.get("/payment-status/{checkout_request_id}", response_model=PaymentStatusResponse)
async def check_payment_status(
    checkout_request_id: str, 
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(select(Payment).where(Payment.checkout_request_id == checkout_request_id))
    payment = result.scalars().first()
    
    if not payment:
        raise HTTPException(status_code=404, detail="Payment not found")
        
    return {
        "status": payment.status,
        "amount": payment.amount,
        "phone": payment.phone
    }
