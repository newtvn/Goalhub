# ⚽ GOALHUB - Football Turf Booking Platform

A modern, full-stack football turf booking platform with M-Pesa payment integration and Google Authentication. Built with React, Node.js, Express, and Firebase.

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![Node](https://img.shields.io/badge/node-%3E%3D16.0.0-brightgreen.svg)
![React](https://img.shields.io/badge/react-19.2.0-blue.svg)

---

## 🌟 Features

### 🎯 Core Features
- **Real-time Turf Booking** - Browse and book football turfs instantly
- **M-Pesa STK Push Integration** - Secure mobile payments via Safaricom M-Pesa
- **Google Authentication** - One-click sign-in with Google accounts
- **Multi-role Dashboard** - Separate views for Users, Managers, and Admins
- **Event Management** - Create and manage football events and tournaments
- **Booking Calendar** - Visual calendar for managing turf availability
- **Real-time Notifications** - In-app notifications for bookings and payments
- **Global Discount System** - Admin-controlled promotional discounts
- **QR Code Booking Confirmation** - Secure booking verification

### 🎨 UI/UX Features
- **Dark/Light Mode** - Beautiful themes with custom gradients
- **Fully Responsive** - Mobile-first design with Tailwind CSS
- **Smooth Animations** - Polished transitions and micro-interactions
- **Modern Glassmorphism** - Contemporary glass-like UI elements

### 🔐 Security Features
- **Helmet.js** - Security headers protection
- **Rate Limiting** - API request throttling
- **Input Validation** - Comprehensive data sanitization
- **Environment Variables** - Secure credential management
- **CORS Protection** - Cross-origin request security

### ⚡ Performance Features
- **Code Splitting** - Lazy loading for all pages to improved load times
- **Optimized Data Fetching** - Smart subscriptions to save bandwidth and costs
- **Image Optimization** - Next-gen WebP formats for faster rendering
- **Memoization** - Efficient re-rendering cycles

---

## 📋 Table of Contents

- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Application](#running-the-application)
- [Project Structure](#project-structure)
- [API Documentation](#api-documentation)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)

---

## 🚀 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v16.0.0 or higher)
- **npm** or **yarn**
- **Git**
- **Firebase Account** (for Google Authentication)
- **Safaricom Daraja API Account** (for M-Pesa integration)

---

## 📦 Installation

### 1. Clone the Repository

```bash
git clone https://github.com/newtvn/Goalhub.git
cd Goalhub
```

### 2. Install Dependencies

```bash
npm install
```

This will install all required packages for both frontend and backend.

---

## ⚙️ Configuration

### 1. Environment Variables

Copy the example environment file:

```bash
cp env.example .env
```

### 2. Configure Firebase (Google Authentication)

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project (or use existing)
3. Enable Google Sign-In:
   - Go to Authentication → Sign-in method
   - Enable Google provider
4. Get your Firebase config:
   - Project Settings → Your apps → Firebase SDK snippet
5. Update `.env` file with Firebase credentials:

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

📖 **Detailed Guide:** See [FIREBASE_SETUP_GUIDE.md](./FIREBASE_SETUP_GUIDE.md)

### 3. Configure M-Pesa Daraja API

1. Go to [Safaricom Daraja Portal](https://developer.safaricom.co.ke/)
2. Create an account and create a new app
3. Get your app credentials (Consumer Key & Secret)
4. For **Sandbox Testing**, use the provided test credentials
5. Update `.env` file with M-Pesa credentials:

```env
MPESA_CONSUMER_KEY=your_consumer_key
MPESA_CONSUMER_SECRET=your_consumer_secret
MPESA_PASSKEY=your_passkey
MPESA_SHORTCODE=your_shortcode
MPESA_ENV=sandbox  # Use 'production' for live
```

**Sandbox Test Credentials (Default):**
```env
MPESA_PASSKEY=bfb279f9aa9bdbcf158e97dd71a467cd2e0c893059b10f78e6b72ada1ed2c919
MPESA_SHORTCODE=174379
MPESA_ENV=sandbox
```

### 4. Additional Configuration

```env
NODE_ENV=development  # Options: development, production
PORT=5001            # Backend server port
```

---

## 🏃 Running the Application

### Development Mode

**Terminal 1 - Frontend:**
```bash
npm run dev
```
Frontend runs on: `http://localhost:5173`

**Terminal 2 - Backend:**
```bash
node server.js
```
Backend runs on: `http://localhost:5001`

### Production Build

```bash
# Build frontend for production
npm run build

# Preview production build
npm run preview
```

---

GOALHUB/
├── src/
│   ├── App.jsx              # Main React application (Lazy Loaded)
│   ├── firebase.js          # Firebase authentication & Firestore
│   ├── main.jsx             # App entry point
│   ├── index.css            # Global styles
│   ├── assets/              # Optimized static assets
│   ├── components/
│   │   ├── dashboard/       # Admin & User Dashboard Views
│   │   ├── layout/          # Navbar, Footer
│   │   ├── modals/          # Application Modals
│   │   └── ui/              # Reusable UI components
│   └── pages/               # Application Pages (Lazy Loaded)
├── server.js                # Express backend server
├── package.json             # Dependencies
├── vite.config.js           # Vite configuration
├── tailwind.config.js       # Tailwind CSS config
├── .env                     # Environment variables (not in git)
├── env.example              # Environment template
├── .gitignore               # Git ignore rules
├── README.md                # This file
└── FIREBASE_SETUP_GUIDE.md  # Firebase setup instructions
```

---

## 🔌 API Documentation

### Base URL
```
Development: http://localhost:5001/api
Production: https://yourdomain.com/api
```

### Endpoints

#### 1. Health Check
```http
GET /health
```
**Response:**
```json
{
  "status": "healthy",
  "timestamp": "2025-11-22T10:30:00.000Z",
  "uptime": 3600,
  "environment": "development",
  "mpesaEnv": "sandbox"
}
```

#### 2. Initiate M-Pesa Payment
```http
POST /api/stkpush
Content-Type: application/json

{
  "phone": "0712345678",
  "amount": 2500
}
```

**Response:**
```json
{
  "MerchantRequestID": "29115-34620561-1",
  "CheckoutRequestID": "ws_CO_191220191020363925",
  "ResponseCode": "0",
  "ResponseDescription": "Success. Request accepted for processing",
  "CustomerMessage": "Success. Request accepted for processing"
}
```

#### 3. Check Payment Status
```http
GET /api/payment-status/:checkoutRequestId
```

**Response:**
```json
{
  "status": "completed",
  "amount": 2500,
  "phone": "254712345678"
}
```

#### 4. M-Pesa Callback (Webhook)
```http
POST /api/callback
```
*This endpoint is called by Safaricom after payment processing*

### Rate Limits

- **General API:** 100 requests per 15 minutes (production)
- **Payment Endpoints:** 10 requests per 15 minutes

---

## 🚀 Deployment

### Frontend Deployment (Vercel/Netlify)

1. **Build the application:**
```bash
npm run build
```

2. **Deploy to Vercel:**
```bash
npm i -g vercel
vercel
```

3. **Configure environment variables** in your hosting platform dashboard

### Backend Deployment (Heroku/Railway/DigitalOcean)

1. **Set environment variables** on your hosting platform

2. **For Heroku:**
```bash
heroku create goalhub-api
git push heroku main
heroku config:set MPESA_CONSUMER_KEY=your_key
heroku config:set MPESA_CONSUMER_SECRET=your_secret
# ... set all other environment variables
```

3. **For Railway:**
- Connect GitHub repository
- Add environment variables in settings
- Deploy automatically on push

### Important Production Checklist

- [ ] Set `NODE_ENV=production`
- [ ] Use production Firebase credentials
- [ ] Use production M-Pesa credentials
- [ ] Set `MPESA_ENV=production`
- [ ] Configure proper callback URL
- [ ] Enable HTTPS/SSL
- [ ] Set up database (replace in-memory storage)
- [ ] Configure proper CORS origins
- [ ] Set up monitoring and logging
- [ ] Configure backup system
- [ ] Test payment flow thoroughly

📖 **Detailed Guide:** See [PRODUCTION_READY.md](./PRODUCTION_READY.md)

---

## 🧪 Testing

### Test Credentials

**Login:**
- Admin: Username contains "admin"
- Manager: Username contains "manager"
- User: Any other username

**Test M-Pesa (Sandbox):**
- Use Safaricom test numbers
- PIN: 1234 (default sandbox PIN)

### Running Tests

```bash
# Run linter
npm run lint

# Preview production build
npm run preview
```

📖 **Detailed Guide:** See [TESTING_GUIDE.md](./TESTING_GUIDE.md)

---

## 🔒 Security Best Practices

1. **Never commit `.env` file** to version control
2. **Use strong, unique credentials** for production
3. **Enable HTTPS/SSL** in production
4. **Rotate API keys** periodically
5. **Monitor API usage** for suspicious activity
6. **Keep dependencies updated:** `npm audit fix`
7. **Use database** instead of in-memory storage for production
8. **Implement proper authentication** and session management
9. **Set up error monitoring** (e.g., Sentry)
10. **Regular backups** of user data

---

## 🐛 Troubleshooting

### Common Issues

**1. Firebase initialization error**
```
Error: Firebase: Error (auth/configuration-not-found)
```
**Solution:** Check that Firebase credentials in `.env` are correct

**2. M-Pesa connection failed**
```
Error: STK Push failed
```
**Solution:** Verify M-Pesa credentials and ensure you're using correct environment (sandbox/production)

**3. Port already in use**
```
Error: listen EADDRINUSE: address already in use :::5001
```
**Solution:** Change PORT in `.env` or kill process using the port

**4. CORS errors**
```
Access to fetch blocked by CORS policy
```
**Solution:** Verify frontend URL is in CORS whitelist in `server.js`

---

## 📚 Additional Documentation

- [Firebase Setup Guide](./FIREBASE_SETUP_GUIDE.md) - Complete Firebase configuration

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👥 Authors

- **Brian Newton** - *Initial work* - [newtvn](https://github.com/newtvn)

---

## 🙏 Acknowledgments

- Safaricom Daraja API for M-Pesa integration
- Firebase for authentication services
- Tailwind CSS for styling
- Lucide React for beautiful icons
- The open-source community

---

## 📞 Support

For support, email: support@goalhub.ke

Or open an issue on [GitHub Issues](https://github.com/newtvn/Goalhub/issues)

---

## 🗺️ Roadmap

- [ ] Add booking history and analytics
- [ ] Implement real database (PostgreSQL/MongoDB)
- [ ] Add email/SMS notifications
- [ ] Multi-language support
- [ ] Mobile app (React Native)
- [ ] Advanced booking filters
- [ ] Customer reviews and ratings
- [ ] Loyalty points system
- [ ] Integration with more payment gateways
- [ ] API for third-party integrations

---

**Made with ❤️ in Kenya** 🇰🇪

⚽ **GOALHUB** - *Where Football Dreams Come True*
