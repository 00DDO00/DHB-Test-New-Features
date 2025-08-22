const API_BASE_URL = 'http://localhost:5002';

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

  async getAccounts(): Promise<Account[]> {
    // Use YAML-compliant endpoint
    const response = await this.fetchApi<{ saving: any[] }>('/accounts/list/CUST001?accountType=saving');
    
    // Transform the YAML structure to the old format for backward compatibility
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

  async getCombispaarAccounts(): Promise<{
    accounts: CombispaarAccount[];
    total_balance: number;
    count: number;
  }> {
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
    const response = await this.fetchApi<{ success: boolean; data: ChartData[]; timestamp: string }>('/api/chart-data');
    return response.data;
  }

  async getUserInfo(): Promise<UserInfo> {
    const response = await this.fetchApi<{ success: boolean; data: UserInfo; timestamp: string }>('/api/user');
    return response.data;
  }

  async getUserProfile(): Promise<UserProfile> {
    // Use YAML-compliant endpoint
    const response = await this.fetchApi<any>('/customer/profile/fullProfile/CUST001');
    
    // Transform YAML response to match expected UserProfile interface
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

  async getMaxiSpaarPageData(): Promise<any> {
    const response = await this.fetchApi<{ success: boolean; data: any; timestamp: string }>('/api/maxispaar/page-data');
    return response.data;
  }

  async getDashboardData(): Promise<DashboardData> {
    const response = await this.fetchApi<{ success: boolean; data: DashboardData; timestamp: string }>('/api/dashboard');
    return response.data;
  }

  async getMessages(): Promise<MessagesResponse> {
    // Use YAML-compliant endpoint
    const response = await this.fetchApi<any[]>('/customer/messages/list/CUST001');
    const unreadResponse = await this.fetchApi<{ count: number }>('/customer/messages/unread/CUST001');
    
    // Transform YAML response to match expected Message interface
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
    // Use YAML-compliant endpoint
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

  async getAccountByIban(iban: string): Promise<AccountByIban> {
    const response = await this.fetchApi<{ success: boolean; data: AccountByIban; timestamp: string }>(`/api/account/by-iban?iban=${iban}`);
    return response.data;
  }

  async getPersonalDetails(): Promise<PersonalDetails> {
    const response = await this.fetchApi<{ success: boolean; data: PersonalDetails; timestamp: string }>('/api/personal-details');
    return response.data;
  }

  async updatePersonalDetails(details: Partial<PersonalDetails>): Promise<PersonalDetails> {
    const response = await fetch(`${API_BASE_URL}/api/personal-details`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
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
    const response = await this.fetchApi<{ success: boolean; data: { phone: string }; timestamp: string }>('/api/personal-details/phone');
    return response.data;
  }

  async sendVerificationCode(): Promise<VerificationCodeResponse> {
    const response = await this.fetchApi<VerificationCodeResponse>('/api/verification/send-code');
    return response;
  }

  async updatePassword(password: string): Promise<PersonalDetails> {
    const response = await fetch(`${API_BASE_URL}/api/personal-details/password`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
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
    const response = await fetch(`${API_BASE_URL}/api/personal-details/validate-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
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
    const response = await this.fetchApi<{ success: boolean; data: SOFQuestion[]; timestamp: string }>('/api/sof-questions');
    return response.data;
  }

  async updateSOFQuestions(questions: SOFQuestion[]): Promise<SOFQuestion[]> {
    const response = await fetch(`${API_BASE_URL}/api/sof-questions`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ questions }),
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data.data;
  }

  // ============================================================================
  // NEW YAML-COMPLIANT ENDPOINTS
  // ============================================================================

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
    return this.fetchApi(`/accounts/saving/new/${customerId}`);
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
    return this.fetchApi(`/accounts/saving/rates/${customerId}`);
  }

  async requestPayeeVerification(targetIBAN: string, beneficiaryName: string): Promise<{
    vopGuid: string;
    verificationStatus: string;
    beneficiaryName: string;
    targetIBAN: string;
    verificationDate: string;
    confidence: string;
  }> {
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
    return this.fetchApi(`/customer/downloads/financialAnnualOverview/${customerId}`);
  }

  async getCustomerCampaigns(customerId: string = 'CUST001'): Promise<Array<{
    subject: string;
    content: string;
    reference: string;
    bannerLink: string;
  }>> {
    return this.fetchApi(`/customer/campaigns/list/${customerId}`);
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
}

export const apiService = new ApiService();
