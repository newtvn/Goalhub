# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

GoalHub is a football turf booking platform with M-Pesa payment integration and Firebase/Google Authentication. The project is in a transitional state with two backend implementations:

1. **Legacy Backend** (Node.js/Express): Current production backend in `server.js`
2. **New Backend** (FastAPI/Python): Being developed in `backend/` directory

## Architecture

### Dual Backend System

The codebase currently maintains two separate backends:

- **Node.js Backend** (`server.js`): Express server handling M-Pesa STK Push payments, currently active
- **FastAPI Backend** (`backend/`): PostgreSQL-backed REST API with SQLAlchemy models, Alembic migrations, and modular routers for turfs, bookings, users, events, notifications, and dashboard

When working on the backend, clarify which implementation the user is referring to.

### Frontend Architecture

React (Vite) application using:
- **Auth**: Firebase (Firestore + Google Auth)
- **State Management**: Props and lifting state (no Context yet, but planned per PROJECT_STATUS.md)
- **Routing**: Currently in a monolithic `App.jsx` with view components
- **UI**: TailwindCSS with Lucide icons

The frontend connects to the Node.js backend for payments and Firebase for data/auth.

## Development Commands

### Frontend (React + Vite)
```bash
npm install          # Install dependencies
npm run dev          # Start dev server (http://localhost:5173)
npm run build        # Production build
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

### Legacy Backend (Node.js)
```bash
node server.js       # Start on port 5001 (or $PORT)
```

### New Backend (FastAPI)
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

## Environment Configuration

### Frontend (.env at root)
```
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
```

### Node.js Backend (.env at root)
```
# Application
NODE_ENV=development
PORT=5001

# Supabase Configuration
SUPABASE_PASSWORD=your_supabase_password

# Firebase Configuration (for frontend)
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=

# M-Pesa Configuration
MPESA_CONSUMER_KEY=
MPESA_CONSUMER_SECRET=
MPESA_PASSKEY=
MPESA_SHORTCODE=
MPESA_ENV=sandbox          # or 'production'
CALLBACK_URL=              # Public HTTPS URL for M-Pesa callbacks
```

### FastAPI Backend (backend/.env)
```
# Database Configuration (Supabase PostgreSQL with connection pooler)
DATABASE_URL=postgresql+asyncpg://postgres.ujivlrfxqvktpgncocrv:[password]@aws-1-eu-west-1.pooler.supabase.com:5432/postgres

# App Configuration
NODE_ENV=development
PORT=8000

# M-Pesa Configuration
MPESA_CONSUMER_KEY=
MPESA_CONSUMER_SECRET=
MPESA_PASSKEY=
MPESA_SHORTCODE=
MPESA_ENV=sandbox
```

## Key Technical Details

### M-Pesa Integration (Node.js Backend)

The `server.js` handles M-Pesa STK Push:
- Includes simulation fallback when auth fails in sandbox mode (see `SIMULATED_TOKEN_AUTH_FAILED`)
- In-memory payment tracking using `Map()` (production should use a database)
- Rate limiting: 10 payment requests per 15 minutes
- Endpoints: `/api/stkpush`, `/api/callback`, `/api/payment-status/:checkoutRequestId`

### Firebase Configuration

**IMPORTANT**: `src/firebase.js` contains hardcoded Firebase credentials (lines 7-14). This is intentional for the production deployment but should be migrated to environment variables for security best practices.

### Database (FastAPI Backend)

- SQLAlchemy with async support (`asyncpg` driver)
- Alembic for migrations in `backend/alembic/versions/`
- Models: User, Turf, Booking, Payment, Event, Notification
- Database session dependency: `get_db()` in `app/database.py`

### Frontend Data Flow

- Firebase Firestore for real-time data (bookings, turfs, events)
- Firebase Auth for user authentication
- Axios calls to Node.js backend for M-Pesa payments
- Vite proxy: `/api/*` → `http://localhost:5001`

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
- The codebase is moving toward the FastAPI backend but Node.js is still in use

When making changes, be aware that:
- The Node.js backend is production-active
- The FastAPI backend is under development
- Frontend still connects to Firebase + Node.js backend

## Security Considerations

- Firestore rules need production hardening (currently may be in test mode)
- M-Pesa simulation logic (`SIMULATED_TOKEN_AUTH_FAILED`) should only run in development
- Node.js backend uses Helmet and rate limiting
- CORS is restricted to localhost origins (update for production)
- Backend validates phone numbers and amounts before M-Pesa calls

## Deployment

### Frontend
- Build: `npm run build` (outputs to `dist/`)
- Deploy `dist/` to Vercel/Netlify
- Configure `VITE_*` environment variables in hosting dashboard

### Node.js Backend
- Deploy root directory with `node server.js` start command
- Set all M-Pesa environment variables
- Update `CALLBACK_URL` to public HTTPS endpoint

### FastAPI Backend
- Deploy `backend/` directory
- Command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
- Run migrations: `alembic upgrade head`
- Configure PostgreSQL database URL

### Docker
Use `docker-compose.yml` to run PostgreSQL + FastAPI backend together.
