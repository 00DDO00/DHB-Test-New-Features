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
  customerNumber: string;
  customerId: string;
  firstName: string;
  surName: string;
  birthDate: string;
  genderName: string;
  maritalStatusName: string;
  identityType: string;
  emails: Array<{
    address: string;
    editable: boolean;
    editableFlag: string;
  }>;
  addresses: Array<{
    countryCode: string;
    cityName: string;
    zipCode: string;
    fullAddressInfo: string;
    editable: boolean;
  }>;
  phones: Array<{
    phoneNumber: string;
    phoneType: string;
    phoneTypeName: string;
    editable: boolean;
  }>;
  prefferedLang: string;
  customerStatus: string;
  customerType: string;
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
  reference: string;
  entryDate: string;
  type: 'Push' | 'Email';
  subject: string;
  body: string;
  isRead: boolean;
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

export interface AccountStatement {
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
}

export interface TransferSimulation {
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
}

export interface UnreadMessages {
  count: number;
}

class ApiService {
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

    return response.json();
  }

  // ============================================================================
  // CUSTOMER API ENDPOINTS (YAML-compliant)
  // ============================================================================

  async getCustomerFullProfile(customerId: string = 'CUST001'): Promise<UserProfile> {
    const response = await this.fetchApi<UserProfile>(`/customer/profile/fullProfile/${customerId}`);
    return response;
  }

  async getCustomerPhone(customerId: string = 'CUST001'): Promise<Array<{
    phoneNumber: string;
    phoneType: string;
    phoneTypeName: string;
    editable: boolean;
  }>> {
    const response = await this.fetchApi<Array<{
      phoneNumber: string;
      phoneType: string;
      phoneTypeName: string;
      editable: boolean;
    }>>(`/customer/profile/phone/${customerId}`);
    return response;
  }

  async getCustomerMessages(customerId: string = 'CUST001'): Promise<Message[]> {
    const response = await this.fetchApi<Message[]>(`/customer/messages/list/${customerId}`);
    return response;
  }

  async getUnreadMessages(customerId: string = 'CUST001'): Promise<UnreadMessages> {
    const response = await this.fetchApi<UnreadMessages>(`/customer/messages/unread/${customerId}`);
    return response;
  }

  async createCustomerMessage(
    customerId: string = 'CUST001',
    content: string,
    type: 'Push' | 'Email' = 'Email',
    subject: string = 'New Message'
  ): Promise<Message> {
    const response = await fetch(`${API_BASE_URL}/customer/messages/${customerId}`, {
      method: 'POST',
      headers: this.getDefaultHeaders(),
      body: JSON.stringify({ content, type, subject }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error?.message || `HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  // ============================================================================
  // ACCOUNT API ENDPOINTS (YAML-compliant)
  // ============================================================================

  async getAccountList(
    customerId: string = 'CUST001',
    accountType: 'checking' | 'saving' = 'saving',
    currencyCodes?: string
  ): Promise<{ saving: any[] }> {
    const params = new URLSearchParams({
      accountType,
      ...(currencyCodes && { currencyCodes })
    });
    
    const response = await this.fetchApi<{ saving: any[] }>(`/accounts/list/${customerId}?${params}`);
    return response;
  }

  async getAccountStatement(
    accountNumber: string,
    pageIndex: number = 0,
    pageSize: number = 10
  ): Promise<AccountStatement> {
    const response = await this.fetchApi<AccountStatement>(
      `/accounts/saving/statement/${accountNumber}/${pageIndex}/${pageSize}`
    );
    return response;
  }

  async getCustomerMatchByAccount(
    customerId: string = 'CUST001',
    accountNumber: string
  ): Promise<{
    customerId: string;
    accountNumber: string;
    matchFound: boolean;
    customerName: string;
    accountName: string;
  }> {
    const response = await this.fetchApi<{
      customerId: string;
      accountNumber: string;
      matchFound: boolean;
      customerName: string;
      accountName: string;
    }>(`/accounts/utilities/customerMatchByAccount/${customerId}/${accountNumber}`);
    return response;
  }

  // ============================================================================
  // TRANSFER API ENDPOINTS (YAML-compliant)
  // ============================================================================

  async getTransferSimulation(
    customerId: string = 'CUST001',
    sourceAccount: string,
    targetIBAN: string,
    amount: number,
    currencyCode: string = 'EUR',
    description: string = '',
    paymentType: string = 'normal',
    period: string = 'oneOff'
  ): Promise<TransferSimulation> {
    const params = new URLSearchParams({
      targetIBAN,
      currencyCode,
      amount: amount.toString(),
      description,
      paymentType,
      period
    });

    const response = await this.fetchApi<TransferSimulation>(
      `/transfers/payment/${customerId}/${sourceAccount}?${params}`
    );
    return response;
  }

  async getHolidays(): Promise<Array<{ date: string; description: string }>> {
    const response = await this.fetchApi<Array<{ date: string; description: string }>>('/transfers/utilities/holidays');
    return response;
  }

  async getBankDate(): Promise<{ bankDate: string; isBusinessDay: boolean }> {
    const response = await this.fetchApi<{ bankDate: string; isBusinessDay: boolean }>('/transfers/utilities/bankDate');
    return response;
  }

  // ============================================================================
  // LEGACY ENDPOINTS (for backward compatibility)
  // ============================================================================

  async getAccounts(): Promise<Account[]> {
    const response = await this.fetchApi<{ success: boolean; data: { saving: any[] }; timestamp: string }>('/api/accounts');
    
    // Transform the new YAML structure to the old format for backward compatibility
    if (response.data && response.data.saving) {
      return response.data.saving.map((account: any) => ({
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
    const response = await this.fetchApi<{ success: boolean; data: UserProfile; timestamp: string }>('/api/user/profile');
    return response.data;
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
    const response = await this.fetchApi<{ success: boolean; data: Message[]; count: number; new_count: number; timestamp: string }>('/api/messages');
    return {
      data: response.data,
      count: response.count,
      new_count: response.new_count
    };
  }

  async sendMessage(content: string, type: 'Push' | 'Email' = 'Email'): Promise<Message> {
    const response = await fetch(`${API_BASE_URL}/api/messages`, {
      method: 'POST',
      headers: this.getDefaultHeaders(),
      body: JSON.stringify({ content, type }),
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data.data;
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
      headers: this.getDefaultHeaders(),
      body: JSON.stringify(details),
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data.data;
  }

  async getPersonalDetailsPhone(): Promise<{ phone: string }> {
    const response = await this.fetchApi<{ success: boolean; data: { phone: string }; timestamp: string }>('/api/personal-details/phone');
    return response.data;
  }

  async updatePassword(password: string): Promise<PersonalDetails> {
    const response = await fetch(`${API_BASE_URL}/api/personal-details/password`, {
      method: 'PUT',
      headers: this.getDefaultHeaders(),
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
      headers: this.getDefaultHeaders(),
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
      headers: this.getDefaultHeaders(),
      body: JSON.stringify(questions),
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data.data;
  }

  async sendVerificationCode(): Promise<VerificationCodeResponse> {
    const response = await this.fetchApi<VerificationCodeResponse>('/api/verification/send-code');
    return response;
  }

  async downloadDocument(type: string): Promise<Blob> {
    const response = await fetch(`${API_BASE_URL}/api/documents/download?type=${type}`, {
      headers: this.getDefaultHeaders(),
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return response.blob();
  }
}

export const apiService = new ApiService();
