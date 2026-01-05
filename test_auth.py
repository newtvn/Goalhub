import requests
import base64
import os
import json

# USER'S KEYS (From screenshot)
consumer_key = "SarzSrsccqf3Q1bWAxrFtQTY6hGFE6holz66M6G77voR9OB0"
consumer_secret = "5QGEWoAxocPPY3CIXYL5OD4uU8AaD84m7GsbBsdXO4OSOfCw1sc3K8VMLol2fvp9"
api_url = "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials"

string_to_encode = f"{consumer_key}:{consumer_secret}"
encoded_string = base64.b64encode(string_to_encode.encode("utf-8")).decode("utf-8")

headers = {
    "Authorization": f"Basic {encoded_string}"
}

print(f"Testing Auth with Key: {consumer_key}")
print(f"Encoded Auth: {encoded_string}")

try:
    response = requests.get(api_url, headers=headers)
    print(f"Status Code: {response.status_code}")
    print(f"Response Body: {response.text}")
except Exception as e:
    print(f"Error: {e}")
