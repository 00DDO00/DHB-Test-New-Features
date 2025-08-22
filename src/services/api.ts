const API_BASE_URL = 'http://localhost:5002/api';

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
  private async fetchApi<T>(endpoint: string): Promise<T> {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error(`API Error (${endpoint}):`, error);
      throw error;
    }
  }

  async getAccounts(): Promise<Account[]> {
    const response = await this.fetchApi<{ success: boolean; data: Account[]; timestamp: string }>('/accounts');
    return response.data;
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
    }>('/combispaar');
    return {
      accounts: response.data,
      total_balance: response.total_balance,
      count: response.count
    };
  }

  async getChartData(): Promise<ChartData[]> {
    const response = await this.fetchApi<{ success: boolean; data: ChartData[]; timestamp: string }>('/chart-data');
    return response.data;
  }

  async getUserInfo(): Promise<UserInfo> {
    const response = await this.fetchApi<{ success: boolean; data: UserInfo; timestamp: string }>('/user');
    return response.data;
  }

  async getUserProfile(): Promise<UserProfile> {
    const response = await this.fetchApi<{ success: boolean; data: UserProfile; timestamp: string }>('/user/profile');
    return response.data;
  }

  async getMaxiSpaarPageData(): Promise<any> {
    const response = await this.fetchApi<{ success: boolean; data: any; timestamp: string }>('/maxispaar/page-data');
    return response.data;
  }

  async getDashboardData(): Promise<DashboardData> {
    const response = await this.fetchApi<{ success: boolean; data: DashboardData; timestamp: string }>('/dashboard');
    return response.data;
  }

  async getMessages(): Promise<MessagesResponse> {
    const response = await this.fetchApi<{ success: boolean; data: Message[]; count: number; new_count: number; timestamp: string }>('/messages');
    return {
      data: response.data,
      count: response.count,
      new_count: response.new_count
    };
  }

  async sendMessage(content: string, type: 'Push' | 'Email' = 'Email'): Promise<Message> {
    const response = await fetch(`${API_BASE_URL}/messages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ content, type }),
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data.data;
  }

  async getAccountByIban(iban: string): Promise<AccountByIban> {
    const response = await this.fetchApi<{ success: boolean; data: AccountByIban; timestamp: string }>(`/account/by-iban?iban=${iban}`);
    return response.data;
  }

  async getPersonalDetails(): Promise<PersonalDetails> {
    const response = await this.fetchApi<{ success: boolean; data: PersonalDetails; timestamp: string }>('/personal-details');
    return response.data;
  }

  async updatePersonalDetails(details: Partial<PersonalDetails>): Promise<PersonalDetails> {
    const response = await fetch(`${API_BASE_URL}/personal-details`, {
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
    const response = await this.fetchApi<{ success: boolean; data: { phone: string }; timestamp: string }>('/personal-details/phone');
    return response.data;
  }

  async sendVerificationCode(): Promise<VerificationCodeResponse> {
    const response = await this.fetchApi<VerificationCodeResponse>('/verification/send-code');
    return response;
  }

  async updatePassword(password: string): Promise<PersonalDetails> {
    const response = await fetch(`${API_BASE_URL}/personal-details/password`, {
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
    const response = await fetch(`${API_BASE_URL}/personal-details/validate-password`, {
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
    const response = await this.fetchApi<{ success: boolean; data: SOFQuestion[]; timestamp: string }>('/sof-questions');
    return response.data;
  }

  async updateSOFQuestions(questions: SOFQuestion[]): Promise<SOFQuestion[]> {
    const response = await fetch(`${API_BASE_URL}/sof-questions`, {
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

  
}

export const apiService = new ApiService();
