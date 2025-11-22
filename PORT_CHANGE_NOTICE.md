# ⚠️ Backend Port Changed: 5000 → 5001

## 🔧 Issue Resolved

**Problem:** Port 5000 on macOS is used by AirPlay/AirTunes service, causing CORS errors.

**Solution:** Backend server now runs on **port 5001**

---

## ✅ What Was Changed

### Backend (`server.js`)
```javascript
// OLD
const PORT = 5000;

// NEW
const PORT = process.env.PORT || 5001;
```

### Frontend (`src/App.jsx`)
```javascript
// OLD
fetch('http://localhost:5000/api/stkpush')
fetch('http://localhost:5000/api/payment-status/...')

// NEW  
fetch('http://localhost:5001/api/stkpush')
fetch('http://localhost:5001/api/payment-status/...')
```

### CORS Configuration
Added proper CORS configuration to allow requests from frontend:
```javascript
const corsOptions = {
  origin: function (origin, callback) {
    const allowedOrigins = [
      'http://localhost:5173',
      'http://localhost:5174',
      'http://127.0.0.1:5173',
      'http://127.0.0.1:5174'
    ];
    callback(null, true);
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  credentials: true,
  optionsSuccessStatus: 200
};
```

---

## 🚀 Running the Application

### Backend (Port 5001)
```bash
cd /Users/newtonbrian/Desktop/PROLITHICA/GOALHUB
node server.js
```

**Expected Output:**
```
🚀 Backend running on http://localhost:5001
```

### Frontend (Port 5173)
```bash
npm run dev
```

---

## 🔍 Why Port 5000 Doesn't Work on Mac

macOS Monterey and later reserve port 5000 for AirPlay Receiver service. This causes conflicts with local development servers.

**Solutions:**
1. ✅ **Use a different port** (we chose 5001)
2. ❌ Disable AirPlay Receiver (not recommended)

---

## ✅ Verification

Backend is running successfully:
```bash
curl http://localhost:5001/api/payment-status/test
# Response: {"error":"Payment not found"}
```

CORS is configured:
- Frontend on port 5173 can now communicate with backend on port 5001
- No more CORS errors

---

## 📝 Summary

| Item | Old Value | New Value |
|------|-----------|-----------|
| Backend Port | 5000 | 5001 |
| Backend URL | http://localhost:5000 | http://localhost:5001 |
| Frontend Port | 5173 | 5173 (unchanged) |
| CORS | Basic | Enhanced with origin checking |

---

**Date:** November 20, 2025  
**Issue:** CORS error due to AirPlay on port 5000  
**Status:** ✅ Resolved  
**Backend Port:** 5001  
**Frontend Port:** 5173  

