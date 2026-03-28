try:
    print("Importing app...")
    from app.main import app
    print("Import successful!")
except Exception as e:
    import traceback
    print(f"IMPORT FAILED: {e}")
    traceback.print_exc()
