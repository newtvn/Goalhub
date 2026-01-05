
import axios from 'axios';
import { Buffer } from 'buffer';

const MPESA_CONSUMER_KEY = "SarzSrsccqf3Q1bWAxrFtQTY6hGFE6holz66M6G77voR9OB0";
const MPESA_CONSUMER_SECRET = "5QGEWoAxocPPY3CIXYL5OD4uU8AaD84m7GsbBsdXO4OSOfCw1sc3K8VMLol2fvp9";

console.log("Checking Keys Hardcoded:");
console.log(`Key: ${MPESA_CONSUMER_KEY}`);
console.log(`Secret: ${MPESA_CONSUMER_SECRET}`);

const run = async () => {
    // Manually construct base64 to ensure no hidden characters
    const auth = Buffer.from(`${MPESA_CONSUMER_KEY}:${MPESA_CONSUMER_SECRET}`, 'utf-8').toString('base64');
    const url = 'https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials';

    console.log(`\nAttempting to connect to: ${url}`);
    console.log(`Auth Header: Basic ${auth}`);

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
