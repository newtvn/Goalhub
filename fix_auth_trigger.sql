-- SAFER VERSION: Disable trigger temporarily
-- Run this to remove the problematic trigger

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

-- The AuthContext.jsx will handle user creation instead via fallback logic
