import express from 'express';
import cors from 'cors';
import axios from 'axios';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import { Buffer } from 'buffer';
import process from 'process';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware - Configure CORS to allow frontend
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    const allowedOrigins = [
      'http://localhost:5173',
      'http://localhost:5174',
      'http://127.0.0.1:5173',
      'http://127.0.0.1:5174'
    ];
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(null, true); // Allow all origins in development
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(bodyParser.json());

// --- YOUR M-PESA CREDENTIALS ---
const CONSUMER_KEY = 'wAprHUGMSnk3T6mSXzaA05QhUi9oaxiB1xqDiNKYkcVHNCwW';
const CONSUMER_SECRET = 'dzubJlzmo1F4erfAoAt6CqU9AlnNx7sXpUi3AwBML3nU4ukGJofyYlAQcFfE1nDH';
const PASSKEY = 'bfb279f9aa9bdbcf158e97dd71a467cd2e0c893059b10f78e6b72ada1ed2c919'; // Standard Sandbox Passkey
const SHORTCODE = '174379'; // Standard Sandbox Paybill

// --- HELPER: GENERATE TOKEN ---
const getAccessToken = async () => {
  const auth = Buffer.from(`${CONSUMER_KEY}:${CONSUMER_SECRET}`).toString('base64');
  try {
    const response = await axios.get(
      'https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials',
      {
        headers: {
          Authorization: `Basic ${auth}`,
        },
      }
    );
    return response.data.access_token;
  } catch (error) {
    console.error("❌ Token Generation Failed:", error.response ? error.response.data : error.message);
    throw error;
  }
};

// In-memory storage for payment tracking (In production, use a database)
const pendingPayments = new Map();

// --- ROUTE: INITIATE STK PUSH ---
app.post('/api/stkpush', async (req, res) => {
  const { phone, amount } = req.body;

  if (!phone || !amount) {
    return res.status(400).json({ error: 'Phone and Amount required' });
  }

  // Format Phone to 254...
  let formattedPhone = phone.replace(/\D/g, ''); // Remove non-digits
  if (formattedPhone.startsWith('0')) formattedPhone = '254' + formattedPhone.substring(1);
  if (formattedPhone.startsWith('7') || formattedPhone.startsWith('1')) formattedPhone = '254' + formattedPhone;

  console.log(`📲 Initiating STK Push to: ${formattedPhone}, Amount: ${amount}`);

  try {
    const accessToken = await getAccessToken();
    console.log("✅ Access Token Generated");
    
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
        CallBackURL: `http://localhost:${PORT}/api/callback`, // Callback URL for payment confirmation
        AccountReference: "GoalHub",
        TransactionDesc: "Turf Booking"
    };

    const response = await axios.post(
      'https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest',
      stkPayload,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    console.log("✅ STK Push Response:", response.data);
    
    // Store the CheckoutRequestID for tracking
    if (response.data.CheckoutRequestID) {
      pendingPayments.set(response.data.CheckoutRequestID, {
        phone: formattedPhone,
        amount: amount,
        status: 'pending',
        timestamp: Date.now()
      });
    }
    
    res.json(response.data);

  } catch (error) {
    console.error("❌ STK Push Error:", error.response ? error.response.data : error.message);
    res.status(500).json({ 
        error: 'STK Push failed', 
        details: error.response ? error.response.data : error.message 
    });
  }
});

// --- ROUTE: M-PESA CALLBACK ---
// This endpoint receives payment confirmation from Safaricom
app.post('/api/callback', (req, res) => {
  console.log("📩 M-Pesa Callback Received:");
  console.log(JSON.stringify(req.body, null, 2));
  
  const { Body } = req.body;
  
  if (Body && Body.stkCallback) {
    const { CheckoutRequestID, ResultCode, ResultDesc } = Body.stkCallback;
    
    if (pendingPayments.has(CheckoutRequestID)) {
      const payment = pendingPayments.get(CheckoutRequestID);
      
      if (ResultCode === 0) {
        // Payment successful
        payment.status = 'completed';
        console.log(`✅ Payment Successful for ${payment.phone}: KES ${payment.amount}`);
      } else {
        // Payment failed or cancelled
        payment.status = 'failed';
        console.log(`❌ Payment Failed: ${ResultDesc}`);
      }
      
      pendingPayments.set(CheckoutRequestID, payment);
    }
  }
  
  // Always respond with 200 to acknowledge receipt
  res.json({ ResultCode: 0, ResultDesc: "Callback received" });
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

app.listen(PORT, () => {
  console.log(`🚀 Backend running on http://localhost:${PORT}`);
});