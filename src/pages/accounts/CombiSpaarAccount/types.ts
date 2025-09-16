// Types for CombiSpaarAccount components

export interface AmountState {
  whole: string;
  decimal: string;
}

export interface AccountOption {
  id: string;
  title: string;
  description: string;
  interestRate: string;
  days: number;
  minAmount: string;
  maxAmount: string;
  balanceClass?: string;
  noticePeriod?: string;
  interest?: string;
  validFrom?: string;
}

export interface IbanOption {
  iban: string;
  accountName: string;
  balance: string;
}

export interface PageData {
  accountName: string;
  balance: string;
  iban: string;
  interestRate: string;
  title: string;
  description: string;
}

export interface CombiSpaarAccountProps {
  // Common props that might be passed between components
}

export interface BreadcrumbsSectionProps {
  // Props for breadcrumbs section
}

export interface AccountSummarySectionProps {
  pageData: PageData | null;
}

export interface AccountDescriptionSectionProps {
  pageData: PageData | null;
}

export interface AccountOptionsSectionProps {
  loading: boolean;
  accountOptions: AccountOption[];
  onOpenAccount: (option: AccountOption) => void;
}

export interface AccountOpeningModalSectionProps {
  modalOpen: boolean;
  onClose: () => void;
  selectedOption: AccountOption | null;
  setSelectedOption: (option: AccountOption | null) => void;
  accountOptions: AccountOption[];
  amount: AmountState;
  setAmount: (amount: AmountState) => void;
  showSummary: boolean;
  showFinalConfirmation: boolean;
  termsAccepted: boolean;
  setTermsAccepted: (value: boolean) => void;
  selectedIban: string;
  setSelectedIban: (value: string) => void;
  errors: {[key: string]: string};
  ibanOptions: IbanOption[];
  onProceed: () => void;
  onEditTransaction: () => void;
  onConfirmTransaction: () => void;
  onFinalDone: () => void;
  calculateMaturityDate: () => string;
  calculateValueDate: () => string;
  getSelectedIbanDetails: () => IbanOption | undefined;
}
