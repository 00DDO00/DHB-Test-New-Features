from flask import Flask, jsonify, request
from flask_cors import CORS
from datetime import datetime, date
import uuid

app = Flask(__name__)
CORS(app)

# Global storage for messages (in a real app, this would be a database)
messages_store = [
    {
        "id": "1",
        "date": "19 August 2025",
        "time": "11:05",
        "type": "Email",
        "content": "€25 Bonus to Our New Customers! DHB Bank gives away €25 bonus to new customers who complete their identification process digitally via Verimi instead of Postident identification. The only condition of this campaign is transferring a minimum amount of €2.500 to newly opened DHB Netspar account within 14 days after the account opening. Once the new DHB Netspar account balance reaches €2.500 or more, the bonus amount is credited to this Netspar account on the same day evening (or on the first working day evening if account opening day is holiday). This campaign is only valid in Germany."
    },
    {
        "id": "2",
        "date": "18 August 2025",
        "time": "11:05",
        "type": "Email",
        "content": "The iPhone model device and Mobile Banking Application pairing have been removed. If the transaction does not belong to you, please contact our support team immediately."
    },
    {
        "id": "3",
        "date": "18 August 2025",
        "time": "10:15",
        "type": "Push",
        "content": "The iPhone model device and Mobile Banking Application pairing have been removed. If the transaction does not belong to you, please contact our support team immediately."
    },
    {
        "id": "4",
        "date": "16 August 2025",
        "time": "14:30",
        "type": "Email",
        "content": "The iPhone model device and Mobile Banking Application pairing have been removed. If the transaction does not belong to you, please contact our support team immediately."
    },
    {
        "id": "5",
        "date": "15 August 2025",
        "time": "09:45",
        "type": "Push",
        "content": "The iPhone model device and Mobile Banking Application pairing have been removed. If the transaction does not belong to you, please contact our support team immediately."
    },
    {
        "id": "6",
        "date": "14 August 2025",
        "time": "16:20",
        "type": "Email",
        "content": "The iPhone model device and Mobile Banking Application pairing have been removed. If the transaction does not belong to you, please contact our support team immediately."
    }
]

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
            }
        ],
        "combispaar_page_data": {
            "page_title": "DHB CombiSpaarrekening",
            "breadcrumbs": {
                "home": "Home",
                "accounts": "Accounts", 
                "open_account": "Open account"
            },
            "main_account": {
                "name": "DHB Account",
                "balance": "€ 15.750,00",
                "iban": "NL24DHBN2018470578",
                "interest_rate": "1.1%",
                "holder_name": "A DERWISH"
            },
            "description": {
                "title": "Save and still be able to withdraw money",
                "content": "The DHB CombiSpaarrekening offers a higher interest rate than the DHB SaveOnline because withdrawals are planned in advance. Depending on the chosen account, you can give 33, 66, or 99 days' notice for withdrawals. A longer notice period results in a higher interest rate."
            },
            "account_options": [
                {
                    "id": "33-days",
                    "balanceClass": "€ 500 to € 500,000",
                    "noticePeriod": "33 days",
                    "interest": "1.60%",
                    "validFrom": date.today().strftime("%d.%m.%Y"),
                    "days": 33,
                    "code": "5242"
                },
                {
                    "id": "66-days",
                    "balanceClass": "€ 500 to € 500,000",
                    "noticePeriod": "66 days",
                    "interest": "1.65%",
                    "validFrom": date.today().strftime("%d.%m.%Y"),
                    "days": 66,
                    "code": "5244"
                },
                {
                    "id": "99-days",
                    "balanceClass": "€ 500 to € 500,000",
                    "noticePeriod": "99 days",
                    "interest": "1.70%",
                    "validFrom": date.today().strftime("%d.%m.%Y"),
                    "days": 99,
                    "code": "5246"
                }
            ],
            "iban_options": [
                {
                    "iban": "NL28DHBN026326642",
                    "balance": "€ 12.012,00",
                    "accountType": "DHB CombiSpaar",
                    "accountHolder": "A DERWISH"
                },
                {
                    "iban": "NL28DHBN026326643",
                    "balance": "€ 8.450,75",
                    "accountType": "DHB SaveOnline",
                    "accountHolder": "A DERWISH"
                },
                {
                    "iban": "NL28DHBN026326644",
                    "balance": "€ 25.300,00",
                    "accountType": "DHB MaxiSpaar",
                    "accountHolder": "A DERWISH"
                },
                {
                    "iban": "NL28DHBN026326645",
                    "balance": "€ 3.125,50",
                    "accountType": "DHB Current Account",
                    "accountHolder": "A DERWISH"
                }
            ]
        },
        "combispaar_accounts": [
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
        },
        "user_profile": {
            "holder_name": "Lucy Lavender",
            "email": "lucy.lavender@dhbbank.com",
            "institution_name": "DHB BANK N/V",
            "bic": "DHBNNL2R",
            "customer_number": "123456",
            "support_reg_number": "123456789",
            "last_login": "10.07.2025 15:26:16"
        },
        "messages": messages_store
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

@app.route('/api/combispaar/page-data', methods=['GET'])
def get_combispaar_page_data():
    data = generate_mock_data()
    return jsonify({
        "success": True,
        "data": data["combispaar_page_data"],
        "timestamp": datetime.now().isoformat()
    })

@app.route('/api/combispaar/account-options', methods=['GET'])
def get_combispaar_account_options():
    data = generate_mock_data()
    return jsonify({
        "success": True,
        "data": data["combispaar_page_data"]["account_options"],
        "timestamp": datetime.now().isoformat()
    })

@app.route('/api/combispaar/iban-options', methods=['GET'])
def get_combispaar_iban_options():
    data = generate_mock_data()
    return jsonify({
        "success": True,
        "data": data["combispaar_page_data"]["iban_options"],
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

@app.route('/api/user/profile', methods=['GET'])
def get_user_profile():
    data = generate_mock_data()
    return jsonify({
        "success": True,
        "data": data["user_profile"],
        "timestamp": datetime.now().isoformat()
    })

@app.route('/api/messages', methods=['GET'])
def get_messages():
    data = generate_mock_data()
    return jsonify({
        "success": True,
        "data": data["messages"],
        "count": len(data["messages"]),
        "new_count": len(data["messages"]),  # Dynamic count based on actual messages
        "timestamp": datetime.now().isoformat()
    })

@app.route('/api/messages', methods=['POST'])
def send_message():
    try:
        data = request.get_json()
        
        # Generate current date and time
        now = datetime.now()
        date_str = now.strftime("%d %B %Y")
        time_str = now.strftime("%H:%M")
        
        # Create new message
        new_message = {
            "id": str(uuid.uuid4()),
            "date": date_str,
            "time": time_str,
            "type": data.get("type", "Email"),
            "content": data.get("content", "New message received.")
        }
        
        # Add to global store
        messages_store.insert(0, new_message)  # Insert at beginning to show newest first
        
        return jsonify({
            "success": True,
            "message": "Message sent successfully",
            "data": new_message,
            "timestamp": datetime.now().isoformat()
        })
    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 400

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
