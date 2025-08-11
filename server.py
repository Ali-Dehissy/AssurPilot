from flask import Flask, jsonify
import psycopg2
import os
from dotenv import load_dotenv

load_dotenv()

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

@app.route('/all_data')
def all_data():
    conn = get_connection()
    cur = conn.cursor()

    # Exemple simple avec jointure (à adapter selon tes clés)
    query = """
    SELECT
      sa.nom, sa.prenom, sa.voiture, 
      sv.matricule_fiscale, 
      r.montant, r.date_recouvrement
    FROM souscription_auto sa
    LEFT JOIN souscription_vie sv ON sa.client_id = sv.client_id
    LEFT JOIN recouvrement r ON sa.client_id = r.client_id
    LIMIT 20;
    """

    cur.execute(query)
    rows = cur.fetchall()
    cur.close()
    conn.close()

    columns = ["nom", "prenom", "voiture", "matricule_fiscale", "montant", "date_recouvrement"]
    result = [dict(zip(columns, row)) for row in rows]

    return jsonify(result)

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port, debug=True)
