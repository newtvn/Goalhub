import express from 'express';
import cors from 'cors';
import axios from 'axios';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import { Buffer } from 'buffer';
import process from 'process';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;
const NODE_ENV = process.env.NODE_ENV || 'development';

// Middleware - Configure CORS to allow frontend (including network access)
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);

    // In development, allow all origins for easier testing
    if (NODE_ENV === 'development') {
      return callback(null, true);
    }

    const allowedOrigins = [
      'http://localhost:5173',
      'http://localhost:5174',
      'http://127.0.0.1:5173',
      'http://127.0.0.1:5174'
    ];

    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(null, false);
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  credentials: true,
  optionsSuccessStatus: 200
};

// Security middleware
app.use(helmet({
  contentSecurityPolicy: NODE_ENV === 'production' ? undefined : false,
  crossOriginEmbedderPolicy: false,
  crossOriginOpenerPolicy: { policy: 'same-origin-allow-popups' }, // Allow Firebase Auth popups
}));

app.use(cors(corsOptions));
app.use(bodyParser.json({ limit: '10kb' })); // Limit body size
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: NODE_ENV === 'production' ? 100 : 1000, // limit each IP to 100 requests per windowMs in production
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

app.use('/api/', limiter);

// Specific rate limit for payment endpoints (more restrictive)
const paymentLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10, // 10 payment requests per 15 minutes
  message: 'Too many payment requests, please try again later.',
});

app.use('/api/stkpush', paymentLimiter);

// --- M-PESA CREDENTIALS FROM ENVIRONMENT VARIABLES ---
const CONSUMER_KEY = process.env.MPESA_CONSUMER_KEY;
const CONSUMER_SECRET = process.env.MPESA_CONSUMER_SECRET;
const PASSKEY = process.env.MPESA_PASSKEY;
const SHORTCODE = process.env.MPESA_SHORTCODE;
const MPESA_ENV = process.env.MPESA_ENV || 'sandbox'; // 'sandbox' or 'production'

// Validate required environment variables
const requiredEnvVars = ['MPESA_CONSUMER_KEY', 'MPESA_CONSUMER_SECRET', 'MPESA_PASSKEY', 'MPESA_SHORTCODE'];
const missingEnvVars = requiredEnvVars.filter(varName => !process.env[varName]);

if (missingEnvVars.length > 0) {
  console.error(`❌ Missing required environment variables: ${missingEnvVars.join(', ')}`);
  console.error('Please check your .env file and ensure all M-Pesa credentials are set.');
  process.exit(1);
}

// --- HELPER: GENERATE TOKEN ---
const getAccessToken = async () => {
  const auth = Buffer.from(`${CONSUMER_KEY}:${CONSUMER_SECRET}`).toString('base64');
  const mpesaUrl = MPESA_ENV === 'production' 
    ? 'https://api.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials'
    : 'https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials';
  
  try {
    const response = await axios.get(mpesaUrl, {
      headers: {
        Authorization: `Basic ${auth}`,
      },
    });
    return response.data.access_token;
  } catch (error) {
    console.error("❌ Token Generation Failed:", error.response ? error.response.data : error.message);
    throw error;
  }
};

// In-memory storage for payment tracking (In production, use a database like PostgreSQL or MongoDB)
const pendingPayments = new Map();

// Logger helper
const logger = {
  info: (message, data = {}) => {
    console.log(`ℹ️ [INFO] ${new Date().toISOString()} - ${message}`, data);
  },
  error: (message, error = {}) => {
    console.error(`❌ [ERROR] ${new Date().toISOString()} - ${message}`, {
      message: error.message,
      stack: NODE_ENV === 'development' ? error.stack : undefined,
      ...error
    });
  },
  warn: (message, data = {}) => {
    console.warn(`⚠️ [WARN] ${new Date().toISOString()} - ${message}`, data);
  },
  success: (message, data = {}) => {
    console.log(`✅ [SUCCESS] ${new Date().toISOString()} - ${message}`, data);
  }
};

// --- HELPER: INPUT VALIDATION ---
const validatePhoneNumber = (phone) => {
  const phoneRegex = /^(\+?254|0)?[17]\d{8}$/;
  return phoneRegex.test(phone.replace(/\s/g, ''));
};

const validateAmount = (amount) => {
  const numAmount = Number(amount);
  return !isNaN(numAmount) && numAmount > 0 && numAmount <= 300000; // Max 300K KES
};

// --- ROUTE: INITIATE STK PUSH ---
app.post('/api/stkpush', async (req, res) => {
  const { phone, amount } = req.body;

  // Validate input
  if (!phone || !amount) {
    return res.status(400).json({ 
      error: 'Missing required fields',
      message: 'Phone number and amount are required' 
    });
  }

  // Validate phone number format
  if (!validatePhoneNumber(phone)) {
    return res.status(400).json({ 
      error: 'Invalid phone number',
      message: 'Please provide a valid Kenyan phone number' 
    });
  }

  // Validate amount
  if (!validateAmount(amount)) {
    return res.status(400).json({ 
      error: 'Invalid amount',
      message: 'Amount must be between 1 and 300,000 KES' 
    });
  }

  // Format Phone to 254...
  let formattedPhone = phone.replace(/\D/g, ''); // Remove non-digits
  if (formattedPhone.startsWith('0')) formattedPhone = '254' + formattedPhone.substring(1);
  if (formattedPhone.startsWith('7') || formattedPhone.startsWith('1')) formattedPhone = '254' + formattedPhone;

  // Ensure phone is exactly 12 digits (254XXXXXXXXX)
  if (formattedPhone.length !== 12) {
    return res.status(400).json({ 
      error: 'Invalid phone number format',
      message: 'Phone number must be a valid Kenyan number' 
    });
  }

  logger.info('Initiating STK Push', { phone: formattedPhone, amount });

  try {
    const accessToken = await getAccessToken();
    logger.success('Access Token Generated');
    
    const date = new Date();
    const timestamp = date.getFullYear() +
      ("0" + (date.getMonth() + 1)).slice(-2) +
      ("0" + date.getDate()).slice(-2) +
      ("0" + date.getHours()).slice(-2) +
      ("0" + date.getMinutes()).slice(-2) +
      ("0" + date.getSeconds()).slice(-2);

    const password = Buffer.from(`${SHORTCODE}${PASSKEY}${timestamp}`).toString('base64');

    const stkPayload = {
        BusinessShortCode: SHORTCODE,
        Password: password,
        Timestamp: timestamp,
        TransactionType: "CustomerPayBillOnline",
        Amount: Math.ceil(amount),
        PartyA: formattedPhone,
        PartyB: SHORTCODE,
        PhoneNumber: formattedPhone,
        CallBackURL: `${process.env.CALLBACK_URL || `http://localhost:${PORT}`}/api/callback`, // Callback URL for payment confirmation
        AccountReference: "GoalHub",
        TransactionDesc: "Turf Booking"
    };

    const stkUrl = MPESA_ENV === 'production'
      ? 'https://api.safaricom.co.ke/mpesa/stkpush/v1/processrequest'
      : 'https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest';
    
    const response = await axios.post(stkUrl, stkPayload, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    logger.success('STK Push Initiated', { 
      checkoutRequestId: response.data.CheckoutRequestID,
      responseCode: response.data.ResponseCode 
    });
    
    // Store the CheckoutRequestID for tracking
    if (response.data.CheckoutRequestID) {
      pendingPayments.set(response.data.CheckoutRequestID, {
        phone: formattedPhone,
        amount: amount,
        status: 'pending',
        timestamp: Date.now(),
        createdAt: new Date().toISOString()
      });
      logger.info('Payment tracking initialized', { checkoutRequestId: response.data.CheckoutRequestID });
    }
    
    res.json(response.data);

  } catch (error) {
    logger.error('STK Push failed', {
      phone: formattedPhone,
      amount,
      error: error.response?.data || error.message
    });
    
    res.status(500).json({ 
      error: 'Payment initiation failed', 
      message: 'Unable to process payment. Please try again.',
      ...(NODE_ENV === 'development' && { 
        details: error.response?.data || error.message 
      })
    });
  }
});

// --- ROUTE: M-PESA CALLBACK ---
// This endpoint receives payment confirmation from Safaricom
app.post('/api/callback', (req, res) => {
  logger.info('M-Pesa Callback Received', { body: req.body });
  
  try {
    const { Body } = req.body;
    
    if (!Body || !Body.stkCallback) {
      logger.warn('Invalid callback format received');
      return res.json({ ResultCode: 0, ResultDesc: "Callback received" });
    }
    
    const { CheckoutRequestID, ResultCode, ResultDesc, CallbackMetadata } = Body.stkCallback;
    
    if (pendingPayments.has(CheckoutRequestID)) {
      const payment = pendingPayments.get(CheckoutRequestID);
      
      if (ResultCode === 0) {
        // Payment successful
        payment.status = 'completed';
        payment.completedAt = new Date().toISOString();
        payment.metadata = CallbackMetadata;
        
        logger.success('Payment Completed', {
          checkoutRequestId: CheckoutRequestID,
          phone: payment.phone,
          amount: payment.amount
        });
      } else {
        // Payment failed or cancelled
        payment.status = 'failed';
        payment.failedAt = new Date().toISOString();
        payment.failureReason = ResultDesc;
        
        logger.warn('Payment Failed', {
          checkoutRequestId: CheckoutRequestID,
          resultCode: ResultCode,
          reason: ResultDesc
        });
      }
      
      pendingPayments.set(CheckoutRequestID, payment);
    } else {
      logger.warn('Received callback for unknown CheckoutRequestID', { CheckoutRequestID });
    }
    
    // Always respond with 200 to acknowledge receipt
    res.json({ ResultCode: 0, ResultDesc: "Callback received successfully" });
  } catch (error) {
    logger.error('Error processing M-Pesa callback', error);
    res.json({ ResultCode: 0, ResultDesc: "Callback received" });
  }
});

// --- ROUTE: CHECK PAYMENT STATUS ---
// Frontend can poll this endpoint to check if payment is complete
app.get('/api/payment-status/:checkoutRequestId', (req, res) => {
  const { checkoutRequestId } = req.params;
  
  if (pendingPayments.has(checkoutRequestId)) {
    const payment = pendingPayments.get(checkoutRequestId);
    res.json({ 
      status: payment.status,
      amount: payment.amount,
      phone: payment.phone
    });
  } else {
    res.status(404).json({ error: 'Payment not found' });
  }
});

// --- HEALTH CHECK ENDPOINTS ---
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: NODE_ENV,
    mpesaEnv: MPESA_ENV
  });
});

app.get('/api/health', (req, res) => {
  const healthcheck = {
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: NODE_ENV,
    services: {
      mpesa: MPESA_ENV,
      paymentsTracking: pendingPayments.size
    }
  };
  
  res.status(200).json(healthcheck);
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: `Cannot ${req.method} ${req.path}`,
    timestamp: new Date().toISOString()
  });
});

// Global error handler
app.use((err, req, res) => {
  logger.error('Unhandled error', err);
  
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error',
    ...(NODE_ENV === 'development' && { stack: err.stack })
  });
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('👋 SIGTERM signal received: closing HTTP server');
  app.close(() => {
    console.log('✅ HTTP server closed');
  });
});

const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Backend running on http://0.0.0.0:${PORT}`);
  console.log(`📊 Environment: ${NODE_ENV}`);
  console.log(`💳 M-Pesa Mode: ${MPESA_ENV}`);
  console.log(`🌐 Network: Exposed to all interfaces`);
});

export default server;