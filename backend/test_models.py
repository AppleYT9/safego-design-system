import sys
import time

def test_import(module_name):
    print(f"Importing {module_name}...", end="", flush=True)
    start = time.time()
    try:
        __import__(module_name)
        print(f" OK ({time.time() - start:.2f}s)")
    except Exception as e:
        print(f" FAILED: {e}")

print("--- Testing Model Imports ---")
test_import("app.models")
print("Done.")
