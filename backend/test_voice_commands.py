import requests
import json

BASE_URL = "http://127.0.0.1:8000"

def test_command(cmd_text):
    print(f"\nTesting: '{cmd_text}'")
    url = f"{BASE_URL}/api/voice/voice-command"
    payload = {"command": cmd_text}
    try:
        response = requests.post(url, json=payload)
        if response.status_code == 200:
            data = response.json()
            print(f"Action:   {data.get('action')}")
            print(f"Target:   {data.get('target')}")
            print(f"Feedback: {data.get('feedback')}")
        else:
            print(f"Error {response.status_code}: {response.text}")
    except Exception as e:
        print(f"Request failed: {e}")

if __name__ == "__main__":
    commands = [
        "open the features",
        "show me the features",
        "features",
        "what can you do",
        "help",
        "book a pink ride to the airport",
        "sos emergency"
    ]
    
    for cmd in commands:
        test_command(cmd)
