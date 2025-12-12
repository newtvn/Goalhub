import httpx
import base64
from datetime import datetime
from app.config import settings
from fastapi import HTTPException

async def get_access_token() -> str:
    """Generate M-Pesa Access Token"""
    consumer_key = settings.MPESA_CONSUMER_KEY
    consumer_secret = settings.MPESA_CONSUMER_SECRET
    
    if not consumer_key or not consumer_secret:
        raise HTTPException(status_code=500, detail="M-Pesa credentials not configured")
        
    api_url = "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials"
    if settings.MPESA_ENV == "production":
        api_url = "https://api.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials"
        
    auth_string = f"{consumer_key}:{consumer_secret}"
    encoded_auth = base64.b64encode(auth_string.encode()).decode()
    
    headers = {"Authorization": f"Basic {encoded_auth}"}
    
    async with httpx.AsyncClient() as client:
        try:
            response = await client.get(api_url, headers=headers)
            response.raise_for_status()
            return response.json()["access_token"]
        except httpx.HTTPError as e:
            print(f"M-Pesa Token Error: {e}")
            raise HTTPException(status_code=502, detail="Failed to authenticate with M-Pesa")

async def initiate_stk_push(phone: str, amount: int) -> dict:
    """Initiate STK Push"""
    access_token = await get_access_token()
    
    timestamp = datetime.now().strftime("%Y%m%d%H%M%S")
    password_str = f"{settings.MPESA_SHORTCODE}{settings.MPESA_PASSKEY}{timestamp}"
    password = base64.b64encode(password_str.encode()).decode()
    
    # Format phone number (Ensure 254...)
    formatted_phone = phone.replace("+", "").replace(" ", "")
    if formatted_phone.startswith("0"):
        formatted_phone = "254" + formatted_phone[1:]
    
    payload = {
        "BusinessShortCode": settings.MPESA_SHORTCODE,
        "Password": password,
        "Timestamp": timestamp,
        "TransactionType": "CustomerPayBillOnline",
        "Amount": amount,
        "PartyA": formatted_phone,
        "PartyB": settings.MPESA_SHORTCODE,
        "PhoneNumber": formatted_phone,
        "CallBackURL": f"http://localhost:{settings.PORT}/api/callback", # TODO: Update for production
        "AccountReference": "GoalHub",
        "TransactionDesc": "Turf Booking"
    }
    
    api_url = "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest"
    if settings.MPESA_ENV == "production":
        api_url = "https://api.safaricom.co.ke/mpesa/stkpush/v1/processrequest"
        
    headers = {"Authorization": f"Bearer {access_token}"}
    
    async with httpx.AsyncClient() as client:
        try:
            response = await client.post(api_url, json=payload, headers=headers)
            response_data = response.json()
            
            # Log response (in a real app use a logger)
            print(f"STK Push Response: {response_data}")
            
            return response_data
        except httpx.HTTPError as e:
            print(f"STK Push Error: {e}")
            raise HTTPException(status_code=502, detail="Failed to initiate STK Push")
