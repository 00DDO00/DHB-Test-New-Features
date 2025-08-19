import React, { useState } from 'react';
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
    setShowFinalConfirmation(false);
    setErrors({});
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
    setModalOpen(false);
    setShowTransactionStatus(false);
    setShowFinalConfirmation(false);
    setErrors({});
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
    { icon: <SettingsIcon />, label: 'Savings Goal Setting', href: '#' },
    { icon: <PeopleIcon />, label: 'Counteraccount change', href: '#' },
    { icon: <FileUploadIcon />, label: 'Transcript download', href: '#' },
    { icon: <TrackChangesIcon />, label: 'Set savings target', href: '#' },
    { icon: <TuneIcon />, label: 'Adjustment', href: '#' },
    { icon: <CloseIcon />, label: 'Account Closure', href: '#' },
  ];

  return (
    <Box sx={{ p: 3 }}>
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

      {/* Account Summary - Full Width Blue Card */}
      <Card sx={{ mb: 0, backgroundColor: '#004996', color: 'white' }}>
        <CardContent>
          <Grid container alignItems="center" justifyContent="space-between">
            <Grid item xs={12} md={8}>
              <Typography variant="h6" sx={{ mb: 1 }}>
                Holder name
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.8 }}>
                NL24DHBN2018470578
              </Typography>
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
                € 2.000,00
              </Typography>
              <Box sx={{ mt: 2 }}>
                <Typography variant="body2" sx={{ mb: 0.5 }}>
                  <strong>Balance class:</strong> EUR 0,00 t/m EUR 100.000,00
                </Typography>
                <Typography variant="body2">
                  <strong>Rente:</strong> 1.7%
                </Typography>
                <Typography variant="body2">
                  <strong>Balance class:</strong> EUR 100.000,01 t/m EUR 500.000,00
                </Typography>
                <Typography variant="body2">
                  <strong>Rente:</strong> 1.7%
                </Typography>
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
        borderRadius: '0 0 8px 8px'
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
            <Typography variant="body2" color="text.secondary">
              No scheduled transfers found.
            </Typography>
          </TabPanel>

          {/* Account Transfers Table - Inside the same frame */}
          <Box sx={{ mt: 4 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">Account transfers</Typography>
              <Box>
                <IconButton size="small" sx={{ mr: 1 }}>
                  <DownloadIcon />
                </IconButton>
                <IconButton size="small">
                  <FilterIcon />
                </IconButton>
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
                  {transactions.map((transaction, index) => (
                    <TableRow key={index}>
                      <TableCell>{transaction.date}</TableCell>
                      <TableCell>{transaction.description}</TableCell>
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
                to="#"
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
        <Box sx={{ width: '300px', p: 3, backgroundColor: '#E6EDF5' }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4, pt: 4, alignItems: 'center' }}>
            {quickActions.map((action, index) => (
              <MuiLink
                key={index}
                href={action.href}
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
              </MuiLink>
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
    </Box>
  );
};

export default SaveOnlineAccount;
