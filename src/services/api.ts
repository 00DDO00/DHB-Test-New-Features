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

  async getDashboardData(): Promise<DashboardData> {
    const response = await this.fetchApi<{ success: boolean; data: DashboardData; timestamp: string }>('/dashboard');
    return response.data;
  }

  
}

export const apiService = new ApiService();
