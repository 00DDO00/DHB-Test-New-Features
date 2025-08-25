from flask import Flask, jsonify, request
from flask_cors import CORS
import yaml
import os
import re
from datetime import datetime, timedelta
import uuid
import json

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

mock_accounts = [
    {
        "BIC": "DHBNNL2R",
        "IBAN": "NL24DHBN2018470578",
        "accountName": "DHB SaveOnline",
        "accountNumber": "2018470578",
        "accountNumberLabel": "SaveOnline Account",
        "address": "GRONINGEN, STR. VONDELLAAN 172",
        "branch": {
            "code": "AMS",
            "name": "Amsterdam Branch"
        },
        "currencyCode": "EUR",
        "customerName": "Lucy Lavender",
        "detail": {
            "balance": 10566.55,
            "holderName": "Lucy Lavender",
            "interestRate": 1.1
        },
        "minPaymentDate": "2025-01-15T00:00:00Z",
        "moduleType": {
            "code": "SAV",
            "name": "Savings"
        },
        "operationProfile": {
            "allowClosing": True,
            "allowModification": True,
            "allowOwnTransferOut": True,
            "allowPaymentOrderOut": True,
            "allowPrintStatement": True,
            "allowSourceForOpening": True
        },
        "productClass": {
            "code": "SAVINGS",
            "name": "Savings Account"
        },
        "productGroup": {
            "code": "saveOnline",
            "name": "SaveOnline"
        },
        "productType": {
            "code": "SAV_ONLINE",
            "name": "Online Savings"
        },
        "status": "active"
    },
    {
        "BIC": "DHBNNL2R",
        "IBAN": "NL24DHBN2018470579",
        "accountName": "DHB MaxiSpaar",
        "accountNumber": "2018470579",
        "accountNumberLabel": "MaxiSpaar Account",
        "address": "GRONINGEN, STR. VONDELLAAN 172",
        "branch": {
            "code": "AMS",
            "name": "Amsterdam Branch"
        },
        "currencyCode": "EUR",
        "customerName": "Lucy Lavender",
        "detail": {
            "balance": 31960.23,
            "holderName": "Lucy Lavender",
            "interestRate": 1.1
        },
        "minPaymentDate": "2025-01-15T00:00:00Z",
        "moduleType": {
            "code": "SAV",
            "name": "Savings"
        },
        "operationProfile": {
            "allowClosing": True,
            "allowModification": True,
            "allowOwnTransferOut": True,
            "allowPaymentOrderOut": True,
            "allowPrintStatement": True,
            "allowSourceForOpening": True
        },
        "productClass": {
            "code": "SAVINGS",
            "name": "Savings Account"
        },
        "productGroup": {
            "code": "maxiSpaar",
            "name": "MaxiSpaar"
        },
        "productType": {
            "code": "SAV_MAXI",
            "name": "Maxi Savings"
        },
        "status": "active"
    }
]

# ============================================================================
# CUSTOMER API ENDPOINTS
# ============================================================================

@app.route('/customer/profile/phone/<customer_id>', methods=['GET'])
def get_customer_phone(customer_id):
    """Get phone number - maps to /customer/profile/phone/{customerId}"""
    
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
        }
    ])

@app.route('/customer/profile/phone/<customer_id>', methods=['PUT'])
def update_customer_phone(customer_id):
    """Update phone number - maps to /customer/profile/phone/{customerId}"""
    
    # Validate required headers
    header_valid, missing_headers = validate_required_headers()
    if not header_valid:
        return create_error_response('495', f"Missing required headers: {', '.join(missing_headers)}")
    
    # Validate customer ID
    if not customer_id:
        return create_error_response('453', 'Customer id is null')
    
    try:
        data = request.get_json()
        
        # Validate required fields
        if not data.get('phoneNumber'):
            return create_error_response('454', 'Mobile phone number is null')
        
        # Mock response
        return jsonify({
            "success": True,
            "message": "Phone number updated successfully",
            "phoneNumber": data.get('phoneNumber'),
            "timestamp": datetime.now().isoformat()
        })
    except Exception as e:
        return create_error_response('500', f'System error occurred: {str(e)}')

@app.route('/customer/profile/identification/<customer_id>', methods=['GET'])
def get_customer_identification(customer_id):
    """Get customer identification - maps to /customer/profile/identification/{customerId}"""
    
    # Validate required headers
    header_valid, missing_headers = validate_required_headers()
    if not header_valid:
        return create_error_response('495', f"Missing required headers: {', '.join(missing_headers)}")
    
    # Validate customer ID
    if not customer_id:
        return create_error_response('453', 'Customer id is null')
    
    # Mock response
    return jsonify({
        "identityType": "PASSPORT",
        "identitySeries": "AB",
        "identitySerialNo": "1234567",
        "issueDate": "2020-01-15T00:00:00Z",
        "expiryDate": "2030-01-15T00:00:00Z",
        "issueCountry": "NL",
        "issueCountryName": "Netherlands"
    })

@app.route('/customer/profile/identification/<customer_id>', methods=['PUT'])
def update_customer_identification(customer_id):
    """Update customer identification - maps to /customer/profile/identification/{customerId}"""
    
    # Validate required headers
    header_valid, missing_headers = validate_required_headers()
    if not header_valid:
        return create_error_response('495', f"Missing required headers: {', '.join(missing_headers)}")
    
    # Validate customer ID
    if not customer_id:
        return create_error_response('453', 'Customer id is null')
    
    try:
        data = request.get_json()
        
        # Mock response
        return jsonify({
            "success": True,
            "message": "Identification updated successfully",
            "timestamp": datetime.now().isoformat()
        })
    except Exception as e:
        return create_error_response('500', f'System error occurred: {str(e)}')

@app.route('/customer/profile/email/<customer_id>', methods=['GET'])
def get_customer_email(customer_id):
    """Get customer email - maps to /customer/profile/email/{customerId}"""
    
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
            "address": "lucy.lavender@example.com",
            "editable": True,
            "editableFlag": "Y"
        }
    ])

@app.route('/customer/profile/email/<customer_id>', methods=['PUT'])
def update_customer_email(customer_id):
    """Update customer email - maps to /customer/profile/email/{customerId}"""
    
    # Validate required headers
    header_valid, missing_headers = validate_required_headers()
    if not header_valid:
        return create_error_response('495', f"Missing required headers: {', '.join(missing_headers)}")
    
    # Validate customer ID
    if not customer_id:
        return create_error_response('453', 'Customer id is null')
    
    try:
        data = request.get_json()
        
        # Mock response
        return jsonify({
            "success": True,
            "message": "Email updated successfully",
            "timestamp": datetime.now().isoformat()
        })
    except Exception as e:
        return create_error_response('500', f'System error occurred: {str(e)}')

@app.route('/customer/profile/address/<customer_id>', methods=['GET'])
def get_customer_address(customer_id):
    """Get customer address - maps to /customer/profile/address/{customerId}"""
    
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
            "addressType": "HOME",
            "addressTypeName": "Home Address",
            "cityCode": "AMS",
            "cityName": "Amsterdam",
            "countryCode": "NL",
            "editable": True,
            "editableFlag": "Y",
            "fullAddressInfo": "GRONINGEN, STR. VONDELLAAN 172",
            "houseNumber": "172",
            "street": "Vondellaan",
            "zipCode": "1011AA"
        }
    ])

@app.route('/customer/profile/address/<customer_id>', methods=['PUT'])
def update_customer_address(customer_id):
    """Update customer address - maps to /customer/profile/address/{customerId}"""
    
    # Validate required headers
    header_valid, missing_headers = validate_required_headers()
    if not header_valid:
        return create_error_response('495', f"Missing required headers: {', '.join(missing_headers)}")
    
    # Validate customer ID
    if not customer_id:
        return create_error_response('453', 'Customer id is null')
    
    try:
        data = request.get_json()
        
        # Mock response
        return jsonify({
            "success": True,
            "message": "Address updated successfully",
            "timestamp": datetime.now().isoformat()
        })
    except Exception as e:
        return create_error_response('500', f'System error occurred: {str(e)}')

@app.route('/customer/profile/validateNetBankingUser', methods=['POST'])
def validate_net_banking_user():
    """Validate net banking user - maps to /customer/profile/validateNetBankingUser"""
    
    # Validate required headers
    header_valid, missing_headers = validate_required_headers()
    if not header_valid:
        return create_error_response('495', f"Missing required headers: {', '.join(missing_headers)}")
    
    try:
        data = request.get_json()
        
        # Mock response
        return jsonify({
            "isValid": True,
            "message": "User validation successful",
            "timestamp": datetime.now().isoformat()
        })
    except Exception as e:
        return create_error_response('500', f'System error occurred: {str(e)}')

@app.route('/customer/profile/login', methods=['POST'])
def customer_login():
    """Customer login - maps to /customer/profile/login"""
    
    # Validate required headers
    header_valid, missing_headers = validate_required_headers()
    if not header_valid:
        return create_error_response('495', f"Missing required headers: {', '.join(missing_headers)}")
    
    try:
        data = request.get_json()
        
        # Mock response
        return jsonify({
            "success": True,
            "sessionId": str(uuid.uuid4()),
            "message": "Login successful",
            "timestamp": datetime.now().isoformat()
        })
    except Exception as e:
        return create_error_response('500', f'System error occurred: {str(e)}')

@app.route('/customer/profile/appStatus', methods=['POST'])
def get_app_status():
    """Get app status - maps to /customer/profile/appStatus"""
    
    # Validate required headers
    header_valid, missing_headers = validate_required_headers()
    if not header_valid:
        return create_error_response('495', f"Missing required headers: {', '.join(missing_headers)}")
    
    try:
        data = request.get_json()
        
        # Mock response
        return jsonify({
            "status": "ACTIVE",
            "message": "Application is active",
            "timestamp": datetime.now().isoformat()
        })
    except Exception as e:
        return create_error_response('500', f'System error occurred: {str(e)}')

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
        
        # Create new message
        new_message = {
            "reference": f"MSG{str(uuid.uuid4())[:8].upper()}",
            "entryDate": datetime.now().isoformat() + "Z",
            "type": data.get('type', 'Email'),
            "subject": data.get('subject', 'New Message'),
            "body": data.get('content', ''),
            "isRead": False
        }
        
        messages_store.append(new_message)
        
        return jsonify(new_message)
    except Exception as e:
        return create_error_response('500', f'System error occurred: {str(e)}')

@app.route('/customer/profile/resolveAddress/<customer_id>/<post_code>', methods=['GET'])
def resolve_address_by_postcode(customer_id, post_code):
    """Resolve address by postcode - maps to /customer/profile/resolveAddress/{customerId}/{postCode}"""
    
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
            "street": "Vondellaan",
            "city": "Amsterdam",
            "postCode": post_code,
            "houseNumbers": ["170", "172", "174"]
        }
    ])

@app.route('/customer/profile/resolveAddress/<customer_id>/<post_code>/<house_no>', methods=['GET'])
def resolve_address_by_house_number(customer_id, post_code, house_no):
    """Resolve address by house number - maps to /customer/profile/resolveAddress/{customerId}/{postCode}/{houseNo}"""
    
    # Validate required headers
    header_valid, missing_headers = validate_required_headers()
    if not header_valid:
        return create_error_response('495', f"Missing required headers: {', '.join(missing_headers)}")
    
    # Validate customer ID
    if not customer_id:
        return create_error_response('453', 'Customer id is null')
    
    # Mock response
    return jsonify({
        "street": "Vondellaan",
        "houseNumber": house_no,
        "postCode": post_code,
        "city": "Amsterdam",
        "fullAddress": f"Vondellaan {house_no}, {post_code} Amsterdam"
    })

@app.route('/customer/profile/isNetBankingUserActive/<customer_id>', methods=['GET'])
def is_net_banking_user_active(customer_id):
    """Check if net banking user is active - maps to /customer/profile/isNetBankingUserActive/{customerId}"""
    
    # Validate required headers
    header_valid, missing_headers = validate_required_headers()
    if not header_valid:
        return create_error_response('495', f"Missing required headers: {', '.join(missing_headers)}")
    
    # Validate customer ID
    if not customer_id:
        return create_error_response('453', 'Customer id is null')
    
    # Mock response
    return jsonify({
        "isActive": True,
        "lastLoginDate": "2025-01-15T14:30:00Z",
        "timestamp": datetime.now().isoformat()
    })

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
        "customerId": customer_id,
        "firstName": "Lucy",
        "firstNameLatin": "Lucy",
        "surName": "Lavender",
        "surNameLatin": "Lavender",
        "middleName": "",
        "birthDate": "1985-06-15T00:00:00Z",
        "birthPlace": "Amsterdam",
        "genderCode": "F",
        "genderName": "Female",
        "maritalStatusCode": "S",
        "maritalStatusName": "Single",
        "customerType": "INDIVIDUAL",
        "customerTypeName": "Individual",
        "customerStatus": "ACTIVE",
        "customerNumber": "123456789",
        "taxNumber": "12345678901",
        "taxOfficeCode": "001",
        "taxOfficeName": "Amsterdam Tax Office",
        "identityType": "PASSPORT",
        "identitySeries": "AB",
        "identitySerialNo": "1234567",
        "prefferedLang": "en",
        "addresses": [
            {
                "addressType": "HOME",
                "addressTypeName": "Home Address",
                "cityCode": "AMS",
                "cityName": "Amsterdam",
                "countryCode": "NL",
                "editable": True,
                "editableFlag": "Y",
                "fullAddressInfo": "GRONINGEN, STR. VONDELLAAN 172",
                "houseNumber": "172",
                "street": "Vondellaan",
                "zipCode": "1011AA"
            }
        ],
        "phones": [
            {
                "editable": True,
                "editableFlag": "Y",
                "phoneNumber": "+31 123 456 789",
                "phoneType": "MOBILE",
                "phoneTypeName": "Mobile"
            }
        ],
        "emails": [
            {
                "address": "lucy.lavender@example.com",
                "editable": True,
                "editableFlag": "Y"
            }
        ]
    })

@app.route('/customer/messages/<customer_id>/<reference>', methods=['GET'])
def get_customer_message_by_reference(customer_id, reference):
    """Get customer message by reference - maps to /customer/messages/{customerId}/{reference}"""
    
    # Validate required headers
    header_valid, missing_headers = validate_required_headers()
    if not header_valid:
        return create_error_response('495', f"Missing required headers: {', '.join(missing_headers)}")
    
    # Validate customer ID
    if not customer_id:
        return create_error_response('453', 'Customer id is null')
    
    # Find message by reference
    message = next((msg for msg in messages_store if msg['reference'] == reference), None)
    
    if not message:
        return create_error_response('477', 'Message not found')
    
    return jsonify(message)

@app.route('/customer/messages/<customer_id>/<reference>', methods=['DELETE'])
def delete_customer_message(customer_id, reference):
    """Delete customer message - maps to /customer/messages/{customerId}/{reference}"""
    
    # Validate required headers
    header_valid, missing_headers = validate_required_headers()
    if not header_valid:
        return create_error_response('495', f"Missing required headers: {', '.join(missing_headers)}")
    
    # Validate customer ID
    if not customer_id:
        return create_error_response('453', 'Customer id is null')
    
    # Find and remove message
    global messages_store
    messages_store = [msg for msg in messages_store if msg['reference'] != reference]
    
    return jsonify({
        "success": True,
        "message": "Message deleted successfully",
        "timestamp": datetime.now().isoformat()
    })

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
    unread_count = len([msg for msg in messages_store if not msg['isRead']])
    
    return jsonify({
        "count": unread_count
    })

@app.route('/customer/messages/list/<customer_id>', methods=['GET'])
def get_customer_messages(customer_id):
    """Get customer messages list - maps to /customer/messages/list/{customerId}"""
    
    # Validate required headers
    header_valid, missing_headers = validate_required_headers()
    if not header_valid:
        return create_error_response('495', f"Missing required headers: {', '.join(missing_headers)}")
    
    # Validate customer ID
    if not customer_id:
        return create_error_response('453', 'Customer id is null')
    
    return jsonify(messages_store)

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

@app.route('/customer/downloads/financialAnnualOverview/print/<customer_id>/<id>', methods=['GET'])
def print_financial_annual_overview(customer_id, id):
    """Print financial annual overview - maps to /customer/downloads/financialAnnualOverview/print/{customerId}/{id}"""
    
    # Validate required headers
    header_valid, missing_headers = validate_required_headers()
    if not header_valid:
        return create_error_response('495', f"Missing required headers: {', '.join(missing_headers)}")
    
    # Validate customer ID
    if not customer_id:
        return create_error_response('453', 'Customer id is null')
    
    # Mock response
    return jsonify({
        "success": True,
        "documentId": id,
        "downloadUrl": f"/downloads/financial/{id}.pdf",
        "timestamp": datetime.now().isoformat()
    })

@app.route('/customer/downloads/contracts/<customer_id>', methods=['GET'])
def get_customer_contracts(customer_id):
    """Get customer contracts - maps to /customer/downloads/contracts/{customerId}"""
    
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
            "contractType": "savings",
            "name": "DHB SaveOnline Contract",
            "date": "2024-01-15",
            "id": "CON_SAV_001"
        },
        {
            "contractType": "maxispaar",
            "name": "DHB MaxiSpaar Contract",
            "date": "2024-06-20",
            "id": "CON_MAX_001"
        }
    ])

@app.route('/customer/downloads/contracts/print/<customer_id>/<id>', methods=['GET'])
def print_customer_contract(customer_id, id):
    """Print customer contract - maps to /customer/downloads/contracts/print/{customerId}/{id}"""
    
    # Validate required headers
    header_valid, missing_headers = validate_required_headers()
    if not header_valid:
        return create_error_response('495', f"Missing required headers: {', '.join(missing_headers)}")
    
    # Validate customer ID
    if not customer_id:
        return create_error_response('453', 'Customer id is null')
    
    # Mock response
    return jsonify({
        "success": True,
        "contractId": id,
        "downloadUrl": f"/downloads/contracts/{id}.pdf",
        "timestamp": datetime.now().isoformat()
    })

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
# ACCOUNT API ENDPOINTS
# ============================================================================

@app.route('/accounts/saving/modification/<customer_id>/<account_number>', methods=['GET'])
def get_saving_modification(customer_id, account_number):
    """Get saving modification - maps to /accounts/saving/modification/{customerId}/{accountNumber}"""
    
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
        "accountNumber": account_number,
        "customerId": customer_id,
        "modificationAllowed": True,
        "modificationOptions": [
            "interest_rate_change",
            "account_type_change",
            "holder_change"
        ]
    })

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
        "isMatch": True,
        "customerName": "Lucy Lavender",
        "accountHolder": "Lucy Lavender"
    })

@app.route('/accounts/targetAccounts/<customer_id>/<account_number>/<transaction_type>', methods=['GET'])
def get_target_accounts(customer_id, account_number, transaction_type):
    """Get target accounts - maps to /accounts/targetAccounts/{customerId}/{accountNumber}/{transactionType}"""
    
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
    return jsonify([
        {
            "accountNumber": "2018470580",
            "accountName": "Target Account 1",
            "iban": "NL24DHBN2018470580",
            "holderName": "John Doe"
        },
        {
            "accountNumber": "2018470581",
            "accountName": "Target Account 2",
            "iban": "NL24DHBN2018470581",
            "holderName": "Jane Smith"
        }
    ])

@app.route('/accounts/saving/transactions/receipt/<account_number>', methods=['GET'])
def get_transaction_receipt(account_number):
    """Get transaction receipt - maps to /accounts/saving/transactions/receipt/{accountNumber}"""
    
    # Validate required headers
    header_valid, missing_headers = validate_required_headers()
    if not header_valid:
        return create_error_response('495', f"Missing required headers: {', '.join(missing_headers)}")
    
    # Validate account number
    if not account_number:
        return create_error_response('456', 'Account number is null')
    
    # Mock response
    return jsonify({
        "accountNumber": account_number,
        "transactionId": "TXN001",
        "receiptUrl": f"/receipts/{account_number}/TXN001.pdf",
        "timestamp": datetime.now().isoformat()
    })

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
                "transactionDate": "2025-01-15",
                "valueDate": "2025-01-15",
                "description": "Salary payment",
                "amount": 2500.00,
                "balance": 10566.55,
                "type": "CREDIT",
                "reference": "REF001"
            },
            {
                "transactionDate": "2025-01-14",
                "valueDate": "2025-01-14",
                "description": "Online purchase",
                "amount": -125.50,
                "balance": 8066.55,
                "type": "DEBIT",
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

@app.route('/accounts/saving/statement/print/<account_number>', methods=['GET'])
def print_account_statement(account_number):
    """Print account statement - maps to /accounts/saving/statement/print/{accountNumber}"""
    
    # Validate required headers
    header_valid, missing_headers = validate_required_headers()
    if not header_valid:
        return create_error_response('495', f"Missing required headers: {', '.join(missing_headers)}")
    
    # Validate account number
    if not account_number:
        return create_error_response('456', 'Account number is null')
    
    # Mock response
    return jsonify({
        "success": True,
        "accountNumber": account_number,
        "statementUrl": f"/statements/{account_number}/statement.pdf",
        "timestamp": datetime.now().isoformat()
    })

@app.route('/accounts/saving/rates/<customer_id>', methods=['GET'])
def get_saving_rates(customer_id):
    """Get saving rates - maps to /accounts/saving/rates/{customerId}"""
    
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

@app.route('/accounts/saving/history/<account_number>', methods=['GET'])
def get_saving_history(account_number):
    """Get saving history - maps to /accounts/saving/history/{accountNumber}"""
    
    # Validate required headers
    header_valid, missing_headers = validate_required_headers()
    if not header_valid:
        return create_error_response('495', f"Missing required headers: {', '.join(missing_headers)}")
    
    # Validate account number
    if not account_number:
        return create_error_response('456', 'Account number is null')
    
    # Mock response
    return jsonify({
        "accountNumber": account_number,
        "history": [
            {
                "date": "2025-01-15",
                "action": "ACCOUNT_OPENED",
                "description": "Account opened",
                "amount": 1000.00
            },
            {
                "date": "2025-01-20",
                "action": "INTEREST_PAID",
                "description": "Interest payment",
                "amount": 5.50
            }
        ]
    })

@app.route('/accounts/saving/history/print/<account_number>', methods=['GET'])
def print_saving_history(account_number):
    """Print saving history - maps to /accounts/saving/history/print/{accountNumber}"""
    
    # Validate required headers
    header_valid, missing_headers = validate_required_headers()
    if not header_valid:
        return create_error_response('495', f"Missing required headers: {', '.join(missing_headers)}")
    
    # Validate account number
    if not account_number:
        return create_error_response('456', 'Account number is null')
    
    # Mock response
    return jsonify({
        "success": True,
        "accountNumber": account_number,
        "historyUrl": f"/history/{account_number}/history.pdf",
        "timestamp": datetime.now().isoformat()
    })

@app.route('/accounts/saving/calculate/<customer_id>', methods=['GET'])
def calculate_saving(customer_id):
    """Calculate saving - maps to /accounts/saving/calculate/{customerId}"""
    
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
        "calculations": [
            {
                "productCode": "SAV_ONLINE",
                "amount": 10000.00,
                "interestRate": 1.1,
                "interestEarned": 110.00,
                "totalAmount": 10110.00
            }
        ]
    })

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
    
    # Mock response
    return jsonify({
        "saving": mock_accounts
    })

# ============================================================================
# TRANSFER API ENDPOINTS
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
    
    # Validate source account
    if not source_account:
        return create_error_response('456', 'Account number is null')
    
    # Get query parameters
    target_iban = request.args.get('targetIBAN', '')
    amount = request.args.get('amount', '0')
    currency_code = request.args.get('currencyCode', 'EUR')
    description = request.args.get('description', '')
    payment_type = request.args.get('paymentType', 'normal')
    period = request.args.get('period', 'oneOff')
    
    # Mock response based on TransferSimulation schema
    return jsonify({
        "simulationId": str(uuid.uuid4()),
        "sourceAccount": source_account,
        "targetIBAN": target_iban,
        "amount": float(amount),
        "currencyCode": currency_code,
        "description": description,
        "paymentType": payment_type,
        "period": period,
        "fees": 0.00,
        "totalAmount": float(amount),
        "estimatedDelivery": datetime.now().strftime("%Y-%m-%d"),
        "status": "SIMULATED"
    })

@app.route('/transfers/ownAccountTransfer/<customer_id>/<source_account>', methods=['GET'])
def get_own_account_transfer(customer_id, source_account):
    """Get own account transfer - maps to /transfers/ownAccountTransfer/{customerId}/{sourceAccountNumber}"""
    
    # Validate required headers
    header_valid, missing_headers = validate_required_headers()
    if not header_valid:
        return create_error_response('495', f"Missing required headers: {', '.join(missing_headers)}")
    
    # Validate customer ID
    if not customer_id:
        return create_error_response('453', 'Customer id is null')
    
    # Validate source account
    if not source_account:
        return create_error_response('456', 'Account number is null')
    
    # Mock response
    return jsonify({
        "customerId": customer_id,
        "sourceAccount": source_account,
        "targetAccounts": [
            {
                "accountNumber": "2018470579",
                "accountName": "DHB MaxiSpaar",
                "iban": "NL24DHBN2018470579"
            }
        ]
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
        {
            "date": "2025-01-01",
            "description": "New Year's Day",
            "isHoliday": True
        },
        {
            "date": "2025-12-25",
            "description": "Christmas Day",
            "isHoliday": True
        }
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

@app.route('/transfers/payment/futurePayment/list/<customer_id>', methods=['GET'])
def get_future_payment_list(customer_id):
    """Get future payment list - maps to /transfers/payment/futurePayment/list/{customerId}"""
    
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
            "paymentId": "PAY001",
            "sourceAccount": "2018470578",
            "targetIBAN": "NL24DHBN2018470579",
            "amount": 500.00,
            "description": "Monthly transfer",
            "scheduledDate": "2025-02-01",
            "status": "SCHEDULED"
        }
    ])

@app.route('/transfers/payment/<customer_id>/<reference>', methods=['GET'])
def get_payment_by_reference(customer_id, reference):
    """Get payment by reference - maps to /transfers/payment/{customerId}/{reference}"""
    
    # Validate required headers
    header_valid, missing_headers = validate_required_headers()
    if not header_valid:
        return create_error_response('495', f"Missing required headers: {', '.join(missing_headers)}")
    
    # Validate customer ID
    if not customer_id:
        return create_error_response('453', 'Customer id is null')
    
    # Mock response
    return jsonify({
        "reference": reference,
        "customerId": customer_id,
        "status": "COMPLETED",
        "amount": 100.00,
        "timestamp": datetime.now().isoformat()
    })

# ============================================================================
# VOP ENDPOINTS
# ============================================================================

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

# ============================================================================
# LEGACY ENDPOINTS - FOR BACKWARD COMPATIBILITY
# ============================================================================

@app.route('/api/combispaar', methods=['GET'])
def legacy_get_combispaar():
    """Legacy endpoint for combispaar accounts"""
    
    # Validate required headers
    header_valid, missing_headers = validate_required_headers()
    if not header_valid:
        return create_error_response('495', f"Missing required headers: {', '.join(missing_headers)}")
    
    # Mock response
    return jsonify({
        "success": True,
        "data": [
            {
                "id": "combispaar_001",
                "name": "DHB Combispaar",
                "type": "combispaar",
                "balance": 15000.00,
                "currency": "EUR",
                "iban": "NL24DHBN2018470580",
                "interest_rate": 1.1,
                "holder_name": "Lucy Lavender"
            }
        ],
        "total_balance": 15000.00,
        "count": 1,
        "timestamp": datetime.now().isoformat()
    })

@app.route('/api/combispaar/page-data', methods=['GET'])
def legacy_get_combispaar_page_data():
    """Legacy endpoint for combispaar page data"""
    
    # Validate required headers
    header_valid, missing_headers = validate_required_headers()
    if not header_valid:
        return create_error_response('495', f"Missing required headers: {', '.join(missing_headers)}")
    
    # Mock response
    return jsonify({
        "success": True,
        "data": {
            "accountName": "DHB SaveOnline",
            "balance": "€ 10.566,55",
            "iban": "NL24DHBN2018470578",
            "interestRate": 1.1,
            "title": "Save and still be able to withdraw money",
            "description": "The DHB CombiSpaarrekening offers a higher interest rate than the DHB SaveOnline because withdrawals are planned in advance. Depending on the chosen account, you can give 33, 66, or 99 days' notice for withdrawals. A longer notice period results in a higher interest rate."
        },
        "timestamp": datetime.now().isoformat()
    })

@app.route('/api/combispaar/account-options', methods=['GET'])
def legacy_get_combispaar_account_options():
    """Legacy endpoint for combispaar account options"""
    
    # Validate required headers
    header_valid, missing_headers = validate_required_headers()
    if not header_valid:
        return create_error_response('495', f"Missing required headers: {', '.join(missing_headers)}")
    
    # Mock response
    return jsonify({
        "success": True,
        "data": [
            {
                "id": "33-days",
                "name": "33 Days Notice",
                "days": 33,
                "interestRate": 1.5,
                "balanceClass": "Class A",
                "noticePeriod": "33 days",
                "interest": "1.5%",
                "validFrom": "2025-01-15"
            },
            {
                "id": "66-days",
                "name": "66 Days Notice",
                "days": 66,
                "interestRate": 1.8,
                "balanceClass": "Class B",
                "noticePeriod": "66 days",
                "interest": "1.8%",
                "validFrom": "2025-01-15"
            },
            {
                "id": "99-days",
                "name": "99 Days Notice",
                "days": 99,
                "interestRate": 2.1,
                "balanceClass": "Class C",
                "noticePeriod": "99 days",
                "interest": "2.1%",
                "validFrom": "2025-01-15"
            }
        ],
        "timestamp": datetime.now().isoformat()
    })

@app.route('/api/combispaar/iban-options', methods=['GET'])
def legacy_get_combispaar_iban_options():
    """Legacy endpoint for combispaar IBAN options"""
    
    # Validate required headers
    header_valid, missing_headers = validate_required_headers()
    if not header_valid:
        return create_error_response('495', f"Missing required headers: {', '.join(missing_headers)}")
    
    # Mock response
    return jsonify({
        "success": True,
        "data": [
            {
                "iban": "NL24DHBN2018470578",
                "accountName": "DHB SaveOnline",
                "balance": "€ 10.566,55",
                "holderName": "Lucy Lavender"
            },
            {
                "iban": "NL24DHBN2018470579",
                "accountName": "DHB MaxiSpaar",
                "balance": "€ 31.960,23",
                "holderName": "Lucy Lavender"
            }
        ],
        "timestamp": datetime.now().isoformat()
    })

@app.route('/api/chart-data', methods=['GET'])
def legacy_get_chart_data():
    """Legacy endpoint for chart data"""
    
    # Validate required headers
    header_valid, missing_headers = validate_required_headers()
    if not header_valid:
        return create_error_response('495', f"Missing required headers: {', '.join(missing_headers)}")
    
    # Mock response
    return jsonify({
        "success": True,
        "data": [
            {
                "label": "Savings",
                "value": 42526.78,
                "color": "#1976d2"
            },
            {
                "label": "Investments",
                "value": 15000.00,
                "color": "#388e3c"
            },
            {
                "label": "Checking",
                "value": 5000.00,
                "color": "#f57c00"
            }
        ],
        "timestamp": datetime.now().isoformat()
    })

@app.route('/api/user', methods=['GET'])
def legacy_get_user():
    """Legacy endpoint for user info"""
    
    # Validate required headers
    header_valid, missing_headers = validate_required_headers()
    if not header_valid:
        return create_error_response('495', f"Missing required headers: {', '.join(missing_headers)}")
    
    # Mock response
    return jsonify({
        "success": True,
        "data": {
            "name": "Lucy Lavender",
            "customer_id": "CUST001",
            "last_login": "2025-01-15 14:30:00"
        },
        "timestamp": datetime.now().isoformat()
    })

@app.route('/api/dashboard', methods=['GET'])
def legacy_get_dashboard():
    """Legacy endpoint for dashboard data"""
    
    # Validate required headers
    header_valid, missing_headers = validate_required_headers()
    if not header_valid:
        return create_error_response('495', f"Missing required headers: {', '.join(missing_headers)}")
    
    # Mock response
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
                        "name": "DHB Combispaar",
                        "type": "combispaar",
                        "balance": 15000.00,
                        "currency": "EUR",
                        "iban": "NL24DHBN2018470580",
                        "interest_rate": 1.1,
                        "holder_name": "Lucy Lavender"
                    }
                ],
                "total_balance": 15000.00,
                "count": 1
            },
            "chart_data": [
                {
                    "label": "Savings",
                    "value": 42526.78,
                    "color": "#1976d2"
                },
                {
                    "label": "Investments",
                    "value": 15000.00,
                    "color": "#388e3c"
                },
                {
                    "label": "Checking",
                    "value": 5000.00,
                    "color": "#f57c00"
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

@app.route('/api/maxispaar/page-data', methods=['GET'])
def legacy_get_maxispaar_page_data():
    """Legacy endpoint for MaxiSpaar page data"""
    
    # Validate required headers
    header_valid, missing_headers = validate_required_headers()
    if not header_valid:
        return create_error_response('495', f"Missing required headers: {', '.join(missing_headers)}")
    
    # Mock response
    return jsonify({
        "success": True,
        "data": {
            "accountName": "DHB MaxiSpaar",
            "balance": "€ 31.960,23",
            "iban": "NL24DHBN2018470579",
            "interest_rate": 1.1,
            "title": "MaxiSpaar Account",
            "description": "High-yield savings account with flexible terms",
            "additional": "No notice period required"
        },
        "timestamp": datetime.now().isoformat()
    })

@app.route('/api/personal-details', methods=['GET'])
def legacy_get_personal_details():
    """Legacy endpoint for personal details"""
    
    # Validate required headers
    header_valid, missing_headers = validate_required_headers()
    if not header_valid:
        return create_error_response('495', f"Missing required headers: {', '.join(missing_headers)}")
    
    # Mock response
    return jsonify({
        "success": True,
        "data": {
            "updateId": "PASSPORT - 1234567",
            "mobilePhone": "+31 123 456 789",
            "password": "**********",
            "email": "lucy.lavender@example.com",
            "telephone": "+31 987 654 321",
            "address": "GRONINGEN, STR. VONDELLAAN 172"
        },
        "timestamp": datetime.now().isoformat()
    })

@app.route('/api/personal-details', methods=['PUT'])
def legacy_update_personal_details():
    """Legacy endpoint for updating personal details"""
    
    # Validate required headers
    header_valid, missing_headers = validate_required_headers()
    if not header_valid:
        return create_error_response('495', f"Missing required headers: {', '.join(missing_headers)}")
    
    try:
        data = request.get_json()
        
        # Mock response
        return jsonify({
            "success": True,
            "data": data,
            "timestamp": datetime.now().isoformat()
        })
    except Exception as e:
        return create_error_response('500', f'System error occurred: {str(e)}')

@app.route('/api/personal-details/phone', methods=['GET'])
def legacy_get_phone():
    """Legacy endpoint for phone number"""
    
    # Validate required headers
    header_valid, missing_headers = validate_required_headers()
    if not header_valid:
        return create_error_response('495', f"Missing required headers: {', '.join(missing_headers)}")
    
    # Mock response
    return jsonify({
        "success": True,
        "data": {
            "phone": "+31 123 456 789"
        },
        "timestamp": datetime.now().isoformat()
    })

@app.route('/api/personal-details/password', methods=['PUT'])
def legacy_update_password():
    """Legacy endpoint for updating password"""
    
    # Validate required headers
    header_valid, missing_headers = validate_required_headers()
    if not header_valid:
        return create_error_response('495', f"Missing required headers: {', '.join(missing_headers)}")
    
    try:
        data = request.get_json()
        
        # Mock response
        return jsonify({
            "success": True,
            "data": {
                "updateId": "PASSPORT - 1234567",
                "mobilePhone": "+31 123 456 789",
                "password": "**********",
                "email": "lucy.lavender@example.com",
                "telephone": "+31 987 654 321",
                "address": "GRONINGEN, STR. VONDELLAAN 172"
            },
            "timestamp": datetime.now().isoformat()
        })
    except Exception as e:
        return create_error_response('500', f'System error occurred: {str(e)}')

@app.route('/api/personal-details/validate-password', methods=['POST'])
def legacy_validate_password():
    """Legacy endpoint for password validation"""
    
    # Validate required headers
    header_valid, missing_headers = validate_required_headers()
    if not header_valid:
        return create_error_response('495', f"Missing required headers: {', '.join(missing_headers)}")
    
    try:
        data = request.get_json()
        
        # Mock validation
        is_valid = data.get('password') and len(data.get('password', '')) >= 6
        
        return jsonify({
            "valid": is_valid,
            "message": "Password is valid" if is_valid else "Password must be at least 6 characters"
        })
    except Exception as e:
        return create_error_response('500', f'System error occurred: {str(e)}')

@app.route('/api/verification/send-code', methods=['GET'])
def legacy_send_verification_code():
    """Legacy endpoint for sending verification code"""
    
    # Validate required headers
    header_valid, missing_headers = validate_required_headers()
    if not header_valid:
        return create_error_response('495', f"Missing required headers: {', '.join(missing_headers)}")
    
    # Generate a random 6-digit code
    import random
    verification_code = ''.join([str(random.randint(0, 9)) for _ in range(6)])
    
    # Mock response
    return jsonify({
        "success": True,
        "data": {
            "code": verification_code
        },
        "message": "Verification code sent successfully",
        "timestamp": datetime.now().isoformat()
    })

@app.route('/api/account/by-iban', methods=['GET'])
def legacy_get_account_by_iban():
    """Legacy endpoint for getting account by IBAN"""
    
    # Validate required headers
    header_valid, missing_headers = validate_required_headers()
    if not header_valid:
        return create_error_response('495', f"Missing required headers: {', '.join(missing_headers)}")
    
    iban = request.args.get('iban', '')
    
    # Mock response
    return jsonify({
        "success": True,
        "data": {
            "holder_name": "Lucy Lavender",
            "institution_name": "DHB Bank",
            "bic": "DHBNNL2R",
            "customer_number": "123456789",
            "support_reg_number": "SUP001",
            "support_packages": "Premium",
            "email": "lucy.lavender@example.com"
        },
        "timestamp": datetime.now().isoformat()
    })

@app.route('/api/sof-questions', methods=['GET'])
def legacy_get_sof_questions():
    """Legacy endpoint for SOF questions"""
    
    # Validate required headers
    header_valid, missing_headers = validate_required_headers()
    if not header_valid:
        return create_error_response('495', f"Missing required headers: {', '.join(missing_headers)}")
    
    # Mock response
    return jsonify({
        "success": True,
        "data": [
            {
                "question": "What is your primary source of income?",
                "answer": "Employment"
            },
            {
                "question": "What is your annual income range?",
                "answer": "€50,000 - €100,000"
            },
            {
                "question": "What is your occupation?",
                "answer": "Software Engineer"
            }
        ],
        "timestamp": datetime.now().isoformat()
    })

@app.route('/api/sof-questions', methods=['PUT'])
def legacy_update_sof_questions():
    """Legacy endpoint for updating SOF questions"""
    
    # Validate required headers
    header_valid, missing_headers = validate_required_headers()
    if not header_valid:
        return create_error_response('495', f"Missing required headers: {', '.join(missing_headers)}")
    
    try:
        data = request.get_json()
        
        # Mock response
        return jsonify({
            "success": True,
            "data": data.get('questions', []),
            "timestamp": datetime.now().isoformat()
        })
    except Exception as e:
        return create_error_response('500', f'System error occurred: {str(e)}')

@app.route('/api/documents/download', methods=['GET'])
def legacy_download_document():
    """Legacy endpoint for document download"""
    
    # Validate required headers
    header_valid, missing_headers = validate_required_headers()
    if not header_valid:
        return create_error_response('495', f"Missing required headers: {', '.join(missing_headers)}")
    
    document_type = request.args.get('type', '')
    
    # Mock response - generate a simple text file
    content = f"This is a mock {document_type} document generated at {datetime.now().isoformat()}"
    
    from flask import Response
    return Response(
        content,
        mimetype='text/plain',
        headers={'Content-Disposition': f'attachment; filename={document_type}.txt'}
    )

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5003)
