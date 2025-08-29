from flask import Flask, jsonify, request
from flask_cors import CORS
from datetime import datetime, date
import uuid
import random
import yaml
import os
import re

app = Flask(__name__)
CORS(app)

# Load YAML schemas for reference
def load_yaml_schemas():
    schemas = {}
    yaml_files = ['customer-api.yaml', 'account-api.yaml', 'transfer-api.yaml']
    
    for yaml_file in yaml_files:
        file_path = os.path.join(os.path.dirname(__file__), yaml_file)
        if os.path.exists(file_path):
            with open(file_path, 'r') as file:
                yaml_content = yaml.safe_load(file)
                if 'components' in yaml_content and 'schemas' in yaml_content['components']:
                    schemas[yaml_file] = yaml_content['components']['schemas']
    
    return schemas

# Load schemas for reference
yaml_schemas = load_yaml_schemas()

# Helper function to validate required headers
def validate_required_headers():
    """Validate required headers from YAML specification"""
    required_headers = ['channelCode', 'username', 'lang', 'countryCode', 'sessionId']
    missing_headers = []
    
    for header in required_headers:
        if not request.headers.get(header):
            missing_headers.append(header)
    
    if missing_headers:
        return False, missing_headers
    return True, None

# Helper function to get customer ID from path or headers
def get_customer_id_from_path():
    """Extract customer ID from URL path"""
    # Extract customer ID from path parameters
    path_parts = request.path.split('/')
    for i, part in enumerate(path_parts):
        if part == 'customerId' or (part.startswith('{') and part.endswith('}')):
            if i + 1 < len(path_parts):
                return path_parts[i + 1]
    return None

# Helper function to create error response based on YAML error codes
def create_error_response(error_code, description):
    """Create error response based on YAML error codes"""
    error_responses = {
        '453': 'Customer id is null',
        '454': 'Mobile phone number is null',
        '456': 'Account number is null',
        '470': 'Invalid request',
        '471': 'Unauthorized',
        '473': 'Invalid party name',
        '474': 'Invalid party account IBAN',
        '475': 'Invalid party agent BICFI',
        '476': 'Invalid requesting agent BICFI',
        '477': 'Not found',
        '490': 'unsuccessful',
        '495': 'Session Id is required',
        '496': 'Check channel code',
        '497': 'County code is required',
        '498': 'Check user code',
        '499': 'Lang is required',
        '500': 'System error occurred',
        '503': 'Error occurred when making database call'
    }
    
    return jsonify({
        "success": False,
        "error": {
            "code": error_code,
            "message": error_responses.get(error_code, description),
            "description": description
        },
        "timestamp": datetime.now().isoformat()
    }), int(error_code) if error_code.isdigit() else 400

# Mock data storage
messages_store = [
    {
        "reference": "MSG001",
        "entryDate": "2025-01-19T11:05:00Z",
        "type": "Email",
        "subject": "€25 Bonus to Our New Customers!",
        "body": "€25 Bonus to Our New Customers! DHB Bank gives away €25 bonus to new customers who complete their identification process digitally via Verimi instead of Postident identification.",
        "isRead": False
    },
    {
        "reference": "MSG002",
        "entryDate": "2025-01-18T11:05:00Z",
        "type": "Email",
        "subject": "Device Pairing Removed",
        "body": "The iPhone model device and Mobile Banking Application pairing have been removed.",
        "isRead": False
    }
]

# Mock account data
mock_accounts = {
    "saving": [
        {
            "customerName": "Lucy Lavender",
            "accountName": "DHB SaveOnline",
            "IBAN": "NL24DHBN2018470578",
            "accountNumber": "2018470578",
            "accountNumberLabel": "SaveOnline Account",
            "BIC": "DHBNNL2R",
            "minPaymentDate": "2025-01-15T00:00:00Z",
            "status": "active",
            "branch": {
                "code": "AMS",
                "name": "Amsterdam Branch"
            },
            "address": "GRONINGEN, STR. VONDELLAAN 172",
            "productGroup": {
                "code": "saveOnline",
                "name": "SaveOnline"
            },
            "moduleType": {
                "code": "SAV",
                "name": "Savings"
            },
            "productType": {
                "code": "SAV_ONLINE",
                "name": "Online Savings"
            },
            "productClass": {
                "code": "SAVINGS",
                "name": "Savings Account"
            },
            "currencyCode": "EUR",
            "operationProfile": {
                "allowModification": True,
                "allowClosing": True,
                "allowSourceForOpening": True,
                "allowPaymentOrderOut": True,
                "allowOwnTransferOut": True,
                "allowPrintStatement": True
            },
            "detail": {
                "balance": 10566.55,
                "interestRate": 1.1,
                "holderName": "Lucy Lavender"
            }
        },
        {
            "customerName": "Lucy Lavender",
            "accountName": "DHB MaxiSpaar",
            "IBAN": "NL24DHBN2018470579",
            "accountNumber": "2018470579",
            "accountNumberLabel": "MaxiSpaar Account",
            "BIC": "DHBNNL2R",
            "minPaymentDate": "2025-01-15T00:00:00Z",
            "status": "active",
            "branch": {
                "code": "AMS",
                "name": "Amsterdam Branch"
            },
            "address": "GRONINGEN, STR. VONDELLAAN 172",
            "productGroup": {
                "code": "maxiSpaar",
                "name": "MaxiSpaar"
            },
            "moduleType": {
                "code": "SAV",
                "name": "Savings"
            },
            "productType": {
                "code": "SAV_MAXI",
                "name": "Maxi Savings"
            },
            "productClass": {
                "code": "SAVINGS",
                "name": "Savings Account"
            },
            "currencyCode": "EUR",
            "operationProfile": {
                "allowModification": True,
                "allowClosing": True,
                "allowSourceForOpening": True,
                "allowPaymentOrderOut": True,
                "allowOwnTransferOut": True,
                "allowPrintStatement": True
            },
            "detail": {
                "balance": 31960.23,
                "interestRate": 1.1,
                "holderName": "Lucy Lavender"
            }
        }
    ]
}

# ============================================================================
# CUSTOMER API ENDPOINTS (from customer-api.yaml)
# ============================================================================

@app.route('/customer/profile/fullProfile/<customer_id>', methods=['GET'])
def get_customer_full_profile(customer_id):
    """Get customer full profile - maps to /customer/profile/fullProfile/{customerId}"""
    
    # Validate required headers
    header_valid, missing_headers = validate_required_headers()
    if not header_valid:
        return create_error_response('495', f"Missing required headers: {', '.join(missing_headers)}")
    
    # Validate customer ID
    if not customer_id:
        return create_error_response('453', 'Customer id is null')
    
    # Mock response based on CustomerIndividual schema
    return jsonify({
        "customerNumber": "123456789",
        "customerId": customer_id,
        "firstName": "Lucy",
        "middleName": "",
        "surName": "Lavender",
        "firstNameLatin": "Lucy",
        "surNameLatin": "Lavender",
        "birthDate": "1985-06-15T00:00:00Z",
        "birthPlace": "Amsterdam",
        "genderCode": "F",
        "genderName": "Female",
        "maritalStatusCode": "S",
        "maritalStatusName": "Single",
        "identityType": "PASSPORT",
        "identitySeries": "AB",
        "identitySerialNo": "1234567",
        "taxNumber": "12345678901",
        "taxOfficeCode": "001",
        "taxOfficeName": "Amsterdam Tax Office",
        "emails": [
            {
                "address": "lucy.lavender@example.com",
                "editable": True,
                "editableFlag": "Y"
            }
        ],
        "addresses": [
            {
                "countryCode": "NL",
                "cityCode": "AMS",
                "cityName": "Amsterdam",
                "zipCode": "1011AA",
                "addressType": "HOME",
                "addressTypeName": "Home Address",
                "fullAddressInfo": "GRONINGEN, STR. VONDELLAAN 172",
                "street": "Vondellaan",
                "houseNumber": "172",
                "editable": True,
                "editableFlag": "Y"
            }
        ],
        "phones": [
            {
                "phoneNumber": "+31 123 456 789",
                "phoneType": "MOBILE",
                "phoneTypeName": "Mobile",
                "editable": True,
                "editableFlag": "Y"
            }
        ],
        "prefferedLang": "en",
        "customerStatus": "ACTIVE",
        "customerType": "INDIVIDUAL",
        "customerTypeName": "Individual"
    })

@app.route('/customer/profile/phone/<customer_id>', methods=['GET'])
def get_customer_phone(customer_id):
    """Get customer phone number - maps to /customer/profile/phone/{customerId}"""
    
    # Validate required headers
    header_valid, missing_headers = validate_required_headers()
    if not header_valid:
        return create_error_response('495', f"Missing required headers: {', '.join(missing_headers)}")
    
    # Validate customer ID
    if not customer_id:
        return create_error_response('453', 'Customer id is null')
    
    # Mock response based on UpdatePhone schema
    return jsonify([
        {
            "phoneNumber": "+31 123 456 789",
            "phoneType": "MOBILE",
            "phoneTypeName": "Mobile",
            "editable": True,
            "editableFlag": "Y"
        },
        {
            "phoneNumber": "+31 987 654 321",
            "phoneType": "HOME",
            "phoneTypeName": "Home",
            "editable": True,
            "editableFlag": "Y"
        }
    ])

@app.route('/customer/messages/list/<customer_id>', methods=['GET'])
def get_customer_messages(customer_id):
    """Get customer messages - maps to /customer/messages/list/{customerId}"""
    
    # Validate required headers
    header_valid, missing_headers = validate_required_headers()
    if not header_valid:
        return create_error_response('495', f"Missing required headers: {', '.join(missing_headers)}")
    
    # Validate customer ID
    if not customer_id:
        return create_error_response('453', 'Customer id is null')
    
    # Mock response based on Messages schema
    return jsonify(messages_store)

@app.route('/customer/messages/unread/<customer_id>', methods=['GET'])
def get_unread_messages(customer_id):
    """Get unread messages count - maps to /customer/messages/unread/{customerId}"""
    
    # Validate required headers
    header_valid, missing_headers = validate_required_headers()
    if not header_valid:
        return create_error_response('495', f"Missing required headers: {', '.join(missing_headers)}")
    
    # Validate customer ID
    if not customer_id:
        return create_error_response('453', 'Customer id is null')
    
    # Count unread messages
    unread_count = len([msg for msg in messages_store if not msg.get('isRead', False)])
    
    # Mock response based on UnreadMessages schema
    return jsonify({
        "count": unread_count
    })

@app.route('/customer/messages/<customer_id>', methods=['POST'])
def create_customer_message(customer_id):
    """Create customer message - maps to /customer/messages/{customerId}"""
    
    # Validate required headers
    header_valid, missing_headers = validate_required_headers()
    if not header_valid:
        return create_error_response('495', f"Missing required headers: {', '.join(missing_headers)}")
    
    # Validate customer ID
    if not customer_id:
        return create_error_response('453', 'Customer id is null')
    
    try:
        data = request.get_json()
        
        # Generate current date and time
        now = datetime.now()
        
        # Create new message
        new_message = {
            "reference": f"MSG{str(uuid.uuid4())[:8].upper()}",
            "entryDate": now.isoformat() + "Z",
            "type": data.get("type", "Email"),
            "subject": data.get("subject", "New Message"),
            "body": data.get("content", "New message received."),
            "isRead": False
        }
        
        # Add to store
        messages_store.insert(0, new_message)
        
        return jsonify(new_message)
    except Exception as e:
        return create_error_response('500', f'System error occurred: {str(e)}')

# ============================================================================
# ACCOUNT API ENDPOINTS (from account-api.yaml)
# ============================================================================

@app.route('/accounts/list/<customer_id>', methods=['GET'])
def get_account_list(customer_id):
    """Get account list - maps to /accounts/list/{customerId}"""
    
    # Validate required headers
    header_valid, missing_headers = validate_required_headers()
    if not header_valid:
        return create_error_response('495', f"Missing required headers: {', '.join(missing_headers)}")
    
    # Validate customer ID
    if not customer_id:
        return create_error_response('453', 'Customer id is null')
    
    # Get account type from query parameters
    account_type = request.args.get('accountType', 'saving')
    currency_codes = request.args.get('currencyCodes', '')
    
    # Validate account type
    if account_type not in ['checking', 'saving']:
        return create_error_response('470', 'Invalid account type')
    
    # Mock response based on AccountList schema
    return jsonify(mock_accounts)

@app.route('/accounts/saving/statement/<account_number>/<int:page_index>/<int:page_size>', methods=['GET'])
def get_account_statement(account_number, page_index, page_size):
    """Get account statement - maps to /accounts/saving/statement/{accountNumber}/{pageIndex}/{pageSize}"""
    
    # Validate required headers
    header_valid, missing_headers = validate_required_headers()
    if not header_valid:
        return create_error_response('495', f"Missing required headers: {', '.join(missing_headers)}")
    
    # Validate account number
    if not account_number:
        return create_error_response('456', 'Account number is null')
    
    # Mock response based on AccountStatement schema
    return jsonify({
        "accountNumber": account_number,
        "accountName": "DHB SaveOnline",
        "currencyCode": "EUR",
        "transactions": [
            {
                "transactionDate": "2025-01-19T10:30:00Z",
                "valueDate": "2025-01-19T00:00:00Z",
                "description": "Salary Payment",
                "amount": 2500.00,
                "balance": 10566.55,
                "type": "credit",
                "reference": "REF001"
            },
            {
                "transactionDate": "2025-01-18T14:15:00Z",
                "valueDate": "2025-01-18T00:00:00Z",
                "description": "Online Purchase",
                "amount": -125.50,
                "balance": 8066.55,
                "type": "debit",
                "reference": "REF002"
            }
        ],
        "pagination": {
            "pageIndex": page_index,
            "pageSize": page_size,
            "totalRecords": 2,
            "totalPages": 1
        }
    })

@app.route('/accounts/utilities/customerMatchByAccount/<customer_id>/<account_number>', methods=['GET'])
def get_customer_match_by_account(customer_id, account_number):
    """Get customer match by account - maps to /accounts/utilities/customerMatchByAccount/{customerId}/{accountNumber}"""
    
    # Validate required headers
    header_valid, missing_headers = validate_required_headers()
    if not header_valid:
        return create_error_response('495', f"Missing required headers: {', '.join(missing_headers)}")
    
    # Validate customer ID
    if not customer_id:
        return create_error_response('453', 'Customer id is null')
    
    # Validate account number
    if not account_number:
        return create_error_response('456', 'Account number is null')
    
    # Mock response
    return jsonify({
        "customerId": customer_id,
        "accountNumber": account_number,
        "matchFound": True,
        "customerName": "Lucy Lavender",
        "accountName": "DHB SaveOnline"
    })

# ============================================================================
# TRANSFER API ENDPOINTS (from transfer-api.yaml)
# ============================================================================

@app.route('/transfers/payment/<customer_id>/<source_account>', methods=['GET'])
def get_transfer_simulation(customer_id, source_account):
    """Get transfer simulation - maps to /transfers/payment/{customerId}/{sourceAccountNumber}"""
    
    # Validate required headers
    header_valid, missing_headers = validate_required_headers()
    if not header_valid:
        return create_error_response('495', f"Missing required headers: {', '.join(missing_headers)}")
    
    # Validate customer ID
    if not customer_id:
        return create_error_response('453', 'Customer id is null')
    
    # Get query parameters
    target_iban = request.args.get('targetIBAN', '')
    currency_code = request.args.get('currencyCode', 'EUR')
    amount = request.args.get('amount', 0, type=float)
    description = request.args.get('description', '')
    payment_type = request.args.get('paymentType', 'normal')
    period = request.args.get('period', 'oneOff')
    
    # Validate required parameters
    if not target_iban:
        return create_error_response('474', 'Invalid party account IBAN')
    
    if amount <= 0:
        return create_error_response('470', 'Invalid amount')
    
    # Mock response
    return jsonify({
        "simulationId": str(uuid.uuid4()),
        "sourceAccount": source_account,
        "targetIBAN": target_iban,
        "amount": amount,
        "currencyCode": currency_code,
        "description": description,
        "paymentType": payment_type,
        "period": period,
        "fees": 0.00,
        "totalAmount": amount,
        "estimatedDelivery": "2025-01-20T00:00:00Z",
        "status": "simulated"
    })

@app.route('/transfers/utilities/holidays', methods=['GET'])
def get_holidays():
    """Get holidays - maps to /transfers/utilities/holidays"""
    
    # Validate required headers
    header_valid, missing_headers = validate_required_headers()
    if not header_valid:
        return create_error_response('495', f"Missing required headers: {', '.join(missing_headers)}")
    
    # Mock response
    return jsonify([
        {"date": "2025-01-01", "description": "New Year's Day"},
        {"date": "2025-04-20", "description": "Easter Sunday"},
        {"date": "2025-05-05", "description": "Liberation Day"}
    ])

@app.route('/transfers/utilities/bankDate', methods=['GET'])
def get_bank_date():
    """Get bank date - maps to /transfers/utilities/bankDate"""
    
    # Validate required headers
    header_valid, missing_headers = validate_required_headers()
    if not header_valid:
        return create_error_response('495', f"Missing required headers: {', '.join(missing_headers)}")
    
    # Mock response
    return jsonify({
        "bankDate": datetime.now().strftime("%Y-%m-%d"),
        "isBusinessDay": True
    })

# ============================================================================
# ADDITIONAL USEFUL YAML ENDPOINTS
# ============================================================================

@app.route('/accounts/saving/new/<customer_id>', methods=['GET'])
def get_new_saving_account_options(customer_id):
    """Get new saving account options - maps to /accounts/saving/new/{customerId}"""
    
    # Validate required headers
    header_valid, missing_headers = validate_required_headers()
    if not header_valid:
        return create_error_response('495', f"Missing required headers: {', '.join(missing_headers)}")
    
    # Validate customer ID
    if not customer_id:
        return create_error_response('453', 'Customer id is null')
    
    # Mock response
    return jsonify({
        "customerId": customer_id,
        "availableProducts": [
            {
                "productCode": "SAV_ONLINE",
                "productName": "DHB SaveOnline",
                "interestRate": 1.1,
                "minimumAmount": 0,
                "maximumAmount": 1000000,
                "currency": "EUR"
            },
            {
                "productCode": "SAV_MAXI",
                "productName": "DHB MaxiSpaar",
                "interestRate": 1.1,
                "minimumAmount": 0,
                "maximumAmount": 1000000,
                "currency": "EUR"
            },
            {
                "productCode": "SAV_COMBI",
                "productName": "DHB Combispaar",
                "interestRate": 1.1,
                "minimumAmount": 0,
                "maximumAmount": 1000000,
                "currency": "EUR"
            }
        ]
    })

@app.route('/accounts/saving/rates/<customer_id>', methods=['GET'])
def get_saving_rates(customer_id):
    """Get saving account rates - maps to /accounts/saving/rates/{customerId}"""
    
    # Validate required headers
    header_valid, missing_headers = validate_required_headers()
    if not header_valid:
        return create_error_response('495', f"Missing required headers: {', '.join(missing_headers)}")
    
    # Validate customer ID
    if not customer_id:
        return create_error_response('453', 'Customer id is null')
    
    # Mock response
    return jsonify({
        "customerId": customer_id,
        "rates": [
            {
                "productCode": "SAV_ONLINE",
                "productName": "DHB SaveOnline",
                "interestRate": 1.1,
                "effectiveDate": "2025-01-01",
                "currency": "EUR"
            },
            {
                "productCode": "SAV_MAXI",
                "productName": "DHB MaxiSpaar",
                "interestRate": 1.1,
                "effectiveDate": "2025-01-01",
                "currency": "EUR"
            },
            {
                "productCode": "SAV_COMBI",
                "productName": "DHB Combispaar",
                "interestRate": 1.1,
                "effectiveDate": "2025-01-01",
                "currency": "EUR"
            }
        ]
    })

@app.route('/vop/requestPayeeVerification', methods=['POST'])
def request_payee_verification():
    """Request payee verification - maps to /vop/requestPayeeVerification"""
    
    # Validate required headers
    header_valid, missing_headers = validate_required_headers()
    if not header_valid:
        return create_error_response('495', f"Missing required headers: {', '.join(missing_headers)}")
    
    try:
        data = request.get_json()
        
        # Validate required fields
        if not data.get('targetIBAN'):
            return create_error_response('474', 'Invalid party account IBAN')
        
        if not data.get('beneficiaryName'):
            return create_error_response('473', 'Invalid party name')
        
        # Mock VOP response
        return jsonify({
            "vopGuid": str(uuid.uuid4()),
            "verificationStatus": "VERIFIED",
            "beneficiaryName": data.get('beneficiaryName'),
            "targetIBAN": data.get('targetIBAN'),
            "verificationDate": datetime.now().isoformat() + "Z",
            "confidence": "HIGH"
        })
    except Exception as e:
        return create_error_response('500', f'System error occurred: {str(e)}')

@app.route('/customer/downloads/financialAnnualOverview/<customer_id>', methods=['GET'])
def get_financial_annual_overview(customer_id):
    """Get financial annual overview - maps to /customer/downloads/financialAnnualOverview/{customerId}"""
    
    # Validate required headers
    header_valid, missing_headers = validate_required_headers()
    if not header_valid:
        return create_error_response('495', f"Missing required headers: {', '.join(missing_headers)}")
    
    # Validate customer ID
    if not customer_id:
        return create_error_response('453', 'Customer id is null')
    
    # Mock response
    return jsonify([
        {
            "documentType": "financial",
            "name": "Financial Overview 2024",
            "year": "2024",
            "id": "FIN_2024_001"
        },
        {
            "documentType": "tax",
            "name": "Tax Statement 2024",
            "year": "2024",
            "id": "TAX_2024_001"
        },
        {
            "documentType": "financial",
            "name": "Financial Overview 2023",
            "year": "2023",
            "id": "FIN_2023_001"
        }
    ])

@app.route('/customer/campaigns/list/<customer_id>', methods=['GET'])
def get_customer_campaigns(customer_id):
    """Get customer campaigns - maps to /customer/campaigns/list/{customerId}"""
    
    # Validate required headers
    header_valid, missing_headers = validate_required_headers()
    if not header_valid:
        return create_error_response('495', f"Missing required headers: {', '.join(missing_headers)}")
    
    # Validate customer ID
    if not customer_id:
        return create_error_response('453', 'Customer id is null')
    
    # Mock response
    return jsonify([
        {
            "subject": "€25 Bonus Campaign",
            "content": "Get €25 bonus when you open a new DHB Netspar account!",
            "reference": "CAM001",
            "bannerLink": "https://example.com/banner1.jpg"
        },
        {
            "subject": "Digital Banking Promotion",
            "content": "Switch to digital banking and get exclusive benefits!",
            "reference": "CAM002",
            "bannerLink": "https://example.com/banner2.jpg"
        }
    ])

# ============================================================================
# LEGACY ENDPOINTS (for backward compatibility)
# ============================================================================

@app.route('/api/accounts', methods=['GET'])
def legacy_get_accounts():
    """Legacy endpoint for backward compatibility"""
    # Return the old format that the frontend expects
    return jsonify({
        "success": True,
        "data": {
            "saving": [
                {
                    "customerName": "Lucy Lavender",
                    "accountName": "DHB SaveOnline",
                    "IBAN": "NL24DHBN2018470578",
                    "accountNumber": "2018470578",
                    "accountNumberLabel": "SaveOnline Account",
                    "BIC": "DHBNNL2R",
                    "minPaymentDate": "2025-01-15T00:00:00Z",
                    "status": "active",
                    "branch": {
                        "code": "AMS",
                        "name": "Amsterdam Branch"
                    },
                    "address": "GRONINGEN, STR. VONDELLAAN 172",
                    "productGroup": {
                        "code": "saveOnline",
                        "name": "SaveOnline"
                    },
                    "moduleType": {
                        "code": "SAV",
                        "name": "Savings"
                    },
                    "productType": {
                        "code": "SAV_ONLINE",
                        "name": "Online Savings"
                    },
                    "productClass": {
                        "code": "SAVINGS",
                        "name": "Savings Account"
                    },
                    "currencyCode": "EUR",
                    "operationProfile": {
                        "allowModification": True,
                        "allowClosing": True,
                        "allowSourceForOpening": True,
                        "allowPaymentOrderOut": True,
                        "allowOwnTransferOut": True,
                        "allowPrintStatement": True
                    },
                    "detail": {
                        "balance": 10566.55,
                        "interestRate": 1.1,
                        "holderName": "Lucy Lavender"
                    }
                },
                {
                    "customerName": "Lucy Lavender",
                    "accountName": "DHB MaxiSpaar",
                    "IBAN": "NL24DHBN2018470579",
                    "accountNumber": "2018470579",
                    "accountNumberLabel": "MaxiSpaar Account",
                    "BIC": "DHBNNL2R",
                    "minPaymentDate": "2025-01-15T00:00:00Z",
                    "status": "active",
                    "branch": {
                        "code": "AMS",
                        "name": "Amsterdam Branch"
                    },
                    "address": "GRONINGEN, STR. VONDELLAAN 172",
                    "productGroup": {
                        "code": "maxiSpaar",
                        "name": "MaxiSpaar"
                    },
                    "moduleType": {
                        "code": "SAV",
                        "name": "Savings"
                    },
                    "productType": {
                        "code": "SAV_MAXI",
                        "name": "Maxi Savings"
                    },
                    "productClass": {
                        "code": "SAVINGS",
                        "name": "Savings Account"
                    },
                    "currencyCode": "EUR",
                    "operationProfile": {
                        "allowModification": True,
                        "allowClosing": True,
                        "allowSourceForOpening": True,
                        "allowPaymentOrderOut": True,
                        "allowOwnTransferOut": True,
                        "allowPrintStatement": True
                    },
                    "detail": {
                        "balance": 31960.23,
                        "interestRate": 1.1,
                        "holderName": "Lucy Lavender"
                    }
                }
            ]
        },
        "timestamp": datetime.now().isoformat()
    })

@app.route('/api/user/profile', methods=['GET'])
def legacy_get_user_profile():
    """Legacy endpoint for backward compatibility"""
    return jsonify({
        "success": True,
        "data": {
            "customerNumber": "123456789",
            "customerId": "CUST001",
            "firstName": "Lucy",
            "middleName": "",
            "surName": "Lavender",
            "firstNameLatin": "Lucy",
            "surNameLatin": "Lavender",
            "birthDate": "1985-06-15T00:00:00Z",
            "birthPlace": "Amsterdam",
            "genderCode": "F",
            "genderName": "Female",
            "maritalStatusCode": "S",
            "maritalStatusName": "Single",
            "identityType": "PASSPORT",
            "identitySeries": "AB",
            "identitySerialNo": "1234567",
            "taxNumber": "12345678901",
            "taxOfficeCode": "001",
            "taxOfficeName": "Amsterdam Tax Office",
            "emails": [
                {
                    "address": "lucy.lavender@example.com",
                    "editable": True,
                    "editableFlag": "Y"
                }
            ],
            "addresses": [
                {
                    "countryCode": "NL",
                    "cityCode": "AMS",
                    "cityName": "Amsterdam",
                    "zipCode": "1011AA",
                    "addressType": "HOME",
                    "addressTypeName": "Home Address",
                    "fullAddressInfo": "GRONINGEN, STR. VONDELLAAN 172",
                    "street": "Vondellaan",
                    "houseNumber": "172",
                    "editable": True,
                    "editableFlag": "Y"
                }
            ],
            "phones": [
                {
                    "phoneNumber": "+31 123 456 789",
                    "phoneType": "MOBILE",
                    "phoneTypeName": "Mobile",
                    "editable": True,
                    "editableFlag": "Y"
                }
            ],
            "prefferedLang": "en",
            "customerStatus": "ACTIVE",
            "customerType": "INDIVIDUAL",
            "customerTypeName": "Individual"
        },
        "timestamp": datetime.now().isoformat()
    })

@app.route('/api/messages', methods=['GET'])
def legacy_get_messages():
    """Legacy endpoint for backward compatibility"""
    return jsonify({
        "success": True,
        "data": [
            {
                "id": "MSG001",
                "date": "19 August 2025",
                "time": "11:05",
                "type": "Email",
                "content": "€25 Bonus to Our New Customers! DHB Bank gives away €25 bonus to new customers who complete their identification process digitally via Verimi instead of Postident identification."
            },
            {
                "id": "MSG002",
                "date": "18 August 2025",
                "time": "11:05",
                "type": "Email",
                "content": "The iPhone model device and Mobile Banking Application pairing have been removed."
            }
        ],
        "count": 2,
        "new_count": 2,
        "timestamp": datetime.now().isoformat()
    })

@app.route('/api/messages', methods=['POST'])
def legacy_send_message():
    """Legacy endpoint for backward compatibility"""
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

@app.route('/api/chart-data', methods=['GET'])
def legacy_get_chart_data():
    """Legacy endpoint for chart data"""
    return jsonify({
        "success": True,
        "data": [
            {
                "label": "DHB SaveOnline",
                "value": 10566.55,
                "color": "#1976d2"
            },
            {
                "label": "DHB MaxiSpaar",
                "value": 31960.23,
                "color": "#388e3c"
            },
            {
                "label": "DHB Combispaar",
                "value": 31250.00,
                "color": "#f57c00"
            }
        ],
        "timestamp": datetime.now().isoformat()
    })

@app.route('/api/user', methods=['GET'])
def legacy_get_user():
    """Legacy endpoint for user info"""
    return jsonify({
        "success": True,
        "data": {
            "name": "Lucy Lavender",
            "customer_id": "CUST001",
            "last_login": "2025-01-15 14:30:00"
        },
        "timestamp": datetime.now().isoformat()
    })

@app.route('/api/combispaar', methods=['GET'])
def legacy_get_combispaar():
    """Legacy endpoint for combispaar accounts"""
    return jsonify({
        "success": True,
        "data": [
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
        "total_balance": 31250.00,
        "count": 2,
        "timestamp": datetime.now().isoformat()
    })

@app.route('/api/combispaar/page-data', methods=['GET'])
def legacy_get_combispaar_page_data():
    """Legacy endpoint for combispaar page data"""
    return jsonify({
        "success": True,
        "data": {
            "accountName": "DHB SaveOnline",
            "balance": "€ 10.566,55",
            "iban": "NL24DHBN2018470578",
            "interestRate": "1.1%",
            "title": "Save and still be able to withdraw money",
            "description": "The DHB CombiSpaarrekening offers a higher interest rate than the DHB SaveOnline because withdrawals are planned in advance. Depending on the chosen account, you can give 33, 66, or 99 days' notice for withdrawals. A longer notice period results in a higher interest rate."
        },
        "timestamp": datetime.now().isoformat()
    })

@app.route('/api/combispaar/account-options', methods=['GET'])
def legacy_get_combispaar_account_options():
    """Legacy endpoint for combispaar account options"""
    today = datetime.now()
    return jsonify({
        "success": True,
        "data": [
            {
                "id": "33-days",
                "name": "33 Days Notice",
                "balanceClass": "Class A",
                "noticePeriod": "33 days",
                "interest": "1.2%",
                "validFrom": today.strftime("%d-%m-%Y"),
                "days": 33,
                "interestRate": 1.2,
                "description": "Withdraw with 33 days notice"
            },
            {
                "id": "66-days",
                "name": "66 Days Notice",
                "balanceClass": "Class B",
                "noticePeriod": "66 days",
                "interest": "1.3%",
                "validFrom": today.strftime("%d-%m-%Y"),
                "days": 66,
                "interestRate": 1.3,
                "description": "Withdraw with 66 days notice"
            },
            {
                "id": "99-days",
                "name": "99 Days Notice",
                "balanceClass": "Class C",
                "noticePeriod": "99 days",
                "interest": "1.4%",
                "validFrom": today.strftime("%d-%m-%Y"),
                "days": 99,
                "interestRate": 1.4,
                "description": "Withdraw with 99 days notice"
            }
        ],
        "timestamp": datetime.now().isoformat()
    })

@app.route('/api/combispaar/iban-options', methods=['GET'])
def legacy_get_combispaar_iban_options():
    """Legacy endpoint for combispaar IBAN options"""
    return jsonify({
        "success": True,
        "data": [
            {
                "iban": "NL24DHBN2018470578",
                "accountName": "DHB SaveOnline",
                "balance": 10566.55,
                "currency": "EUR"
            },
            {
                "iban": "NL24DHBN2018470579",
                "accountName": "DHB MaxiSpaar",
                "balance": 31960.23,
                "currency": "EUR"
            }
        ],
        "timestamp": datetime.now().isoformat()
    })

@app.route('/api/maxispaar/page-data', methods=['GET'])
def legacy_get_maxispaar_page_data():
    """Legacy endpoint for maxispaar page data"""
    return jsonify({
        "success": True,
        "data": {
            "balance": "€ 31.960,23",
            "interest_rate": "1.1%",
            "maturity_date": "31-12-2025",
            "value_date": "15-01-2025",
            "iban": "NL24DHBN2018470578",
            "title": "Many choices of different terms",
            "description": "Do you want to benefit from a higher interest rate by fixing your savings for a certain period? With a DHB MaxiSpaar account, you can easily choose from different terms, from three months up to 5 years.",
            "additional": "If you already have a DHB SaveOnline account, you can immediately open a DHB MaxiSpaar account online. That is free."
        },
        "timestamp": datetime.now().isoformat()
    })

@app.route('/api/dashboard', methods=['GET'])
def legacy_get_dashboard():
    """Legacy endpoint for dashboard data"""
    return jsonify({
        "success": True,
        "data": {
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
            "combispaar": {
                "accounts": [
                    {
                        "id": "combispaar_001",
                        "name": "DHB Combispaar Account 1",
                        "type": "savings",
                        "balance": 12500.00,
                        "currency": "EUR",
                        "iban": "NL24DHBN2018470581",
                        "interest_rate": 1.1,
                        "holder_name": "Lucy Lavender"
                    }
                ],
                "total_balance": 12500.00,
                "count": 1
            },
            "chart_data": [
                {
                    "label": "DHB SaveOnline",
                    "value": 10566.55,
                    "color": "#1976d2"
                },
                {
                    "label": "DHB MaxiSpaar",
                    "value": 31960.23,
                    "color": "#388e3c"
                }
            ],
            "user_info": {
                "name": "Lucy Lavender",
                "customer_id": "CUST001",
                "last_login": "2025-01-15 14:30:00"
            }
        },
        "timestamp": datetime.now().isoformat()
    })

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5002)
