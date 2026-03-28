import sqlite3
try:
    conn = sqlite3.connect('safego.db')
    cursor = conn.cursor()
    cursor.execute("SELECT name FROM sqlite_master WHERE type='table';")
    tables = cursor.fetchall()
    print(f"Tables in safego.db: {[t[0] for t in tables]}")
    conn.close()
except Exception as e:
    print(f"Error checking database: {e}")
