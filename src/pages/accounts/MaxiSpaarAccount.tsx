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
  Home as HomeIcon,
  KeyboardArrowDown,
  Check,
  ContentCopy,
  ArrowForward,
} from '@mui/icons-material';
import { Link, useNavigate } from 'react-router-dom';
import { apiService } from '../../services/api';

interface MaxiSpaarOption {
  id: string;
  term: string;
  interest: string;
  validFrom: string;
  balanceClass: string;
  days: number;
}

const MaxiSpaarAccount: React.FC = () => {
  const navigate = useNavigate();
  const [accountData, setAccountData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  // Modal states
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState<any>(null);
  const [amount, setAmount] = useState({ whole: '', decimal: '' });
  const [showSummary, setShowSummary] = useState(false);
  const [show2FA, setShow2FA] = useState(false);
  const [showFinalConfirmation, setShowFinalConfirmation] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [selectedIban, setSelectedIban] = useState('');
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  
  // 2FA states
  const [verificationCode, setVerificationCode] = useState(['', '', '', '', '', '']);
  const [generatedCode, setGeneratedCode] = useState('');
  const [isCodeSent, setIsCodeSent] = useState(false);
  
  // IBAN options state
  const [ibanOptions, setIbanOptions] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await apiService.getMaxiSpaarPageData();
        setAccountData(data);
        
        // Fetch IBAN options with proper headers
        const headers = {
          'Content-Type': 'application/json',
          'channelCode': 'WEB',
          'username': 'testuser',
          'lang': 'en',
          'countryCode': 'NL',
          'sessionId': 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
          'customerId': 'CUST001'
        };
        
        const ibanResponse = await fetch('http://localhost:5003/api/combispaar/iban-options', {
          headers
        });
        const ibanData = await ibanResponse.json();
        
        if (ibanData.success) {
          setIbanOptions(ibanData.data);
        }
      } catch (error) {
        console.error('Failed to fetch MaxiSpaar data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Debug useEffect to monitor state changes
  useEffect(() => {
    console.log('State changed - showSummary:', showSummary, 'show2FA:', show2FA, 'showFinalConfirmation:', showFinalConfirmation);
  }, [showSummary, show2FA, showFinalConfirmation]);

  // Auto-send verification code when 2FA popup opens
  useEffect(() => {
    if (show2FA && !isCodeSent) {
      handleSendCode();
    }
  }, [show2FA]);

  // Debug verification code state
  useEffect(() => {
    console.log('Verification code state changed:', verificationCode);
    console.log('Generated code:', generatedCode);
    console.log('Is code sent:', isCodeSent);
  }, [verificationCode, generatedCode, isCodeSent]);

  const maxiSpaarOptions: MaxiSpaarOption[] = accountData?.account_options || [
    {
      id: '3-months',
      term: '3 maanden',
      interest: '1,85%',
      validFrom: '11.06.2025',
      balanceClass: '€ 500 to € 500,000'
    },
    {
      id: '6-months',
      term: '6 maanden',
      interest: '1,90%',
      validFrom: '18.07.2025',
      balanceClass: '€ 500 to € 500,000'
    },
    {
      id: '9-months',
      term: '9 maanden',
      interest: '1,95%',
      validFrom: '18.07.2025',
      balanceClass: '€ 500 to € 500,000'
    },
    {
      id: '12-months',
      term: '12 maanden',
      interest: '2,05%',
      validFrom: '11.06.2025',
      balanceClass: '€ 500 to € 500,000'
    },
    {
      id: '2-years',
      term: '2 jaar',
      interest: '2,10%',
      validFrom: '11.06.2025',
      balanceClass: '€ 500 to € 500,000'
    },
    {
      id: '3-years',
      term: '3 jaar',
      interest: '2,20%',
      validFrom: '18.07.2025',
      balanceClass: '€ 500 to € 500,000'
    },
    {
      id: '4-years',
      term: '4 jaar',
      interest: '2,25%',
      validFrom: '11.06.2025',
      balanceClass: '€ 500 to € 500,000'
    },
    {
      id: '5-years',
      term: '5 jaar',
      interest: '2,30%',
      validFrom: '11.06.2025',
      balanceClass: '€ 500 to € 500,000'
    }
  ];

  const handleOpenAccount = (option: MaxiSpaarOption) => {
    setSelectedOption(option);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedOption(null);
    setAmount({ whole: '', decimal: '' });
    setShowSummary(false);
    setShow2FA(false);
    setShowFinalConfirmation(false);
    setTermsAccepted(false);
    setSelectedIban('');
    setErrors({});
    setVerificationCode(['', '', '', '', '', '']);
    setGeneratedCode('');
    setIsCodeSent(false);
  };

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};

    if (!selectedIban) {
      newErrors.iban = 'Please select an IBAN';
    }

    if (!selectedOption) {
      newErrors.term = 'Please select a term';
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

  const handleConfirmTransaction = async () => {
    console.log('handleConfirmTransaction called');
    console.log('Current state - showSummary:', showSummary, 'show2FA:', show2FA, 'showFinalConfirmation:', showFinalConfirmation);
    console.log('termsAccepted:', termsAccepted);
    if (!termsAccepted) {
      console.log('Terms not accepted, showing error');
      setErrors({ terms: 'Please accept the Terms and Conditions' });
      return;
    }
    console.log('Terms accepted, proceeding to 2FA');
    console.log('Setting showSummary to false and show2FA to true');
    setShowSummary(false);
    setShow2FA(true);
    // Reset verification code state
    setVerificationCode(['', '', '', '', '', '']);
    setIsCodeSent(false);
    setGeneratedCode('');
    setErrors({});
  };

  const handleFinalDone = () => {
    console.log('Transaction confirmed:', {
      selectedOption,
      amount,
      selectedIban
    });
    handleCloseModal();
  };

  const handleAmountChange = (field: string, value: string) => {
    setAmount(prev => ({ ...prev, [field]: value }));
  };

  const getSelectedIbanDetails = () => {
    return ibanOptions.find(option => option.iban === selectedIban) || ibanOptions[0];
  };

  const handleSendCode = async () => {
    console.log('handleSendCode called');
    try {
      console.log('Fetching verification code from API...');
      const headers = {
        'Content-Type': 'application/json',
        'channelCode': 'WEB',
        'username': 'testuser',
        'lang': 'en',
        'countryCode': 'NL',
        'sessionId': 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
        'customerId': 'CUST001'
      };
      
      const response = await fetch('http://localhost:5003/api/verification/send-code', {
        headers
      });
      const data = await response.json();
      console.log('API response:', data);
      if (data.success) {
        console.log('Setting generated code:', data.data.code);
        setGeneratedCode(data.data.code);
        setIsCodeSent(true);
        // Auto-fill the code after a short delay
        setTimeout(() => {
          const codeArray = data.data.code.split('');
          console.log('Auto-filling code:', codeArray);
          setVerificationCode(codeArray);
        }, 1000);
      }
    } catch (error) {
      console.error('Failed to send verification code:', error);
    }
  };

  const handleResendCode = () => {
    handleSendCode();
  };

  const handleVerificationCodeChange = (index: number, value: string) => {
    if (value.length <= 1) {
      const newCode = [...verificationCode];
      newCode[index] = value;
      setVerificationCode(newCode);
      
      // Auto-focus next input
      if (value && index < 5) {
        const nextInput = document.getElementById(`verification-input-${index + 1}`);
        if (nextInput) {
          nextInput.focus();
        }
      }
    }
  };

  const handleVerifyCode = () => {
    console.log('handleVerifyCode called');
    console.log('Current state before verification - showSummary:', showSummary, 'show2FA:', show2FA, 'showFinalConfirmation:', showFinalConfirmation);
    console.log('verificationCode array:', verificationCode);
    const enteredCode = verificationCode.join('');
    console.log('Entered code:', enteredCode, 'Generated code:', generatedCode);
    console.log('Code comparison result:', enteredCode === generatedCode);
    console.log('Code lengths - entered:', enteredCode.length, 'generated:', generatedCode.length);
    if (enteredCode === generatedCode) {
      console.log('Code is valid, setting show2FA to false and showFinalConfirmation to true');
      setShow2FA(false);
      setShowFinalConfirmation(true);
    } else {
      console.log('Code is invalid');
      setErrors({ verification: 'Invalid verification code' });
    }
  };

  const handleBackToSummary = () => {
    console.log('handleBackToSummary called');
    setShow2FA(false);
    setShowSummary(true);
    setVerificationCode(['', '', '', '', '', '']);
    setErrors({});
  };

  if (loading) {
    return (
      <Box sx={{ p: 3, display: 'flex', justifyContent: 'center' }}>
        <Typography>Loading...</Typography>
      </Box>
    );
  }

  return (
      <Box sx={{ pl: 3, pr: 3, maxWidth: '100%' }}>      {/* Breadcrumbs */}
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
        DHB MaxiSpaar Account
      </Typography>
      <Breadcrumbs sx={{ mb: 3 }} aria-label="breadcrumb navigation">
        <MuiLink 
          component={Link}
          to="/private" 
          color="inherit" 
          underline="hover"
          sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}
        >
          <HomeIcon sx={{ mr: 0.5, fontSize: 20 }} />
          Home
        </MuiLink>
        <MuiLink 
          component={Link}
          to="/accounts" 
          color="inherit" 
          underline="hover"
          sx={{ cursor: 'pointer' }}
        >
          Accounts
        </MuiLink>
        <MuiLink 
          component={Link}
          to="/accounts/open" 
          color="inherit" 
          underline="hover"
          sx={{ cursor: 'pointer' }}
        >
          Open account
        </MuiLink>
        <Typography color="text.primary" fontWeight="bold">
          DHB MaxiSpaar Account
        </Typography>
      </Breadcrumbs>

      {/* Account Summary Section (White Box) */}
      <Card 
        sx={{ 
          mb: 3,
          backgroundColor: 'white',
          borderRadius: 2,
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          border: '1px solid #E0E0E0'
        }}
        role="region"
        aria-label="MaxiSpaar account summary"
      >
        <CardContent sx={{ p: 3 }}>
          <Grid container spacing={3} alignItems="center">
            {/* Left Side */}
            <Grid item xs={12} md={6}>
              <Typography variant="h4" fontWeight="bold" color="#004996" sx={{ mb: 1 }}>
                {accountData?.main_account?.name || 'DHB Account'}
              </Typography>
              <Typography variant="body1" color="#666" sx={{ mb: 0.5 }} id="iban-label-maxispaar">
                IBAN Number
              </Typography>
              <Typography variant="body1" color="#666" id="interest-label-maxispaar">
                Cumulative Interest Amount
              </Typography>
            </Grid>
            
            {/* Right Side */}
            <Grid item xs={12} md={6} sx={{ textAlign: 'right' }}>
              <Typography 
                variant="h3" 
                fontWeight="bold" 
                color="#004996" 
                sx={{ mb: 1 }}
                aria-label={`Account balance: ${accountData?.balance || '€ --.---,--'}`}
              >
                {accountData?.balance || '€ --.---,--'}
              </Typography>
              <Typography 
                variant="body1" 
                color="#666" 
                sx={{ mb: 0.5 }}
                aria-labelledby="iban-label-maxispaar"
                aria-label={`IBAN: ${accountData?.iban || 'NL24DHBN2018470578'}`}
              >
                {accountData?.iban || 'NL24DHBN2018470578'}
              </Typography>
              <Typography 
                variant="body1" 
                color="#666"
                aria-labelledby="interest-label-maxispaar"
                aria-label={`Interest rate: ${accountData?.interest_rate || '1.1%'}`}
              >
                {accountData?.interest_rate || '1.1%'}
              </Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Introductory Text Section */}
      <Card sx={{ 
        mb: 4,
        backgroundColor: 'white',
        borderRadius: 2,
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
      }}>
        <CardContent sx={{ p: 3 }}>
          <Typography variant="h5" fontWeight="bold" color="#333" sx={{ mb: 2 }}>
            {accountData?.title || 'Many choices of different terms'}
          </Typography>
          <Typography variant="body1" color="#666" sx={{ mb: 2, lineHeight: 1.6 }}>
            {accountData?.description || 'Do you want to benefit from a higher interest rate by fixing your savings for a certain period? With a DHB MaxiSpaar account, you can easily choose from different terms, from three months up to 5 years.'}
          </Typography>
          <Typography variant="body1" color="#666" sx={{ lineHeight: 1.6 }}>
            {accountData?.additional || 'If you already have a DHB SaveOnline account, you can immediately open a DHB MaxiSpaar account online. That is free.'}
          </Typography>
        </CardContent>
      </Card>

      {/* Savings Options Grid */}
      <Box sx={{ width: '100%' }}>
        <Grid container spacing={2}>
          {maxiSpaarOptions.map((option) => (
            <Grid item xs={12} sm={6} md={4} key={option.id}>
            <Card sx={{ 
              borderRadius: 2,
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              border: '1px solid #E0E0E0',
              minHeight: '280px'
            }}>
              <CardContent sx={{ pl: 6, pr: 6, py: 4, flex: 1, display: 'flex', flexDirection: 'column' }}>
                {/* Balance Class */}
                <Box sx={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  py: 2,
                  borderBottom: '1px solid #E0E0E0'
                }}>
                  <Typography variant="body1" fontWeight="bold" color="#000">
                    Balance Class
                  </Typography>
                  <Typography variant="body1" color="#000">
                    {option.balanceClass}
                  </Typography>
                </Box>

                {/* Term */}
                <Box sx={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  py: 2,
                  borderBottom: '1px solid #E0E0E0'
                }}>
                  <Typography variant="body1" fontWeight="bold" color="#000">
                    Term
                  </Typography>
                  <Typography variant="body1" color="#000">
                    {option.term}
                  </Typography>
                </Box>

                {/* Interest */}
                <Box sx={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  py: 2,
                  borderBottom: '1px solid #E0E0E0'
                }}>
                  <Typography variant="body1" fontWeight="bold" color="#000">
                    Interest
                  </Typography>
                  <Typography variant="body1" color="#000">
                    {option.interest}
                  </Typography>
                </Box>

                {/* Valid From */}
                <Box sx={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  py: 2,
                  borderBottom: '1px solid #E0E0E0'
                }}>
                  <Typography variant="body1" fontWeight="bold" color="#000">
                    Valid from
                  </Typography>
                  <Typography variant="body1" color="#000">
                    {option.validFrom}
                  </Typography>
                </Box>

                {/* Open Account Button */}
                <Button
                  variant="contained"
                  startIcon={<Add />}
                  onClick={() => handleOpenAccount(option)}
                  sx={{
                    backgroundColor: '#FC9F15',
                    color: 'white',
                    textTransform: 'none',
                    borderRadius: 2,
                    py: 4,
                    mt: 'auto',
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
      </Box>

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
            {!showSummary && !show2FA && !showFinalConfirmation ? (
              /* Form Content */
              <Card sx={{ backgroundColor: 'white', borderRadius: 2, p: 3 }}>
                {/* IBAN Section */}
                <Box sx={{ mb: 3 }}>
                  <Typography variant="body2" color="#000" fontWeight="medium" sx={{ mb: 1 }}>
                    IBAN
                  </Typography>
                  <FormControl fullWidth>
                    <Select
                      value={selectedIban}
                      onChange={(e) => setSelectedIban(e.target.value)}
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
                      {ibanOptions.map((option) => (
                        <MenuItem key={option.iban} value={option.iban}>
                          {option.iban}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  {selectedIban && getSelectedIbanDetails() && (
                    <Box sx={{ mt: 2 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="body2" color="#000">Balance</Typography>
                        <Typography variant="body2" fontWeight="medium">{getSelectedIbanDetails().balance}</Typography>
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="body2" color="#000">Account</Typography>
                        <Typography variant="body2" fontWeight="medium">{getSelectedIbanDetails().accountName}</Typography>
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="body2" color="#000">Account holder(s)</Typography>
                        <Typography variant="body2" fontWeight="medium">{getSelectedIbanDetails().holderName}</Typography>
                      </Box>
                    </Box>
                  )}
                </Box>

                {/* Amount Entry Section */}
                <Box sx={{ mb: 3 }}>
                  <Typography variant="body2" color="#000" fontWeight="medium" sx={{ mb: 2 }}>
                    Amount entry
                  </Typography>
                  <Box sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: 1
                  }}>
                    <TextField
                      placeholder="000"
                      value={amount.whole}
                      onChange={(e) => handleAmountChange('whole', e.target.value)}
                      sx={{ 
                        flex: 1,
                        '& .MuiOutlinedInput-root': {
                          '& fieldset': {
                            borderColor: '#004996',
                          },
                        }
                      }}
                      size="small"
                    />
                    <Typography variant="body1" color="#666">,</Typography>
                    <TextField
                      placeholder="00"
                      value={amount.decimal}
                      onChange={(e) => handleAmountChange('decimal', e.target.value)}
                      sx={{ 
                        width: '80px',
                        '& .MuiOutlinedInput-root': {
                          '& fieldset': {
                            borderColor: '#004996',
                          },
                        },
                        '& .MuiInputBase-input::placeholder': {
                          color: '#999',
                        }
                      }}
                      size="small"
                    />
                    <Typography variant="body1" color="#666">€</Typography>
                  </Box>
                  {errors.amount && (
                    <Typography variant="caption" color="error" sx={{ mt: 1 }}>
                      {errors.amount}
                    </Typography>
                  )}
                </Box>

                {/* Notice Period Section */}
                <Box sx={{ mb: 3 }}>
                  <Typography variant="body2" color="#000" fontWeight="medium" sx={{ mb: 2 }}>
                    Notice period
                  </Typography>
                  <FormControl fullWidth>
                    <Select
                      value={selectedOption?.id || ''}
                      onChange={(e) => {
                        const option = maxiSpaarOptions.find(opt => opt.id === e.target.value);
                        setSelectedOption(option);
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
                      {maxiSpaarOptions.map((option) => (
                        <MenuItem key={option.id} value={option.id}>
                          {option.days} [{option.id}]: days ({option.interest})
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  {selectedOption && (
                    <Box sx={{ mt: 2 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="body2" color="#000">Maturity Date</Typography>
                        <Typography variant="body2" fontWeight="medium">29 May 2023</Typography>
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="body2" color="#000">Value Date</Typography>
                        <Typography variant="body2" fontWeight="medium">29 May 2024</Typography>
                      </Box>
                    </Box>
                  )}
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
                    py: 2,
                    fontWeight: 500,
                    '&:hover': {
                      backgroundColor: '#e58a0d'
                    }
                  }}
                >
                  Proceed
                </Button>
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
                      <Typography variant="body2" color="#666">Term</Typography>
                      <Typography variant="body2" fontWeight="bold">
                        {selectedOption ? selectedOption.term : ''}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                      <Typography variant="body2" color="#666">Interest Rate</Typography>
                      <Typography variant="body2" fontWeight="bold">
                        {selectedOption ? selectedOption.interest : ''}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                      <Typography variant="body2" color="#666">Valid from</Typography>
                      <Typography variant="body2" fontWeight="bold">
                        {selectedOption ? selectedOption.validFrom : ''}
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
                        {' '}of DHB Bank MaxiSpaar Account and acknowledge the receipt of the{' '}
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
            ) : show2FA && !showFinalConfirmation ? (
              /* 2FA Verification Content */
              <Box>
                <Typography variant="h5" fontWeight="bold" sx={{ mb: 3, color: '#333' }}>
                  Enter Verification Code
                </Typography>
                
                {/* Verification Card */}
                <Card sx={{ 
                  backgroundColor: 'white', 
                  borderRadius: 2, 
                  p: 3, 
                  mb: 3,
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                  textAlign: 'center'
                }}>
                  <Typography variant="body1" fontWeight="bold" sx={{ mb: 2, color: '#333' }}>
                    We sent a 6-digit code to your email address.
                  </Typography>
                  <Typography variant="body1" fontWeight="bold" sx={{ mb: 3, color: '#333' }}>
                    Enter it below
                  </Typography>
                  
                  {/* Code Input Fields */}
                  <Box sx={{ 
                    display: 'flex', 
                    gap: 1, 
                    justifyContent: 'center', 
                    mb: 3 
                  }}>
                    {verificationCode.map((digit, index) => (
                      <TextField
                        key={index}
                        id={`verification-input-${index}`}
                        value={digit}
                        onChange={(e) => handleVerificationCodeChange(index, e.target.value)}
                        inputProps={{
                          maxLength: 1,
                          style: { textAlign: 'center', fontSize: '1.2rem' }
                        }}
                        sx={{
                          width: '50px',
                          '& .MuiOutlinedInput-root': {
                            '& fieldset': {
                              borderColor: index === 0 ? '#004996' : '#E0E0E0',
                            },
                            '&:hover fieldset': {
                              borderColor: '#004996',
                            },
                            '&.Mui-focused fieldset': {
                              borderColor: '#004996',
                            },
                          },
                        }}
                        size="small"
                      />
                    ))}
                  </Box>
                  
                  {/* Resend Code Link */}
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                    <Typography variant="body2" color="#666">
                      Didn't receive the code?
                    </Typography>
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        color: '#FC9F15', 
                        cursor: 'pointer',
                        textDecoration: 'underline'
                      }}
                      onClick={handleResendCode}
                    >
                      Resend code
                    </Typography>
                  </Box>
                </Card>

                {/* Action Buttons */}
                <Button
                  variant="contained"
                  fullWidth
                  onClick={handleVerifyCode}
                  sx={{
                    backgroundColor: '#FC9F15',
                    color: 'white',
                    textTransform: 'none',
                    borderRadius: 2,
                    py: 1.5,
                    fontWeight: 500,
                    mb: 2,
                    '&:hover': {
                      backgroundColor: '#e58a0d'
                    }
                  }}
                >
                  Authorize
                </Button>
                
                <Button
                  variant="outlined"
                  fullWidth
                  onClick={handleBackToSummary}
                  sx={{
                    borderColor: '#004996',
                    color: '#004996',
                    textTransform: 'none',
                    borderRadius: 2,
                    py: 1.5,
                    fontWeight: 500,
                    '&:hover': {
                      borderColor: '#004996',
                      backgroundColor: 'rgba(0, 73, 150, 0.1)'
                    }
                  }}
                >
                  Back
                </Button>
                
                {errors.verification && (
                  <Typography color="error" variant="body2" sx={{ mt: 1, textAlign: 'center' }}>
                    {errors.verification}
                  </Typography>
                )}
              </Box>
            ) : (
              /* Final Confirmation Content */
              <Card sx={{ 
                backgroundColor: 'white', 
                borderRadius: 2, 
                p: 3, 
                pb: 1,
                textAlign: 'center',
                width: '400px',
                height: '350px',
                margin: '0 auto',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center'
              }}>
                <Box sx={{ mb: 3 }}>
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

                  {/* Congratulations Text */}
                  <Typography variant="h5" fontWeight="bold" sx={{ mb: 2, color: '#2E7D32' }}>
                    Congratulations!
                  </Typography>

                  {/* Success Message */}
                  <Typography variant="body1" sx={{ mb: 4, color: '#333' }}>
                    You have successfully opened your account with DHB MaxiSpaar
                  </Typography>
                </Box>

                {/* Done Button */}
                <Button
                  variant="contained"
                  fullWidth
                  onClick={handleFinalDone}
                  sx={{
                    backgroundColor: '#FC9F15',
                    color: 'white',
                    textTransform: 'none',
                    borderRadius: 2,
                    py: 3,
                    fontWeight: 500,
                    '&:hover': {
                      backgroundColor: '#e58a0d'
                    }
                  }}
                >
                  Done
                </Button>
              </Card>
            )}
          </Box>
        </Box>
      </Modal>
    </Box>
  );
};

export default MaxiSpaarAccount;
