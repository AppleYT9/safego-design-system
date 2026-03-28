import uvicorn
import sys

if __name__ == "__main__":
    try:
        print("Starting uvicorn...")
        uvicorn.run("app.main:app", host="127.0.0.1", port=8000, reload=False)
    except Exception as e:
        print(f"FAILED TO START UVICORN: {e}")
        sys.exit(1)
