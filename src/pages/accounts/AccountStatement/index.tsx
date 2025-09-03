import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { apiService } from '../../../services/api';
import {
  Box,
  Card,
  CardContent,
} from '@mui/material';
import { Transaction, AmountFilter } from './types';

// Import section components
import BreadcrumbsSection from './BreadcrumbsSection';
import AccountStatementHeaderSection from './AccountStatementHeaderSection';
import TransactionTableSection from './TransactionTableSection';
import FilterModalSection from './FilterModalSection';

const AccountStatement: React.FC = () => {
  const { t } = useTranslation();
  const [filterPopupOpen, setFilterPopupOpen] = useState(false);
  const [periodFilter, setPeriodFilter] = useState('today');
  const [periodFilterEnabled, setPeriodFilterEnabled] = useState(false);
  const [amountFilter, setAmountFilter] = useState(false);
  const [minAmount, setMinAmount] = useState<AmountFilter>({ whole: '', decimal: '' });
  const [maxAmount, setMaxAmount] = useState<AmountFilter>({ whole: '', decimal: '' });
  const [transactionsCount, setTransactionsCount] = useState('10');
  const [debitTransactions, setDebitTransactions] = useState(true);
  const [creditTransactions, setCreditTransactions] = useState(true);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([]);

  // Mock transactions for fallback
  const mockTransactions: Transaction[] = [
    { id: 1, date: '15-01-2024', description: 'Holder name', account: 'NL24DHBN2018470578', balance: '€ 1.250,00', type: 'credit' },
    { id: 2, date: '14-01-2024', description: 'Salary payment', account: 'NL24DHBN2018470578', balance: '€ 2.500,00', type: 'credit' },
    { id: 3, date: '13-01-2024', description: 'Online purchase', account: 'NL24DHBN2018470578', balance: '€ -125,50', type: 'debit' },
    { id: 4, date: '12-01-2024', description: 'ATM withdrawal', account: 'NL24DHBN2018470578', balance: '€ -100,00', type: 'debit' },
    { id: 5, date: '11-01-2024', description: 'Transfer to savings', account: 'NL24DHBN2018470578', balance: '€ -500,00', type: 'debit' },
    { id: 6, date: '10-01-2024', description: 'Interest payment', account: 'NL24DHBN2018470578', balance: '€ 15,75', type: 'credit' },
    { id: 7, date: '09-01-2024', description: 'Utility bill', account: 'NL24DHBN2018470578', balance: '€ -85,30', type: 'debit' },
    { id: 8, date: '08-01-2024', description: 'Grocery shopping', account: 'NL24DHBN2018470578', balance: '€ -67,89', type: 'debit' },
    { id: 9, date: '07-01-2024', description: 'Refund', account: 'NL24DHBN2018470578', balance: '€ 45,00', type: 'credit' },
    { id: 10, date: '06-01-2024', description: 'Subscription fee', account: 'NL24DHBN2018470578', balance: '€ -19,99', type: 'debit' }
  ];

  // Load transactions from YAML API
  useEffect(() => {
    const loadTransactions = async () => {
      try {
        // Use YAML endpoint to get account statement
        const statementData = await apiService.getAccountStatement('2018470578', 0, 50);
        
        // Transform YAML data to match expected format
        const transformedTransactions = statementData.transactions.map((txn: any, index: number) => ({
          id: index + 1,
          date: txn.transactionDate || txn.date,
          description: txn.description || txn.narration,
          account: txn.accountNumber || 'NL24DHBN2018470578',
          balance: `€ ${txn.amount || txn.balance}`,
          type: (txn.amount && txn.amount.startsWith('-')) ? 'debit' : 'credit'
        }));
        
        setTransactions(transformedTransactions);
        setFilteredTransactions(transformedTransactions);
      } catch (error) {
        console.error('Failed to load transactions:', error);
        // Fallback to mock data
        setTransactions(mockTransactions);
        setFilteredTransactions(mockTransactions);
      }
    };

    loadTransactions();
  }, []);

  const applyFilters = () => {
    let filtered = [...transactions];

    // Filter by transaction type
    if (!debitTransactions && !creditTransactions) {
      filtered = [];
    } else if (!debitTransactions) {
      filtered = filtered.filter(transaction => transaction.type === 'credit');
    } else if (!creditTransactions) {
      filtered = filtered.filter(transaction => transaction.type === 'debit');
    }

    // Filter by amount if amount filter is enabled
    if (amountFilter) {
      const minAmountValue = parseFloat(`${minAmount.whole || 0}.${minAmount.decimal || '00'}`);
      const maxAmountValue = parseFloat(`${maxAmount.whole || 999999}.${maxAmount.decimal || '99'}`);
      
      filtered = filtered.filter(transaction => {
        // Extract numeric value from balance string
        // Remove €, spaces, and handle European number format (1.250,00 -> 1250.00)
        let balanceStr = transaction.balance.replace(/[€\s]/g, '');
        // Remove dots (thousand separators) and replace comma with dot (decimal separator)
        balanceStr = balanceStr.replace(/\./g, '').replace(',', '.');
        const balanceValue = parseFloat(balanceStr);
        // Use absolute value for filtering (ignore positive/negative sign)
        const absoluteValue = Math.abs(balanceValue);
        
        return absoluteValue >= minAmountValue && absoluteValue <= maxAmountValue;
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
    const dataToDownload = filteredTransactions.length > 0 ? filteredTransactions : mockTransactions;
    
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
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', 'account_statement.csv');
    }
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Box sx={{ p: 3 }}>
      <BreadcrumbsSection />

      {/* Account Statement Section */}
      <Card>
        <CardContent>
          <AccountStatementHeaderSection
            onDownload={downloadAccountStatement}
            onFilterOpen={() => setFilterPopupOpen(true)}
          />

          <TransactionTableSection
            transactions={mockTransactions}
            filteredTransactions={filteredTransactions}
          />
        </CardContent>
      </Card>

      <FilterModalSection
        open={filterPopupOpen}
        onClose={() => setFilterPopupOpen(false)}
        periodFilter={periodFilter}
        setPeriodFilter={setPeriodFilter}
        periodFilterEnabled={periodFilterEnabled}
        setPeriodFilterEnabled={setPeriodFilterEnabled}
        amountFilter={amountFilter}
        setAmountFilter={setAmountFilter}
        minAmount={minAmount}
        setMinAmount={setMinAmount}
        maxAmount={maxAmount}
        setMaxAmount={setMaxAmount}
        transactionsCount={transactionsCount}
        setTransactionsCount={setTransactionsCount}
        debitTransactions={debitTransactions}
        setDebitTransactions={setDebitTransactions}
        creditTransactions={creditTransactions}
        setCreditTransactions={setCreditTransactions}
        onApplyFilters={applyFilters}
      />
    </Box>
  );
};

export default AccountStatement;
