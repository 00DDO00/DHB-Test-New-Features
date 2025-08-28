import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { apiService } from '../../services/api';
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
} from '@mui/icons-material';
import { Link } from 'react-router-dom';

const AccountStatement: React.FC = () => {
  const { t } = useTranslation();
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
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Mock transactions for fallback
  const mockTransactions = [
    { id: 1, date: '15-01-2024', description: 'Holder name', account: 'NL24DHBN2018470578', balance: '€ 1.250,00', type: 'credit' },
    { id: 2, date: '12-01-2024', description: 'Holder name', account: 'NL24DHBN2018470578', balance: '- € 500,00', type: 'debit' },
    { id: 3, date: '10-01-2024', description: 'Holder name', account: 'NL24DHBN2018470578', balance: '€ 750,00', type: 'credit' },
    { id: 4, date: '08-01-2024', description: 'Holder name', account: 'NL24DHBN2018470578', balance: '- € 300,00', type: 'debit' },
    { id: 5, date: '05-01-2024', description: 'Holder name', account: 'NL24DHBN2018470578', balance: '€ 2.000,00', type: 'credit' },
    { id: 6, date: '03-01-2024', description: 'Holder name', account: 'NL24DHBN2018470578', balance: '- € 150,00', type: 'debit' },
    { id: 7, date: '01-01-2024', description: 'Holder name', account: 'NL24DHBN2018470578', balance: '€ 1.500,00', type: 'credit' },
    { id: 8, date: '30-12-2023', description: 'Holder name', account: 'NL24DHBN2018470578', balance: '- € 800,00', type: 'debit' },
    { id: 9, date: '28-12-2023', description: 'Holder name', account: 'NL24DHBN2018470578', balance: '€ 3.200,00', type: 'credit' },
    { id: 10, date: '25-12-2023', description: 'Holder name', account: 'NL24DHBN2018470578', balance: '- € 450,00', type: 'debit' },
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
          date: txn.transactionDate,
          description: txn.description,
          account: 'NL24DHBN2018470578',
          balance: txn.amount > 0 ? `€ ${txn.amount.toFixed(2).replace('.', ',')}` : `- € ${Math.abs(txn.amount).toFixed(2).replace('.', ',')}`,
          type: txn.type.toLowerCase()
        }));

        setTransactions(transformedTransactions);
        setFilteredTransactions(transformedTransactions);
      } catch (error) {
        console.error('Failed to load transactions:', error);
        // Fallback to mock data
        setTransactions(mockTransactions);
        setFilteredTransactions(mockTransactions);
      } finally {
        setLoading(false);
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
      filtered = filtered.filter(t => t.type === 'credit');
    } else if (!creditTransactions) {
      filtered = filtered.filter(t => t.type === 'debit');
    }

    // Filter by amount if amount filter is enabled
    if (amountFilter) {
      const minAmountValue = parseFloat(`${minAmount.whole || 0}.${minAmount.decimal || '00'}`);
      const maxAmountValue = parseFloat(`${maxAmount.whole || 999999}.${maxAmount.decimal || '00'}`);

      filtered = filtered.filter(transaction => {
        // Extract numeric value from balance string
        // Remove €, spaces, and handle European number format (1.250,00 -> 1250.00)
        let balanceStr = transaction.balance.replace(/[€\s]/g, '');
        // Remove dots (thousand separators) and replace comma with dot (decimal separator)
        balanceStr = balanceStr.replace(/\./g, '').replace(',', '.');
        const balanceValue = parseFloat(balanceStr);
        // Use absolute value for filtering (ignore positive/negative sign)
        const absoluteValue = Math.abs(balanceValue);
        
        console.log(`Transaction: ${transaction.balance}, Parsed: ${balanceValue}, Absolute: ${absoluteValue}, Min: ${minAmountValue}, Max: ${maxAmountValue}`);
        
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
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `account_statement_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Breadcrumbs */}
      <Breadcrumbs sx={{ mb: 3 }}>
        <MuiLink component={Link} to="/" color="inherit" sx={{ textDecoration: 'none' }}>
          {t('home')}
        </MuiLink>
        <MuiLink component={Link} to="/accounts" color="inherit" sx={{ textDecoration: 'none' }}>
          {t('accounts.title')}
        </MuiLink>
        <MuiLink component={Link} to="/accounts/saveonline" color="inherit" sx={{ textDecoration: 'none' }}>
          {t('account-statements.select-account.title.saveOnline')}
        </MuiLink>
        <Typography color="text.primary">{t('account-statement')}</Typography>
      </Breadcrumbs>



      {/* Account Statement Section */}
      <Card>
        <CardContent>
          {/* Header */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Box>
              <Typography variant="h5" fontWeight="bold" sx={{ mb: 1 }}>
                {t('account-statement')}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                NN-LLL-NNNN - NN-LLL-NNNN
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <IconButton size="small" onClick={downloadAccountStatement}>
                  <DownloadIcon />
                </IconButton>
                <Typography variant="caption" color="text.secondary">
                  {t('accounts.download')}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <IconButton size="small" onClick={() => setFilterPopupOpen(true)}>
                  <FilterIcon />
                </IconButton>
                <Typography variant="caption" color="text.secondary">
                  {t('account-history.filter-button')}
                </Typography>
              </Box>
            </Box>
          </Box>

          {/* Table */}
          <TableContainer component={Paper} variant="outlined">
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell><strong>{t('statement-date')}</strong></TableCell>
                  <TableCell><strong>{t('payments.explanation')}</strong></TableCell>
                  <TableCell align="right"><strong>{t('accounts.balance')}</strong></TableCell>
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

          {/* Pagination */}
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            mt: 3, 
            p: 2, 
            borderTop: '1px solid #e0e0e0',
            bgcolor: '#f9f9f9'
          }}>
            <IconButton size="small">
              <ArrowForwardIcon sx={{ transform: 'rotate(180deg)' }} />
            </IconButton>
            <Typography variant="body2" sx={{ mx: 2 }}>
              1-{(filteredTransactions.length > 0 ? filteredTransactions : mockTransactions).length} out of {(filteredTransactions.length > 0 ? filteredTransactions : mockTransactions).length}
            </Typography>
            <IconButton size="small">
              <ArrowForwardIcon />
            </IconButton>
          </Box>
        </CardContent>
      </Card>

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
              {t('account-history.filter-button')}
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
                    {t('period')}
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
                      {period === '6 month' ? t('six_months') : period === 'today' ? t('today') : period === 'week' ? t('week') : period === 'month' ? t('month') : period}
                    </Button>
                  ))}
                </Box>
                
                {/* Value Date Section - Only show when periodFilterEnabled is enabled */}
                {periodFilterEnabled && (
                  <Box sx={{ mt: 3, mb: 6 }}>
                    {/* Value Date From */}
                    <Box sx={{ mb: 3 }}>
                      <Typography variant="body1" color="#333" sx={{ mb: 1 }}>
                        {t('rates-calculate.value-date')}: {t('from')}
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
    </Box>
  );
};

export default AccountStatement;
