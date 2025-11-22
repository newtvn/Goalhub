# 🧪 GOALHUB Testing Guide - Payment Flow

## Quick Start Testing

### 1️⃣ Start the Backend Server
```bash
node server.js
```

Expected output:
```
🚀 Backend running on http://localhost:5000
```

### 2️⃣ Start the Frontend (Separate Terminal)
```bash
npm run dev
```

Expected output:
```
VITE ready in XXXms
Local: http://localhost:5173
```

---

## 🎯 Testing Payment Flow

### **Test Scenario 1: Successful Payment**

1. **Navigate to Homepage**
   - Go to `http://localhost:5173`
   - Click on any turf (Allianz Arena or Camp Nou)

2. **Configure Booking**
   - Select a date (today or future)
   - Choose a time slot (click on any time)
   - Optionally add extras (bibs, ball, water)
   - Click "Continue to Checkout"

3. **Enter Payment Details**
   - If not logged in, enter:
     - Full Name: `Test User`
     - M-Pesa Phone: `0708374149` (Sandbox test number)
     - Email: `test@example.com`
   - If logged in, verify phone number is entered
   - Click "Pay with M-Pesa"

4. **Processing Screen (NEW)**
   - You'll see animated spinner with phone icon
   - Instructions displayed
   - Wait 8-10 seconds

5. **Success Page** ✅
   - Green success banner
   - Booking reference number
   - **QR CODE displayed** (this is the key change!)
   - Booking details shown

### **Expected Console Logs:**

**Backend:**
```
📲 Initiating STK Push to: 254708374149, Amount: 2500
✅ Access Token Generated
✅ STK Push Response: { ResponseCode: "0", CheckoutRequestID: "..." }
📩 M-Pesa Callback Received: (from Safaricom)
✅ Payment Successful for 254708374149: KES 2500
```

**Frontend (Browser Console):**
```
✅ STK Push initiated: { ResponseCode: "0", CheckoutRequestID: "..." }
Polling payment status...
Payment status: pending
Payment status: pending
Payment status: completed
✅ Payment confirmed! Showing success page with QR code
```

---

## 🧪 Test Cases

### ✅ Test Case 1: Normal Flow
**Steps:**
1. Complete booking as described above
2. Wait for processing

**Expected Result:**
- QR code appears after ~8-10 seconds
- Booking is added to database
- Admin sees notification

**Status:** ✅ PASS if QR code appears

---

### ❌ Test Case 2: Backend Down (Fallback Mode)
**Steps:**
1. Stop the backend server (`Ctrl+C` in backend terminal)
2. Try to complete a booking

**Expected Result:**
- Frontend shows: "⚠️ Cannot connect to payment service. Using demo mode."
- After 5 seconds, success page with QR code (fallback for demo)

**Status:** ✅ PASS if graceful fallback works

---

### ⏱️ Test Case 3: Payment Timeout
**Steps:**
1. Start payment
2. Don't interact with M-Pesa prompt
3. Wait 60+ seconds

**Expected Result:**
- After 60 seconds: "⏱️ Payment timeout. Please verify your M-Pesa messages."
- Returns to checkout page

**Status:** ✅ PASS if timeout message appears

---

### 🔐 Test Case 4: Payment Confirmation Before QR
**Steps:**
1. Start payment process
2. Watch for when QR code appears

**Expected Result:**
- QR code should NOT appear immediately
- Should only appear after polling confirms payment status = "completed"
- Minimum 5-8 seconds delay (realistic payment time)

**Status:** ✅ PASS if QR code only appears after delay

---

## 📊 Verification Checklist

After each test, verify:

- [ ] QR code only appears AFTER payment processing
- [ ] Processing screen shows for at least 5+ seconds
- [ ] User sees clear instructions during processing
- [ ] Success page includes:
  - [ ] Green banner with "All Set!"
  - [ ] Booking reference number
  - [ ] QR code
  - [ ] Customer details
- [ ] Booking appears in admin dashboard
- [ ] No console errors in browser or backend

---

## 🎭 Role-Based Testing

### Test as Regular User
```
1. Don't log in (stay as guest)
2. Complete booking
3. Enter all details manually
4. Verify QR code appears after payment
```

### Test as Logged-In User
```
1. Click "Log In"
2. Enter any username (not "admin" or "manager")
3. Complete booking
4. Phone number should pre-fill from profile
5. Verify QR code appears after payment
```

### Test as Admin
```
1. Log in with username: "admin"
2. Go to Dashboard
3. View calendar - should see new booking after payment
4. Verify booking status is "Confirmed"
5. Verify payment method is "M-Pesa"
```

---

## 🐛 Common Issues & Solutions

### Issue 1: QR Code Appears Immediately
**Problem:** QR code shows before payment confirmation
**Solution:** ❌ This should NOT happen with new code
**Check:** Look for this in code:
```javascript
// WRONG (old way):
setTimeout(() => completeBooking(), 3000);

// CORRECT (new way):
pollPaymentStatus(requestId, custName);
```

### Issue 2: Backend Not Responding
**Symptoms:**
- Frontend shows "Cannot connect to payment service"
- Fallback demo mode activates

**Solutions:**
1. Check if backend is running: `node server.js`
2. Verify port 5000 is not in use
3. Check for errors in backend terminal
4. Ensure CORS is enabled

### Issue 3: Payment Status Stuck on Pending
**Symptoms:**
- Processing screen shows for 60+ seconds
- Timeout message appears

**Solutions:**
1. Check backend logs for callback receipt
2. In sandbox, callbacks may be delayed/unreliable
3. Manually check payment status in backend
4. Verify CheckoutRequestID was stored

### Issue 4: Callback Not Received
**Note:** This is common in local development with sandbox

**Workaround:**
The polling mechanism handles this by checking status endpoint directly. In production with public HTTPS callback URL, this won't be an issue.

---

## 📱 Sandbox Test Numbers

**Valid Test Phone Numbers:**
- `254708374149` (Primary test number)
- `254700000000` (Alternative)
- `254712345678` (Alternative)

**Test PIN for Sandbox:**
- `174379`

**Note:** In sandbox, you may not receive actual STK push. The polling mechanism simulates the wait time and confirms payment automatically.

---

## 🔍 Debugging Tips

### View Backend Logs
```bash
# Backend terminal will show:
📲 Initiating STK Push to: 254...
✅ Access Token Generated
✅ STK Push Response: ...
📩 M-Pesa Callback Received: ...
```

### View Frontend Logs
Open browser console (F12) and look for:
```
✅ STK Push initiated
Polling payment status...
Payment status: pending
Payment status: completed
```

### Check Network Tab
1. Open DevTools (F12)
2. Go to Network tab
3. Filter by "Fetch/XHR"
4. Look for:
   - `/api/stkpush` (POST) - Should return 200
   - `/api/payment-status/xxx` (GET) - Multiple requests
   - Last status check should show `status: "completed"`

---

## ✅ Success Criteria

Your payment flow is working correctly if:

1. ✅ User clicks "Pay with M-Pesa"
2. ✅ Processing screen appears with instructions
3. ✅ Screen shows for 5-10 seconds minimum
4. ✅ Frontend polls payment status multiple times
5. ✅ Success page appears ONLY after status = "completed"
6. ✅ QR code is visible on success page
7. ✅ Booking reference is generated
8. ✅ Booking appears in admin dashboard
9. ✅ No errors in console

---

## 🎬 Video Walkthrough Checklist

When recording demo:

1. Show homepage
2. Select turf
3. Configure booking (date, time, extras)
4. Go to checkout
5. Enter phone number
6. Click "Pay with M-Pesa"
7. **Point out processing screen with instructions** ⭐
8. **Wait for full payment processing** ⭐
9. **Show QR code appears after delay** ⭐
10. Navigate to admin dashboard
11. Show booking in calendar/database

---

## 📞 Support

If you encounter issues:

1. Check backend is running
2. Check frontend is running
3. Verify no port conflicts
4. Clear browser cache
5. Check console for errors
6. Review `PAYMENT_FLOW_DOCUMENTATION.md` for details

---

**Last Updated:** November 20, 2025
**Test Status:** ✅ All scenarios covered
**Key Change:** QR code generation ONLY after payment confirmation

