const API_BASE_URL = 'http://localhost:5003'; // Changed to yaml-api.py port

export interface Account {
  id: string;
  name: string;
  type: string;
  balance: number;
  currency: string;
  iban: string;
  interest_rate: number;
  holder_name: string;
}

export interface CombispaarAccount {
  id: string;
  name: string;
  type: string;
  balance: number;
  currency: string;
  iban: string;
  interest_rate: number;
  holder_name: string;
}

export interface ChartData {
  label: string;
  value: number;
  color: string;
}

export interface UserInfo {
  name: string;
  customer_id: string;
  last_login: string;
}

export interface UserProfile {
  holder_name: string;
  email: string;
  institution_name: string;
  bic: string;
  customer_number: string;
  support_reg_number: string;
  last_login: string;
}

export interface AccountByIban {
  holder_name: string;
  institution_name: string;
  bic: string;
  customer_number: string;
  support_reg_number: string;
  support_packages: string;
  email: string;
}

export interface PersonalDetails {
  updateId: string;
  mobilePhone: string;
  password: string;
  email: string;
  telephone: string;
  address: string;
}

export interface SOFQuestion {
  question: string;
  answer: string;
}

export interface VerificationCodeResponse {
  success: boolean;
  data: {
    code: string;
  };
  message: string;
  timestamp: string;
}

export interface Message {
  id: string;
  date: string;
  time: string;
  type: 'Push' | 'Email';
  content: string;
}

export interface MessagesResponse {
  data: Message[];
  count: number;
  new_count: number;
}

export interface DashboardData {
  accounts: Account[];
  combispaar: {
    accounts: CombispaarAccount[];
    total_balance: number;
    count: number;
  };
  chart_data: ChartData[];
  user_info: UserInfo;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  timestamp: string;
}

export class ApiService {
  private getDefaultHeaders(): Record<string, string> {
    return {
      'Content-Type': 'application/json',
      'channelCode': 'WEB',
      'username': 'testuser',
      'lang': 'en',
      'countryCode': 'NL',
      'sessionId': this.generateSessionId(),
      'customerId': 'CUST001'
    };
  }

  private generateSessionId(): string {
    return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  private async fetchApi<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    try {
      const url = `${API_BASE_URL}${endpoint}`;
      const headers = { ...this.getDefaultHeaders(), ...options.headers };
      
      const response = await fetch(url, {
        ...options,
        headers,
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error?.message || `HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error(`API Error (${endpoint}):`, error);
      throw error;
    }
  }

  // ============================================================================
  // YAML ENDPOINTS - IMPLEMENTED
  // ============================================================================

  async getAccounts(): Promise<Account[]> {
    // YAML: /accounts/list/{customerId}
    const response = await this.fetchApi<{ saving: any[] }>('/accounts/list/CUST001?accountType=saving');
    
    if (response.saving) {
      return response.saving.map((account: any) => ({
        id: account.accountNumber || account.IBAN,
        name: account.accountName,
        type: account.productGroup?.code || 'savings',
        balance: account.detail?.balance || 0,
        currency: account.currencyCode || 'EUR',
        iban: account.IBAN,
        interest_rate: account.detail?.interestRate || 1.1,
        holder_name: account.customerName || account.detail?.holderName
      }));
    }
    
    return [];
  }

  async getUserProfile(): Promise<UserProfile> {
    // YAML: /customer/profile/fullProfile/{customerId}
    const response = await this.fetchApi<any>('/customer/profile/fullProfile/CUST001');
    
    return {
      holder_name: `${response.firstName} ${response.surName}`,
      email: response.emails?.[0]?.address || 'lucy.lavender@example.com',
      institution_name: 'DHB Bank',
      bic: 'DHBNNL2R',
      customer_number: response.customerNumber || '123456789',
      support_reg_number: 'SUP001',
      last_login: '2025-01-15 14:30:00'
    };
  }

  async getMessages(): Promise<MessagesResponse> {
    // YAML: /customer/messages/list/{customerId} and /customer/messages/unread/{customerId}
    const response = await this.fetchApi<any[]>('/customer/messages/list/CUST001');
    const unreadResponse = await this.fetchApi<{ count: number }>('/customer/messages/unread/CUST001');
    
    const transformedMessages: Message[] = response.map((msg, index) => {
      const entryDate = new Date(msg.entryDate);
      return {
        id: msg.reference || `msg_${index}`,
        date: entryDate.toLocaleDateString(),
        time: entryDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        type: msg.type as 'Push' | 'Email',
        content: msg.body || msg.subject || 'No content available'
      };
    });
    
    return {
      data: transformedMessages,
      count: transformedMessages.length,
      new_count: unreadResponse.count
    };
  }

  async sendMessage(content: string, type: 'Push' | 'Email' = 'Email'): Promise<Message> {
    // YAML: /customer/messages/{customerId}
    const response = await fetch(`${API_BASE_URL}/customer/messages/CUST001`, {
      method: 'POST',
      headers: this.getDefaultHeaders(),
      body: JSON.stringify({ content, type, subject: 'New Message' }),
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  }

  async getAccountStatement(
    accountNumber: string,
    pageIndex: number = 0,
    pageSize: number = 10
  ): Promise<{
    accountNumber: string;
    accountName: string;
    currencyCode: string;
    transactions: Array<{
      transactionDate: string;
      valueDate: string;
      description: string;
      amount: number;
      balance: number;
      type: string;
      reference: string;
    }>;
    pagination: {
      pageIndex: number;
      pageSize: number;
      totalRecords: number;
      totalPages: number;
    };
  }> {
    // YAML: /accounts/saving/statement/{accountNumber}/{pageIndex}/{pageSize}
    return this.fetchApi(`/accounts/saving/statement/${accountNumber}/${pageIndex}/${pageSize}`);
  }

  async getTransferSimulation(
    customerId: string = 'CUST001',
    sourceAccount: string,
    targetIBAN: string,
    amount: number,
    currencyCode: string = 'EUR',
    description: string = '',
    paymentType: string = 'normal',
    period: string = 'oneOff'
  ): Promise<{
    simulationId: string;
    sourceAccount: string;
    targetIBAN: string;
    amount: number;
    currencyCode: string;
    description: string;
    paymentType: string;
    period: string;
    fees: number;
    totalAmount: number;
    estimatedDelivery: string;
    status: string;
  }> {
    // YAML: /transfers/payment/{customerId}/{sourceAccountNumber}
    const params = new URLSearchParams({
      targetIBAN,
      currencyCode,
      amount: amount.toString(),
      description,
      paymentType,
      period
    });

    return this.fetchApi(`/transfers/payment/${customerId}/${sourceAccount}?${params}`);
  }

  async getSavingRates(customerId: string = 'CUST001'): Promise<{
    customerId: string;
    rates: Array<{
      productCode: string;
      productName: string;
      interestRate: number;
      effectiveDate: string;
      currency: string;
    }>;
  }> {
    // YAML: /accounts/saving/rates/{customerId}
    return this.fetchApi(`/accounts/saving/rates/${customerId}`);
  }

  async getNewSavingAccountOptions(customerId: string = 'CUST001'): Promise<{
    customerId: string;
    availableProducts: Array<{
      productCode: string;
      productName: string;
      interestRate: number;
      minimumAmount: number;
      maximumAmount: number;
      currency: string;
    }>;
  }> {
    // YAML: /accounts/saving/new/{customerId}
    return this.fetchApi(`/accounts/saving/new/${customerId}`);
  }

  async requestPayeeVerification(targetIBAN: string, beneficiaryName: string): Promise<{
    vopGuid: string;
    verificationStatus: string;
    beneficiaryName: string;
    targetIBAN: string;
    verificationDate: string;
    confidence: string;
  }> {
    // YAML: /vop/requestPayeeVerification
    const response = await fetch(`${API_BASE_URL}/vop/requestPayeeVerification`, {
      method: 'POST',
      headers: this.getDefaultHeaders(),
      body: JSON.stringify({ targetIBAN, beneficiaryName }),
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error?.message || `HTTP error! status: ${response.status}`);
    }
    
    return response.json();
  }

  async getFinancialAnnualOverview(customerId: string = 'CUST001'): Promise<Array<{
    documentType: string;
    name: string;
    year: string;
    id: string;
  }>> {
    // YAML: /customer/downloads/financialAnnualOverview/{customerId}
    return this.fetchApi(`/customer/downloads/financialAnnualOverview/${customerId}`);
  }

  async getCustomerCampaigns(customerId: string = 'CUST001'): Promise<Array<{
    subject: string;
    content: string;
    reference: string;
    bannerLink: string;
  }>> {
    // YAML: /customer/campaigns/list/{customerId}
    return this.fetchApi(`/customer/campaigns/list/${customerId}`);
  }

  async getCustomerPhone(customerId: string = 'CUST001'): Promise<Array<{
    phoneNumber: string;
    phoneType: string;
    phoneTypeName: string;
    editable: boolean;
    editableFlag: string;
  }>> {
    // YAML: /customer/profile/phone/{customerId}
    return this.fetchApi(`/customer/profile/phone/${customerId}`);
  }

  async updateCustomerPhone(customerId: string = 'CUST001', phoneNumber: string): Promise<any> {
    // YAML: /customer/profile/phone/{customerId}
    const response = await fetch(`${API_BASE_URL}/customer/profile/phone/${customerId}`, {
      method: 'PUT',
      headers: this.getDefaultHeaders(),
      body: JSON.stringify({ phoneNumber }),
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return response.json();
  }

  async getCustomerEmail(customerId: string = 'CUST001'): Promise<Array<{
    address: string;
    editable: boolean;
    editableFlag: string;
  }>> {
    // YAML: /customer/profile/email/{customerId}
    return this.fetchApi(`/customer/profile/email/${customerId}`);
  }

  async updateCustomerEmail(customerId: string = 'CUST001', email: string): Promise<any> {
    // YAML: /customer/profile/email/{customerId}
    const response = await fetch(`${API_BASE_URL}/customer/profile/email/${customerId}`, {
      method: 'PUT',
      headers: this.getDefaultHeaders(),
      body: JSON.stringify({ address: email }),
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return response.json();
  }

  async getCustomerAddress(customerId: string = 'CUST001'): Promise<Array<{
    addressType: string;
    addressTypeName: string;
    cityCode: string;
    cityName: string;
    countryCode: string;
    editable: boolean;
    editableFlag: string;
    fullAddressInfo: string;
    houseNumber: string;
    street: string;
    zipCode: string;
  }>> {
    // YAML: /customer/profile/address/{customerId}
    return this.fetchApi(`/customer/profile/address/${customerId}`);
  }

  async updateCustomerAddress(customerId: string = 'CUST001', addressData: any): Promise<any> {
    // YAML: /customer/profile/address/{customerId}
    const response = await fetch(`${API_BASE_URL}/customer/profile/address/${customerId}`, {
      method: 'PUT',
      headers: this.getDefaultHeaders(),
      body: JSON.stringify(addressData),
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return response.json();
  }

  async getCustomerIdentification(customerId: string = 'CUST001'): Promise<{
    identityType: string;
    identitySeries: string;
    identitySerialNo: string;
    issueDate: string;
    expiryDate: string;
    issueCountry: string;
    issueCountryName: string;
  }> {
    // YAML: /customer/profile/identification/{customerId}
    return this.fetchApi(`/customer/profile/identification/${customerId}`);
  }

  async updateCustomerIdentification(customerId: string = 'CUST001', identificationData: any): Promise<any> {
    // YAML: /customer/profile/identification/{customerId}
    const response = await fetch(`${API_BASE_URL}/customer/profile/identification/${customerId}`, {
      method: 'PUT',
      headers: this.getDefaultHeaders(),
      body: JSON.stringify(identificationData),
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return response.json();
  }

  async getCustomerContracts(customerId: string = 'CUST001'): Promise<Array<{
    contractType: string;
    name: string;
    date: string;
    id: string;
  }>> {
    // YAML: /customer/downloads/contracts/{customerId}
    return this.fetchApi(`/customer/downloads/contracts/${customerId}`);
  }

  async getSavingHistory(accountNumber: string): Promise<{
    accountNumber: string;
    history: Array<{
      date: string;
      action: string;
      description: string;
      amount: number;
    }>;
  }> {
    // YAML: /accounts/saving/history/{accountNumber}
    return this.fetchApi(`/accounts/saving/history/${accountNumber}`);
  }

  async getHolidays(): Promise<Array<{
    date: string;
    description: string;
    isHoliday: boolean;
  }>> {
    // YAML: /transfers/utilities/holidays
    return this.fetchApi('/transfers/utilities/holidays');
  }

  async getBankDate(): Promise<{
    bankDate: string;
    isBusinessDay: boolean;
  }> {
    // YAML: /transfers/utilities/bankDate
    return this.fetchApi('/transfers/utilities/bankDate');
  }

  async getFuturePaymentList(customerId: string = 'CUST001'): Promise<Array<{
    paymentId: string;
    sourceAccount: string;
    targetIBAN: string;
    amount: number;
    description: string;
    scheduledDate: string;
    status: string;
  }>> {
    // YAML: /transfers/payment/futurePayment/list/{customerId}
    return this.fetchApi(`/transfers/payment/futurePayment/list/${customerId}`);
  }

  // ============================================================================
  // LEGACY ENDPOINTS - KEPT FOR COMPATIBILITY
  // ============================================================================

  async getCombispaarAccounts(): Promise<{
    accounts: CombispaarAccount[];
    total_balance: number;
    count: number;
  }> {
    // LEGACY: /api/combispaar - No YAML equivalent
    const response = await this.fetchApi<{
      success: boolean;
      data: CombispaarAccount[];
      total_balance: number;
      count: number;
      timestamp: string;
    }>('/api/combispaar');
    return {
      accounts: response.data,
      total_balance: response.total_balance,
      count: response.count
    };
  }

  async getChartData(): Promise<ChartData[]> {
    // LEGACY: /api/chart-data - No YAML equivalent
    const response = await this.fetchApi<{ success: boolean; data: ChartData[]; timestamp: string }>('/api/chart-data');
    return response.data;
  }

  async getUserInfo(): Promise<UserInfo> {
    // LEGACY: /api/user - No YAML equivalent
    const response = await this.fetchApi<{ success: boolean; data: UserInfo; timestamp: string }>('/api/user');
    return response.data;
  }

  async getMaxiSpaarPageData(): Promise<any> {
    // LEGACY: /api/maxispaar/page-data - No YAML equivalent
    const response = await this.fetchApi<{ success: boolean; data: any; timestamp: string }>('/api/maxispaar/page-data');
    return response.data;
  }

  async getSolidExtraPageData(): Promise<any> {
    // LEGACY: /api/solidextra/page-data - No YAML equivalent
    const response = await this.fetchApi<{ success: boolean; data: any; timestamp: string }>('/api/solidextra/page-data');
    return response.data;
  }



  async getDashboardData(): Promise<DashboardData> {
    // LEGACY: /api/dashboard - No YAML equivalent
    const response = await this.fetchApi<{ success: boolean; data: DashboardData; timestamp: string }>('/api/dashboard');
    return response.data;
  }

  async getAccountByIban(iban: string): Promise<AccountByIban> {
    // LEGACY: /api/account/by-iban - No YAML equivalent
    const response = await this.fetchApi<{ success: boolean; data: AccountByIban; timestamp: string }>(`/api/account/by-iban?iban=${iban}`);
    return response.data;
  }

  async getPersonalDetails(): Promise<PersonalDetails> {
    // LEGACY: /api/personal-details - No YAML equivalent
    const response = await this.fetchApi<{ success: boolean; data: PersonalDetails; timestamp: string }>('/api/personal-details');
    return response.data;
  }

  async updatePersonalDetails(details: Partial<PersonalDetails>): Promise<PersonalDetails> {
    // LEGACY: /api/personal-details - No YAML equivalent
    const response = await fetch(`${API_BASE_URL}/api/personal-details`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'channelCode': 'WEB',
        'username': 'demo_user',
        'lang': 'en',
        'countryCode': 'NL',
        'sessionId': 'demo_session_123',
      },
      body: JSON.stringify(details),
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data.data;
  }

  async getPhoneNumber(): Promise<{ phone: string }> {
    // LEGACY: /api/personal-details/phone - No YAML equivalent
    const response = await this.fetchApi<{ success: boolean; data: { phone: string }; timestamp: string }>('/api/personal-details/phone');
    return response.data;
  }

  async sendVerificationCode(): Promise<VerificationCodeResponse> {
    // LEGACY: /api/verification/send-code - No YAML equivalent
    const response = await this.fetchApi<VerificationCodeResponse>('/api/verification/send-code');
    return response;
  }

  async updatePassword(password: string): Promise<PersonalDetails> {
    // LEGACY: /api/personal-details/password - No YAML equivalent
    const response = await fetch(`${API_BASE_URL}/api/personal-details/password`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'channelCode': 'WEB',
        'username': 'demo_user',
        'lang': 'en',
        'countryCode': 'NL',
        'sessionId': 'demo_session_123',
      },
      body: JSON.stringify({ password }),
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data.data;
  }

  async validatePassword(password: string): Promise<{ valid: boolean; message: string }> {
    // LEGACY: /api/personal-details/validate-password - No YAML equivalent
    const response = await fetch(`${API_BASE_URL}/api/personal-details/validate-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'channelCode': 'WEB',
        'username': 'demo_user',
        'lang': 'en',
        'countryCode': 'NL',
        'sessionId': 'demo_session_123',
      },
      body: JSON.stringify({ password }),
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return { valid: data.valid, message: data.message };
  }

  async getSOFQuestions(): Promise<SOFQuestion[]> {
    // LEGACY: /api/sof-questions - Get SOF questions from API
    const response = await fetch(`${API_BASE_URL}/api/sof-questions`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'channelCode': 'WEB',
        'username': 'demo_user',
        'lang': 'en',
        'countryCode': 'NL',
        'sessionId': 'demo_session_123',
      },
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data.data || data; // Handle both {data: [...]} and [...] formats
  }

  async updateSOFQuestions(questions: SOFQuestion[]): Promise<SOFQuestion[]> {
    // LEGACY: /api/sof-questions - No YAML equivalent
    const response = await fetch(`${API_BASE_URL}/api/sof-questions`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'channelCode': 'WEB',
        'username': 'demo_user',
        'lang': 'en',
        'countryCode': 'NL',
        'sessionId': 'demo_session_123',
      },
      body: JSON.stringify({ questions }),
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data.data;
  }
}

export const apiService = new ApiService();
