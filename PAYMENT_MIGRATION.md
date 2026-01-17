# Payment Migration Guide

## What Changed?

All M-Pesa payment processing has been migrated from the Node.js server (`server.js`) to the FastAPI backend (`backend/app/`).

## Endpoint Changes

| Old (Node.js) | New (FastAPI) | Status |
|---------------|---------------|--------|
| http://localhost:5001/api/stkpush | http://localhost:8000/api/stkpush | ✅ Migrated |
| http://localhost:5001/api/callback | http://localhost:8000/api/callback | ✅ Migrated |
| http://localhost:5001/api/payment-status/:id | http://localhost:8000/api/payment-status/:id | ✅ Migrated |

## New Features in FastAPI Backend

The FastAPI payment implementation includes several production-ready enhancements:

1. **Rate Limiting**: Prevents payment abuse with configurable rate limits (10 requests per 15 minutes)
2. **Enhanced Phone Validation**: Validates and normalizes Kenyan phone numbers automatically
3. **Sandbox Simulation Mode**: Graceful fallback when M-Pesa sandbox credentials fail
4. **Structured Logging**: Comprehensive payment event tracking for debugging
5. **Configurable Callback URL**: Environment-based callback URL configuration
6. **Payment-Booking Integration**: Bookings are now linked to completed payments in the database

## How to Migrate

### 1. Update Frontend API Calls

All payment-related API calls in your frontend code should now use port 8000 (FastAPI):

**Before:**
```javascript
const response = await fetch('/api/stkpush', { /* ... */ });
```

**After:**
```javascript
const response = await fetch('http://localhost:8000/api/stkpush', { /* ... */ });
```

### 2. Update M-Pesa Callback URL

In the Safaricom Developer Portal:

1. Log in to your Safaricom Daraja account
2. Navigate to your application settings
3. Update the callback URL to point to FastAPI:
   - **Development**: `http://your-ngrok-url/api/callback`
   - **Production**: `https://your-production-domain.com/api/callback`

### 3. Configure Environment Variables

Update your `backend/.env` file with the new callback URL setting:

```bash
# M-Pesa Callback URL (production)
CALLBACK_URL=https://your-production-domain.com/api/callback
```

For development, you can leave this blank to use the default localhost callback.

### 4. Test Payment Flow End-to-End

1. Start the FastAPI backend:
   ```bash
   cd backend
   uvicorn app.main:app --reload --port 8000
   ```

2. Start the frontend:
   ```bash
   npm run dev
   ```

3. Test a complete payment flow:
   - Select a turf and time slot
   - Proceed to checkout
   - Enter M-Pesa phone number
   - Complete STK Push on your phone
   - Verify booking is created with payment link

### 5. Remove Node.js Server (Optional)

Once you've verified everything works with FastAPI:

```bash
# Stop the Node.js server if running
# (No need to start it anymore)

# Optionally remove the deprecated files
rm server.js
rm db.js
```

## Rollback Plan

If you encounter issues during migration:

### Immediate Rollback (Restore Node.js endpoints)

1. Start the Node.js server:
   ```bash
   node server.js
   ```

2. Temporarily revert frontend API calls to use port 5001:
   ```javascript
   // In App.jsx, change:
   fetch('http://localhost:5001/api/stkpush', ...)
   ```

3. Update M-Pesa callback URL back to Node.js endpoint

### FastAPI Rollback (Revert Code Changes)

If the FastAPI backend has issues:

```bash
git checkout HEAD~1 backend/app/routers/payments.py
git checkout HEAD~1 backend/app/services/mpesa.py
git checkout HEAD~1 src/App.jsx
```

## Verification Checklist

Before fully removing the Node.js server, verify:

- [ ] STK Push successfully triggers on phone
- [ ] Payment status polling works correctly
- [ ] M-Pesa callback updates payment status
- [ ] Bookings are created only after payment confirmation
- [ ] Payment and booking are linked in database
- [ ] Rate limiting prevents abuse
- [ ] Phone number validation handles all formats
- [ ] Error handling works correctly
- [ ] Logs show payment events properly

## Key Differences

### Database Integration

- **Node.js**: Used in-memory Map() for payment tracking
- **FastAPI**: Uses PostgreSQL with proper foreign key relationships

### Payment-Booking Flow

- **Node.js**: Bookings created immediately, no payment verification
- **FastAPI**: Bookings require completed payment and include payment_id reference

### Validation

- **Node.js**: Basic regex validation
- **FastAPI**: Pydantic validators with automatic phone normalization

### Error Handling

- **Node.js**: Basic try-catch with console logs
- **FastAPI**: Structured logging with payment event tracking

## Troubleshooting

### Issue: "Payment not found" error when creating booking

**Solution**: Ensure the payment has completed before calling the booking endpoint. The frontend automatically handles this by polling payment status.

### Issue: Rate limit errors (429)

**Solution**: Wait 15 minutes or adjust rate limit settings in `backend/app/middleware/rate_limit.py`

### Issue: "Invalid phone number format"

**Solution**: Phone numbers are now automatically normalized. Accepted formats:
- `0712345678`
- `254712345678`
- `+254712345678`
- `712345678`

### Issue: M-Pesa callback not received

**Solution**:
1. Verify callback URL is publicly accessible (use ngrok for development)
2. Check FastAPI logs for incoming callback requests
3. Ensure CALLBACK_URL environment variable is set correctly

## Support

For issues or questions:
1. Check the FastAPI logs: `uvicorn app.main:app --reload --port 8000`
2. Review payment event logs (look for "💳" emoji in console output)
3. Verify database payment records:
   ```sql
   SELECT * FROM payments ORDER BY created_at DESC LIMIT 5;
   ```

## Timeline

- **Migration Completed**: 2026-01-17
- **Node.js Server Deprecated**: 2026-01-17
- **Planned Removal**: 2026-02-17 (after 1 month of stable operation)

## Additional Resources

- FastAPI Payment Router: `backend/app/routers/payments.py`
- M-Pesa Service: `backend/app/services/mpesa.py`
- Phone Validation: `backend/app/schemas/booking.py`
- Rate Limiting: `backend/app/middleware/rate_limit.py`
- Frontend Payment Logic: `src/App.jsx` (lines 609-690)
