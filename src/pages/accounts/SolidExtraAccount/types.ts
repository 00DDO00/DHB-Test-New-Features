// Types for SolidExtraAccount components

export interface SolidExtraOption {
  id: string;
  term: string;
  interest: string;
  validFrom: string;
  balanceClass: string;
  days: number;
}

export interface AmountState {
  whole: string;
  decimal: string;
}

export interface IbanOption {
  iban: string;
  accountName: string;
  balance: string;
}

export interface AccountData {
  main_account?: {
    name: string;
  };
  balance: string;
  iban: string;
  interest_rate: string;
  title?: string;
  description?: string;
  additional?: string;
}

export interface SolidExtraAccountProps {
  // Common props that might be passed between components
}

export interface BreadcrumbsSectionProps {
  // Props for breadcrumbs section
}

export interface AccountSummarySectionProps {
  accountData: AccountData | null;
}

export interface IntroductoryTextSectionProps {
  accountData: AccountData | null;
}

export interface SavingsOptionsSectionProps {
  accountData: AccountData | null;
  solidExtraOptions: SolidExtraOption[];
  onOpenAccount: (option: SolidExtraOption) => void;
}

export interface AccountOpeningModalSectionProps {
  modalOpen: boolean;
  onClose: () => void;
  selectedOption: SolidExtraOption | null;
  setSelectedOption: (option: SolidExtraOption | null) => void;
  solidExtraOptions: SolidExtraOption[];
  amount: AmountState;
  setAmount: (amount: AmountState) => void;
  selectedIban: string;
  setSelectedIban: (value: string) => void;
  showSummary: boolean;
  show2FATypeSelection: boolean;
  show2FA: boolean;
  showFinalConfirmation: boolean;
  termsAccepted: boolean;
  setTermsAccepted: (value: boolean) => void;
  selected2FAType: 'email' | 'sms';
  setSelected2FAType: (type: 'email' | 'sms') => void;
  errors: {[key: string]: string};
  ibanOptions: IbanOption[];
  verificationCode: string[];
  setVerificationCode: (code: string[]) => void;
  isCodeSent: boolean;
  onProceed: () => void;
  onEditTransaction: () => void;
  onConfirmTransaction: () => void;
  onSendCodeFromTypeSelection: () => void;
  onBackToSummary: () => void;
  onVerifyCode: () => void;
  onFinalDone: () => void;
  onResendCode: () => void;
  getSelectedIbanDetails: () => IbanOption | undefined;
  calculateMaturityDate: () => string;
  calculateValueDate: () => string;
}
