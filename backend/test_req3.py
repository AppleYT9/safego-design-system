import urllib.request
from urllib.error import HTTPError

req = urllib.request.Request('http://localhost:8000/api/auth/register', method='OPTIONS')
req.add_header('Origin', 'http://192.168.1.5:5173')
req.add_header('Access-Control-Request-Method', 'POST')
req.add_header('Access-Control-Request-Headers', 'content-type')

try:
    resp = urllib.request.urlopen(req)
    print("Status:", resp.getcode())
    print("Headers:", resp.headers)
    print("Body:", resp.read())
except HTTPError as e:
    print("Status:", e.code)
    print("Headers:", e.headers)
    print("Body:", e.read())
except Exception as e:
    print("Error:", e)
