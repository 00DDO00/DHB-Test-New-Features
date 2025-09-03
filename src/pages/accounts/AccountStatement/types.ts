// Types for AccountStatement components

export interface Transaction {
  id: number;
  date: string;
  description: string;
  account: string;
  balance: string;
  type: 'credit' | 'debit';
}

export interface AmountFilter {
  whole: string;
  decimal: string;
}

export interface AccountStatementProps {
  // Common props that might be passed between components
}

export interface BreadcrumbsSectionProps {
  // Props for breadcrumbs section
}

export interface AccountStatementHeaderSectionProps {
  onDownload: () => void;
  onFilterOpen: () => void;
}

export interface TransactionTableSectionProps {
  transactions: Transaction[];
  filteredTransactions: Transaction[];
}

export interface FilterModalSectionProps {
  open: boolean;
  onClose: () => void;
  periodFilter: string;
  setPeriodFilter: (value: string) => void;
  periodFilterEnabled: boolean;
  setPeriodFilterEnabled: (value: boolean) => void;
  amountFilter: boolean;
  setAmountFilter: (value: boolean) => void;
  minAmount: AmountFilter;
  setMinAmount: (value: AmountFilter) => void;
  maxAmount: AmountFilter;
  setMaxAmount: (value: AmountFilter) => void;
  transactionsCount: string;
  setTransactionsCount: (value: string) => void;
  debitTransactions: boolean;
  setDebitTransactions: (value: boolean) => void;
  creditTransactions: boolean;
  setCreditTransactions: (value: boolean) => void;
  onApplyFilters: () => void;
}
