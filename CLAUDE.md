# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

GoalHub is a football turf booking platform with M-Pesa payment integration and Firebase/Google Authentication. The backend is built with FastAPI and uses PostgreSQL for data persistence.

**Note**: A deprecated Node.js backend (`server.js`) exists in the repository but is no longer used. All payment processing and API endpoints have been migrated to FastAPI. See `PAYMENT_MIGRATION.md` for details.

## Architecture

### Backend (FastAPI/Python)

Single backend service handling all API endpoints including:
- **M-Pesa Payment Processing**: STK Push initiation, callback handling, and payment status tracking
- **Turf Bookings**: Booking management with payment verification
- **User Management**: User profiles and authentication (integrates with Firebase Auth)
- **Events & Notifications**: Event management and user notifications
- **Dashboard**: Admin/manager analytics and data views

**Key Features**:
- PostgreSQL database with async SQLAlchemy ORM
- Alembic migrations for schema management
- Rate limiting for payment endpoints (10 requests per 15 minutes)
- Enhanced phone number validation and normalization
- Sandbox simulation mode for M-Pesa development
- Structured logging for payment events
- Payment-booking integration with foreign key relationships

**Endpoints**:
- `POST /api/stkpush` - Initiate M-Pesa payment
- `POST /api/callback` - Receive M-Pesa callback
- `GET /api/payment-status/{id}` - Check payment status
- `POST /api/bookings/` - Create booking (with optional payment verification)
- Additional endpoints for turfs, users, events, notifications, and dashboard

### Frontend Architecture

React (Vite) application using:
- **Auth**: Firebase Authentication (Google Sign-In)
- **Payment**: FastAPI backend (M-Pesa integration on port 8000)
- **Data**: PostgreSQL via FastAPI endpoints (Supabase hosted)
- **State Management**: Props and lifting state (no Context yet, but planned per PROJECT_STATUS.md)
- **Routing**: Currently in a monolithic `App.jsx` with view components
- **UI**: TailwindCSS with Lucide icons

## Development Commands

### Frontend (React + Vite)
```bash
npm install          # Install dependencies
npm run dev          # Start dev server (http://localhost:5173)
npm run build        # Production build
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

### Backend (FastAPI)
```bash
cd backend
pip install -r requirements.txt

# Database migrations
alembic upgrade head                    # Run all migrations
alembic revision --autogenerate -m ""   # Create new migration
alembic downgrade -1                    # Rollback one migration

# Development server
uvicorn app.main:app --reload --port 8000

# Docker (full stack with PostgreSQL)
docker-compose up --build
```

**Note**: The deprecated Node.js server (`node server.js`) is no longer needed and will be removed in a future update.

## Environment Configuration

### Frontend (.env at root)
```bash
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
```

### Backend (backend/.env)
```bash
# Database Configuration (Supabase PostgreSQL with connection pooler)
DATABASE_URL=postgresql+asyncpg://postgres.ujivlrfxqvktpgncocrv:[password]@aws-1-eu-west-1.pooler.supabase.com:5432/postgres

# App Configuration
NODE_ENV=development
PORT=8000

# M-Pesa Configuration
MPESA_CONSUMER_KEY=your_consumer_key
MPESA_CONSUMER_SECRET=your_consumer_secret
MPESA_PASSKEY=bfb279f9aa9bdbcf158e97dd71a467cd2e0c893059b10f78e6b72ada1ed2c919
MPESA_SHORTCODE=174379
MPESA_ENV=sandbox          # or 'production'

# M-Pesa Callback URL (optional, defaults to localhost if not set)
# For production, set to your public HTTPS endpoint
# For development, use ngrok or similar tunnel service
CALLBACK_URL=              # Example: https://your-domain.com/api/callback
```

## Key Technical Details

### M-Pesa Integration (FastAPI Backend)

The FastAPI backend (`backend/app/routers/payments.py` and `backend/app/services/mpesa.py`) handles M-Pesa STK Push:

**Features**:
- PostgreSQL payment tracking with full transaction history
- Rate limiting: 10 payment requests per 15 minutes (configurable in `app/middleware/rate_limit.py`)
- Enhanced phone number validation and automatic normalization (Kenyan numbers)
- Sandbox simulation fallback when auth fails (see `SIMULATED_TOKEN_AUTH_FAILED` in `mpesa.py`)
- Configurable callback URL via `CALLBACK_URL` environment variable
- Structured logging for all payment events (search logs for "💳" emoji)
- Payment-booking integration with foreign key relationships

**Endpoints**:
- `POST /api/stkpush` - Initiate M-Pesa STK Push (validates phone & amount)
- `POST /api/callback` - Receive M-Pesa callback (updates payment status)
- `GET /api/payment-status/{checkout_request_id}` - Check payment status

**Implementation Files**:
- `backend/app/routers/payments.py` - Payment API endpoints
- `backend/app/services/mpesa.py` - M-Pesa service layer
- `backend/app/schemas/booking.py` - Payment request/response schemas with validators
- `backend/app/middleware/rate_limit.py` - Rate limiting middleware
- `backend/app/utils/logger.py` - Structured logging

### Firebase Configuration

**IMPORTANT**: `src/firebase.js` contains hardcoded Firebase credentials (lines 7-14). This is intentional for the production deployment but should be migrated to environment variables for security best practices.

### Database (PostgreSQL via Supabase)

- SQLAlchemy with async support (`asyncpg` driver)
- Alembic for migrations in `backend/alembic/versions/`
- Models: User, Turf, Booking, Payment, Event, Notification
- Database session dependency: `get_db()` in `app/database.py`
- Payment-Booking relationship: Bookings have optional `payment_id` foreign key

### Frontend Data Flow

- Firebase Auth for user authentication (Google Sign-In)
- FastAPI backend (port 8000) for M-Pesa payments and booking creation
- PostgreSQL via FastAPI for all data (turfs, bookings, payments, events)
- Payment flow: Frontend → FastAPI STK Push → M-Pesa → FastAPI Callback → Booking Creation

## Code Patterns

### FastAPI Backend Structure
- **Routers**: Domain-specific endpoints in `app/routers/`
- **Models**: SQLAlchemy ORM models in `app/models/`
- **Schemas**: Pydantic request/response models in `app/schemas/`
- **Services**: Business logic (e.g., `app/services/mpesa.py`)
- **Dependencies**: Shared dependencies in `app/dependencies/`

### Frontend Component Organization
```
src/
├── components/
│   ├── dashboard/          # Dashboard views and logic
│   │   ├── views/          # Tab-specific views
│   │   └── modals/         # CRUD modals
│   ├── layout/             # Navbar, Footer
│   └── NotificationsPanel.jsx
├── pages/                  # Lazy-loaded route components
├── firebase.js             # Firebase initialization
└── App.jsx                 # Main application (currently monolithic)
```

## Migration State (from PROJECT_STATUS.md)

The project is actively being refactored:
- State management is planned to move from prop-drilling to React Context
- Large views in `App.jsx` should be extracted to `src/pages/`
- ✅ **Payment migration complete**: All M-Pesa payment processing has been migrated from Node.js to FastAPI

When making changes, be aware that:
- The FastAPI backend is the active production backend
- Frontend connects to FastAPI (port 8000) for all API calls and Firebase for authentication
- A deprecated Node.js backend (`server.js`) exists but should not be used

## Security Considerations

- **M-Pesa**: Simulation logic (`SIMULATED_TOKEN_AUTH_FAILED`) should only run in sandbox mode
- **Rate Limiting**: Payment endpoints limited to 10 requests per 15 minutes per IP
- **Phone Validation**: Pydantic validators ensure proper phone number format before API calls
- **Amount Validation**: Payment amounts restricted to 1-300,000 KES range
- **Payment Verification**: Bookings require completed payment confirmation
- **CORS**: Restricted to localhost origins in development (update for production)
- **Callback Security**: Ensure `CALLBACK_URL` is HTTPS in production
- **Firebase**: Firestore rules need production hardening (currently may be in test mode)
- **Environment Variables**: Never commit `.env` files with real credentials

## Deployment

### Frontend
```bash
npm run build  # outputs to dist/
```
- Deploy `dist/` to Vercel/Netlify/similar
- Configure `VITE_*` environment variables in hosting dashboard
- Update API endpoint URLs if not using same domain

### Backend (FastAPI)
```bash
cd backend
alembic upgrade head  # Run database migrations
uvicorn app.main:app --host 0.0.0.0 --port $PORT
```

**Environment Configuration**:
- Set all M-Pesa environment variables (see Backend .env section above)
- Update `CALLBACK_URL` to public HTTPS endpoint
- Configure PostgreSQL `DATABASE_URL` (Supabase connection string)
- Set `MPESA_ENV=production` for production deployment

**Platform-Specific**:
- **Render/Railway**: Deploy `backend/` directory, set start command above
- **Docker**: Use `docker-compose.yml` to run PostgreSQL + FastAPI together
- **AWS/GCP**: Deploy as containerized app or use serverless options

**Post-Deployment**:
- Update M-Pesa callback URL in Safaricom Developer Portal
- Test payment flow end-to-end with real M-Pesa credentials
- Monitor logs for payment events (search for "💳" emoji)
