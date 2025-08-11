from flask import Flask, jsonify
import psycopg2
import os
from dotenv import load_dotenv

load_dotenv()  # Charge le fichier .env

app = Flask(__name__)

def get_connection():
    return psycopg2.connect(
        host=os.getenv("PGHOST"),
        port=os.getenv("PGPORT"),
        user=os.getenv("PGUSER"),
        password=os.getenv("PGPASSWORD"),
        dbname=os.getenv("PGDATABASE"),
        sslmode="require" if os.getenv("PGSSL") == "true" else "disable"
    )

@app.route('/clients')
def clients():
    conn = get_connection()
    cur = conn.cursor()
    cur.execute("SELECT nom, prenom FROM souscription_auto LIMIT 10;")
    rows = cur.fetchall()
    cur.close()
    conn.close()
    return jsonify(rows)

if __name__ == "__main__":
    app.run(debug=True)
