from flask import Flask, jsonify, request
from flask_cors import CORS
from datetime import datetime, date
import uuid
import random

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
        "maxispaar_page_data": {
            "page_title": "DHB MaxiSpaar Account",
            "breadcrumbs": {
                "home": "Home",
                "accounts": "Accounts", 
                "open_account": "Open account",
                "maxispaar": "DHB MaxiSpaar Account"
            },
            "main_account": {
                "name": "DHB SaveOnline",
                "balance": "€ 12.012,00",
                "iban": "NL24DHBN2018470578",
                "interest_rate": "1.1%",
                "holder_name": "Lucy Lavender"
            },
            "description": {
                "title": "Many choices of different terms",
                "content": "Do you want to benefit from a higher interest rate by fixing your savings for a certain period? With a DHB MaxiSpaar account, you can easily choose from different terms, from three months up to 5 years.",
                "additional": "If you already have a DHB SaveOnline account, you can immediately open a DHB MaxiSpaar account online. That is free."
            },
            "account_options": [
                {
                    "id": "3-months",
                    "term": "3 months",
                    "interest": "1,85%",
                    "validFrom": "11.06.2025",
                    "balanceClass": "€ 500 to € 500,000"
                },
                {
                    "id": "6-months",
                    "term": "6 months",
                    "interest": "1,90%",
                    "validFrom": "18.07.2025",
                    "balanceClass": "€ 500 to € 500,000"
                },
                {
                    "id": "9-months",
                    "term": "9 months",
                    "interest": "1,95%",
                    "validFrom": "18.07.2025",
                    "balanceClass": "€ 500 to € 500,000"
                },
                {
                    "id": "12-months",
                    "term": "12 months",
                    "interest": "2,05%",
                    "validFrom": "11.06.2025",
                    "balanceClass": "€ 500 to € 500,000"
                },
                {
                    "id": "2-years",
                    "term": "2 years",
                    "interest": "2,10%",
                    "validFrom": "11.06.2025",
                    "balanceClass": "€ 500 to € 500,000"
                },
                {
                    "id": "3-years",
                    "term": "3 years",
                    "interest": "2,20%",
                    "validFrom": "18.07.2025",
                    "balanceClass": "€ 500 to € 500,000"
                },
                {
                    "id": "4-years",
                    "term": "4 years",
                    "interest": "2,25%",
                    "validFrom": "11.06.2025",
                    "balanceClass": "€ 500 to € 500,000"
                },
                {
                    "id": "5-years",
                    "term": "5 years",
                    "interest": "2,30%",
                    "validFrom": "11.06.2025",
                    "balanceClass": "€ 500 to € 500,000"
                }
            ]
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

@app.route('/api/maxispaar/page-data', methods=['GET'])
def get_maxispaar_page_data():
    data = generate_mock_data()
    return jsonify({
        "success": True,
        "data": data["maxispaar_page_data"],
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

@app.route('/api/verification/send-code', methods=['GET'])
def send_verification_code():
    # Generate a random 6-digit code
    verification_code = ''.join([str(random.randint(0, 9)) for _ in range(6)])
    
    return jsonify({
        "success": True,
        "code": verification_code,
        "message": "Verification code sent successfully",
        "timestamp": datetime.now().isoformat()
    })

@app.route('/api/account/by-iban', methods=['GET'])
def get_account_by_iban():
    iban = request.args.get('iban', '').upper()
    
    # Mock account data for different IBANs
    mock_accounts = {
        "AAAAA": {
            "holder_name": "John Smith",
            "institution_name": "DHB BANK N.V.",
            "bic": "DHBNNL2R",
            "customer_number": "103098",
            "support_reg_number": "301278947",
            "support_packages": "Premium Support",
            "email": "john.smith@example.com"
        },
        "NL24DHBN2018470578": {
            "holder_name": "Lucy Lavender",
            "institution_name": "DHB BANK N.V.",
            "bic": "DHBNNL2R",
            "customer_number": "103099",
            "support_reg_number": "301278948",
            "support_packages": "Standard Support",
            "email": "lucy.lavender@example.com"
        },
        "NL24DHBN2018470579": {
            "holder_name": "Lucy Lavender",
            "institution_name": "DHB BANK N.V.",
            "bic": "DHBNNL2R",
            "customer_number": "103100",
            "support_reg_number": "301278949",
            "support_packages": "Premium Support",
            "email": "lucy.lavender@example.com"
        }
    }
    
    if iban in mock_accounts:
        return jsonify({
            "success": True,
            "data": mock_accounts[iban],
            "timestamp": datetime.now().isoformat()
        })
    else:
        return jsonify({
            "success": False,
            "error": "Account not found for IBAN: " + iban,
            "timestamp": datetime.now().isoformat()
        }), 404

@app.route('/api/documents/download', methods=['GET'])
def download_document():
    document_type = request.args.get('type', '')
    
    # Document content templates
    document_templates = {
        'terms-conditions': {
            'filename': 'Terms_and_Conditions.pdf',
            'content': f"""DHB BANK N.V.
Terms & Conditions

Generated on: {datetime.now().strftime('%d %B %Y')}

1. GENERAL TERMS
These terms and conditions govern the use of DHB BANK N.V. services.

2. ACCOUNT HOLDER RESPONSIBILITIES
- Maintain accurate account information
- Report suspicious activities immediately
- Keep login credentials secure

3. BANKING SERVICES
- Online banking access
- Transaction processing
- Account management

4. PRIVACY AND SECURITY
- Data protection compliance
- Secure transmission protocols
- Confidentiality obligations

5. LIABILITY
- Bank liability limitations
- Customer responsibility
- Dispute resolution procedures

For questions, contact: support@dhbbank.com
"""
        },
        'depositor-template': {
            'filename': 'Depositor_Information_Template.pdf',
            'content': f"""DHB BANK N.V.
Depositor Information Template

Generated on: {datetime.now().strftime('%d %B %Y')}

DEPOSITOR DETAILS
Name: [Depositor Name]
Address: [Depositor Address]
Contact: [Phone/Email]

ACCOUNT INFORMATION
Account Type: Savings Account
Account Number: [Account Number]
IBAN: [IBAN Number]

DEPOSIT DETAILS
Amount: [Amount]
Currency: EUR
Deposit Date: [Date]
Purpose: [Purpose of Deposit]

REQUIRED DOCUMENTATION
- Valid ID document
- Proof of address
- Source of funds declaration
- Tax identification number

COMPLIANCE NOTES
- All deposits subject to AML/KYC procedures
- Large deposits may require additional verification
- Reporting requirements apply

Contact: compliance@dhbbank.com
"""
        },
        'financial-overview': {
            'filename': 'Financial_Annual_Overview.pdf',
            'content': f"""DHB BANK N.V.
Financial Annual Overview

Generated on: {datetime.now().strftime('%d %B %Y')}

ANNUAL SUMMARY
Fiscal Year: 2024
Report Period: January 1 - December 31, 2024

FINANCIAL HIGHLIGHTS
Total Assets: €2,450,000,000
Total Liabilities: €2,180,000,000
Net Income: €45,000,000
Return on Assets: 1.84%
Capital Adequacy Ratio: 15.2%

DEPOSIT ANALYSIS
Total Deposits: €1,850,000,000
Savings Accounts: €1,200,000,000
Current Accounts: €650,000,000
Average Interest Rate: 1.1%

LOAN PORTFOLIO
Total Loans: €1,200,000,000
Mortgage Loans: €800,000,000
Business Loans: €400,000,000
Loan Loss Provision: €12,000,000

OPERATIONAL METRICS
Number of Customers: 125,000
Number of Branches: 45
Digital Transactions: 85%
Customer Satisfaction: 4.6/5.0

REGULATORY COMPLIANCE
- Basel III compliance maintained
- ECB requirements met
- Local regulatory standards exceeded

For detailed financial statements, visit: www.dhbbank.com/financials
"""
        },
        'account-statements': {
            'filename': 'Account_Statements.pdf',
            'content': f"""DHB BANK N.V.
Account Statements

Generated on: {datetime.now().strftime('%d %B %Y')}

ACCOUNT HOLDER: Lucy Lavender
ACCOUNT NUMBER: NL24DHBN2018470578
STATEMENT PERIOD: {datetime.now().strftime('%B %Y')}

OPENING BALANCE: €10,566.55
CLOSING BALANCE: €10,566.55

TRANSACTION SUMMARY
Total Credits: €2,500.00
Total Debits: €1,200.00
Net Change: €1,300.00

INTEREST EARNED
Interest Rate: 1.1%
Interest Earned: €116.23
Interest Paid: €116.23

ACCOUNT FEES
Monthly Maintenance: €0.00
Transaction Fees: €0.00
Total Fees: €0.00

IMPORTANT NOTICES
- Keep this statement for your records
- Report discrepancies within 30 days
- Contact us for any questions

Contact: statements@dhbbank.com
"""
        },
        'contracts': {
            'filename': 'Your_Contracts.pdf',
            'content': f"""DHB BANK N.V.
Your Contracts

Generated on: {datetime.now().strftime('%d %B %Y')}

CONTRACT SUMMARY
Customer: Lucy Lavender
Customer ID: 103098
Contract Date: 15 March 2023

ACTIVE CONTRACTS

1. SAVINGS ACCOUNT AGREEMENT
   Contract Number: SAV-2023-001
   Account Type: DHB SaveOnline
   Interest Rate: 1.1%
   Terms: 12 months renewable
   Status: Active

2. ONLINE BANKING AGREEMENT
   Contract Number: DIG-2023-002
   Services: Internet Banking, Mobile App
   Security: 2FA, Encryption
   Terms: Ongoing
   Status: Active

3. PRIVACY AGREEMENT
   Contract Number: PRIV-2023-003
   Data Processing: GDPR compliant
   Retention: 7 years
   Terms: Ongoing
   Status: Active

CONTRACT TERMS
- All contracts subject to DHB BANK terms
- Changes require 30-day notice
- Termination requires written notice
- Disputes resolved through arbitration

CONTACT INFORMATION
Legal Department: legal@dhbbank.com
Customer Service: support@dhbbank.com
"""
        }
    }
    
    if document_type in document_templates:
        template = document_templates[document_type]
        
        # Create a simple text-based PDF content (in real app, you'd use a PDF library)
        # For now, we'll return the content as a downloadable text file
        from flask import Response
        
        response = Response(
            template['content'],
            mimetype='text/plain',
            headers={
                'Content-Disposition': f'attachment; filename="{template["filename"]}"'
            }
        )
        return response
    else:
        return jsonify({
            "success": False,
            "error": "Document type not found: " + document_type,
            "timestamp": datetime.now().isoformat()
        }), 404


# Global storage for personal details (in a real app, this would be a database)
personal_details_store = {
    "updateId": "PASSPORT - UZLQMADJU",
    "mobilePhone": "+31 6 12345678",
    "password": "**********",
    "email": "john.smith@example.com",
    "telephone": "+31 20 1234567",
    "address": "Amsterdam, Netherlands"
}

# Separate storage for actual password value (in a real app, this would be encrypted in a database)
current_password = "password123"

@app.route('/api/personal-details', methods=['GET'])
def get_personal_details():
    return jsonify({
        "success": True,
        "data": personal_details_store,
        "timestamp": datetime.now().isoformat()
    })

@app.route('/api/personal-details', methods=['PUT'])
def update_personal_details():
    try:
        data = request.get_json()
        
        # Update the stored data
        for key, value in data.items():
            if key in personal_details_store:
                personal_details_store[key] = value
        
        return jsonify({
            "success": True,
            "data": personal_details_store,
            "message": "Personal details updated successfully",
            "timestamp": datetime.now().isoformat()
        })
    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e),
            "timestamp": datetime.now().isoformat()
        }), 400

@app.route('/api/personal-details/phone', methods=['GET'])
def get_phone_number():
    return jsonify({
        "success": True,
        "data": {
            "phone": personal_details_store["mobilePhone"]
        },
        "timestamp": datetime.now().isoformat()
    })

@app.route('/api/personal-details/password', methods=['PUT'])
def update_password():
    try:
        data = request.get_json()
        new_password = data.get('password')
        
        if new_password:
            global current_password
            current_password = new_password
            personal_details_store["password"] = "••••••••••••••••"
            return jsonify({
                "success": True,
                "data": personal_details_store,
                "message": "Password updated successfully",
                "timestamp": datetime.now().isoformat()
            })
        else:
            return jsonify({
                "success": False,
                "error": "Password is required",
                "timestamp": datetime.now().isoformat()
            }), 400
    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e),
            "timestamp": datetime.now().isoformat()
        }), 400

@app.route('/api/personal-details/validate-password', methods=['POST'])
def validate_password():
    try:
        data = request.get_json()
        provided_password = data.get('password')
        
        if provided_password == current_password:
            return jsonify({
                "success": True,
                "valid": True,
                "message": "Password is valid",
                "timestamp": datetime.now().isoformat()
            })
        else:
            return jsonify({
                "success": True,
                "valid": False,
                "message": "Password is incorrect",
                "timestamp": datetime.now().isoformat()
            })
    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e),
            "timestamp": datetime.now().isoformat()
        }), 400

# SOF Questions endpoints
sof_questions_store = [
    {
        "question": "What is the origin of the money in your NIBC Savings Account?",
        "answer": "Leftover from my income"
    },
    {
        "question": "What is your (joint) gross annual income?",
        "answer": "Between €0 and €30,000"
    },
    {
        "question": "How often do you expect to deposit money into your Savings Account?",
        "answer": "Never or on average once a month"
    },
    {
        "question": "What is the amount if these are the amounts you plan to deposit?",
        "answer": "Less than €10,000"
    },
    {
        "question": "What is the source of your income?",
        "answer": "Director, Major Shareholder"
    },
    {
        "question": "What amount do you expect to save/deposit annually with NIBC?",
        "answer": "Nothing or less than €1,000"
    },
    {
        "question": "Do you expect to make one or more occasional (larger) deposits with us?",
        "answer": "Yes"
    }
]

@app.route('/api/sof-questions', methods=['GET'])
def get_sof_questions():
    return jsonify({
        "success": True,
        "data": sof_questions_store,
        "timestamp": datetime.now().isoformat()
    })

@app.route('/api/sof-questions', methods=['PUT'])
def update_sof_questions():
    try:
        data = request.get_json()
        questions = data.get('questions', [])
        
        # Update the stored data
        global sof_questions_store
        sof_questions_store = questions
        
        return jsonify({
            "success": True,
            "data": sof_questions_store,
            "message": "SOF questions updated successfully",
            "timestamp": datetime.now().isoformat()
        })
    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e),
            "timestamp": datetime.now().isoformat()
        }), 400

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5002)
