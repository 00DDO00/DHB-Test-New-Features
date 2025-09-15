export interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

export interface SavingsGoal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  percentage: number;
}

export interface AccountData {
  holder_name?: string;
  institution_name?: string;
  bic?: string;
  customer_number?: string;
  support_reg_number?: string;
  email?: string;
}

export interface Transaction {
  id?: string;
  date: string;
  description: string;
  account: string;
  balance: string;
  type: 'debit' | 'credit';
}

export interface TransferData {
  id: string;
  description: string;
  amount: string;
  period: string;
  startDate: string;
  endDate?: string;
  status: 'scheduled' | 'completed' | 'recurring';
  completedPayments: number;
  totalPayments: number;
  isExpanded?: boolean;
  // New fields for table display
  executionDate: string;
  recipient: {
    accountNumber: string;
    name: string;
  };
}

export interface DateObject {
  day: string;
  month: string;
  year: string;
}

export interface AmountObject {
  whole: string;
  decimal: string;
}

export interface FormErrors {
  [key: string]: string;
}