from flask import Flask, jsonify, request
import psycopg2
import os
from flask_cors import CORS
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
CORS(app)

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


@app.route('/filter_clients', methods=['POST'])
def filter_clients():
    criteria = request.json
    
    query = """
    SELECT
      sv.nom, sv.prenom, sa.voiture, sv.matricule_fiscale, sv.age, r.montant, r.date_recouvrement, sv.ge
    FROM souscription_vie sv
    LEFT JOIN souscription_auto sa ON sv.client_id = sa.client_id
    LEFT JOIN recouvrement r ON sv.client_id = r.client_id
    WHERE 1=1
    """

    params = []

    if criteria.get('ageMin'):
        query += " AND sv.age >= %s"
        params.append(int(criteria['ageMin']))

    if criteria.get('ageMax'):
        query += " AND sv.age <= %s"
        params.append(int(criteria['ageMax']))

    if criteria.get('hasMatriculeFiscale') == 'yes':
        query += " AND sv.matricule_fiscale IS NOT NULL AND sv.matricule_fiscale != ''"
    elif criteria.get('hasMatriculeFiscale') == 'no':
        query += " AND (sv.matricule_fiscale IS NULL OR sv.matricule_fiscale = '')"

    if criteria.get('hasAssuranceAuto') == 'yes':
        query += " AND sa.client_id IS NOT NULL"
    elif criteria.get('hasAssuranceAuto') == 'no':
        query += " AND sa.client_id IS NULL"

    if criteria.get('anciennete'):
        query += " AND sv.ge >= %s"
        params.append(int(criteria['anciennete']))

    if criteria.get('voitureType'):
        query += " AND sa.voiture = %s"
        params.append(criteria['voitureType'])

    query += " LIMIT 100"

    conn = get_connection()
    cur = conn.cursor()
    cur.execute(query, params)
    rows = cur.fetchall()
    cur.close()
    conn.close()

    columns = ["nom", "prenom", "voiture", "matricule_fiscale", "age", "montant", "date_recouvrement", "ge"]
    result = [dict(zip(columns, row)) for row in rows]

    return jsonify(result)


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port, debug=True)
