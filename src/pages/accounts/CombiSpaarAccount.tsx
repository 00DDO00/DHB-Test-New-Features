import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Button,
  Breadcrumbs,
  Link as MuiLink,
  Modal,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Radio,
  RadioGroup,
  FormControlLabel,
  IconButton,
  Checkbox,
} from '@mui/material';
import {
  Add,
  Close,
  KeyboardArrowDown,
  Check,
  ContentCopy,
  ArrowForward,
} from '@mui/icons-material';
import { Link } from 'react-router-dom';

const CombiSpaarAccount: React.FC = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState<any>(null);
  const [amount, setAmount] = useState({ whole: '', decimal: '' });
  const [noticePeriodDestination, setNoticePeriodDestination] = useState('combispaar');
  const [showSummary, setShowSummary] = useState(false);
  const [showFinalConfirmation, setShowFinalConfirmation] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [selectedIban, setSelectedIban] = useState('');
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  
  // API data states
  const [pageData, setPageData] = useState<any>(null);
  const [accountOptions, setAccountOptions] = useState<any[]>([]);
  const [ibanOptions, setIbanOptions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);



  const handleOpenAccount = (accountType: string) => {
    const option = accountOptions.find(opt => opt.id === accountType);
    setSelectedOption(option);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedOption(null);
    setAmount({ whole: '', decimal: '' });
    setNoticePeriodDestination('combispaar');
    setShowSummary(false);
    setShowFinalConfirmation(false);
    setTermsAccepted(false);
    setSelectedIban('');
    setErrors({});
  };

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};

    if (!selectedIban) {
      newErrors.iban = 'Please select an IBAN';
    }

    if (!selectedOption) {
      newErrors.noticePeriod = 'Please select a notice period';
    }

    if (!amount.whole && !amount.decimal) {
      newErrors.amount = 'Amount is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleProceed = () => {
    if (validateForm()) {
      setShowSummary(true);
    }
  };

  const handleEditTransaction = () => {
    setShowSummary(false);
  };

  const handleConfirmTransaction = () => {
    // Check if terms are accepted
    if (!termsAccepted) {
      setErrors({ terms: 'Please accept the Terms and Conditions' });
      return;
    }
    // Show final confirmation popup
    setShowFinalConfirmation(true);
  };

  const handleFinalDone = () => {
    // Handle the final confirmation
    console.log('Transaction confirmed:', {
      selectedOption,
      amount,
      noticePeriodDestination
    });
    handleCloseModal();
  };

  const handleAmountChange = (field: string, value: string) => {
    setAmount(prev => ({ ...prev, [field]: value }));
  };

  const calculateMaturityDate = () => {
    if (!selectedOption) return '';
    const today = new Date();
    const maturityDate = new Date(today);
    maturityDate.setDate(today.getDate() + selectedOption.days);
    return maturityDate.toLocaleDateString('en-GB', { 
      day: 'numeric', 
      month: 'short', 
      year: 'numeric' 
    });
  };

  const calculateValueDate = () => {
    if (!selectedOption) return '';
    const today = new Date();
    const valueDate = new Date(today);
    valueDate.setFullYear(today.getFullYear() + 1);
    return valueDate.toLocaleDateString('en-GB', { 
      day: 'numeric', 
      month: 'short', 
      year: 'numeric' 
    });
  };

  const getSelectedIbanDetails = () => {
    return ibanOptions.find(option => option.iban === selectedIban) || ibanOptions[0];
  };

  // Fetch data from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        const headers = {
          'Content-Type': 'application/json',
          'channelCode': 'WEB',
          'username': 'testuser',
          'lang': 'en',
          'countryCode': 'NL',
          'sessionId': 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
          'customerId': 'CUST001'
        };
        
        // Fetch page data
        const pageResponse = await fetch('http://localhost:5003/api/combispaar/page-data', {
          headers
        });
        const pageData = await pageResponse.json();
        
        // Fetch account options
        const accountResponse = await fetch('http://localhost:5003/api/combispaar/account-options', {
          headers
        });
        const accountData = await accountResponse.json();
        
        // Fetch IBAN options
        const ibanResponse = await fetch('http://localhost:5003/api/combispaar/iban-options', {
          headers
        });
        const ibanData = await ibanResponse.json();
        
        if (pageData.success) {
          setPageData(pageData.data);
        }
        
        if (accountData.success) {
          setAccountOptions(accountData.data);
        }
        
        if (ibanData.success) {
          setIbanOptions(ibanData.data);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

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
        DHB CombiSpaar Account
      </Typography>
      {/* Breadcrumbs */}
      <Breadcrumbs sx={{ mb: 3 }}>
        <MuiLink 
          component={Link}
          to="/private" 
          color="inherit" 
          underline="hover"
          sx={{ cursor: 'pointer' }}
        >
          {pageData?.breadcrumbs?.home || 'Home'}
        </MuiLink>
        <MuiLink color="inherit" underline="hover" sx={{ cursor: 'pointer' }}>
          {pageData?.breadcrumbs?.accounts || 'Accounts'}
        </MuiLink>
        <MuiLink color="inherit" underline="hover" sx={{ cursor: 'pointer' }}>
          {pageData?.breadcrumbs?.open_account || 'Open account'}
        </MuiLink>
        <Typography color="text.primary" fontWeight="bold">
          {pageData?.page_title || 'DHB CombiSpaarrekening'}
        </Typography>
      </Breadcrumbs>

      {/* DHB SaveOnline Account Details */}
      <Card sx={{ mb: 3, backgroundColor: 'white' }}>
        <CardContent sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h4" color="#004996" fontWeight="bold">
              {pageData?.accountName || 'DHB SaveOnline'}
            </Typography>
            <Box sx={{ textAlign: 'right' }}>
              <Typography variant="h5" fontWeight="bold" sx={{ mb: 1 }}>
                {pageData?.balance || '€ 0,00'}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                IBAN Number: {pageData?.iban || 'NL24DHBN2018470578'}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Cumulative Interest Amount: {pageData?.interestRate || '1.1%'}
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* Account Description */}
      <Card sx={{ mb: 3, backgroundColor: 'white', borderRadius: 2, boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
        <CardContent sx={{ p: 3 }}>
          <Typography variant="h5" fontWeight="bold" sx={{ mb: 2, color: '#333' }}>
            {pageData?.title || 'Save and still be able to withdraw money'}
          </Typography>
          <Typography variant="body1" color="#666" sx={{ lineHeight: 1.6 }}>
            {pageData?.description || 'The DHB CombiSpaarrekening offers a higher interest rate than the DHB SaveOnline because withdrawals are planned in advance. Depending on the chosen account, you can give 33, 66, or 99 days\' notice for withdrawals. A longer notice period results in a higher interest rate.'}
          </Typography>
        </CardContent>
      </Card>

      {/* Account Options Cards */}
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
          <Typography>Loading account options...</Typography>
        </Box>
      ) : (
        <Grid container spacing={3}>
          {accountOptions.map((option) => (
          <Grid item xs={12} md={4} key={option.id}>
            <Card sx={{ 
              backgroundColor: 'white', 
              borderRadius: 2, 
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              height: '100%',
              display: 'flex',
              flexDirection: 'column'
            }}>
              <CardContent sx={{ p: 3, flex: 1, display: 'flex', flexDirection: 'column' }}>
                {/* Account Details */}
                <Box sx={{ mb: 3, flex: 1 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="body2" color="#666">Balance Class</Typography>
                    <Typography variant="body2" fontWeight="medium">{option.balanceClass}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="body2" color="#666">Notice Period</Typography>
                    <Typography variant="body2" fontWeight="medium">{option.noticePeriod}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="body2" color="#666">Interest</Typography>
                    <Typography variant="body2" fontWeight="medium" color="#4CAF50">{option.interest}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="body2" color="#666">Valid from</Typography>
                    <Typography variant="body2" fontWeight="medium">{option.validFrom}</Typography>
                  </Box>
                </Box>

                {/* Open Account Button */}
                <Button
                  variant="contained"
                  startIcon={<Add />}
                  onClick={() => handleOpenAccount(option.id)}
                  sx={{
                    backgroundColor: '#FC9F15',
                    color: 'white',
                    textTransform: 'none',
                    borderRadius: 2,
                    py: 1.5,
                    fontWeight: 500,
                    width: '100%',
                    '&:hover': {
                      backgroundColor: '#e58a0d'
                    }
                  }}
                >
                  Open account +
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
        </Grid>
      )}

      {/* Account Opening Modal */}
      <Modal
        open={modalOpen}
        onClose={handleCloseModal}
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
          flexDirection: 'column'
        }}>
          {/* Modal Header */}
          <Box sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            p: 3,
            borderBottom: '1px solid #E0E0E0'
          }}>
            <Typography variant="h5" fontWeight="bold" color="#333">
              Account opening
            </Typography>
            <IconButton onClick={handleCloseModal}>
              <Close />
            </IconButton>
          </Box>

          {/* Modal Content */}
          <Box sx={{ p: 3, flex: 1 }}>
            {!showSummary && !showFinalConfirmation ? (
              /* Form Content */
              <Card sx={{ backgroundColor: 'white', borderRadius: 2, p: 3 }}>
              {/* IBAN Section */}
              <Box sx={{ mb: 3 }}>
                <Typography variant="body2" color="#004996" fontWeight="medium" sx={{ mb: 1 }}>
                  IBAN
                </Typography>
                <FormControl fullWidth>
                  <Select
                    value={selectedIban}
                    onChange={(e) => setSelectedIban(e.target.value)}
                    displayEmpty
                    size="small"
                    sx={{ 
                      backgroundColor: '#F9F9F9',
                      '& .MuiOutlinedInput-root': {
                        '& fieldset': {
                          borderColor: '#004996',
                        },
                      }
                    }}
                  >
                    {ibanOptions.map((option) => (
                      <MenuItem key={option.iban} value={option.iban}>
                        {option.iban}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                {selectedIban && (
                  <Box sx={{ mt: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2" color="#666">Balance</Typography>
                      <Typography variant="body2" fontWeight="medium">{getSelectedIbanDetails().balance}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2" color="#666">Account</Typography>
                      <Typography variant="body2" fontWeight="medium">{getSelectedIbanDetails().accountType}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body2" color="#666">Account holder(s)</Typography>
                      <Typography variant="body2" fontWeight="medium">{getSelectedIbanDetails().accountHolder}</Typography>
                    </Box>
                  </Box>
                )}
              </Box>

              {/* Amount Entry Section */}
              <Box sx={{ mb: 3 }}>
                <Typography variant="body2" color="#004996" fontWeight="medium" sx={{ mb: 2 }}>
                  Amount entry
                </Typography>
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 1
                }}>
                  <TextField
                    value={amount.whole}
                    onChange={(e) => handleAmountChange('whole', e.target.value)}
                    placeholder="000"
                    size="small"
                    sx={{ width: '220px' }}
                    inputProps={{ style: { textAlign: 'center' } }}
                  />
                  <Typography variant="h6">,</Typography>
                  <TextField
                    value={amount.decimal}
                    onChange={(e) => handleAmountChange('decimal', e.target.value)}
                    placeholder="00"
                    size="small"
                    sx={{ width: '140px' }}
                    inputProps={{ style: { textAlign: 'center' } }}
                  />
                  <Box sx={{ ml: 4 }}>
                    <Typography variant="h6">€</Typography>
                  </Box>
                </Box>
              </Box>

              {/* Notice Period Dropdown */}
              <Box sx={{ mb: 3 }}>
                <Typography variant="body2" color="#004996" fontWeight="medium" sx={{ mb: 1 }}>
                  Notice period
                </Typography>
                <FormControl fullWidth>
                  <Select
                    value={selectedOption ? selectedOption.id : ''}
                    onChange={(e) => {
                      const option = accountOptions.find(opt => opt.id === e.target.value);
                      setSelectedOption(option || null);
                    }}
                    displayEmpty
                    size="small"
                    sx={{ 
                      backgroundColor: 'white',
                      '& .MuiOutlinedInput-root': {
                        '& fieldset': {
                          borderColor: '#004996',
                        },
                      }
                    }}
                  >
                    {accountOptions.map((option) => (
                      <MenuItem key={option.id} value={option.id}>
                        {option.days} days ({option.interest})
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>

              {/* Date Fields */}
              <Box sx={{ mb: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <Typography variant="body2" color="#666">Maturity Date</Typography>
                  <Typography variant="body2" fontWeight="medium">{calculateMaturityDate()}</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2" color="#666">Value Date</Typography>
                  <Typography variant="body2" fontWeight="medium">{calculateValueDate()}</Typography>
                </Box>
              </Box>

              {/* Account destination Options */}
              <Box sx={{ mb: 3 }}>
                <Typography variant="body2" color="#004996" fontWeight="medium" sx={{ mb: 2 }}>
                  Account destination
                </Typography>
                <RadioGroup
                  value={noticePeriodDestination}
                  onChange={(e) => setNoticePeriodDestination(e.target.value)}
                >
                  <Box sx={{ 
                    border: '1px solid #004996', 
                    borderRadius: 1, 
                    p: 1.5,
                    backgroundColor: '#F9F9F9',
                    mb: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    cursor: 'pointer'
                  }} onClick={() => setNoticePeriodDestination('combispaar')}>
                    <Typography variant="body1">
                      To my CombiSpaar Account
                    </Typography>
                    <Box sx={{
                      width: 20,
                      height: 20,
                      borderRadius: '50%',
                      border: '2px solid #004996',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: noticePeriodDestination === 'combispaar' ? '#004996' : 'transparent'
                    }}>
                      {noticePeriodDestination === 'combispaar' && (
                        <Check sx={{ color: 'white', fontSize: 14 }} />
                      )}
                    </Box>
                  </Box>
                  <Box sx={{ 
                    border: '1px solid #004996', 
                    borderRadius: 1, 
                    p: 1.5,
                    backgroundColor: '#F9F9F9',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    cursor: 'pointer'
                  }} onClick={() => setNoticePeriodDestination('counter')}>
                    <Typography variant="body1">
                      To my Counter Account
                    </Typography>
                    <Box sx={{
                      width: 20,
                      height: 20,
                      borderRadius: '50%',
                      border: '2px solid #004996',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: noticePeriodDestination === 'counter' ? '#004996' : 'transparent'
                    }}>
                      {noticePeriodDestination === 'counter' && (
                        <Check sx={{ color: 'white', fontSize: 14 }} />
                      )}
                    </Box>
                  </Box>
                </RadioGroup>
              </Box>
                {/* Proceed Button */}
                <Button
                  variant="contained"
                  fullWidth
                  onClick={handleProceed}
                  sx={{
                    backgroundColor: '#FC9F15',
                    color: 'white',
                    textTransform: 'none',
                    borderRadius: 2,
                    py: 1.5,
                    fontWeight: 500,
                    mt: 3,
                    '&:hover': {
                      backgroundColor: '#e58a0d'
                    }
                  }}
                >
                  Proceed
                </Button>
                {errors.iban && (
                  <Typography color="error" variant="body2" sx={{ mt: 1, textAlign: 'center' }}>
                    {errors.iban}
                  </Typography>
                )}
                {errors.noticePeriod && (
                  <Typography color="error" variant="body2" sx={{ mt: 1, textAlign: 'center' }}>
                    {errors.noticePeriod}
                  </Typography>
                )}
                {errors.amount && (
                  <Typography color="error" variant="body2" sx={{ mt: 1, textAlign: 'center' }}>
                    {errors.amount}
                  </Typography>
                )}
              </Card>
            ) : showSummary && !showFinalConfirmation ? (
              /* Summary Content */
              <Box>
                <Typography variant="h5" fontWeight="bold" sx={{ mb: 3, color: '#333' }}>
                  Account details
                </Typography>
                
                {/* Account Details Card */}
                <Card sx={{ 
                  backgroundColor: 'white', 
                  borderRadius: 2, 
                  p: 3, 
                  mb: 3,
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                }}>
                  <Box sx={{ mb: 3 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                      <Typography variant="body2" color="#666">Selected account</Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="body2" fontWeight="bold">{selectedIban}</Typography>
                        <IconButton size="small" sx={{ p: 0 }}>
                          <ContentCopy sx={{ fontSize: 16, color: '#666' }} />
                        </IconButton>
                      </Box>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                      <Typography variant="body2" color="#666">Balance</Typography>
                      <Typography variant="body2" fontWeight="bold">{getSelectedIbanDetails().balance}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                      <Typography variant="body2" color="#666">Account holder(s)</Typography>
                      <Typography variant="body2" fontWeight="bold">{getSelectedIbanDetails().accountHolder}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                      <Typography variant="body2" color="#666">Amount</Typography>
                      <Typography variant="body2" fontWeight="bold">
                        € {amount.whole || '--.---'},{amount.decimal || '--'}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                      <Typography variant="body2" color="#666">Maturity Date</Typography>
                      <Typography variant="body2" fontWeight="bold">{calculateMaturityDate()}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                      <Typography variant="body2" color="#666">Value Date</Typography>
                      <Typography variant="body2" fontWeight="bold">{calculateValueDate()}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                      <Typography variant="body2" color="#666">Term</Typography>
                      <Typography variant="body2" fontWeight="bold">
                        {selectedOption ? `${selectedOption.days} dagen` : ''}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                      <Typography variant="body2" color="#666">Interest Rate</Typography>
                      <Typography variant="body2" fontWeight="bold">
                        {selectedOption ? selectedOption.interest : ''}
                      </Typography>
                    </Box>
                  </Box>

                  {/* Edit Link */}
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, cursor: 'pointer' }} onClick={handleEditTransaction}>
                    <Typography variant="body2" color="#004996" sx={{ textDecoration: 'underline' }}>
                      Edit
                    </Typography>
                    <ArrowForward sx={{ fontSize: 16, color: '#004996' }} />
                  </Box>
                </Card>

                {/* Disclaimer Card */}
                <Card sx={{ 
                  backgroundColor: '#F5F5F5', 
                  borderRadius: 2, 
                  p: 2,
                  mb: 3
                }}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={termsAccepted}
                        onChange={(e) => setTermsAccepted(e.target.checked)}
                        sx={{
                          color: '#004996',
                          '&.Mui-checked': {
                            color: '#004996',
                          },
                        }}
                      />
                    }
                    label={
                      <Typography variant="body2" color="#666" sx={{ lineHeight: 1.5 }}>
                        We accept the{' '}
                        <MuiLink href="#" sx={{ color: '#004996', textDecoration: 'underline' }}>
                          Terms and Conditions
                        </MuiLink>
                        {' '}of DHB Bank CombiSpaar Account and acknowledge the receipt of the{' '}
                        <MuiLink href="#" sx={{ color: '#004996', textDecoration: 'underline' }}>
                          Depositor Information Template
                        </MuiLink>.
                      </Typography>
                    }
                    sx={{ alignItems: 'flex-start', margin: 0 }}
                  />
                </Card>

                {/* Confirm Button */}
                <Button
                  variant="contained"
                  fullWidth
                  onClick={handleConfirmTransaction}
                  sx={{
                    backgroundColor: '#FC9F15',
                    color: 'white',
                    textTransform: 'none',
                    borderRadius: 2,
                    py: 1.5,
                    fontWeight: 500,
                    '&:hover': {
                      backgroundColor: '#e58a0d'
                    }
                  }}
                >
                  Confirm
                </Button>
                {errors.terms && (
                  <Typography color="error" variant="body2" sx={{ mt: 1, textAlign: 'center' }}>
                    {errors.terms}
                  </Typography>
                )}
              </Box>
            ) : showFinalConfirmation ? (
              /* Final Confirmation Content */
              <Card sx={{ backgroundColor: 'white', borderRadius: 2, p: 3, textAlign: 'center' }}>
                {/* Success Icon */}
                <Box sx={{
                  width: 80,
                  height: 80,
                  borderRadius: '50%',
                  backgroundColor: '#4CAF50',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto',
                  mb: 3
                }}>
                  <Check sx={{ color: 'white', fontSize: 40 }} />
                </Box>

                {/* Heading */}
                <Typography variant="h5" fontWeight="bold" sx={{ mb: 2, color: '#2E7D32' }}>
                  Congratulations!
                </Typography>

                {/* Body Text */}
                <Typography variant="body1" sx={{ mb: 4, color: '#333' }}>
                  You have successfully opened your account with DHB CombiSpaar
                </Typography>

                {/* Done Button */}
                <Button
                  variant="contained"
                  fullWidth
                  onClick={handleFinalDone}
                  sx={{
                    backgroundColor: '#F5A623',
                    color: 'white',
                    textTransform: 'none',
                    borderRadius: 2,
                    py: 1.5,
                    fontWeight: 500,
                    '&:hover': {
                      backgroundColor: '#e6951a'
                    }
                  }}
                >
                  Done
                </Button>
              </Card>
            ) : null}
          </Box>
        </Box>
      </Modal>
    </Box>
  );
};

export default CombiSpaarAccount;
