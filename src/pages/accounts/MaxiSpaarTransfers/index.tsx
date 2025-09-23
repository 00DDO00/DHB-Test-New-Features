import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Modal, 
  IconButton, 
  Button,
  Link as MuiLink
} from '@mui/material';
import {
  Close as CloseIcon,
  ArrowForward as ArrowForwardIcon,
  CheckCircle as CheckCircleIcon,
  TrendingUp as TrendingUpIcon,
  Add as AddIcon
} from '@mui/icons-material';
import { useLocation } from 'react-router-dom';
import { apiService } from '../../../services/api';

// Import section components
import BreadcrumbsSection from './BreadcrumbsSection';
import SavingsGoalsSection from './SavingsGoalsSection';
import AccountSummarySection from './AccountSummarySection';
import ConnectedFrameSection from './ConnectedFrameSection';
import TransferModal from './TransferModal';
import FilterModal from './FilterModal';
import SavingsGoalModals from './SavingsGoalModals';
import TransferDetailsPopup from './TransferDetailsPopup';
import DownloadStatementPopup from './DownloadStatementPopup';
import AccountClosurePopup from './AccountClosurePopup';
import AccountClosureCongratulationsPopup from './AccountClosureCongratulationsPopup';
import HistoricalRateModal from './HistoricalRateModal';
import ExtendAccountModal from './ExtendAccountModal';
import ExtendAccountConfirmationModal from './ExtendAccountConfirmationModal';
import ExtendAccountCongratulationsModal from './ExtendAccountCongratulationsModal';

// Import types
import { SavingsGoal, AccountData, TransferData, Transaction, DateObject, AmountObject } from './types';

// Import icons for quick actions
import {
  Settings as SettingsIcon,
  People as PeopleIcon,
  FileUpload as FileUploadIcon,
  TrackChanges as TrackChangesIcon,
  Tune as TuneIcon
} from '@mui/icons-material';

const MaxiSpaarTransfers: React.FC = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  
  // Get account data from URL parameters
  const accountId = searchParams.get('accountId');
  const accountIban = searchParams.get('iban');
  const accountBalance = searchParams.get('balance');
  
  // All the original state variables
  const [tabValue, setTabValue] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState('dhb-combispaar');
  const [accountSelectorOpen, setAccountSelectorOpen] = useState(false);
  const [period, setPeriod] = useState('every-week');
  const [startDate, setStartDate] = useState<DateObject>({ day: '', month: '', year: '' });
  const [endDate, setEndDate] = useState<DateObject>({ day: '', month: '', year: '' });
  const [explanation, setExplanation] = useState('');
  const [beneficiaryAccount, setBeneficiaryAccount] = useState('');
  const [showTransactionStatus, setShowTransactionStatus] = useState(false);
  const [amount, setAmount] = useState<AmountObject>({ whole: '', decimal: '' });
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [showFinalConfirmation, setShowFinalConfirmation] = useState(false);
  
  // Filter popup states
  const [filterPopupOpen, setFilterPopupOpen] = useState(false);
  const [periodFilter, setPeriodFilter] = useState('today');
  const [periodFilterEnabled, setPeriodFilterEnabled] = useState(false);
  const [amountFilter, setAmountFilter] = useState(false);
  const [minAmount, setMinAmount] = useState<AmountObject>({ whole: '', decimal: '' });
  const [maxAmount, setMaxAmount] = useState<AmountObject>({ whole: '', decimal: '' });
  const [debitTransactions, setDebitTransactions] = useState(true);
  const [creditTransactions, setCreditTransactions] = useState(true);
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([]);
  const [savingsGoalModalOpen, setSavingsGoalModalOpen] = useState(false);
  const [savingsTargetModalOpen, setSavingsTargetModalOpen] = useState(false);
  const [congratulationsModalOpen, setCongratulationsModalOpen] = useState(false);
  const [showSavingsGoals, setShowSavingsGoals] = useState(false);
  const [savedGoals, setSavedGoals] = useState<SavingsGoal[]>([]);
  
  const [scheduledTransfers, setScheduledTransfers] = useState<TransferData[]>([]);
  const [selectedGoal, setSelectedGoal] = useState('');
  const [savingsTargetName, setSavingsTargetName] = useState('');
  const [amountWhole, setAmountWhole] = useState('');
  const [amountDecimal, setAmountDecimal] = useState('');
  const [amountError, setAmountError] = useState('');
  const [mockTransactions, setMockTransactions] = useState<Transaction[]>([]);
  const [accountData, setAccountData] = useState<AccountData | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  
  // Transfer Details Popup state
  const [transferDetailsOpen, setTransferDetailsOpen] = useState(false);
  const [selectedTransfer, setSelectedTransfer] = useState<TransferData | null>(null);
  const [downloadStatementOpen, setDownloadStatementOpen] = useState(false);
  const [accountClosureOpen, setAccountClosureOpen] = useState(false);
  const [accountClosureCongratulationsOpen, setAccountClosureCongratulationsOpen] = useState(false);
  const [closedAccountNumber, setClosedAccountNumber] = useState('');
  
  // New state variables for MaxiSpaar specific modals
  const [historicalRateModalOpen, setHistoricalRateModalOpen] = useState(false);
  const [extendAccountModalOpen, setExtendAccountModalOpen] = useState(false);
  const [extendAccountConfirmationOpen, setExtendAccountConfirmationOpen] = useState(false);
  const [extendAccountCongratulationsOpen, setExtendAccountCongratulationsOpen] = useState(false);
  const [extensionData, setExtensionData] = useState<{
    extensionType: string;
    amount: string;
    selectedTerm: string;
  }>({ extensionType: '', amount: '', selectedTerm: '' });
  const [selectedExtensionPeriod, setSelectedExtensionPeriod] = useState('');

  // Mock transactions data
  useEffect(() => {
    setMockTransactions([
      {
        id: '1',
        date: '15-Jan-2024',
        description: 'Holder name NL24DHBN2018470581',
        account: 'From: DHB SaveOnline',
        balance: '€ 1.250,00',
        type: 'credit'
      },
      {
        id: '2',
        date: '28-Dec-2023',
        description: 'Holder name NL24DHBN2018470581',
        account: 'To: DHB SaveOnline',
        balance: '- € 500,00',
        type: 'debit'
      },
      {
        id: '3',
        date: '15-Dec-2023',
        description: 'Holder name NL24DHBN2018470581',
        account: 'From: External Transfer',
        balance: '€ 2.000,00',
        type: 'credit'
      },
      {
        id: '4',
        date: '01-Dec-2023',
        description: 'Holder name NL24DHBN2018470581',
        account: 'To: Monthly Savings',
        balance: '- € 750,00',
        type: 'debit'
      },
      {
        id: '5',
        date: '01-Nov-2023',
        description: 'Holder name NL24DHBN2018470581',
        account: 'From: Salary Deposit',
        balance: '€ 3.200,00',
        type: 'credit'
      }
    ]);
  }, []);

  // Initialize dummy scheduled transfers
  useEffect(() => {
    setScheduledTransfers([
      {
        id: 'scheduled-1',
        description: 'Monthly Savings Transfer',
        amount: '€ 800,00',
        period: 'every-month',
        startDate: '01/10/2024',
        endDate: '01/10/2025',
        status: 'scheduled',
        completedPayments: 0,
        totalPayments: 12,
        executionDate: '2024-10-01',
        recipient: {
          accountNumber: 'NL24DHBN2018470578',
          name: 'DHB SaveOnline'
        }
      },
      {
        id: 'scheduled-2',
        description: 'Bi-weekly Investment',
        amount: '€ 400,00',
        period: 'every-2-weeks',
        startDate: '15/09/2024',
        endDate: '15/12/2024',
        status: 'scheduled',
        completedPayments: 3,
        totalPayments: 7,
        executionDate: '2024-09-15',
        recipient: {
          accountNumber: 'NL91DHBN2018470579',
          name: 'Investment Portfolio'
        }
      },
      {
        id: 'scheduled-3',
        description: 'Quarterly High Yield Transfer',
        amount: '€ 2.000,00',
        period: 'every-3-months',
        startDate: '01/01/2024',
        endDate: '01/01/2026',
        status: 'scheduled',
        completedPayments: 3,
        totalPayments: 8,
        executionDate: '2024-01-01',
        recipient: {
          accountNumber: 'NL12DHBN2018470580',
          name: 'High Yield Account'
        }
      },
      {
        id: 'scheduled-4',
        description: 'Annual Bonus Allocation',
        amount: '€ 5.000,00',
        period: 'every-year',
        startDate: '01/12/2024',
        endDate: '01/12/2029',
        status: 'scheduled',
        completedPayments: 0,
        totalPayments: 5,
        executionDate: '2024-12-01',
        recipient: {
          accountNumber: 'NL34DHBN2018470581',
          name: 'Bonus Savings'
        }
      },
      {
        id: 'scheduled-5',
        description: 'Monthly Retirement Fund',
        amount: '€ 1.000,00',
        period: 'every-month',
        startDate: '15/07/2024',
        endDate: '15/07/2034',
        status: 'scheduled',
        completedPayments: 2,
        totalPayments: 120,
        executionDate: '2024-07-15',
        recipient: {
          accountNumber: 'NL56DHBN2018470582',
          name: 'Retirement Fund'
        }
      }
    ]);
  }, []);

  // Fetch account data on component mount
  useEffect(() => {
    const fetchAccountData = async () => {
      try {
        // Use the IBAN from URL parameters or fallback to default
        const ibanToUse = accountIban || 'NL24DHBN2018470581';
        const data = await apiService.getAccountByIban(ibanToUse);
        setAccountData(data);
      } catch (error) {
        console.error('Failed to fetch account data:', error);
        // Set fallback data if API fails
        setAccountData({
          holder_name: 'Lucy Lavender',
          institution_name: 'DHB Bank',
          bic: 'DHBNL2R',
          customer_number: 'CUST001',
          support_reg_number: 'SR001',
          email: 'lucy.lavender@example.com'
        });
      } finally {
        setLoading(false);
      }
    };

    fetchAccountData();
  }, [accountIban]);

  // Event handlers
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleOpenModal = () => {
    setModalOpen(true);
    setErrors({});
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setShowTransactionStatus(false);
  };

  const handleAccountChange = (accountId: string) => {
    setSelectedAccount(accountId);
    setAccountSelectorOpen(false);
  };

  const handlePeriodChange = (event: any) => {
    setPeriod(event.target.value);
  };

  const handleBeneficiaryAccountChange = (event: any) => {
    setBeneficiaryAccount(event.target.value);
  };

  const handleAmountChange = (field: string, value: string) => {
    setAmount(prev => ({ ...prev, [field]: value }));
  };

  const handleStartDateChange = (field: string, value: string) => {
    setStartDate(prev => ({ ...prev, [field]: value }));
  };

  const handleEndDateChange = (field: string, value: string) => {
    setEndDate(prev => ({ ...prev, [field]: value }));
  };

  const handleExplanationChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setExplanation(event.target.value);
  };

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};

    // Check required fields
    if (!beneficiaryAccount) {
      newErrors.beneficiaryAccount = 'Beneficiary account is required';
    }

    if (!amount.whole && !amount.decimal) {
      newErrors.amount = 'Amount is required';
    }

    if (!explanation.trim()) {
      newErrors.explanation = 'Explanation is required';
    }

    // Check date validation
    if (period !== 'one-time') {
      if (!startDate.day || !startDate.month || !startDate.year) {
        newErrors.startDate = 'Start date is required';
      }
      if (!endDate.day || !endDate.month || !endDate.year) {
        newErrors.endDate = 'End date is required';
      }

      // Check if start date is not later than end date
      if (startDate.day && startDate.month && startDate.year && 
          endDate.day && endDate.month && endDate.year) {
        const start = new Date(parseInt(startDate.year), parseInt(startDate.month) - 1, parseInt(startDate.day));
        const end = new Date(parseInt(endDate.year), parseInt(endDate.month) - 1, parseInt(endDate.day));
        
        if (start > end) {
          newErrors.endDate = 'End date cannot be earlier than start date';
        }
      }
    } else {
      if (!startDate.day || !startDate.month || !startDate.year) {
        newErrors.startDate = 'Date is required';
      }
    }

    // Check if dates are not in the past
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);

    if (startDate.day && startDate.month && startDate.year) {
      const start = new Date(parseInt(startDate.year), parseInt(startDate.month) - 1, parseInt(startDate.day));
      if (start < currentDate) {
        newErrors.startDate = 'Date cannot be in the past';
      }
    }

    if (endDate.day && endDate.month && endDate.year) {
      const end = new Date(parseInt(endDate.year), parseInt(endDate.month) - 1, parseInt(endDate.day));
      if (end < currentDate) {
        newErrors.endDate = 'Date cannot be in the past';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleConfirmTransfer = () => {
    if (validateForm()) {
      setShowTransactionStatus(true);
    }
  };

  const handleEditTransaction = () => {
    setShowTransactionStatus(false);
  };

  const handleFinalConfirm = () => {
    setShowFinalConfirmation(true);
  };

  const handleCancelTransaction = () => {
    setModalOpen(false);
    setShowTransactionStatus(false);
    setShowFinalConfirmation(false);
    setErrors({});
  };

  const handleDone = () => {
    console.log('Transfer completed - adding to table');
    
    // Check if this transfer should be completed (start date has passed)
    const transferStartDate = new Date(parseInt(startDate.year), parseInt(startDate.month) - 1, parseInt(startDate.day));
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const shouldBeCompleted = transferStartDate <= today;
    
    // Only add to completed transfers if the start date has passed
    if (shouldBeCompleted) {
      // Create transfer record from the form data
      const newTransfer = {
        id: Date.now().toString(),
        date: new Date().toLocaleDateString('en-GB'),
        description: explanation || 'Transfer',
        account: 'NL24DHBN2018470578',
        balance: `-€ ${amount.whole || '0'}.${amount.decimal || '00'}`,
        type: 'debit' as const
      };
      
      console.log('New transfer to be added:', newTransfer);
      
      // Add to the beginning of the transactions list
      setMockTransactions(prev => {
        console.log('Previous transactions:', prev);
        const newList = [newTransfer, ...prev];
        console.log('New transactions list:', newList);
        return newList;
      });
    }
    
    // Always add to scheduled transfers (both recurring and one-time)
    {
      const transferEndDate = endDate.day ? new Date(parseInt(endDate.year), parseInt(endDate.month) - 1, parseInt(endDate.day)) : undefined;
      
      const newScheduledTransfer = {
        id: Date.now().toString(),
        description: explanation || (period === 'one-time' ? 'One-time Transfer' : 'Recurring Transfer'),
        amount: `€ ${amount.whole || '0'}.${amount.decimal || '00'}`,
        period: period,
        startDate: transferStartDate.toLocaleDateString('en-GB'),
        endDate: transferEndDate?.toLocaleDateString('en-GB'),
        status: period === 'one-time' ? 'scheduled' as const : 'recurring' as const,
        completedPayments: shouldBeCompleted ? 1 : 0, // If start date has passed, mark as 1 completed payment
        totalPayments: period === 'one-time' ? 1 : calculateTotalPayments(transferStartDate, transferEndDate, period),
        // New fields for table display
        executionDate: transferStartDate.toISOString(),
        recipient: {
          accountNumber: beneficiaryAccount || 'NL24 DHBN 2018 4705 78',
          name: explanation || 'Recipient name'
        }
      };
      
      setScheduledTransfers(prev => [...prev, newScheduledTransfer]);
    }
    
    // Clear any filtered transactions so the new transfer shows up
    setFilteredTransactions([]);
    
    setModalOpen(false);
    setShowTransactionStatus(false);
    setShowFinalConfirmation(false);
    setErrors({});
  };

  // Calculate total payments for recurring transfers
  const calculateTotalPayments = (startDate: Date, endDate: Date | undefined, period: string): number => {
    if (!endDate) return 1; // No end date means ongoing
    
    const timeDiff = endDate.getTime() - startDate.getTime();
    const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
    
    switch (period) {
      case 'daily':
      case 'every-day':
        return Math.floor(daysDiff) + 1;
      case 'weekly':
      case 'every-week':
        return Math.floor(daysDiff / 7) + 1;
      case 'monthly':
      case 'every-month':
        return Math.floor(daysDiff / 30) + 1;
      case 'yearly':
      case 'every-year':
        return Math.floor(daysDiff / 365) + 1;
      default:
        return 1;
    }
  };

  // Apply filters function
  const applyFilters = () => {
    let filtered = [...mockTransactions];

    // Filter by transaction type
    if (!debitTransactions && !creditTransactions) {
      filtered = [];
    } else if (!debitTransactions) {
      filtered = filtered.filter(t => t.type === 'credit');
    } else if (!creditTransactions) {
      filtered = filtered.filter(t => t.type === 'debit');
    }

    // Filter by amount if amount filter is enabled
    if (amountFilter) {
      // Only apply min filter if min amount is entered
      const hasMinAmount = minAmount.whole && minAmount.whole.trim() !== '';
      const hasMaxAmount = maxAmount.whole && maxAmount.whole.trim() !== '';
      
      const minAmountValue = hasMinAmount ? parseFloat(`${minAmount.whole}.${minAmount.decimal || '00'}`) : 0;
      const maxAmountValue = hasMaxAmount ? parseFloat(`${maxAmount.whole}.${maxAmount.decimal || '00'}`) : Number.MAX_SAFE_INTEGER;

      filtered = filtered.filter(transaction => {
        // Extract numeric value from balance string
        let balanceStr = transaction.balance;
        console.log(`Original balance: "${balanceStr}"`);
        
        // Check if the balance is negative
        const isNegative = balanceStr.includes('-');
        
        // Remove €, spaces, and handle European number format (1.250,00 -> 1250.00)
        balanceStr = balanceStr.replace(/[€\s-]/g, '');
        console.log(`After removing €, spaces, and minus: "${balanceStr}"`);
        
        // Handle European number format (1.250,00 -> 1250.00) or standard format (900.00 -> 900.00)
        if (balanceStr.includes(',')) {
          // European format: remove dots (thousand separators) and replace comma with dot
          balanceStr = balanceStr.replace(/\./g, '').replace(',', '.');
        }
        // If no comma, keep the dot as decimal separator
        console.log(`After formatting: "${balanceStr}"`);
        
        const balanceValue = parseFloat(balanceStr);
        console.log(`Parsed balanceValue: ${balanceValue}`);
        
        // Apply negative sign if original was negative
        const finalValue = isNegative ? -balanceValue : balanceValue;
        console.log(`Final value with sign: ${finalValue}`);
        
        // Use absolute value for filtering (ignore positive/negative sign)
        const absoluteValue = Math.abs(finalValue);
        console.log(`Absolute value: ${absoluteValue}`);
        
        console.log(`Transaction: "${transaction.balance}", Final Absolute: ${absoluteValue}, Min: ${minAmountValue}, Max: ${maxAmountValue}, HasMin: ${hasMinAmount}, HasMax: ${hasMaxAmount}`);
        
        // Apply filters based on what's entered
        const passesMinFilter = !hasMinAmount || absoluteValue >= minAmountValue;
        const passesMaxFilter = !hasMaxAmount || absoluteValue <= maxAmountValue;
        
        console.log(`Passes min filter: ${passesMinFilter}, Passes max filter: ${passesMaxFilter}`);
        
        return passesMinFilter && passesMaxFilter;
      });
    }


    setFilteredTransactions(filtered);
    setFilterPopupOpen(false);
  };

  // Savings Goal functions
  const savingsGoalOptions = [
    'Vacation', 'Car', 'Savings',
    'House', 'Buffer', 'Study',
    'Driving License', 'Future', 'Pension',
    'Scooter', 'Future', 'Pension'
  ];

  const handleSavingsGoalClick = (goal: string) => {
    setSelectedGoal(goal);
    setSavingsTargetName(goal);
    setSavingsGoalModalOpen(false);
    setSavingsTargetModalOpen(true);
  };

  const handleCustomGoalClick = () => {
    setSelectedGoal('');
    setSavingsTargetName('');
    setSavingsGoalModalOpen(false);
    setSavingsTargetModalOpen(true);
  };

  const handleConfirmSavingsTarget = () => {
    // Validate amount
    if (!amountWhole || amountWhole.trim() === '') {
      setAmountError('Please enter an amount');
      return;
    }
    
    // Validate that amount is numeric
    if (!/^\d+$/.test(amountWhole) || !/^\d*$/.test(amountDecimal)) {
      setAmountError('Please enter valid numbers only');
      return;
    }
    
    // Clear any previous errors
    setAmountError('');
    
    // Calculate target amount
    const targetAmount = parseFloat(`${amountWhole}.${amountDecimal || '00'}`);
    
    // Create new goal
    const newGoal = {
      id: Date.now().toString(),
      name: savingsTargetName || selectedGoal,
      targetAmount: targetAmount,
      currentAmount: 0, // Start with 0 progress
      percentage: 0 // Start with 0%
    };
    
    // Add to saved goals
    setSavedGoals(prev => [...prev, newGoal]);
    
    setSavingsTargetModalOpen(false);
    setCongratulationsModalOpen(true);
  };

  const handleCloseCongratulations = () => {
    setCongratulationsModalOpen(false);
    setShowSavingsGoals(true);
    
    // Reset form
    setSelectedGoal('');
    setSavingsTargetName('');
    setAmountWhole('');
    setAmountDecimal('');
  };

  const downloadAccountStatement = () => {
    // Get the current data to download (filtered or all)
    const dataToDownload = filteredTransactions.length > 0 ? filteredTransactions : mockTransactions.slice(0, 5);
    
    // Create CSV content
    const csvHeaders = ['Date', 'Description', 'Account Number', 'Balance', 'Type'];
    const csvRows = dataToDownload.map(transaction => [
      transaction.date,
      transaction.description,
      transaction.account,
      transaction.balance,
      transaction.type
    ]);
    
    // Combine headers and rows
    const csvContent = [csvHeaders, ...csvRows]
      .map(row => row.map(field => `"${field}"`).join(','))
      .join('\n');
    
    // Create and download the file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'account_statement.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Data arrays for date selectors
  const days = Array.from({ length: 31 }, (_, i) => (i + 1).toString().padStart(2, '0'));
  const months = [
    { value: '01', label: 'Jan' }, { value: '02', label: 'Feb' }, { value: '03', label: 'Mar' },
    { value: '04', label: 'Apr' }, { value: '05', label: 'May' }, { value: '06', label: 'Jun' },
    { value: '07', label: 'Jul' }, { value: '08', label: 'Aug' }, { value: '09', label: 'Sep' },
    { value: '10', label: 'Oct' }, { value: '11', label: 'Nov' }, { value: '12', label: 'Dec' }
  ];
  const years = Array.from({ length: 27 }, (_, i) => (2024 + i).toString());

  // Account data
  const accounts = [
    { id: 'dhb-combispaar', name: 'DHB Combispaar', iban: 'NL24DHBN2018470578', balance: '€ 2.500,00' },
    { id: 'dhb-saveonline', name: 'DHB SaveOnline', iban: 'NL24DHBN2018470579', balance: '€ 1.750,00' },
    { id: 'dhb-current', name: 'DHB Current Account', iban: 'NL24DHBN2018470580', balance: '€ 3.200,00' },
  ];

  const selectedAccountData = accounts.find(acc => acc.id === selectedAccount) || accounts[0];

  const handleDownloadStatement = () => {
    setDownloadStatementOpen(true);
  };

  // New handlers for MaxiSpaar specific modals
  const handleExtendAccountShowConfirmation = (extensionType: string, amount: string, selectedTerm: string) => {
    setExtensionData({ extensionType, amount, selectedTerm });
    setExtendAccountModalOpen(false);
    setExtendAccountConfirmationOpen(true);
  };

  const handleExtendAccountEdit = () => {
    setExtendAccountConfirmationOpen(false);
    setExtendAccountModalOpen(true);
  };

  const handleExtendAccountConfirm = () => {
    setSelectedExtensionPeriod(extensionData.selectedTerm);
    setExtendAccountConfirmationOpen(false);
    setExtendAccountCongratulationsOpen(true);
  };

  // Quick Actions data
  const quickActions = [
    {
      label: 'Historical rate change',
      icon: <TrendingUpIcon sx={{ fontSize: '1rem' }} />,
      onClick: () => setHistoricalRateModalOpen(true)
    },
    {
      label: 'Extend account',
      icon: <AddIcon sx={{ fontSize: '1rem' }} />,
      onClick: () => setExtendAccountModalOpen(true)
    }
  ];

  // Helper functions for scheduled transfers - EXACT from original
  const calculateCompletedPayments = (startDate: string, period: string): number => {
    console.log('=== CALCULATE COMPLETED PAYMENTS DEBUG ===');
    console.log('Input startDate:', startDate);
    console.log('Input period:', period);
    
    // Parse date components directly to avoid timezone issues
    const [day, month, year] = startDate.split('/').map(Number);
    const start = new Date(year, month - 1, day); // month is 0-indexed
    
    const today = new Date();
    const todayDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    
    console.log('Parsed start:', start);
    console.log('Today date:', todayDate);
    console.log('Start > Today?', start > todayDate);
    
    // Compare only the date part, not time
    if (start > todayDate) {
      console.log('Start is in future, returning 0');
      return 0;
    }
    
    const timeDiff = todayDate.getTime() - start.getTime();
    const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
    
    console.log('Time diff:', timeDiff);
    console.log('Days diff:', daysDiff);
    
    let result = 0;
    switch (period) {
      case 'daily':
      case 'every-day':
        result = Math.min(Math.floor(daysDiff) + 1, 999); // Cap at reasonable number
        break;
      case 'weekly':
      case 'every-week':
        result = Math.min(Math.floor(daysDiff / 7) + 1, 999);
        break;
      case 'monthly':
      case 'every-month':
        result = Math.min(Math.floor(daysDiff / 30) + 1, 999);
        break;
      case 'yearly':
      case 'every-year':
        result = Math.min(Math.floor(daysDiff / 365) + 1, 999);
        break;
      case 'one-time':
        // For one-time transfers, if start date is today or in the past, it's completed
        result = daysDiff >= 0 ? 1 : 0;
        break;
      default:
        result = 0;
    }
    
    console.log('Final result:', result);
    console.log('=== END CALCULATE COMPLETED PAYMENTS DEBUG ===');
    return result;
  };

  const getPaymentStatus = (transfer: TransferData): { previous: string; next: string } => {
    const completedPayments = calculateCompletedPayments(transfer.startDate, transfer.period);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const startDate = new Date(transfer.startDate.split('/').reverse().join('-'));
    const endDate = transfer.endDate ? new Date(transfer.endDate.split('/').reverse().join('-')) : null;
    
    console.log('Transfer:', transfer.description);
    console.log('Start date:', transfer.startDate, 'Parsed:', startDate);
    console.log('Today:', today);
    console.log('Completed payments:', completedPayments);
    console.log('Start === Today:', startDate.getTime() === today.getTime());
    console.log('Start > Today:', startDate > today);
    
    // Check if transfer is completed
    if (endDate && endDate <= today) {
      return {
        previous: 'Completed',
        next: 'Transfer completed'
      };
    }
    
    // Check if start date is today (payment has been made)
    if (startDate.toDateString() === today.toDateString()) {
      return {
        previous: 'Completed',
        next: 'Pending'
      };
    }
    
    // Check if any payments have been completed (for past start dates)
    if (completedPayments > 0) {
      return {
        previous: 'Completed',
        next: 'Pending'
      };
    }
    
    // Check if transfer hasn't started yet
    if (startDate.toDateString() > today.toDateString()) {
      return {
        previous: 'None',
        next: 'Scheduled'
      };
    }
    
    return {
      previous: 'None',
      next: 'Scheduled'
    };
  };

  const toggleScheduledTransfer = (id: string) => {
    setScheduledTransfers(prev => 
      prev.map(transfer => 
        transfer.id === id 
          ? { ...transfer, isExpanded: !transfer.isExpanded }
          : transfer
      )
    );
  };

  // Transfer Details Popup handlers
  const handleTransferClick = (transfer: TransferData) => {
    setSelectedTransfer(transfer);
    setTransferDetailsOpen(true);
  };

  const handleCloseTransferDetails = () => {
    setTransferDetailsOpen(false);
    setSelectedTransfer(null);
  };

  const handleEditTransfer = () => {
    // TODO: Implement edit transfer functionality
    console.log('Edit transfer:', selectedTransfer);
    handleCloseTransferDetails();
  };

  const handleConfirmTransferDetails = () => {
    // TODO: Implement confirm transfer functionality
    console.log('Confirm transfer:', selectedTransfer);
    handleCloseTransferDetails();
  };

  const handleCancelTransfer = () => {
    // TODO: Implement cancel transfer functionality
    console.log('Cancel transfer:', selectedTransfer);
    handleCloseTransferDetails();
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Page heading */}
      <Typography
        component="h1"
        variant="h4"
        sx={{
          position: 'absolute',
          left: '-10000px',
          width: '1px',
          height: '1px',
          overflow: 'hidden'
        }}
      >
        DHB SaveOnline Account
      </Typography>

      {/* Breadcrumbs Section */}
      <BreadcrumbsSection />

      {/* Savings Goals Section */}
      <SavingsGoalsSection 
        showSavingsGoals={showSavingsGoals}
        savedGoals={savedGoals}
      />

      {/* Account Summary - Full Width Blue Card */}
        <AccountSummarySection 
          accountData={accountData} 
          accountIban={accountIban || undefined}
          accountBalance={accountBalance || undefined}
        />

      {/* Connected Frame: Transfer Section + Quick Actions */}
      <ConnectedFrameSection
        tabValue={tabValue}
        onTabChange={handleTabChange}
        onOpenFilter={() => setFilterPopupOpen(true)}
        onDownloadStatement={handleDownloadStatement}
        filteredTransactions={filteredTransactions}
        mockTransactions={mockTransactions}
        quickActions={quickActions}
        onTransferClick={handleTransferClick}
      />

      {/* Transfer Modal */}
      <TransferModal
        open={modalOpen}
        onClose={handleCloseModal}
        accountSelectorOpen={accountSelectorOpen}
        selectedAccount={selectedAccount}
        beneficiaryAccount={beneficiaryAccount}
        amount={amount}
        explanation={explanation}
        period={period}
        startDate={startDate}
        endDate={endDate}
        errors={errors}
        onAccountSelectorToggle={() => setAccountSelectorOpen(!accountSelectorOpen)}
        onAccountChange={handleAccountChange}
        onBeneficiaryAccountChange={handleBeneficiaryAccountChange}
        onAmountChange={handleAmountChange}
        onExplanationChange={handleExplanationChange}
        onPeriodChange={handlePeriodChange}
        onStartDateChange={handleStartDateChange}
        onEndDateChange={handleEndDateChange}
        onConfirmTransfer={handleConfirmTransfer}
        accounts={accounts}
        selectedAccountData={selectedAccountData}
        days={days}
        months={months}
        years={years}
      />

      {/* Transaction Status Modal */}
      <Modal
        open={showTransactionStatus}
        onClose={handleCloseModal}
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-end',
          '& .MuiBackdrop-root': {
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            backdropFilter: 'blur(4px)'
          }
        }}
      >
        <Box
          sx={{
            position: 'relative',
            width: '50%',
            height: '100vh',
            bgcolor: '#F3F3F3',
            borderRadius: '16px 0 0 0',
            boxShadow: 24,
            overflow: 'auto',
            display: 'flex',
            flexDirection: 'column'
          }}
        >
          {/* Modal Header */}
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            p: 3, 
            borderBottom: '1px solid #e0e0e0',
            bgcolor: 'white'
          }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
              Transaction Status
            </Typography>
            <IconButton onClick={handleCloseModal}>
              <CloseIcon />
            </IconButton>
          </Box>

          {/* Transaction Details Section */}
          <Box sx={{ p: 3, bgcolor: 'white', m: 3, borderRadius: 1, flex: 1 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body2">Account</Typography>
                <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                  {selectedAccountData.iban}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body2">Amount</Typography>
                <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                  € {amount.whole || '0'},{amount.decimal || '00'}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body2">Beneficiary Account</Typography>
                <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                  {beneficiaryAccount || 'Not selected'}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body2">Beneficiary name</Typography>
                <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                  {beneficiaryAccount ? 'E. VERMALEN' : 'Not specified'}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body2">Periodicity</Typography>
                <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                  {period === 'one-time' ? 'Once' : period.replace('-', ' ')}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body2">Payment Date</Typography>
                <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                  {period === 'one-time' 
                    ? `${startDate.day || 'NN'}-${startDate.month || 'LLL'}-${startDate.year || 'NNNN'}`
                    : `${startDate.day || 'NN'}-${startDate.month || 'LLL'}-${startDate.year || 'NNNN'}`
                  }
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body2">Commission Amount</Typography>
                <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                  € 0.00
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body2">Explanation</Typography>
                <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                  {explanation || 'No explanation provided'}
                </Typography>
              </Box>
              
              {/* Edit Link */}
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                <MuiLink
                  component="button"
                  onClick={handleEditTransaction}
                  sx={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    textDecoration: 'none',
                    color: '#1976d2',
                    fontWeight: 'bold',
                    '&:hover': { textDecoration: 'underline' }
                  }}
                >
                  Edit
                  <ArrowForwardIcon sx={{ ml: 0.5, fontSize: '1rem' }} />
                </MuiLink>
              </Box>
            </Box>
          </Box>

          {/* Action Buttons */}
          <Box sx={{ p: 3, bgcolor: 'white', mx: 3, mb: 3, borderRadius: 1 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Button
                variant="contained"
                fullWidth
                onClick={handleFinalConfirm}
                sx={{
                  backgroundColor: '#FC9F15',
                  '&:hover': { backgroundColor: '#e88a0a' },
                  py: 2,
                  fontSize: '1.1rem'
                }}
                endIcon={<ArrowForwardIcon />}
              >
                Confirm →
              </Button>
              <Button
                variant="outlined"
                fullWidth
                onClick={handleCancelTransaction}
                sx={{
                  borderColor: '#1976d2',
                  color: '#1976d2',
                  py: 2,
                  fontSize: '1.1rem',
                  '&:hover': {
                    borderColor: '#1565c0',
                    backgroundColor: 'rgba(25, 118, 210, 0.04)'
                  }
                }}
              >
                Cancel
              </Button>
            </Box>
          </Box>
        </Box>
      </Modal>

      {/* Final Confirmation Modal */}
      <Modal
        open={showFinalConfirmation}
        onClose={handleDone}
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-end',
          '& .MuiBackdrop-root': {
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            backdropFilter: 'blur(4px)'
          }
        }}
      >
        <Box
          sx={{
            position: 'relative',
            width: '50%',
            height: '100vh',
            bgcolor: '#F3F3F3',
            borderRadius: '16px 0 0 0',
            boxShadow: 24,
            overflow: 'auto',
            display: 'flex',
            flexDirection: 'column'
          }}
        >
          {/* Modal Header */}
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            p: 3, 
            borderBottom: '1px solid #e0e0e0',
            bgcolor: 'white'
          }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
              Transaction Complete
            </Typography>
            <IconButton onClick={handleDone}>
              <CloseIcon />
            </IconButton>
          </Box>

          {/* Success Content */}
          <Box sx={{ 
            p: 3, 
            bgcolor: 'white', 
            m: 3, 
            borderRadius: 1, 
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center'
          }}>
            {/* Success Icon */}
            <Box sx={{
              width: 80,
              height: 80,
              borderRadius: '50%',
              backgroundColor: '#4caf50',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: '2.5rem',
              fontWeight: 'bold',
              mb: 3
            }}>
              ✓
            </Box>

            {/* Success Text */}
            <Typography 
              variant="h5" 
              sx={{ 
                color: '#4caf50', 
                fontWeight: 'bold', 
                mb: 2 
              }}
            >
              Congratulations!
            </Typography>
            
            <Typography 
              variant="h6" 
              sx={{ 
                fontWeight: 'bold', 
                mb: 2 
              }}
            >
              Your transaction is completed
            </Typography>
            
            <Typography 
              variant="body1" 
              sx={{ 
                mb: 1 
              }}
            >
              The transaction reference number is:
            </Typography>
            
            <Typography 
              variant="body1" 
              sx={{ 
                fontWeight: 'bold', 
                mb: 3 
              }}
            >
              290990S003491
            </Typography>
          </Box>

          {/* Done Button */}
          <Box sx={{ p: 3, bgcolor: 'white', mx: 3, mb: 3, borderRadius: 1 }}>
            <Button
              variant="contained"
              fullWidth
              onClick={handleDone}
              sx={{
                backgroundColor: '#FC9F15',
                '&:hover': { backgroundColor: '#e88a0a' },
                py: 2,
                fontSize: '1.1rem',
                borderRadius: 2
              }}
            >
              Done
            </Button>
          </Box>
        </Box>
      </Modal>

      {/* Filter Modal */}
      <FilterModal
        open={filterPopupOpen}
        onClose={() => setFilterPopupOpen(false)}
        onApplyFilters={applyFilters}
        periodFilter={periodFilter}
        periodFilterEnabled={periodFilterEnabled}
        amountFilter={amountFilter}
        minAmount={minAmount}
        maxAmount={maxAmount}
        debitTransactions={debitTransactions}
        creditTransactions={creditTransactions}
        setPeriodFilter={setPeriodFilter}
        setPeriodFilterEnabled={setPeriodFilterEnabled}
        setAmountFilter={setAmountFilter}
        setMinAmount={setMinAmount}
        setMaxAmount={setMaxAmount}
        setDebitTransactions={setDebitTransactions}
        setCreditTransactions={setCreditTransactions}
      />

      {/* Savings Goal Modals */}
      <SavingsGoalModals
        savingsGoalModalOpen={savingsGoalModalOpen}
        savingsTargetModalOpen={savingsTargetModalOpen}
        congratulationsModalOpen={congratulationsModalOpen}
        selectedGoal={selectedGoal}
        savingsTargetName={savingsTargetName}
        amountWhole={amountWhole}
        amountDecimal={amountDecimal}
        amountError={amountError}
        onCloseSavingsGoal={() => setSavingsGoalModalOpen(false)}
        onCloseSavingsTarget={() => setSavingsTargetModalOpen(false)}
        onCloseCongratulations={handleCloseCongratulations}
        onSavingsGoalClick={handleSavingsGoalClick}
        onCustomGoalClick={handleCustomGoalClick}
        onConfirmSavingsTarget={handleConfirmSavingsTarget}
        setSavingsTargetName={setSavingsTargetName}
        setAmountWhole={setAmountWhole}
        setAmountDecimal={setAmountDecimal}
        setAmountError={setAmountError}
        savingsGoalOptions={savingsGoalOptions}
      />

      {/* Transfer Details Popup */}
      <TransferDetailsPopup
        open={transferDetailsOpen}
        onClose={handleCloseTransferDetails}
        transfer={selectedTransfer}
        onEditTransfer={handleEditTransfer}
        onConfirmTransfer={handleConfirmTransferDetails}
        onCancelTransfer={handleCancelTransfer}
        calculateCompletedPayments={calculateCompletedPayments}
        allTransfers={scheduledTransfers}
      />

      {/* Download Statement Popup */}
      <DownloadStatementPopup
        open={downloadStatementOpen}
        onClose={() => setDownloadStatementOpen(false)}
      />

      <AccountClosurePopup
        open={accountClosureOpen}
        onClose={() => setAccountClosureOpen(false)}
        onAccountClosed={(accountNumber) => {
          setClosedAccountNumber(accountNumber);
          setAccountClosureCongratulationsOpen(true);
        }}
      />

      <AccountClosureCongratulationsPopup
        open={accountClosureCongratulationsOpen}
        onClose={() => setAccountClosureCongratulationsOpen(false)}
        accountNumber={closedAccountNumber}
      />

      {/* Historical Rate Modal */}
      <HistoricalRateModal
        open={historicalRateModalOpen}
        onClose={() => setHistoricalRateModalOpen(false)}
      />

      {/* Extend Account Modal */}
      <ExtendAccountModal
        open={extendAccountModalOpen}
        onClose={() => setExtendAccountModalOpen(false)}
        onConfirm={handleExtendAccountConfirm}
        onShowConfirmation={handleExtendAccountShowConfirmation}
      />

      {/* Extend Account Confirmation Modal */}
      <ExtendAccountConfirmationModal
        open={extendAccountConfirmationOpen}
        onClose={() => setExtendAccountConfirmationOpen(false)}
        onEdit={handleExtendAccountEdit}
        onConfirm={handleExtendAccountConfirm}
        extensionType={extensionData.extensionType}
        amount={extensionData.amount}
        selectedTerm={extensionData.selectedTerm}
      />

      {/* Extend Account Congratulations Modal */}
      <ExtendAccountCongratulationsModal
        open={extendAccountCongratulationsOpen}
        onClose={() => setExtendAccountCongratulationsOpen(false)}
        selectedPeriod={selectedExtensionPeriod}
      />
    </Box>
  );
};

export default MaxiSpaarTransfers;