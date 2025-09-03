import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Tabs,
  Tab,
  Chip,
  IconButton,
  Breadcrumbs,
  Link as MuiLink,
  Modal,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Switch,
  FormControlLabel,
} from '@mui/material';
import {
  ArrowForward as ArrowForwardIcon,
  Download as DownloadIcon,
  FilterList as FilterIcon,
  Settings as SettingsIcon,
  People as PeopleIcon,
  FileUpload as FileUploadIcon,
  TrackChanges as TrackChangesIcon,
  Tune as TuneIcon,
  Close as CloseIcon,
  CheckCircle as CheckCircleIcon,
} from '@mui/icons-material';
import { Link } from 'react-router-dom';
import { apiService } from '../../../services/api';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`transfer-tabpanel-${index}`}
      aria-labelledby={`transfer-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

const SaveOnlineAccount: React.FC = () => {
  const [tabValue, setTabValue] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState('dhb-combispaar');
  const [accountSelectorOpen, setAccountSelectorOpen] = useState(false);
  const [period, setPeriod] = useState('every-week');
  const [startDate, setStartDate] = useState({ day: '', month: '', year: '' });
  const [endDate, setEndDate] = useState({ day: '', month: '', year: '' });
  const [explanation, setExplanation] = useState('');
  const [beneficiaryAccount, setBeneficiaryAccount] = useState('');
  const [showTransactionStatus, setShowTransactionStatus] = useState(false);
  const [amount, setAmount] = useState({ whole: '', decimal: '' });
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [showFinalConfirmation, setShowFinalConfirmation] = useState(false);
  
  // Filter popup states
  const [filterPopupOpen, setFilterPopupOpen] = useState(false);
  const [periodFilter, setPeriodFilter] = useState('today');
  const [periodFilterEnabled, setPeriodFilterEnabled] = useState(false);
  const [amountFilter, setAmountFilter] = useState(false);
  const [minAmount, setMinAmount] = useState({ whole: '', decimal: '' });
  const [maxAmount, setMaxAmount] = useState({ whole: '', decimal: '' });
  const [transactionsCount, setTransactionsCount] = useState('5');
  const [debitTransactions, setDebitTransactions] = useState(true);
  const [creditTransactions, setCreditTransactions] = useState(true);
  const [filteredTransactions, setFilteredTransactions] = useState<any[]>([]);
  const [savingsGoalModalOpen, setSavingsGoalModalOpen] = useState(false);
  const [savingsTargetModalOpen, setSavingsTargetModalOpen] = useState(false);
  const [congratulationsModalOpen, setCongratulationsModalOpen] = useState(false);
  const [showSavingsGoals, setShowSavingsGoals] = useState(false);
  const [savedGoals, setSavedGoals] = useState<Array<{
    id: string;
    name: string;
    targetAmount: number;
    currentAmount: number;
    percentage: number;
  }>>([]);
  
  const [scheduledTransfers, setScheduledTransfers] = useState<Array<{
    id: string;
    description: string;
    amount: string;
    period: string;
    startDate: string;
    endDate?: string;
    status: 'scheduled' | 'completed';
    completedPayments: number;
    totalPayments: number;
    isExpanded?: boolean;
  }>>([]);
  const [selectedGoal, setSelectedGoal] = useState('');
  const [savingsTargetName, setSavingsTargetName] = useState('');
  const [amountWhole, setAmountWhole] = useState('');
  const [amountDecimal, setAmountDecimal] = useState('');
  const [amountError, setAmountError] = useState('');
  const [mockTransactions, setMockTransactions] = useState<any[]>([]);
  const [accountData, setAccountData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Fetch account data on component mount
  useEffect(() => {
    const fetchAccountData = async () => {
      try {
        // Use the IBAN from the SaveOnline account
        const data = await apiService.getAccountByIban('NL24DHBN2018470578');
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
  }, []);

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
        
        // Remove €, spaces, and handle European number format (1.250,00 -> 1250.00)
        balanceStr = balanceStr.replace(/[€\s]/g, '');
        console.log(`After removing € and spaces: "${balanceStr}"`);
        
        // Handle European number format (1.250,00 -> 1250.00) or standard format (900.00 -> 900.00)
        if (balanceStr.includes(',')) {
          // European format: remove dots (thousand separators) and replace comma with dot
          balanceStr = balanceStr.replace(/\./g, '').replace(',', '.');
        }
        // If no comma, keep the dot as decimal separator
        console.log(`After formatting: "${balanceStr}"`);
        
        const balanceValue = parseFloat(balanceStr);
        console.log(`Parsed balanceValue: ${balanceValue}`);
        
        // Use absolute value for filtering (ignore positive/negative sign)
        const absoluteValue = Math.abs(balanceValue);
        console.log(`Absolute value: ${absoluteValue}`);
        
        console.log(`Transaction: "${transaction.balance}", Final Absolute: ${absoluteValue}, Min: ${minAmountValue}, Max: ${maxAmountValue}, HasMin: ${hasMinAmount}, HasMax: ${hasMaxAmount}`);
        
        // Apply filters based on what's entered
        const passesMinFilter = !hasMinAmount || absoluteValue >= minAmountValue;
        const passesMaxFilter = !hasMaxAmount || absoluteValue <= maxAmountValue;
        
        console.log(`Passes min filter: ${passesMinFilter}, Passes max filter: ${passesMaxFilter}`);
        
        return passesMinFilter && passesMaxFilter;
      });
    }

    // Filter by transaction count
    const count = parseInt(transactionsCount);
    filtered = filtered.slice(0, count);

    setFilteredTransactions(filtered);
    setFilterPopupOpen(false);
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
    link.setAttribute('download', `account_statement_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

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
        type: 'debit'
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
    
    // Add to scheduled transfers if it's recurring OR if it's one-time with future date
    if (period !== 'one-time' || !shouldBeCompleted) {
      const transferEndDate = endDate.day ? new Date(parseInt(endDate.year), parseInt(endDate.month) - 1, parseInt(endDate.day)) : undefined;
      
      const newScheduledTransfer = {
        id: Date.now().toString(),
        description: explanation || (period === 'one-time' ? 'One-time Transfer' : 'Recurring Transfer'),
        amount: `€ ${amount.whole || '0'}.${amount.decimal || '00'}`,
        period: period,
        startDate: transferStartDate.toLocaleDateString('en-GB'),
        endDate: transferEndDate?.toLocaleDateString('en-GB'),
        status: 'scheduled' as const,
        completedPayments: shouldBeCompleted ? 1 : 0, // If start date has passed, mark as 1 completed payment
        totalPayments: period === 'one-time' ? 1 : calculateTotalPayments(transferStartDate, transferEndDate, period),
        isExpanded: false
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
        return Math.floor(daysDiff) + 1;
      case 'weekly':
        return Math.floor(daysDiff / 7) + 1;
      case 'monthly':
        return Math.floor(daysDiff / 30) + 1;
      case 'yearly':
        return Math.floor(daysDiff / 365) + 1;
      default:
        return 1;
    }
  };

  // Calculate completed payments based on start date and today
  const calculateCompletedPayments = (startDate: string, period: string): number => {
    const start = new Date(startDate.split('/').reverse().join('-'));
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (start > today) return 0;
    
    const timeDiff = today.getTime() - start.getTime();
    const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
    
    switch (period) {
      case 'daily':
        return Math.min(Math.floor(daysDiff) + 1, 999); // Cap at reasonable number
      case 'weekly':
        return Math.min(Math.floor(daysDiff / 7) + 1, 999);
      case 'monthly':
        return Math.min(Math.floor(daysDiff / 30) + 1, 999);
      case 'yearly':
        return Math.min(Math.floor(daysDiff / 365) + 1, 999);
      default:
        return 0;
    }
  };

  // Toggle scheduled transfer expansion
  const toggleScheduledTransfer = (id: string) => {
    setScheduledTransfers(prev => prev.map(transfer => 
      transfer.id === id ? { ...transfer, isExpanded: !transfer.isExpanded } : transfer
    ));
  };

  // Calculate next payment date
  const getNextPaymentDate = (startDate: string, period: string, completedPayments: number): string => {
    const start = new Date(startDate.split('/').reverse().join('-'));
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (start > today) {
      return start.toLocaleDateString('en-GB');
    }
    
    let nextDate = new Date(start);
    
    // Calculate next payment based on period and completed payments
    switch (period) {
      case 'daily':
        nextDate.setDate(start.getDate() + completedPayments);
        break;
      case 'weekly':
        nextDate.setDate(start.getDate() + (completedPayments * 7));
        break;
      case 'monthly':
        nextDate.setMonth(start.getMonth() + completedPayments);
        break;
      case 'yearly':
        nextDate.setFullYear(start.getFullYear() + completedPayments);
        break;
      default:
        return 'N/A';
    }
    
    return nextDate.toLocaleDateString('en-GB');
  };

  // Get payment status text
  const getPaymentStatus = (transfer: any): { previous: string; next: string } => {
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

  // Generate date options
  const getDaysInMonth = (month: number, year: number) => {
    return new Date(year, month, 0).getDate();
  };

  const getCurrentDate = () => {
    const now = new Date();
    return {
      day: now.getDate().toString(),
      month: (now.getMonth() + 1).toString(),
      year: now.getFullYear().toString()
    };
  };

  const currentDate = getCurrentDate();
  const days = Array.from({ length: 31 }, (_, i) => (i + 1).toString().padStart(2, '0'));
  const months = [
    { value: '01', label: 'Jan' }, { value: '02', label: 'Feb' }, { value: '03', label: 'Mar' },
    { value: '04', label: 'Apr' }, { value: '05', label: 'May' }, { value: '06', label: 'Jun' },
    { value: '07', label: 'Jul' }, { value: '08', label: 'Aug' }, { value: '09', label: 'Sep' },
    { value: '10', label: 'Oct' }, { value: '11', label: 'Nov' }, { value: '12', label: 'Dec' }
  ];
  const years = Array.from({ length: 27 }, (_, i) => (2024 + i).toString());

  const accounts = [
    { id: 'dhb-combispaar', name: 'DHB Combispaar', iban: 'NL24DHBN2018470578', balance: '€ 2.500,00' },
    { id: 'dhb-saveonline', name: 'DHB SaveOnline', iban: 'NL24DHBN2018470579', balance: '€ 1.750,00' },
    { id: 'dhb-current', name: 'DHB Current Account', iban: 'NL24DHBN2018470580', balance: '€ 3.200,00' },
  ];

  const selectedAccountData = accounts.find(acc => acc.id === selectedAccount) || accounts[0];

  const transactions = [
    {
      date: '01-Jan-2024',
      description: 'Holder name NL24DHBN2018470578',
      balance: '€ 1.250,00',
      type: 'credit'
    },
    {
      date: '28-Dec-2023',
      description: 'Holder name NL24DHBN2018470578',
      balance: '- € 500,00',
      type: 'debit'
    },
    {
      date: '15-Dec-2023',
      description: 'Holder name NL24DHBN2018470578',
      balance: '€ 2.000,00',
      type: 'credit'
    },
    {
      date: '01-Dec-2023',
      description: 'Holder name NL24DHBN2018470578',
      balance: '- € 750,00',
      type: 'debit'
    }
  ];

  const quickActions = [
    { icon: <SettingsIcon />, label: 'Savings Goal Setting', href: '#', onClick: () => setSavingsGoalModalOpen(true) },
    { icon: <PeopleIcon />, label: 'Counteraccount change', href: '#', onClick: () => {} },
    { icon: <FileUploadIcon />, label: 'Transcript download', href: '#', onClick: () => {} },
    { icon: <TrackChangesIcon />, label: 'Set savings target', href: '#', onClick: () => {} },
    { icon: <TuneIcon />, label: 'Adjustment', href: '#', onClick: () => {} },
    { icon: <CloseIcon />, label: 'Account Closure', href: '#', onClick: () => {} },
  ];

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
      {/* Breadcrumbs */}
      <Breadcrumbs sx={{ mb: 3 }}>
        <MuiLink component={Link} to="/private" color="inherit" underline="hover">
          Home
        </MuiLink>
        <MuiLink component={Link} to="/dashboard/analytics" color="inherit" underline="hover">
          Accounts
        </MuiLink>
        <Typography color="text.primary">DHB SaveOnline</Typography>
      </Breadcrumbs>

      {/* Savings Goals Section */}
      {showSavingsGoals && savedGoals.length > 0 && (
        <Card sx={{ mb: 3, p: 3, boxShadow: '0 2px 8px rgba(0,0,0,0.1)', borderRadius: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#333' }}>
              Savings Goals
            </Typography>
            <Box sx={{ display: 'flex', gap: 3 }}>
              {savedGoals.map((goal) => (
                <Box key={goal.id} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
                  <Box sx={{ position: 'relative', width: 60, height: 60 }}>
                    <Box
                      sx={{
                        width: '100%',
                        height: '100%',
                        borderRadius: '50%',
                        border: '4px solid #E0E0E0',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        position: 'relative'
                      }}
                    >
                      <Box
                        sx={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          width: '100%',
                          height: '100%',
                          borderRadius: '50%',
                          border: '4px solid transparent',
                          borderTop: '4px solid #4CAF50',
                          transform: `rotate(${-90 + (goal.percentage * 3.6)}deg)`,
                          clipPath: goal.percentage >= 50 ? 'none' : 'polygon(50% 0%, 50% 50%, 100% 50%, 100% 100%, 0% 100%, 0% 0%)'
                        }}
                      />
                      {goal.percentage >= 50 && (
                        <Box
                          sx={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                            borderRadius: '50%',
                            border: '4px solid #4CAF50',
                            borderRight: '4px solid transparent',
                            borderBottom: '4px solid transparent',
                            transform: 'rotate(-90deg)'
                          }}
                        />
                      )}
                      <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#4CAF50' }}>
                        {goal.percentage}%
                      </Typography>
                    </Box>
                  </Box>
                  <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#333' }}>
                    {goal.name}
                  </Typography>
                  <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                    € {goal.currentAmount.toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} / {goal.targetAmount.toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Box>
        </Card>
      )}

      {/* Account Summary - Full Width Blue Card */}
      <Card sx={{ mb: 0, backgroundColor: '#004996', color: 'white', borderRadius: '12px 12px 0 0' }}>
        <CardContent>
          <Grid container alignItems="center">
            {/* Left Side - Holder Name and IBAN */}
            <Grid item xs={12} md={4}>
              <Typography variant="h6" sx={{ mb: 1 }}>
                {accountData?.holder_name || 'Loading...'}
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.8 }}>
                NL24DHBN2018470578
              </Typography>
            </Grid>
            
            {/* Center - Balance */}
            <Grid item xs={12} md={4} sx={{ textAlign: 'center' }}>
              <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                € 2.000,00
              </Typography>
            </Grid>
            
            {/* Right Side - Balance Classes and Rates Table */}
            <Grid item xs={12} md={4}>
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', width: '100%' }}>
                <Box sx={{ width: '100%', maxWidth: '400px' }}>
                  {/* Header Row */}
                  <Box sx={{ display: 'flex', mb: 1, justifyContent: 'space-between' }}>
                    <Typography variant="body2" sx={{ fontWeight: 'bold', flex: 1, mr: 0.5 }}>
                      Balance class
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 'bold', minWidth: '60px', textAlign: 'right' }}>
                      Rente
                    </Typography>
                  </Box>
                  
                  {/* Data Row 1 */}
                  <Box sx={{ display: 'flex', mb: 1, justifyContent: 'space-between' }}>
                    <Typography variant="body2" sx={{ flex: 1, mr: 0.5, whiteSpace: 'nowrap' }}>
                      EUR 0,00 t/m EUR 100.000,00
                    </Typography>
                    <Typography variant="body2" sx={{ minWidth: '60px', textAlign: 'right' }}>
                      1.7 %
                    </Typography>
                  </Box>
                  
                  {/* Data Row 2 */}
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2" sx={{ flex: 1, mr: 0.5, whiteSpace: 'nowrap' }}>
                      EUR 100.000,01 t/m EUR 500.000,00
                    </Typography>
                    <Typography variant="body2" sx={{ minWidth: '60px', textAlign: 'right' }}>
                      1.7 %
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Connected Frame: Transfer Section + Quick Actions */}
      <Box sx={{ 
        display: 'flex', 
        backgroundColor: 'white',
        border: '1px solid #e0e0e0',
        borderTop: 'none',
        borderRadius: '0 0 16px 16px'
      }}>
        {/* Transfer Section - Left Side */}
        <Box sx={{ flex: 1, p: 3, borderRight: '1px solid #e0e0e0' }}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
            <Tabs 
              value={tabValue} 
              onChange={handleTabChange}
              sx={{
                '& .MuiTab-root': {
                  height: '48px',
                  width: '288px',
                  textTransform: 'none',
                  fontSize: '18px',
                  fontWeight: 700,
                  color: '#000000'
                }
              }}
            >
              <Tab label="Completed transfers" />
              <Tab label="Scheduled transfers" />
            </Tabs>
          </Box>

          <TabPanel value={tabValue} index={0}>
            <Typography variant="body1" sx={{ mb: 3, color: 'text.primary', fontSize: '17px' }}> 
              Do you transfer funds to your contra account or savings account before 2.30pm on a working day? 
              Then the transfer will be processed the same day. After these times, the transfer will be processed 
              the next working day.
            </Typography>
            
            <Box sx={{ textAlign: 'center', mb: 3 }}>
              <Button
                variant="contained"
                size="large"
                onClick={handleOpenModal}
                sx={{
                  backgroundColor: '#FC9F15',
                  '&:hover': { backgroundColor: '#e88a0a' },
                  px: 4,
                  py: 2,
                  fontSize: '1.1rem',
                  width: '100%'
                }}
                endIcon={<ArrowForwardIcon />}
              >
                Make New Transfer
              </Button>
            </Box>
          </TabPanel>

          <TabPanel value={tabValue} index={1}>
            {scheduledTransfers.length === 0 ? (
              <Typography variant="body2" color="text.secondary">
                No scheduled transfers found.
              </Typography>
            ) : (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {scheduledTransfers.map((transfer) => {
                  const completedPayments = calculateCompletedPayments(transfer.startDate, transfer.period);
                  const isCompleted = transfer.endDate && new Date(transfer.endDate) <= new Date();
                  const paymentStatus = getPaymentStatus(transfer);
                  
                  return (
                    <Box
                      key={transfer.id}
                      onClick={() => toggleScheduledTransfer(transfer.id)}
                      sx={{
                        border: '1px solid #e0e0e0',
                        borderRadius: 1,
                        p: 2,
                        cursor: 'pointer',
                        '&:hover': {
                          backgroundColor: '#f5f5f5'
                        }
                      }}
                    >
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Box>
                          <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                            {transfer.description}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {transfer.amount} • {transfer.period} • {transfer.startDate}
                            {transfer.endDate && ` - ${transfer.endDate}`}
                          </Typography>
                        </Box>
                        <Box sx={{ textAlign: 'right' }}>
                          <Typography variant="body2" color={isCompleted ? 'success.main' : 'text.secondary'}>
                            {isCompleted ? 'Completed' : 'Active'}
                          </Typography>

                        </Box>
                      </Box>
                      
                      {transfer.isExpanded && (
                        <Box sx={{ mt: 2, pt: 2, borderTop: '1px solid #e0e0e0' }}>
                          <Typography variant="body2" sx={{ mb: 1 }}>
                            <strong>Payment Schedule:</strong> {transfer.period}
                          </Typography>
                          <Typography variant="body2" sx={{ mb: 1 }}>
                            <strong>Start Date:</strong> {transfer.startDate}
                          </Typography>
                          {transfer.endDate && (
                            <Typography variant="body2" sx={{ mb: 1 }}>
                              <strong>End Date:</strong> {transfer.endDate}
                            </Typography>
                          )}
                          <Typography variant="body2" sx={{ mb: 1 }}>
                            <strong>Amount per payment:</strong> {transfer.amount}
                          </Typography>
                          <Typography variant="body2" sx={{ mb: 1 }}>
                            <strong>Previous payment:</strong> {paymentStatus.previous}
                          </Typography>
                          <Typography variant="body2" sx={{ mb: 1 }}>
                            <strong>Next payment:</strong> {paymentStatus.next}
                          </Typography>
                        </Box>
                      )}
                    </Box>
                  );
                })}
              </Box>
            )}
          </TabPanel>

          {/* Account Transfers Table - Inside the same frame */}
          <Box sx={{ mt: 4 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">Account transfers</Typography>
              <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <IconButton size="small" onClick={downloadAccountStatement}>
                    <DownloadIcon />
                  </IconButton>
                  <Typography variant="caption" color="text.secondary">
                    Download
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <IconButton size="small" onClick={() => setFilterPopupOpen(true)}>
                    <FilterIcon />
                  </IconButton>
                  <Typography variant="caption" color="text.secondary">
                    Filter
                  </Typography>
                </Box>
              </Box>
            </Box>

            <TableContainer component={Paper} variant="outlined">
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell><strong>Date</strong></TableCell>
                    <TableCell><strong>Description</strong></TableCell>
                    <TableCell align="right"><strong>Balance</strong></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {(filteredTransactions.length > 0 ? filteredTransactions : mockTransactions).map((transaction, index) => (
                    <TableRow key={transaction.id || index}>
                      <TableCell>{transaction.date}</TableCell>
                      <TableCell>
                        {transaction.description}
                        <br />
                        <Typography variant="caption" color="text.secondary">
                          {transaction.account}
                        </Typography>
                      </TableCell>
                      <TableCell 
                        align="right"
                        sx={{ 
                          color: transaction.type === 'debit' ? 'error.main' : 'success.main',
                          fontWeight: 'bold'
                        }}
                      >
                        {transaction.balance}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            <Box sx={{ textAlign: 'center', mt: 2 }}>
              <MuiLink
                component={Link}
                to="/accounts/saveonline/statement"
                sx={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  textDecoration: 'none',
                  color: '#FC9F15',
                  fontWeight: 'bold',
                  '&:hover': { textDecoration: 'underline' }
                }}
              >
                See All
                <ArrowForwardIcon sx={{ ml: 0.5, fontSize: '1rem' }} />
              </MuiLink>
            </Box>
          </Box>
        </Box>

        {/* Quick Actions - Right Side */}
        <Box sx={{ width: '300px', p: 3, backgroundColor: '#E6EDF5', borderRadius: '0 0 16px 0' }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4, pt: 4, alignItems: 'center' }}>
            {quickActions.map((action, index) => (
              <Box
                key={index}
                onClick={action.onClick}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  p: 1.5,
                  borderRadius: 1,
                  textDecoration: 'none',
                  color: 'text.primary',
                  backgroundColor: 'transparent',
                  border: 'none',
                  transition: 'all 0.2s',
                  width: '240px',
                  cursor: 'pointer',
                  '&:hover': {
                    backgroundColor: 'rgba(0, 0, 0, 0.05)',
                    textDecoration: 'none'
                  }
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, minWidth: '180px' }}>
                  <Box sx={{ width: '24px', display: 'flex', justifyContent: 'center' }}>
                    {action.icon}
                  </Box>
                  <Typography variant="body2">{action.label}</Typography>
                </Box>
                <ArrowForwardIcon sx={{ fontSize: '1rem' }} />
              </Box>
            ))}
          </Box>
        </Box>
      </Box>

      {/* Transfer Modal */}
      <Modal
        open={modalOpen}
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
              Account opening
            </Typography>
            <IconButton onClick={handleCloseModal}>
              <CloseIcon />
            </IconButton>
          </Box>

          {/* Account Information Section */}
          <Typography
            component="h2"
            variant="h5"
            sx={{
              position: 'absolute',
              left: '-10000px',
              width: '1px',
              height: '1px',
              overflow: 'hidden'
            }}
          >
            Account Information
          </Typography>
          
          {/* Account Details Section */}
          <Box 
            sx={{ 
              p: 3, 
              bgcolor: 'white', 
              m: 3, 
              borderRadius: 1, 
              position: 'relative',
              cursor: 'pointer'
            }}
            onClick={() => setAccountSelectorOpen(!accountSelectorOpen)}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6" sx={{ color: '#004996', fontWeight: 'bold' }}>
                {selectedAccountData.name}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography>{selectedAccountData.balance}</Typography>
                <ArrowForwardIcon sx={{ transform: accountSelectorOpen ? 'rotate(270deg)' : 'rotate(90deg)', transition: 'transform 0.2s' }} />
              </Box>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="body2">IBAN Number</Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography variant="body2">{selectedAccountData.iban}</Typography>
                <ArrowForwardIcon sx={{ transform: accountSelectorOpen ? 'rotate(270deg)' : 'rotate(90deg)', transition: 'transform 0.2s' }} />
              </Box>
            </Box>

            {/* Account Selector Dropdown */}
            {accountSelectorOpen && (
              <Box sx={{ 
                position: 'absolute', 
                top: '100%', 
                left: 0, 
                right: 0, 
                bgcolor: 'white', 
                border: '1px solid #e0e0e0', 
                borderRadius: 1, 
                mt: 1, 
                zIndex: 1000,
                boxShadow: 3
              }}>
                {accounts.map((account) => (
                  <Box
                    key={account.id}
                    sx={{
                      p: 2,
                      cursor: 'pointer',
                      borderBottom: '1px solid #f0f0f0',
                      '&:last-child': { borderBottom: 'none' },
                      bgcolor: selectedAccount === account.id ? '#f0f8ff' : 'transparent'
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAccountChange(account.id);
                    }}
                  >
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                      <Typography variant="body1" sx={{ fontWeight: 'bold', color: '#004996' }}>
                        {account.name}
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                        {account.balance}
                      </Typography>
                    </Box>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      {account.iban}
                    </Typography>
                  </Box>
                ))}
              </Box>
            )}
          </Box>

          {/* Form Fields */}
          <Box sx={{ p: 3, bgcolor: 'white', mx: 3, mb: 3, borderRadius: 1, flex: 1 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              {/* Beneficiary Account */}
              <FormControl fullWidth error={!!errors.beneficiaryAccount}>
                <InputLabel>Beneficiary Account</InputLabel>
                <Select
                  value={beneficiaryAccount}
                  label="Beneficiary Account"
                  onChange={handleBeneficiaryAccountChange}
                >
                  <MenuItem value="">Select a beneficiary account</MenuItem>
                  {accounts.map((account) => (
                    <MenuItem key={account.id} value={account.iban}>
                      {account.name} (IBAN: {account.iban})
                    </MenuItem>
                  ))}
                </Select>
                {errors.beneficiaryAccount && (
                  <Typography variant="body2" color="error">{errors.beneficiaryAccount}</Typography>
                )}
              </FormControl>

              {/* Amount */}
              <Box>
                <Typography variant="body2" sx={{ mb: 1 }}>Amount</Typography>
                <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                  <TextField
                    placeholder="000"
                    sx={{ flex: 1 }}
                    size="small"
                    value={amount.whole}
                    onChange={(e) => handleAmountChange('whole', e.target.value)}
                    error={!!errors.amount}
                  />
                  <TextField
                    placeholder="00"
                    sx={{ width: '80px' }}
                    size="small"
                    value={amount.decimal}
                    onChange={(e) => handleAmountChange('decimal', e.target.value)}
                    error={!!errors.amount}
                  />
                  <Typography>€</Typography>
                </Box>
                {errors.amount && (
                  <Typography variant="body2" color="error">{errors.amount}</Typography>
                )}
              </Box>

              {/* Explanation */}
              <TextField
                fullWidth
                label="Explanation"
                placeholder="Text"
                inputProps={{ maxLength: 50 }}
                helperText={`${(explanation || '').length}/50 characters`}
                onChange={handleExplanationChange}
                error={!!errors.explanation}
              />

              {/* Period */}
              <FormControl fullWidth error={!!errors.period}>
                <InputLabel>Period *</InputLabel>
                <Select
                  value={period}
                  label="Period *"
                  onChange={handlePeriodChange}
                >
                  <MenuItem value="every-day">Every day</MenuItem>
                  <MenuItem value="every-week">Every week</MenuItem>
                  <MenuItem value="every-month">Every month</MenuItem>
                  <MenuItem value="every-year">Every year</MenuItem>
                  <MenuItem value="one-time">One time</MenuItem>
                </Select>
                {errors.period && (
                  <Typography variant="body2" color="error">{errors.period}</Typography>
                )}
              </FormControl>

              {/* Start Date */}
              {period !== 'one-time' && (
                <Box>
                  <Typography variant="body2" sx={{ mb: 1 }}>Start Date</Typography>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <FormControl size="small" sx={{ flex: 1 }} error={!!errors.startDate}>
                      <InputLabel>Day</InputLabel>
                      <Select value={startDate.day} label="Day" onChange={(e) => handleStartDateChange('day', e.target.value)}>
                        {days.map(day => (
                          <MenuItem key={day} value={day}>{day}</MenuItem>
                        ))}
                      </Select>
                      {errors.startDate && (
                        <Typography variant="body2" color="error">{errors.startDate}</Typography>
                      )}
                    </FormControl>
                    <FormControl size="small" sx={{ flex: 1 }} error={!!errors.startDate}>
                      <InputLabel>Month</InputLabel>
                      <Select value={startDate.month} label="Month" onChange={(e) => handleStartDateChange('month', e.target.value)}>
                        {months.map(month => (
                          <MenuItem key={month.value} value={month.value}>{month.label}</MenuItem>
                        ))}
                      </Select>
                      {errors.startDate && (
                        <Typography variant="body2" color="error">{errors.startDate}</Typography>
                      )}
                    </FormControl>
                    <FormControl size="small" sx={{ flex: 1 }} error={!!errors.startDate}>
                      <InputLabel>Year</InputLabel>
                      <Select value={startDate.year} label="Year" onChange={(e) => handleStartDateChange('year', e.target.value)}>
                        {years.map(year => (
                          <MenuItem key={year} value={year}>{year}</MenuItem>
                        ))}
                      </Select>
                      {errors.startDate && (
                        <Typography variant="body2" color="error">{errors.startDate}</Typography>
                      )}
                    </FormControl>
                  </Box>
                </Box>
              )}

              {/* End Date */}
              {period !== 'one-time' && (
                <Box>
                  <Typography variant="body2" sx={{ mb: 1 }}>End Date</Typography>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <FormControl size="small" sx={{ flex: 1 }} error={!!errors.endDate}>
                      <InputLabel>Day</InputLabel>
                      <Select value={endDate.day} label="Day" onChange={(e) => handleEndDateChange('day', e.target.value)}>
                        {days.map(day => (
                          <MenuItem key={day} value={day}>{day}</MenuItem>
                        ))}
                      </Select>
                      {errors.endDate && (
                        <Typography variant="body2" color="error">{errors.endDate}</Typography>
                      )}
                    </FormControl>
                    <FormControl size="small" sx={{ flex: 1 }} error={!!errors.endDate}>
                      <InputLabel>Month</InputLabel>
                      <Select value={endDate.month} label="Month" onChange={(e) => handleEndDateChange('month', e.target.value)}>
                        {months.map(month => (
                          <MenuItem key={month.value} value={month.value}>{month.label}</MenuItem>
                        ))}
                      </Select>
                      {errors.endDate && (
                        <Typography variant="body2" color="error">{errors.endDate}</Typography>
                      )}
                    </FormControl>
                    <FormControl size="small" sx={{ flex: 1 }} error={!!errors.endDate}>
                      <InputLabel>Year</InputLabel>
                      <Select value={endDate.year} label="Year" onChange={(e) => handleEndDateChange('year', e.target.value)}>
                        {years.map(year => (
                          <MenuItem key={year} value={year}>{year}</MenuItem>
                        ))}
                      </Select>
                      {errors.endDate && (
                        <Typography variant="body2" color="error">{errors.endDate}</Typography>
                      )}
                    </FormControl>
                  </Box>
                </Box>
              )}

              {/* Single Date for One Time */}
              {period === 'one-time' && (
                <Box>
                  <Typography variant="body2" sx={{ mb: 1 }}>Date</Typography>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <FormControl size="small" sx={{ flex: 1 }} error={!!errors.startDate}>
                      <InputLabel>Day</InputLabel>
                      <Select value={startDate.day} label="Day" onChange={(e) => handleStartDateChange('day', e.target.value)}>
                        {days.map(day => (
                          <MenuItem key={day} value={day}>{day}</MenuItem>
                        ))}
                      </Select>
                      {errors.startDate && (
                        <Typography variant="body2" color="error">{errors.startDate}</Typography>
                      )}
                    </FormControl>
                    <FormControl size="small" sx={{ flex: 1 }} error={!!errors.startDate}>
                      <InputLabel>Month</InputLabel>
                      <Select value={startDate.month} label="Month" onChange={(e) => handleStartDateChange('month', e.target.value)}>
                        {months.map(month => (
                          <MenuItem key={month.value} value={month.value}>{month.label}</MenuItem>
                        ))}
                      </Select>
                      {errors.startDate && (
                        <Typography variant="body2" color="error">{errors.startDate}</Typography>
                      )}
                    </FormControl>
                    <FormControl size="small" sx={{ flex: 1 }} error={!!errors.startDate}>
                      <InputLabel>Year</InputLabel>
                      <Select value={startDate.year} label="Year" onChange={(e) => handleStartDateChange('year', e.target.value)}>
                        {years.map(year => (
                          <MenuItem key={year} value={year}>{year}</MenuItem>
                        ))}
                      </Select>
                      {errors.startDate && (
                        <Typography variant="body2" color="error">{errors.startDate}</Typography>
                      )}
                    </FormControl>
                  </Box>
                </Box>
              )}
            </Box>
          </Box>

          {/* Confirm Button */}
          <Box sx={{ p: 3, bgcolor: 'white', mx: 3, mb: 3, borderRadius: 1 }}>
            <Button
              variant="contained"
              fullWidth
              onClick={handleConfirmTransfer}
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
          </Box>
        </Box>
      </Modal>

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

      {/* Filter Popup Modal */}
      <Modal
        open={filterPopupOpen}
        onClose={() => setFilterPopupOpen(false)}
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-end',
          '& .MuiBackdrop-root': {
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            backdropFilter: 'blur(4px)',
          }
        }}
      >
        <Box sx={{
          width: '35%',
          height: '100vh',
          backgroundColor: '#F3F3F3',
          overflow: 'auto',
          display: 'flex',
          flexDirection: 'column',
          borderRadius: '8px 0 0 8px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.15)'
        }}>
          {/* Modal Header */}
          <Box sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            p: 3
          }}>
            <Typography variant="h5" fontWeight="bold" color="#333">
              Filter
            </Typography>
            <IconButton onClick={() => setFilterPopupOpen(false)}>
              <CloseIcon />
            </IconButton>
          </Box>

          {/* Modal Content */}
          <Box sx={{ p: 8, flex: 1 }}>
            {/* White Container for Filtering Options */}
            <Card sx={{ 
              backgroundColor: 'white', 
              borderRadius: 2, 
              p: 3,
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
            }}>
            {/* Period Section */}
            <Box sx={{ mb: 6 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" fontWeight="bold" color="#333">
                  Period
                </Typography>
                <Switch 
                  checked={periodFilterEnabled} 
                  onChange={(e) => setPeriodFilterEnabled(e.target.checked)}
                  sx={{
                    '& .MuiSwitch-track': {
                      backgroundColor: periodFilterEnabled ? '#4CAF50' : '#E0E0E0',
                      borderRadius: 22 / 2,
                      opacity: 1,
                      height: 22,
                    },
                    '& .MuiSwitch-thumb': {
                      backgroundColor: '#FFFFFF',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                      width: 18,
                      height: 18,
                    },
                    '& .MuiSwitch-switchBase': {
                      color: '#FFFFFF',
                      top: 4.2,
                      left: 2,
                    },
                  }}
                />
              </Box>
              <Box sx={{ display: 'flex', gap: 1 }}>
                {['today', 'week', 'month', '6 month'].map((period) => (
                  <Button
                    key={period}
                    variant={periodFilter === period ? 'contained' : 'outlined'}
                    onClick={() => setPeriodFilter(period)}
                    sx={{
                      flex: 1,
                      height: 36,
                      lineHeight: '36px',
                      backgroundColor: periodFilter === period ? '#004996' : 'transparent',
                      color: periodFilter === period ? 'white' : '#333',
                      borderColor: '#004996',
                      textTransform: 'none',
                      '&:hover': {
                        backgroundColor: periodFilter === period ? '#004996' : 'rgba(0, 73, 150, 0.1)',
                      }
                    }}
                  >
                    {period === '6 month' ? '6 month' : period.charAt(0).toUpperCase() + period.slice(1)}
                  </Button>
                ))}
              </Box>
              
              {/* Value Date Section - Only show when periodFilterEnabled is enabled */}
              {periodFilterEnabled && (
                <Box sx={{ mt: 3, mb: 6 }}>
                  {/* Value Date From */}
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="body1" color="#333" sx={{ mb: 1 }}>
                      Value Date: From
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <FormControl size="small" sx={{ flex: 1 }}>
                        <Select
                          displayEmpty
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              borderColor: '#004996',
                              '& fieldset': {
                                borderColor: '#004996',
                              },
                            },
                          }}
                        >
                          <MenuItem value="">Day</MenuItem>
                          {Array.from({ length: 31 }, (_, i) => i + 1).map(day => (
                            <MenuItem key={day} value={day}>{day}</MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                      <FormControl size="small" sx={{ flex: 1 }}>
                        <Select
                          displayEmpty
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              borderColor: '#004996',
                              '& fieldset': {
                                borderColor: '#004996',
                              },
                            },
                          }}
                        >
                          <MenuItem value="">Month</MenuItem>
                          {Array.from({ length: 12 }, (_, i) => i + 1).map(month => (
                            <MenuItem key={month} value={month}>{month}</MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                      <FormControl size="small" sx={{ flex: 1 }}>
                        <Select
                          displayEmpty
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              borderColor: '#004996',
                              '& fieldset': {
                                borderColor: '#004996',
                              },
                            },
                          }}
                        >
                          <MenuItem value="">Year</MenuItem>
                          {Array.from({ length: 10 }, (_, i) => new Date().getFullYear() + i).map(year => (
                            <MenuItem key={year} value={year}>{year}</MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Box>
                  </Box>
                  
                  {/* Value Date To */}
                  <Box>
                    <Typography variant="body1" color="#333" sx={{ mb: 1 }}>
                      Value Date: To
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <FormControl size="small" sx={{ flex: 1 }}>
                        <Select
                          displayEmpty
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              borderColor: '#004996',
                              '& fieldset': {
                                borderColor: '#004996',
                              },
                            },
                          }}
                        >
                          <MenuItem value="">Day</MenuItem>
                          {Array.from({ length: 31 }, (_, i) => i + 1).map(day => (
                            <MenuItem key={day} value={day}>{day}</MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                      <FormControl size="small" sx={{ flex: 1 }}>
                        <Select
                          displayEmpty
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              borderColor: '#004996',
                              '& fieldset': {
                                borderColor: '#004996',
                              },
                            },
                          }}
                        >
                          <MenuItem value="">Month</MenuItem>
                          {Array.from({ length: 12 }, (_, i) => i + 1).map(month => (
                            <MenuItem key={month} value={month}>{month}</MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                      <FormControl size="small" sx={{ flex: 1 }}>
                        <Select
                          displayEmpty
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              borderColor: '#004996',
                              '& fieldset': {
                                borderColor: '#004996',
                              },
                            },
                          }}
                        >
                          <MenuItem value="">Year</MenuItem>
                          {Array.from({ length: 10 }, (_, i) => new Date().getFullYear() + i).map(year => (
                            <MenuItem key={year} value={year}>{year}</MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Box>
                  </Box>
                </Box>
              )}
            </Box>

            {/* Amount Section */}
            <Box sx={{ mb: 6 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" fontWeight="bold" color="#333">
                  Amount
                </Typography>
                <Switch 
                  checked={amountFilter} 
                  onChange={(e) => setAmountFilter(e.target.checked)}
                  sx={{
                    '& .MuiSwitch-track': {
                      backgroundColor: amountFilter ? '#4CAF50' : '#E0E0E0',
                      borderRadius: 22 / 2,
                      opacity: 1,
                      height: 22,
                    },
                    '& .MuiSwitch-thumb': {
                      backgroundColor: '#FFFFFF',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                      width: 18,
                      height: 18,
                    },
                    '& .MuiSwitch-switchBase': {
                      color: '#FFFFFF',
                      top: 4,
                      left: 2,
                    },
                  }}
                />
              </Box>
              
              {/* Amount Input Fields - Only show when amountFilter is enabled */}
              {amountFilter && (
                <Box sx={{ mt: 3 }}>
                  {/* Minimal Amount */}
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="body1" color="#333" sx={{ mb: 1 }}>
                      Minimal Amount
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <TextField
                        placeholder="000"
                        size="small"
                        value={minAmount.whole}
                        onChange={(e) => setMinAmount(prev => ({ ...prev, whole: e.target.value }))}
                        sx={{
                          flex: 1,
                          '& .MuiOutlinedInput-root': {
                            borderColor: '#004996',
                            '& fieldset': {
                              borderColor: '#004996',
                            },
                          },
                        }}
                      />
                      <TextField
                        placeholder="00"
                        size="small"
                        value={minAmount.decimal}
                        onChange={(e) => setMinAmount(prev => ({ ...prev, decimal: e.target.value }))}
                        sx={{
                          width: '80px',
                          '& .MuiOutlinedInput-root': {
                            borderColor: '#004996',
                            '& fieldset': {
                              borderColor: '#004996',
                            },
                          },
                        }}
                      />
                      <Typography variant="body1" color="#333">
                        €
                      </Typography>
                    </Box>
                  </Box>
                  
                  {/* Maximum Amount */}
                  <Box>
                    <Typography variant="body1" color="#333" sx={{ mb: 1 }}>
                      Maximum Amount
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <TextField
                        placeholder="000"
                        size="small"
                        value={maxAmount.whole}
                        onChange={(e) => setMaxAmount(prev => ({ ...prev, whole: e.target.value }))}
                        sx={{
                          flex: 1,
                          '& .MuiOutlinedInput-root': {
                            borderColor: '#004996',
                            '& fieldset': {
                              borderColor: '#004996',
                            },
                          },
                        }}
                      />
                      <TextField
                        placeholder="00"
                        size="small"
                        value={maxAmount.decimal}
                        onChange={(e) => setMaxAmount(prev => ({ ...prev, decimal: e.target.value }))}
                        sx={{
                          width: '80px',
                          '& .MuiOutlinedInput-root': {
                            borderColor: '#004996',
                            '& fieldset': {
                              borderColor: '#004996',
                            },
                          },
                        }}
                      />
                      <Typography variant="body1" color="#333">
                        €
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              )}
            </Box>

            {/* Show transactions Section */}
            <Box sx={{ mb: 6 }}>
              <Typography variant="h6" fontWeight="bold" color="#333" sx={{ mb: 2 }}>
                Show transactions
              </Typography>
              <Box sx={{ display: 'flex', gap: 1 }}>
                {['5', '10', '20', '30'].map((count) => (
                  <Button
                    key={count}
                    variant={transactionsCount === count ? 'contained' : 'outlined'}
                    onClick={() => setTransactionsCount(count)}
                    sx={{
                      flex: 1,
                      height: 36,
                      lineHeight: '36px',
                      backgroundColor: transactionsCount === count ? '#004996' : 'transparent',
                      color: transactionsCount === count ? 'white' : '#333',
                      borderColor: '#004996',
                      textTransform: 'none',
                      fontSize: '0.75rem',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      '&:hover': {
                        backgroundColor: transactionsCount === count ? '#004996' : 'rgba(0, 73, 150, 0.1)',
                      }
                    }}
                  >
                    {count} Transfers
                  </Button>
                ))}
              </Box>
            </Box>

            {/* Type of transaction Section */}
            <Box sx={{ mb: 6 }}>
              <Typography variant="h6" fontWeight="bold" color="#333" sx={{ mb: 2 }}>
                Type of transaction
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="body1" color="#333">
                    Debit transactions
                  </Typography>
                  <Switch 
                    checked={debitTransactions} 
                    onChange={(e) => setDebitTransactions(e.target.checked)}
                    sx={{
                      '& .MuiSwitch-track': {
                        backgroundColor: '#E0E0E0',
                        borderRadius: 22 / 2,
                        opacity: 1,
                        height: 22,
                      },
                      '& .MuiSwitch-thumb': {
                        backgroundColor: '#FFFFFF',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                        width: 18,
                        height: 18,
                      },
                      '& .MuiSwitch-switchBase': {
                        color: '#FFFFFF',
                        top: 4.2,
                        left: 2,
                      },
                      '& .MuiSwitch-switchBase.Mui-checked': {
                        color: '#4CAF50',
                      },
                      '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                        backgroundColor: '#4CAF50',
                      },
                    }}
                  />
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="body1" color="#333">
                    Credit transactions
                  </Typography>
                  <Switch 
                    checked={creditTransactions} 
                    onChange={(e) => setCreditTransactions(e.target.checked)}
                    sx={{
                      '& .MuiSwitch-track': {
                        backgroundColor: '#E0E0E0',
                        borderRadius: 22 / 2,
                        opacity: 1,
                        height: 22,
                      },
                      '& .MuiSwitch-thumb': {
                        backgroundColor: '#FFFFFF',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                        width: 18,
                        height: 18,
                      },
                      '& .MuiSwitch-switchBase': {
                        color: '#FFFFFF',
                        top: 4,
                        left: 2,
                      },
                      '& .MuiSwitch-switchBase.Mui-checked': {
                        color: '#4CAF50',
                      },
                      '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                        backgroundColor: '#4CAF50',
                      },
                    }}
                  />
                </Box>
              </Box>
            </Box>
            </Card>
          </Box>

          {/* Apply Button */}
          <Box sx={{ p: 3, borderTop: '1px solid #E0E0E0' }}>
            <Button
              variant="contained"
              fullWidth
              onClick={applyFilters}
              sx={{
                background: 'linear-gradient(45deg, #FC9F15, #FFB74D)',
                color: 'white',
                textTransform: 'none',
                borderRadius: 2,
                py: 1.5,
                fontWeight: 500,
                fontSize: '1.1rem',
                '&:hover': {
                  background: 'linear-gradient(45deg, #e58a0d, #FFA726)',
                }
              }}
            >
              Apply
              <ArrowForwardIcon sx={{ ml: 1 }} />
            </Button>
          </Box>
        </Box>
      </Modal>

      {/* Savings Goal Modal */}
      <Modal
        open={savingsGoalModalOpen}
        onClose={() => setSavingsGoalModalOpen(false)}
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
            width: '35%',
            height: '100vh',
            bgcolor: '#F3F3F3',
            borderRadius: '8px 0 0 8px',
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
            p: 3
          }}>
            <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#333' }}>
              Savings Goal Setting
            </Typography>
            <IconButton onClick={() => setSavingsGoalModalOpen(false)}>
              <CloseIcon />
            </IconButton>
          </Box>

          {/* Modal Content - White Container */}
          <Box sx={{ p: 8, flex: 1 }}>
            <Card sx={{
              backgroundColor: 'white',
              borderRadius: 2,
              p: 3,
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
            }}>
              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 3 }}>
                What are you saving for?
              </Typography>

              {/* Savings Goal Options Grid */}
              <Box sx={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(3, 1fr)', 
                gap: 2, 
                mb: 4 
              }}>
                {savingsGoalOptions.map((goal, index) => (
                  <Button
                    key={index}
                    variant="outlined"
                    onClick={() => handleSavingsGoalClick(goal)}
                    sx={{
                      py: 2,
                      px: 2,
                      borderColor: '#E0E0E0',
                      color: '#333',
                      backgroundColor: '#F5F5F5',
                      textTransform: 'none',
                      fontWeight: 'normal',
                      '&:hover': {
                        backgroundColor: '#E8E8E8',
                        borderColor: '#BDBDBD'
                      }
                    }}
                  >
                    {goal}
                  </Button>
                ))}
              </Box>

              {/* Custom Goal Button */}
              <Button
                variant="outlined"
                fullWidth
                onClick={handleCustomGoalClick}
                sx={{
                  py: 2,
                  borderColor: '#2196F3',
                  color: '#2196F3',
                  backgroundColor: '#E3F2FD',
                  textTransform: 'none',
                  fontWeight: 'normal',
                  '&:hover': {
                    backgroundColor: '#BBDEFB',
                    borderColor: '#1976D2'
                  }
                }}
              >
                Or define your own goal
              </Button>
            </Card>
          </Box>
        </Box>
      </Modal>

      {/* Savings Target Modal */}
      <Modal
        open={savingsTargetModalOpen}
        onClose={() => setSavingsTargetModalOpen(false)}
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
            width: '35%',
            height: '100vh',
            bgcolor: '#F3F3F3',
            borderRadius: '8px 0 0 8px',
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
            p: 3
          }}>
            <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#333' }}>
              Savings Goal Setting
            </Typography>
            <IconButton onClick={() => setSavingsTargetModalOpen(false)}>
              <CloseIcon />
            </IconButton>
          </Box>

          {/* Modal Content - White Container */}
          <Box sx={{ p: 8, flex: 1 }}>
            <Card sx={{
              backgroundColor: 'white',
              borderRadius: 2,
              p: 3,
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
            }}>
              {/* What are you saving for? Section */}
              <Box sx={{ mb: 4 }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
                  What are you saving for?
                </Typography>
                <TextField
                  fullWidth
                  label="Savings target name"
                  value={savingsTargetName}
                  onChange={(e) => setSavingsTargetName(e.target.value)}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': {
                        borderColor: '#2196F3',
                      },
                      '&:hover fieldset': {
                        borderColor: '#1976D2',
                      },
                    },
                    '& .MuiInputLabel-root': {
                      color: '#2196F3',
                    },
                  }}
                />
              </Box>

              {/* Amount Section */}
              <Box sx={{ mb: 4 }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
                  Amount
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <TextField
                    sx={{
                      flex: 1,
                      '& .MuiOutlinedInput-root': {
                        '& fieldset': {
                          borderColor: amountError ? '#d32f2f' : '#2196F3',
                        },
                        '&:hover fieldset': {
                          borderColor: amountError ? '#d32f2f' : '#1976D2',
                        },
                      },
                      '& .MuiInputBase-input::placeholder': {
                        color: '#999 !important',
                        opacity: '1 !important',
                      },
                    }}
                    value={amountWhole}
                    onChange={(e) => {
                      const value = e.target.value.replace(/[^0-9]/g, ''); // Only allow numbers
                      setAmountWhole(value);
                      if (amountError) setAmountError(''); // Clear error when user starts typing
                    }}
                    placeholder="000"
                    error={!!amountError}
                  />
                  <TextField
                    sx={{
                      width: '80px',
                      '& .MuiOutlinedInput-root': {
                        '& fieldset': {
                          borderColor: '#2196F3',
                        },
                        '&:hover fieldset': {
                          borderColor: '#1976D2',
                        },
                      },
                      '& .MuiInputBase-input::placeholder': {
                        color: '#999 !important',
                        opacity: '1 !important',
                      },
                    }}
                    value={amountDecimal}
                    onChange={(e) => {
                      const value = e.target.value.replace(/[^0-9]/g, ''); // Only allow numbers
                      setAmountDecimal(value);
                    }}
                    placeholder="00"
                    error={!!amountError}
                  />
                  <Typography variant="h6" sx={{ color: '#2196F3', fontWeight: 'bold' }}>
                    €
                  </Typography>
                </Box>
                {amountError && (
                  <Typography variant="caption" sx={{ color: '#d32f2f', mt: 1, display: 'block' }}>
                    {amountError}
                  </Typography>
                )}
                
              </Box>
            </Card>
          </Box>

          {/* Confirm Button */}
          <Box sx={{ p: 3, borderTop: '1px solid #E0E0E0' }}>
            <Button
              variant="contained"
              fullWidth
              onClick={handleConfirmSavingsTarget}
              sx={{
                background: 'linear-gradient(45deg, #FC9F15, #FFB74D)',
                color: 'white',
                textTransform: 'none',
                borderRadius: 2,
                py: 1.5,
                fontWeight: 500,
                fontSize: '1.1rem',
                '&:hover': {
                  background: 'linear-gradient(45deg, #e58a0d, #FFA726)',
                }
              }}
            >
              Confirm
              <ArrowForwardIcon sx={{ ml: 1 }} />
            </Button>
          </Box>
        </Box>
      </Modal>

      {/* Congratulations Modal */}
      <Modal
        open={congratulationsModalOpen}
        onClose={handleCloseCongratulations}
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
            width: '35%',
            height: '100vh',
            bgcolor: '#F3F3F3',
            borderRadius: '8px 0 0 8px',
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
            p: 3
          }}>
            <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#333' }}>
              Savings Goal Setting
            </Typography>
            <IconButton onClick={handleCloseCongratulations}>
              <CloseIcon />
            </IconButton>
          </Box>

          {/* Modal Content - White Container */}
          <Box sx={{ p: 8, flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Card sx={{
              backgroundColor: 'white',
              borderRadius: 2,
              p: 4,
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
              width: '100%'
            }}>
              {/* Checkmark Icon */}
              <Box
                sx={{
                  width: 80,
                  height: 80,
                  borderRadius: '50%',
                  backgroundColor: '#4CAF50',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mb: 3
                }}
              >
                <CheckCircleIcon 
                  sx={{ 
                    fontSize: 50, 
                    color: 'white' 
                  }} 
                />
              </Box>

              {/* Congratulations Heading */}
              <Typography 
                variant="h4" 
                sx={{ 
                  fontWeight: 'bold', 
                  color: '#4CAF50', 
                  mb: 2 
                }}
              >
                Congratulations!
              </Typography>

              {/* Success Message */}
              <Typography 
                variant="body1" 
                sx={{ 
                  color: '#333', 
                  mb: 4,
                  lineHeight: 1.5
                }}
              >
                You have successfully opened Savings Goal
              </Typography>

              {/* Done Button */}
              <Button
                variant="contained"
                fullWidth
                onClick={handleCloseCongratulations}
                sx={{
                  background: 'linear-gradient(45deg, #FC9F15, #FFB74D)',
                  color: 'white',
                  textTransform: 'none',
                  borderRadius: 2,
                  py: 1.5,
                  fontWeight: 500,
                  fontSize: '1.1rem',
                  '&:hover': {
                    background: 'linear-gradient(45deg, #e58a0d, #FFA726)',
                  }
                }}
              >
                Done
              </Button>
            </Card>
          </Box>
        </Box>
      </Modal>

    </Box>
  );
};

export default SaveOnlineAccount;
