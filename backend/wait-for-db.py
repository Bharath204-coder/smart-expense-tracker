import time
import psycopg2
import os

db_url = os.getenv("DATABASE_URL")

while True:
    try:
        conn = psycopg2.connect(db_url)
        conn.close()
        break
    except Exception as e:
        print("Waiting for database...")
        time.sleep(2)

print("Database ready!")