from flask import Flask, jsonify
from flask_cors import CORS
from datetime import datetime

app = Flask(__name__)
CORS(app)

# Mock data for DHB banking accounts
def generate_mock_data():
    return {
        "accounts": [
            {
                "id": "saveonline_001",
                "name": "DHB SaveOnline",
                "type": "savings",
                "balance": 10566.55,
                "currency": "EUR",
                "iban": "NL24DHBN2018470578",
                "interest_rate": 1.1,
                "holder_name": "Lucy Lavender"
            },
            {
                "id": "maxispaar_001", 
                "name": "DHB MaxiSpaar",
                "type": "savings",
                "balance": 31960.23,
                "currency": "EUR",
                "iban": "NL24DHBN2018470579",
                "interest_rate": 1.1,
                "holder_name": "Lucy Lavender"
            }
        ],
        "combispaar_accounts": [
            {
                "id": "combispaar_001",
                "name": "DHB Combispaar Account 1",
                "type": "savings",
                "balance": 12500.00,
                "currency": "EUR",
                "iban": "NL24DHBN2018470581",
                "interest_rate": 1.1,
                "holder_name": "Lucy Lavender"
            },
            {
                "id": "combispaar_002",
                "name": "DHB Combispaar Account 2",
                "type": "savings",
                "balance": 18750.00,
                "currency": "EUR",
                "iban": "NL24DHBN2018470582",
                "interest_rate": 1.1,
                "holder_name": "Lucy Lavender"
            },
            {
                "id": "combispaar_003",
                "name": "DHB Combispaar Account 3",
                "type": "savings",
                "balance": 22300.00,
                "currency": "EUR",
                "iban": "NL24DHBN2018470583",
                "interest_rate": 1.1,
                "holder_name": "Lucy Lavender"
            },
            {
                "id": "combispaar_004",
                "name": "DHB Combispaar Account 4",
                "type": "savings",
                "balance": 15600.00,
                "currency": "EUR",
                "iban": "NL24DHBN2018470584",
                "interest_rate": 1.1,
                "holder_name": "Lucy Lavender"
            },
            {
                "id": "combispaar_005",
                "name": "DHB Combispaar Account 5",
                "type": "savings",
                "balance": 19800.00,
                "currency": "EUR",
                "iban": "NL24DHBN2018470585",
                "interest_rate": 1.1,
                "holder_name": "Lucy Lavender"
            },
            {
                "id": "combispaar_006",
                "name": "DHB Combispaar Account 6",
                "type": "savings",
                "balance": 14200.00,
                "currency": "EUR",
                "iban": "NL24DHBN2018470586",
                "interest_rate": 1.1,
                "holder_name": "Lucy Lavender"
            },
            {
                "id": "combispaar_007",
                "name": "DHB Combispaar Account 7",
                "type": "savings",
                "balance": 16800.00,
                "currency": "EUR",
                "iban": "NL24DHBN2018470587",
                "interest_rate": 1.1,
                "holder_name": "Lucy Lavender"
            },
            {
                "id": "combispaar_008",
                "name": "DHB Combispaar Account 8",
                "type": "savings",
                "balance": 13400.00,
                "currency": "EUR",
                "iban": "NL24DHBN2018470588",
                "interest_rate": 1.1,
                "holder_name": "Lucy Lavender"
            },
            {
                "id": "combispaar_009",
                "name": "DHB Combispaar Account 9",
                "type": "savings",
                "balance": 19200.00,
                "currency": "EUR",
                "iban": "NL24DHBN2018470589",
                "interest_rate": 1.1,
                "holder_name": "Lucy Lavender"
            },
            {
                "id": "combispaar_010",
                "name": "DHB Combispaar Account 10",
                "type": "savings",
                "balance": 17500.00,
                "currency": "EUR",
                "iban": "NL24DHBN2018470590",
                "interest_rate": 1.1,
                "holder_name": "Lucy Lavender"
            }
        ],
        "chart_data": [
            {
                "label": "DHB Combispaar",
                "value": 125657.92,
                "color": "#e9ecef"
            },
            {
                "label": "DHB MaxiSpaar", 
                "value": 31960.23,
                "color": "#6c757d"
            },
            {
                "label": "Solidextra Depositorekening",
                "value": 45678.45,
                "color": "#adb5bd"
            }
        ],
        "user_info": {
            "name": "Lucy Lavender",
            "customer_id": "CUST001",
            "last_login": datetime.now().isoformat()
        }
    }

@app.route('/api/accounts', methods=['GET'])
def get_accounts():
    data = generate_mock_data()
    return jsonify({
        "success": True,
        "data": data["accounts"],
        "timestamp": datetime.now().isoformat()
    })

@app.route('/api/combispaar', methods=['GET'])
def get_combispaar_accounts():
    data = generate_mock_data()
    return jsonify({
        "success": True,
        "data": data["combispaar_accounts"],
        "total_balance": sum(acc["balance"] for acc in data["combispaar_accounts"]),
        "count": len(data["combispaar_accounts"]),
        "timestamp": datetime.now().isoformat()
    })

@app.route('/api/chart-data', methods=['GET'])
def get_chart_data():
    data = generate_mock_data()
    return jsonify({
        "success": True,
        "data": data["chart_data"],
        "timestamp": datetime.now().isoformat()
    })

@app.route('/api/user', methods=['GET'])
def get_user_info():
    data = generate_mock_data()
    return jsonify({
        "success": True,
        "data": data["user_info"],
        "timestamp": datetime.now().isoformat()
    })

@app.route('/api/dashboard', methods=['GET'])
def get_dashboard_data():
    data = generate_mock_data()
    return jsonify({
        "success": True,
        "data": {
            "accounts": data["accounts"],
            "combispaar": {
                "accounts": data["combispaar_accounts"],
                "total_balance": sum(acc["balance"] for acc in data["combispaar_accounts"]),
                "count": len(data["combispaar_accounts"])
            },
            "chart_data": data["chart_data"],
            "user_info": data["user_info"]
        },
        "timestamp": datetime.now().isoformat()
    })


if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5002)
