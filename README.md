# GOALHUB - Football Turf Booking Platform

A full-stack football turf booking platform integrating M-Pesa payments and Google Authentication. Built using the React ecosystem and Node.js.

## Technology Stack

*   **Frontend**: React, Vite, Tailwind CSS
*   **Backend**: Node.js, Express, Axios
*   **Database & Auth**: Firebase (Firestore, Authentication)
*   **Payments**: Safaricom Daraja API (M-Pesa STK Push)

---

## Features

### Core Functionality
*   **Real-time Availability**: Instant browsing and booking of football turfs.
*   **Payment Integration**: Secure mobile payments via Safaricom M-Pesa STK Push.
*   **Authentication**: Google Sign-In integration for seamless user access.
*   **Role-Based Access**: Distinct interfaces for Users, Managers, and Administrators.
*   **Event Management**: Tools for scheduling and organizing tournaments.

### Performance & UX
*   **Optimized Rendering**: Lazy loading and code splitting for improved performance.
*   **Responsive Design**: Mobile-first architecture ensuring compatibility across devices.
*   **Data Efficiency**: Smart data subscriptions to minimize bandwidth usage.
*   **Image Optimization**: implementation of WebP formats for faster load times.

---

## Prerequisites

Ensure the following tools are installed before setup:
*   Node.js (v16.0.0 or higher)
*   npm or yarn
*   Git

You will also need valid accounts for:
*   Firebase (for Google Authentication)
*   Safaricom Daraja API (for payment processing)

---

## Installation

1.  **Clone the Repository**
    ```bash
    git clone https://github.com/newtvn/Goalhub.git
    cd Goalhub
    ```

2.  **Install Dependencies**
    ```bash
    npm install
    ```

---

## Configuration

### Environment Variables

Create a .env file in the root directory by copying the example:
```bash
cp env.example .env
```

### Firebase Configuration

Update the .env file with your Firebase credentials (obtained from the Firebase Console):

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

### M-Pesa Configuration

Update the .env file with your Safaricom Daraja API credentials:

```env
MPESA_CONSUMER_KEY=your_consumer_key
MPESA_CONSUMER_SECRET=your_consumer_secret
MPESA_PASSKEY=your_passkey
MPESA_SHORTCODE=your_shortcode
MPESA_ENV=sandbox  # Change to 'production' for live deployment
```

### Server Configuration

```env
NODE_ENV=development
PORT=5001
```

---

## Usage

### Development Mode

Start the development servers for both frontend and backend:

**Frontend (Terminal 1)**
```bash
npm run dev
```
Access at: http://localhost:5173

**Backend (Terminal 2)**
```bash
node server.js
```
Access at: http://localhost:5001

### Production Build

To build the application for production:

```bash
npm run build
```

To preview the production build locally:
```bash
npm run preview
```

---

## Project Structure

```
GOALHUB/
├── src/
│   ├── App.jsx              # Main React application
│   ├── firebase.js          # Firebase configuration & services
│   ├── main.jsx             # Entry point
│   ├── index.css            # Global styles
│   ├── assets/              # Static assets
│   ├── components/
│   │   ├── dashboard/       # Dashboard views & logic
│   │   ├── layout/          # Navigation & Footer
│   │   ├── modals/          # UI Modals
│   │   └── ui/              # Shared UI components
│   └── pages/               # Route pages (Lazy Loaded)
├── server.js                # Express backend
├── package.json             # Dependencies
├── vite.config.js           # Vite config
├── tailwind.config.js       # Tailwind config
└── .env                     # Environment variables
```

---

## API Documentation

The backend exposes the following REST endpoints:

### Health Check

`GET /health`
Returns the operational status of the API and its services.

### Payments (`/api`)

*   `POST /stkpush`: Initiates an M-Pesa payment request.
    *   Body: `{ phone: string, amount: number }`
*   `GET /payment-status/:checkoutRequestId`: Retrieves the status of a specific transaction.
*   `POST /callback`: Webhook endpoint for Safaricom IPN callbacks.

---

## Deployment

### Frontend (`Vercel`, `Netlify`)
1.  Build the project using `npm run build`.
2.  Deploy the generated `dist` folder.
3.  Configure all VITE_ prefixed environment variables in the hosting dashboard.

### Backend (`Heroku`, `Railway`, `Render`)
1.  Deploy the root directory.
2.  Set the start command to `node server.js`.
3.  Configure all server-side environment variables (MPESA keys, PORT, NODE_ENV).

---

## License

This project is licensed under the MIT License.
