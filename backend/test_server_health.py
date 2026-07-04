import httpx
try:
    response = httpx.get("http://127.0.0.1:8000/", timeout=3.0)
    print("Status:", response.status_code)
    print("Content:", response.text)
except Exception as e:
    print("Health check failed:", e)
