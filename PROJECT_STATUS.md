# GoalHub - Project Status & Production Roadmap

## 1. Project Overview
GoalHub is a football turf booking platform built with:
- **Frontend**: React (Vite), TailwindCSS, Lucide Icons.
- **Backend**: Node.js, Express.
- **Database**: Firebase Firestore (Client-side usage).
- **Payments**: Safaricom M-Pesa Daraja API.

## 2. Refactoring Status (Completed)
We have successfully begun moving from a monolithic `App.jsx` to a modular architecture:
- **Theme**: Moved to `src/theme/index.js`.
- **Mock Data**: Moved to `src/data/mockData.jsx`.
- **Components**:
  - `Navbar`: Extracted to `src/components/Navbar.jsx`.
  - `Footer`: Extracted to `src/components/Footer.jsx`.
  - `NotificationsPanel`: Extracted to `src/components/NotificationsPanel.jsx`.
- **Utils**: Created `src/utils/calendarUtils.js` for logic extraction.

## 3. Production Checklist (ToDo)

### A. Codebase Organization
- [ ] **Split App Pages**: Move `LandingView`, `DashboardView`, `EventsView` into `src/pages/`.
- [ ] **State Management**: Refactor strict prop-drilling into `React.Context` (e.g., `BookingContext`, `AuthContext`) to clean up `App.jsx` state.

### B. Security
- [ ] **Firestore Rules**: Lock down database. Currently assumes Test Mode.
  ```javascript
  match /bookings/{id} { allow read, write: if request.auth != null; }
  ```
- [ ] **Environment Variables**: ensure `.env` is ignored in Git (it is).
- [ ] **Backend Security**: `server.js` has basic Rate Limiting. Ensure `helmet` and `cors` are strictly configured for Production domains.

### C. M-Pesa Integration
- [ ] **Callback URL**: Update `CALLBACK_URL` in `.env` to a real public HTTPS domain (e.g., via Railway/Render/Vercel) so Safaricom can notify you.
- [ ] **Remove Simulation**: In `server.js`, ensure the `SIMULATED_TOKEN_AUTH_FAILED` logic is strictly wrapped in `if (process.env.NODE_ENV === 'development')`.

### D. Performance
- [ ] **Lazy Loading**: Use `React.lazy()` for heavy views like the Dashboard.
- [ ] **Image Optimization**: Serve images from a CDN (Cloudinary/Firebase) instead of raw Unsplash URLs for faster load times.

## 4. Workflows
- **Development**: `npm run dev` + `node server.js`
- **Build**: `npm run build`
