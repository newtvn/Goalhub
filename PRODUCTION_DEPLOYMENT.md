# GoalHub Production Deployment Guide

This document provides a comprehensive checklist and guide for deploying GoalHub to production.

## Table of Contents

1. [Pre-Deployment Checklist](#pre-deployment-checklist)
2. [Environment Configuration](#environment-configuration)
3. [Database Setup](#database-setup)
4. [Backend Deployment](#backend-deployment)
5. [Frontend Deployment](#frontend-deployment)
6. [M-Pesa Configuration](#m-pesa-configuration)
7. [Post-Deployment Verification](#post-deployment-verification)
8. [Monitoring & Maintenance](#monitoring--maintenance)
9. [Rollback Procedures](#rollback-procedures)

---

## Pre-Deployment Checklist

### Security

- [ ] All `.env` files are in `.gitignore` and NOT committed to git
- [ ] Rotate all exposed credentials (if repository was ever public)
- [ ] Firebase credentials configured via environment variables
- [ ] M-Pesa production credentials obtained from Safaricom
- [ ] HTTPS SSL certificate configured for production domain
- [ ] Database backups enabled and tested
- [ ] Firestore security rules hardened (if still using Firestore)

### Code Readiness

- [ ] All tests passing
- [ ] No hardcoded localhost URLs remaining
- [ ] API endpoints use centralized configuration
- [ ] Error handling in place for all critical paths
- [ ] Logging configured for production
- [ ] Rate limiting tested

### Infrastructure

- [ ] Production database created (Supabase PostgreSQL)
- [ ] Database connection pooling configured
- [ ] CDN configured for frontend static assets (optional)
- [ ] Monitoring service configured (Sentry, DataDog, etc.)

---

## Environment Configuration

### Backend Environment Variables

Create a `.env` file in `backend/` with the following (use `backend/.env.example` as template):

```bash
# Required
NODE_ENV=production
PORT=8000
DATABASE_URL=postgresql+asyncpg://postgres.xxx:[PASSWORD]@aws-0-region.pooler.supabase.com:5432/postgres
ALLOWED_ORIGINS=https://yourapp.com,https://www.yourapp.com

# Firebase Admin SDK
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxx@your-project.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"

# M-Pesa Production
MPESA_CONSUMER_KEY=your_production_consumer_key
MPESA_CONSUMER_SECRET=your_production_consumer_secret
MPESA_PASSKEY=your_production_passkey
MPESA_SHORTCODE=your_production_shortcode
MPESA_ENV=production
CALLBACK_URL=https://api.yourapp.com/api/callback

# Optional (defaults provided)
DB_POOL_SIZE=20
DB_MAX_OVERFLOW=40
DB_POOL_RECYCLE=3600
```

**Important Notes:**
- `CALLBACK_URL` must be HTTPS in production
- `ALLOWED_ORIGINS` must include your frontend domain(s)
- Never commit this file to version control

### Frontend Environment Variables

Create a `.env` file in root directory (use `.env.example` as template):

```bash
# Required
VITE_API_URL=https://api.yourapp.com

# Firebase Client SDK (these are safe to expose)
VITE_FIREBASE_API_KEY=AIzaSy...
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789012
VITE_FIREBASE_APP_ID=1:123456789012:web:abc123...
VITE_FIREBASE_MEASUREMENT_ID=G-XXXXXXXXXX
```

---

## Database Setup

### 1. Run Migrations

```bash
cd backend
alembic upgrade head
```

### 2. Verify Schema

```bash
# Connect to production database and verify tables exist
psql $DATABASE_URL

# List all tables
\dt

# Expected tables: users, turfs, bookings, payments, events, notifications
```

### 3. Configure Backups

- Enable automated backups in Supabase dashboard
- Test restore procedure on staging database
- Document backup retention policy

---

## Backend Deployment

### Option A: Deploy to Render/Railway

1. **Connect Repository**
   - Link GitHub repository to Render/Railway
   - Select `backend/` as root directory

2. **Configure Build**
   ```bash
   # Build Command
   pip install -r requirements.txt

   # Start Command
   uvicorn app.main:app --host 0.0.0.0 --port $PORT
   ```

3. **Set Environment Variables**
   - Add all variables from `backend/.env.example`
   - Ensure `NODE_ENV=production`

4. **Health Check**
   - Configure health check endpoint: `/health`
   - Expected response: `{"status":"healthy","database":"connected"}`

### Option B: Deploy with Docker

```bash
# Build image
cd backend
docker build -t goalhub-backend .

# Run container
docker run -d \
  -p 8000:8000 \
  --env-file .env \
  --name goalhub-backend \
  goalhub-backend
```

### Post-Deployment

```bash
# Test health endpoint
curl https://api.yourapp.com/health

# Expected response:
# {
#   "status": "healthy",
#   "environment": "production",
#   "mpesa_env": "production",
#   "database": "connected"
# }
```

---

## Frontend Deployment

### Option A: Deploy to Vercel

1. **Install Vercel CLI** (optional)
   ```bash
   npm install -g vercel
   ```

2. **Deploy**
   ```bash
   # Build locally first to test
   npm run build

   # Deploy to Vercel
   vercel --prod
   ```

3. **Configure Environment Variables in Vercel Dashboard**
   - Add all `VITE_*` variables from `.env.example`
   - Set `VITE_API_URL` to your production backend URL

4. **Configure Domain**
   - Add custom domain in Vercel settings
   - Update `ALLOWED_ORIGINS` in backend to include this domain

### Option B: Deploy to Netlify

1. **Build Command**: `npm run build`
2. **Publish Directory**: `dist`
3. **Environment Variables**: Add all `VITE_*` variables in Netlify dashboard

---

## M-Pesa Configuration

### 1. Safaricom Developer Portal Setup

1. **Register App on Daraja API**
   - Go to [Safaricom Developer Portal](https://developer.safaricom.co.ke)
   - Create production app
   - Get production credentials

2. **Configure Callback URL**
   - Register: `https://api.yourapp.com/api/callback`
   - **MUST be HTTPS** - M-Pesa will reject HTTP callbacks
   - Ensure endpoint is publicly accessible

3. **Test Credentials**
   ```bash
   # Test M-Pesa authentication
   curl -X POST https://api.yourapp.com/api/stkpush \
     -H "Content-Type: application/json" \
     -d '{
       "phone": "254712345678",
       "amount": 100
     }'
   ```

### 2. IP Whitelisting (Optional but Recommended)

- Whitelist Safaricom callback IP addresses
- Add validation in `backend/app/routers/payments.py` callback endpoint

---

## Post-Deployment Verification

### Critical Path Testing

Run through these scenarios manually:

#### 1. User Registration & Authentication

- [ ] Google Sign-In works
- [ ] User profile syncs with backend database
- [ ] Firebase token refreshes properly

#### 2. Turf Booking Flow (Without Payment)

- [ ] Browse available turfs
- [ ] Select turf and time slot
- [ ] Complete booking without payment
- [ ] Booking appears in user dashboard

#### 3. Payment Flow (CRITICAL)

- [ ] Initiate STK Push from checkout
- [ ] Receive M-Pesa prompt on phone
- [ ] Complete payment
- [ ] M-Pesa callback received and processed
- [ ] Payment status updates in database
- [ ] Booking completes successfully
- [ ] User sees success page

#### 4. Admin Dashboard

- [ ] Admin can view all bookings
- [ ] Dashboard stats display correctly
- [ ] Chart data renders

### Automated Health Checks

Set up monitoring for:

```bash
# Backend health
GET https://api.yourapp.com/health
# Expected: {"status":"healthy","database":"connected"}

# Frontend availability
GET https://yourapp.com
# Expected: 200 OK
```

---

## Monitoring & Maintenance

### 1. Application Monitoring

**Recommended: Sentry**

Backend setup:
```python
# backend/app/main.py
import sentry_sdk

sentry_sdk.init(
    dsn="YOUR_SENTRY_DSN",
    environment=settings.NODE_ENV,
    traces_sample_rate=1.0 if settings.NODE_ENV == "development" else 0.1,
)
```

Frontend setup:
```javascript
// src/main.jsx
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: "YOUR_SENTRY_DSN",
  environment: import.meta.env.MODE,
});
```

### 2. Payment Monitoring

Monitor these metrics:

- Payment success rate (should be >95%)
- Average payment processing time
- Callback failures
- STK Push timeout rate

Set up alerts for:
- Payment success rate drops below 90%
- Callback endpoint returning errors
- Database connection failures

### 3. Database Maintenance

- **Weekly**: Review slow query logs
- **Monthly**: Analyze table growth and add indexes if needed
- **Quarterly**: Test backup restore procedure

---

## Rollback Procedures

### Backend Rollback

```bash
# Render/Railway: Rollback to previous deployment
render rollback <deployment-id>

# Docker: Switch to previous image
docker stop goalhub-backend
docker run -d --env-file .env --name goalhub-backend goalhub-backend:previous
```

### Database Rollback

```bash
# Rollback one migration
cd backend
alembic downgrade -1

# Rollback to specific version
alembic downgrade <revision_id>
```

### Frontend Rollback

- Vercel/Netlify: Use dashboard to revert to previous deployment

---

## Production Incidents

### M-Pesa Callback Not Received

**Symptoms**: Payments succeed on M-Pesa but bookings don't complete

**Diagnosis**:
1. Check callback URL is HTTPS and publicly accessible
2. Verify callback endpoint logs for incoming requests
3. Check M-Pesa dashboard for callback failures

**Solution**:
```bash
# Check backend logs for callback errors
# Verify CALLBACK_URL environment variable
echo $CALLBACK_URL

# Manually query payment status
curl https://api.yourapp.com/api/payment-status/<checkout_request_id>
```

### Database Connection Pool Exhausted

**Symptoms**: `OperationalError: could not connect to server`

**Solution**:
1. Increase `DB_POOL_SIZE` and `DB_MAX_OVERFLOW`
2. Check for connection leaks (unclosed sessions)
3. Restart backend service

### Firebase Authentication Failures

**Symptoms**: 401 errors on all authenticated endpoints

**Solution**:
1. Verify Firebase credentials are correctly set
2. Check Firebase service account hasn't been rotated
3. Verify `NODE_ENV=production` disables mock mode

---

## Security Best Practices

- Rotate secrets regularly (every 90 days)
- Review user permissions and admin accounts monthly
- Monitor for suspicious payment patterns
- Keep dependencies updated (`npm audit`, `pip-audit`)
- Regular security scans on infrastructure

---

## Support & Documentation

- **API Documentation**: https://api.yourapp.com/docs
- **Backend Logs**: Check hosting platform dashboard
- **M-Pesa Support**: Safaricom Daraja support
- **Firebase Console**: https://console.firebase.google.com

---

**Last Updated**: 2026-01-18
**Version**: 1.0
