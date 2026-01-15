# 🚀 Supabase & Render Migration Guide

This guide outlines the steps to migrate your backend from Firebase to **Supabase** and deploy your full stack application (React Frontend + Express Backend) to **Render**.

---

## 🔹 Phase 1: Supabase Setup (Database & Auth)

### 1. Create Supabase Project
1. Go to [Supabase.com](https://supabase.com) and create a new project.
2. Note down your `Project URL` and `API Key` (anon/public).

### 2. Database Schema (SQL)
Run the following SQL in the Supabase **SQL Editor** to recreate your data structure. This replaces Firestore collections with Relational Tables.

```sql
-- Enable UUIDs
create extension if not exists "uuid-ossp";

-- 1. Users Table (Extends Supabase Auth)
create table public.users (
  id uuid references auth.users not null primary key,
  email text,
  display_name text,
  role text default 'user', -- 'admin', 'manager', 'user'
  phone text,
  avatar_url text,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- 2. Turfs
create table public.turfs (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  price numeric not null,
  image text,
  capacity int,
  type text,
  available boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- 3. Bookings
create table public.bookings (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.users(id),
  turf_id uuid references public.turfs(id),
  date date not null,
  time text not null,
  duration int default 1,
  total_amount numeric not null,
  status text default 'pending', -- 'confirmed', 'cancelled', 'pending'
  payment_status text default 'unpaid',
  payment_method text,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- 4. Transactions (Replaces server.js in-memory Map)
create table public.transactions (
  id text primary key, -- Use M-Pesa CheckoutRequestID
  booking_id uuid references public.bookings(id),
  amount numeric not null,
  phone text,
  status text default 'pending', -- 'completed', 'failed'
  mpesa_receipt text,
  metadata jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- 5. Events & Extras (Create similarly)
-- ...
```

### 3. Row Level Security (RLS)
*   **Users**: Users can read/edit their own profile. Admins can read/edit all.
*   **Bookings**: Users see their own. Admins see all.
*   **Turfs/Events**: Public read access. Admin write access.

---

## 🔹 Phase 2: Code Migration

### 1. Install Dependencies
```bash
npm install @supabase/supabase-js
```

### 2. Create `src/supabase.js`
Replace `src/firebase.js` logic with a Supabase client.

```javascript
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseKey);

// Example: Subscribe to Bookings
export const subscribeToBookings = (callback) => {
  return supabase
    .from('bookings')
    .on('INSERT', payload => callback(prev => [payload.new, ...prev]))
    .subscribe();
};
```

### 3. Update `server.js` (Crucial)
Your backend currently stores payments in memory (`pendingPayments`). **This will fail on Render** because cloud services restart frequently. You must save to the database.

**Changes needed in `server.js`**:
*   Import `supabase-js`.
*   In `/api/stkpush`: logic, `INSERT` into `transactions` table instead of `pendingPayments.set()`.
*   In `/api/callback`: `UPDATE` the `transactions` table where `id` matches `CheckoutRequestID`.

---

## 🔹 Phase 3: Deploy to Render

### 1. Backend Service (Web Service)
This runs your Express API (`server.js`).

1.  In Render Dashboard, click **New +** -> **Web Service**.
2.  Connect your Repo.
3.  **Build Command**: `npm install`
4.  **Start Command**: `node server.js`
5.  **Environment Variables**:
    *   `MPESA_CONSUMER_KEY`, `MPESA_CONSUMER_SECRET`, etc.
    *   `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` (For backend admin access).
    *   `NODE_ENV` = `production`

### 2. Frontend (Static Site)
This hosts your React App.

1.  In Render Dashboard, click **New +** -> **Static Site**.
2.  Connect your Repo.
3.  **Build Command**: `npm install && npm run build`
4.  **Publish Directory**: `dist`
5.  **Environment Variables**:
    *   `VITE_SUPABASE_URL`: Your Supabase Project URL.
    *   `VITE_SUPABASE_ANON_KEY`: Your Supabase Public Key.
    *   `VITE_API_URL`: The URL of your **Backend Web Service** (created in step 1), e.g., `https://goalhub-api.onrender.com`.

### 3. Final Wire-up
*   Update your frontend `src/config.js` or API calls to point to the `VITE_API_URL` instead of `localhost:5001`.

---

## ✅ Summary
1.  **Stop using In-Memory Storage** in `server.js` (Use Supabase).
2.  **Deploy Backend** to Render (Web Service).
3.  **Deploy Frontend** to Render (Static Site).
4.  **Connect** them via Environment Variables.
