import socket
s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
try:
    s.bind(("127.0.0.1", 8000))
    print("Successfully bound to 127.0.0.1:8000")
except Exception as e:
    print(f"Failed to bind to 127.0.0.1:8000: {e}")
finally:
    s.close()

s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
try:
    s.bind(("0.0.0.0", 8000))
    print("Successfully bound to 0.0.0.0:8000")
except Exception as e:
    print(f"Failed to bind to 0.0.0.0:8000: {e}")
finally:
    s.close()
