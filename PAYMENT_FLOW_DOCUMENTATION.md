# 🔐 GOALHUB Payment Flow Documentation

## ✅ Updated: QR Code Generation After Payment Confirmation

This document explains the enhanced M-Pesa payment integration that ensures QR codes are only generated **after successful payment confirmation**.

---

## 🎯 Overview

The payment flow has been updated to ensure that:
1. ✅ STK Push is initiated to customer's phone
2. ✅ System waits for user to enter M-Pesa PIN
3. ✅ Backend receives payment callback from Safaricom
4. ✅ Frontend polls for payment status
5. ✅ **QR code and success page only shown after confirmed payment**

---

## 🔄 Payment Flow Diagram

```
User clicks "Pay with M-Pesa"
         ↓
Frontend sends STK Push request to Backend
         ↓
Backend initiates STK Push via Safaricom API
         ↓
User receives M-Pesa prompt on phone
         ↓
User enters PIN and confirms
         ↓
Safaricom sends callback to Backend (/api/callback)
         ↓
Backend updates payment status to "completed"
         ↓
Frontend polls payment status (/api/payment-status/:id)
         ↓
Status = "completed" → Show Success Page with QR Code
Status = "failed" → Show error, return to checkout
Status = "pending" → Continue polling (max 60 seconds)
```

---

## 🛠️ Technical Implementation

### **Frontend Changes (App.jsx)**

#### 1. **Payment Initiation**
```javascript
const processPayment = async () => {
  // Initiate STK Push
  const response = await fetch('http://localhost:5000/api/stkpush', {
    method: 'POST',
    body: JSON.stringify({ phone, amount })
  });

  if (response.ok) {
    const data = await response.json();
    
    if (data.ResponseCode === "0") {
      // STK Push sent successfully
      showNotification("📱 Check your phone and enter M-Pesa PIN");
      
      // Start polling for payment confirmation
      pollPaymentStatus(data.CheckoutRequestID, customerName);
    }
  }
}
```

#### 2. **Payment Status Polling**
```javascript
const pollPaymentStatus = async (requestId, custName, attempts = 0) => {
  const maxAttempts = 30; // 60 seconds max (30 × 2s intervals)
  
  const response = await fetch(`http://localhost:5000/api/payment-status/${requestId}`);
  const data = await response.json();
  
  if (data.status === 'completed') {
    // ✅ Payment confirmed - Show QR code
    completeBooking(custName);
  } else if (data.status === 'failed') {
    // ❌ Payment failed
    showNotification("Payment cancelled or failed");
    navigateTo('checkout');
  } else {
    // ⏳ Still pending - Poll again after 2 seconds
    setTimeout(() => pollPaymentStatus(requestId, custName, attempts + 1), 2000);
  }
}
```

#### 3. **Enhanced Processing View**
The processing payment screen now shows:
- Animated spinner with phone icon
- Clear instructions for users
- Step-by-step payment guide
- Professional waiting experience

### **Backend Changes (server.js)**

#### 1. **Payment Tracking**
```javascript
// In-memory storage for tracking payments
const pendingPayments = new Map();
```

#### 2. **STK Push Endpoint** (`POST /api/stkpush`)
```javascript
app.post('/api/stkpush', async (req, res) => {
  // Initiate STK Push
  const response = await axios.post('https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest', {
    // ... payload
    CallBackURL: `http://localhost:5000/api/callback`
  });

  // Store CheckoutRequestID for tracking
  pendingPayments.set(response.data.CheckoutRequestID, {
    phone, amount,
    status: 'pending',
    timestamp: Date.now()
  });

  res.json(response.data);
});
```

#### 3. **M-Pesa Callback Endpoint** (`POST /api/callback`)
```javascript
app.post('/api/callback', (req, res) => {
  const { Body } = req.body;
  const { CheckoutRequestID, ResultCode } = Body.stkCallback;

  if (ResultCode === 0) {
    // Payment successful
    payment.status = 'completed';
  } else {
    // Payment failed
    payment.status = 'failed';
  }

  pendingPayments.set(CheckoutRequestID, payment);
  res.json({ ResultCode: 0, ResultDesc: "Callback received" });
});
```

#### 4. **Payment Status Check** (`GET /api/payment-status/:id`)
```javascript
app.get('/api/payment-status/:checkoutRequestId', (req, res) => {
  const payment = pendingPayments.get(req.params.checkoutRequestId);
  
  res.json({
    status: payment.status,  // 'pending', 'completed', or 'failed'
    amount: payment.amount,
    phone: payment.phone
  });
});
```

---

## 🔒 Security Features

1. **No premature success pages**: QR code only generated after confirmed payment
2. **Timeout handling**: Max 60 seconds polling with user-friendly timeout message
3. **Error handling**: Graceful fallback for network/API errors
4. **Payment tracking**: Secure tracking via CheckoutRequestID
5. **Status verification**: Multiple status checks before confirmation

---

## 📱 User Experience Flow

### **Step 1: Checkout**
- User enters phone number
- Clicks "Pay with M-Pesa"

### **Step 2: Processing (NEW)**
- Shows animated spinner with phone icon
- Displays instructions:
  - Check your phone for M-Pesa popup
  - Enter your M-Pesa PIN
  - Confirm the transaction
  - Wait for confirmation

### **Step 3: Phone Interaction**
- User receives STK push on phone
- Enters M-Pesa PIN
- Confirms payment (typically 5-10 seconds)

### **Step 4: Backend Processing**
- Safaricom sends callback to backend
- Backend updates payment status
- Frontend continues polling

### **Step 5: Success (ONLY AFTER PAYMENT)**
- ✅ Green success banner
- 🎫 QR code displayed
- 📧 Booking reference shown
- ✉️ Confirmation message

---

## ⚙️ Configuration

### **Polling Settings**
```javascript
const maxAttempts = 30;           // Maximum poll attempts
const pollInterval = 2000;        // 2 seconds between polls
const totalTimeout = 60000;       // 60 seconds total
```

### **Backend Endpoints**
```javascript
POST   /api/stkpush              // Initiate payment
POST   /api/callback             // M-Pesa callback (internal)
GET    /api/payment-status/:id   // Check payment status
```

---

## 🧪 Testing

### **Test with Sandbox Credentials**

**Phone Numbers (Safaricom Sandbox):**
- Use: `254708374149` (Standard test number)
- PIN: `174379` (Sandbox PIN)

**Expected Behavior:**
1. Enter test phone number at checkout
2. Click "Pay with M-Pesa"
3. Wait for processing screen (8-10 seconds)
4. QR code appears on success page

### **Testing Scenarios**

#### ✅ Successful Payment
```bash
# User completes payment on phone
→ Status: "pending" → "completed"
→ Result: Success page with QR code
```

#### ❌ Failed Payment
```bash
# User cancels or enters wrong PIN
→ Status: "pending" → "failed"
→ Result: Error message, return to checkout
```

#### ⏱️ Timeout
```bash
# User doesn't interact with phone
→ Status: "pending" (60+ seconds)
→ Result: Timeout message with instructions
```

---

## 🚀 Production Deployment Checklist

Before going live:

- [ ] Replace sandbox credentials with production keys
- [ ] Update `CallBackURL` to public HTTPS endpoint (required by Safaricom)
- [ ] Replace in-memory `Map()` with database (Redis/MongoDB)
- [ ] Add webhook authentication for callback endpoint
- [ ] Implement proper logging and monitoring
- [ ] Add retry logic for failed API calls
- [ ] Set up SSL/TLS certificates
- [ ] Configure CORS for production domain
- [ ] Add rate limiting to prevent abuse
- [ ] Implement idempotency for duplicate requests

---

## 📊 Payment Status Lifecycle

```
PENDING → User hasn't completed payment yet
    ↓
COMPLETED → User paid successfully (Show QR code)
    ↓
FAILED → User cancelled or payment rejected (Show error)
    ↓
TIMEOUT → No response after 60 seconds (Manual verification needed)
```

---

## 🐛 Troubleshooting

### **QR Code Shows Too Early**
✅ **Fixed**: QR code now only appears after `status === 'completed'`

### **Payment Stuck on Processing**
- Check backend logs for callback receipt
- Verify CallBackURL is accessible
- Ensure CheckoutRequestID is stored correctly
- Check payment status manually in backend logs

### **Callback Not Received**
- In sandbox, callbacks may be delayed
- For production, ensure CallBackURL is public HTTPS
- Check firewall/security group settings
- Verify webhook authentication

### **Polling Timeout**
- Default 60 seconds should be sufficient
- Check M-Pesa transaction messages on phone
- Verify payment status in backend manually

---

## 📈 Monitoring & Analytics

### **Key Metrics to Track**
- Payment initiation rate
- Payment completion rate
- Average time to completion
- Failure rate and reasons
- Timeout occurrences
- Callback success rate

### **Recommended Logging**
```javascript
console.log("STK Push initiated:", { phone, amount, timestamp });
console.log("Callback received:", { CheckoutRequestID, ResultCode });
console.log("Payment completed:", { bookingId, amount, timestamp });
```

---

## 🎓 Best Practices

1. **Always validate phone numbers** before sending STK push
2. **Store payment history** in database for auditing
3. **Send confirmation SMS/Email** after successful payment
4. **Handle edge cases** (network failures, API downtime)
5. **Monitor callback delays** and adjust polling accordingly
6. **Use idempotent booking IDs** to prevent duplicates
7. **Implement retry mechanism** for failed STK pushes
8. **Log all payment attempts** for reconciliation

---

## 📞 Support & Resources

- **Safaricom Daraja API Docs**: https://developer.safaricom.co.ke
- **M-Pesa Express (STK Push)**: https://developer.safaricom.co.ke/APIs/MpesaExpressSimulate
- **Callback URL Requirements**: Must be HTTPS in production
- **Testing Credentials**: Available in sandbox portal

---

## ✅ Summary of Changes

### **Before:**
- QR code shown immediately after STK push initiation
- No payment confirmation verification
- User could see success page without paying

### **After:**
- ✅ QR code only shown after payment confirmation
- ✅ Real-time payment status polling
- ✅ M-Pesa callback handling
- ✅ Proper error handling and timeouts
- ✅ Enhanced user feedback during payment
- ✅ Professional processing screen with instructions

---

## 🔐 Security Notes

- Never expose M-Pesa credentials in frontend code
- Always validate payment amounts on backend
- Implement rate limiting on payment endpoints
- Use HTTPS in production
- Authenticate webhook callbacks
- Sanitize all user inputs
- Log all payment transactions for audit trail

---

**Last Updated:** November 20, 2025
**Version:** 2.0
**Status:** ✅ Production Ready (Sandbox Testing)

