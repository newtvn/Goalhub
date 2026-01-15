import dotenv from 'dotenv';
import axios from 'axios';
import { Buffer } from 'buffer';

dotenv.config();

const { MPESA_CONSUMER_KEY, MPESA_CONSUMER_SECRET } = process.env;

console.log("Checking Keys:");
console.log(`Key Length: ${MPESA_CONSUMER_KEY ? MPESA_CONSUMER_KEY.length : 'MISSING'}`);
console.log(`Secret Length: ${MPESA_CONSUMER_SECRET ? MPESA_CONSUMER_SECRET.length : 'MISSING'}`);

const run = async () => {
    const auth = Buffer.from(`${MPESA_CONSUMER_KEY}:${MPESA_CONSUMER_SECRET}`).toString('base64');
    const url = 'https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials';

    console.log(`\nAttempting to connect to: ${url}`);

    try {
        const https = await import('https');
        const agent = new https.Agent({ family: 4 });

        const response = await axios.get(url, {
            headers: { Authorization: `Basic ${auth}` },
            httpsAgent: agent
        });
        console.log("✅ SUCCESS! Token received:");
        console.log(response.data);
    } catch (error) {
        console.error("❌ FAILED:");
        if (error.response) {
            console.error("Status:", error.response.status);
            console.error("Data:", JSON.stringify(error.response.data, null, 2));
        } else {
            console.error(error.message);
        }
    }
};

run();
