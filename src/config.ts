export const firebaseConfig = {
  apiKey: import.meta.env.VITE_APP_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_APP_FIREBASE_AUTH_DOMAIN,
  databaseURL: import.meta.env.VITE_APP_FIREBASE_DATABASE_URL,
  projectId: import.meta.env.VITE_APP_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_APP_FIREBASE_APPID,
  measurementId: import.meta.env.VITE_APP_FIREBASE_MEASUREMENT_ID,
};

export const auth0Config = {
  clientId: import.meta.env.VITE_APP_AUTH0_CLIENT_ID,
  domain: import.meta.env.VITE_APP_AUTH0_DOMAIN,
  clientSecret: import.meta.env.VITE_APP_AUTH_CLIENT_SECRET,
  redirectUri: import.meta.env.VITE_APP_REDIRECT_URI,
};

export const cognitoConfig = {
  userPoolId: import.meta.env.VITE_APP_COGNITO_USER_POOL_ID,
  clientId: import.meta.env.VITE_APP_COGNITO_CLIENT_ID,
};

export const auth0ConfigTestEnv = {
  clientId: import.meta.env.VITE_APP_AUTH0_CLIENT_ID,
  domain: import.meta.env.VITE_APP_AUTH0_DOMAIN,
  clientSecret: import.meta.env.VITE_APP_AUTH_CLIENT_SECRET,
  redirectUri: import.meta.env.VITE_APP_TEST_REDIRECT_URI,
};

export const auth0ConfigProdEnv = {
  clientId: import.meta.env.VITE_APP_PROD_CLIENT_ID,
  domain: import.meta.env.VITE_APP_PROD_DOMAIN,
  clientSecret: import.meta.env.VITE_APP_PROD_CLIENT_SECRET,
  redirectUri: import.meta.env.VITE_APP_PROD_REDIRECT_URI,
};

const API_GATEWAY_TEST = import.meta.env.VITE_APP_API_GATEWAY_TEST;
const API_GATEWAY_PROD = import.meta.env.VITE_APP_API_GATEWAY_PROD;

export const apiConfigTest = {
  accountsApi: API_GATEWAY_TEST + import.meta.env.VITE_APP_ACCOUNTS_API,
  cardsApi: API_GATEWAY_TEST + import.meta.env.VITE_APP_CARDS_API,
  exchangeApi: API_GATEWAY_TEST + import.meta.env.VITE_APP_EXCHANGE_API,
  paymentApi: API_GATEWAY_TEST + import.meta.env.VITE_APP_PAYMENT_API,
  transferApi: API_GATEWAY_TEST + import.meta.env.VITE_APP_TRANSFER_API,
  customerApi: API_GATEWAY_TEST + import.meta.env.VITE_APP_CUSTOMER_API,
  userManagementApi:
    API_GATEWAY_TEST + import.meta.env.VITE_APP_USER_MANAGEMENT_API,
  fileUpload: API_GATEWAY_TEST + import.meta.env.VITE_APP_FILE_UPLOAD_API,
  fileParse: API_GATEWAY_TEST + import.meta.env.VITE_APP_FILE_PARSE_API,
  bulkTransactions:
    API_GATEWAY_TEST + import.meta.env.VITE_APP_BULK_TRANSACTIONS_API,
  loanApi: API_GATEWAY_TEST + import.meta.env.VITE_APP_LOAN_API,
  cardPlusApi: import.meta.env.VITE_APP_CARD_PLUS_API,
  limitApi: API_GATEWAY_TEST + import.meta.env.VITE_APP_LIMIT_API,
  templateApi: API_GATEWAY_TEST + import.meta.env.VITE_APP_TEMPLATE_API,
  mainApi: API_GATEWAY_TEST + import.meta.env.VITE_APP_MAIN_API,
  notificationsApi:
    API_GATEWAY_TEST + import.meta.env.VITE_APP_NOTIFICATIONS_API,
  localizationsApi: import.meta.env.VITE_APP_UAT_URL,
};

export const apiConfigProd = {
  accountsApi: API_GATEWAY_PROD + import.meta.env.VITE_APP_ACCOUNTS_API,
  cardsApi: API_GATEWAY_PROD + import.meta.env.VITE_APP_CARDS_API,
  exchangeApi: API_GATEWAY_PROD + import.meta.env.VITE_APP_EXCHANGE_API,
  paymentApi: API_GATEWAY_PROD + import.meta.env.VITE_APP_PAYMENT_API,
  transferApi: API_GATEWAY_PROD + import.meta.env.VITE_APP_TRANSFER_API,
  customerApi: API_GATEWAY_PROD + import.meta.env.VITE_APP_CUSTOMER_API,
  userManagementApi:
    API_GATEWAY_PROD + import.meta.env.VITE_APP_USER_MANAGEMENT_API,
  fileUpload: API_GATEWAY_PROD + import.meta.env.VITE_APP_FILE_UPLOAD_API,
  fileParse: API_GATEWAY_PROD + import.meta.env.VITE_APP_FILE_PARSE_API,
  bulkTransactions:
    API_GATEWAY_PROD + import.meta.env.VITE_APP_BULK_TRANSACTIONS_API,
  loanApi: API_GATEWAY_PROD + import.meta.env.VITE_APP_LOAN_API,
  cardPlusApi: import.meta.env.VITE_APP_CARD_PLUS_API,
  limitApi: API_GATEWAY_PROD + import.meta.env.VITE_APP_LIMIT_API,
  templateApi: API_GATEWAY_PROD + import.meta.env.VITE_APP_TEMPLATE_API,
  mainApi: API_GATEWAY_PROD + import.meta.env.VITE_APP_MAIN_API,
  notificationsApi:
    API_GATEWAY_PROD + import.meta.env.VITE_APP_NOTIFICATIONS_API,
  localizationsApi: import.meta.env.VITE_APP_UAT_URL,
};

export const DATA_CRYPT_SECRET_KEY = import.meta.env
  .VITE_APP_DATA_CRYPT_SECRET_KEY;

export const environment: "local" | "test" | "prod" = import.meta.env
  .VITE_APP_ENV_VARIABLE;

export const apiConfig = environment === "prod" ? apiConfigProd : apiConfigTest;
