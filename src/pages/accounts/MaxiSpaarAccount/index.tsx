import React, { useState, useEffect } from 'react';
import { Box, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { apiService } from '../../../services/api';
import { MaxiSpaarOption, AmountState, IbanOption, AccountData } from './types';

// Import section components
import BreadcrumbsSection from './BreadcrumbsSection';
import AccountSummarySection from './AccountSummarySection';
import IntroductoryTextSection from './IntroductoryTextSection';
import SavingsOptionsSection from './SavingsOptionsSection';
import AccountOpeningModalSection from './AccountOpeningModalSection';

const MaxiSpaarAccount: React.FC = () => {
  const navigate = useNavigate();
  const [accountData, setAccountData] = useState<AccountData | null>({
    main_account: { name: 'DHB Account' },
    balance: '€ 15,234.89',
    iban: 'NL24DHBN2018470578',
    interest_rate: '1.1%'
  });
  const [loading, setLoading] = useState(true);
  
  // Modal states
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState<MaxiSpaarOption | null>(null);
  const [amount, setAmount] = useState<AmountState>({ whole: '', decimal: '' });
  const [showSummary, setShowSummary] = useState(false);
  const [show2FA, setShow2FA] = useState(false);
  const [showFinalConfirmation, setShowFinalConfirmation] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [selectedIban, setSelectedIban] = useState('NL24DHBN2018470578');
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  
  // 2FA states
  const [verificationCode, setVerificationCode] = useState(['', '', '', '', '', '']);
  const [generatedCode, setGeneratedCode] = useState('');
  const [isCodeSent, setIsCodeSent] = useState(false);
  
  // IBAN options state with fallback data
  const [ibanOptions, setIbanOptions] = useState<IbanOption[]>([
    {
      iban: 'NL24DHBN2018470578',
      accountName: 'DHB SaveOnline',
      balance: '€ 15,234.89'
    },
    {
      iban: 'NL91DHBN2018470579',
      accountName: 'DHB Business Account',
      balance: '€ 8,750.25'
    }
  ]);

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
          if (ibanData.data.length > 0) {
            setSelectedIban(ibanData.data[0].iban);
          }
        }
      } catch (error) {
        console.error('Error fetching data:', error);
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
  }, [show2FA, isCodeSent]);

  // Debug verification code state
  useEffect(() => {
    console.log('Verification code state changed:', verificationCode);
    console.log('Generated code:', generatedCode);
    console.log('Is code sent:', isCodeSent);
  }, [verificationCode, generatedCode, isCodeSent]);

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
    setVerificationCode(['', '', '', '', '', '']);
    setIsCodeSent(false);
    setGeneratedCode('');
    setErrors({});
  };

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};

    if (!selectedIban) {
      newErrors.iban = 'Please select an IBAN';
    }

    if (!amount.whole && !amount.decimal) {
      newErrors.amount = 'Please enter an amount';
    }

    if (!selectedOption) {
      newErrors.option = 'Please select a savings option';
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
      setErrors({ terms: 'Please accept the Terms and Conditions' });
      return;
    }
    console.log('Terms accepted, proceeding to 2FA');
    
    setShowSummary(false);
    setShow2FA(true);
    // Reset verification code state
    setVerificationCode(['', '', '', '', '', '']);
    setIsCodeSent(false);
  };

  const handleFinalDone = () => {
    console.log('Transaction confirmed:', {
      selectedOption,
      amount,
      selectedIban
    });
    handleCloseModal();
  };

  const getSelectedIbanDetails = () => {
    if (!ibanOptions || !Array.isArray(ibanOptions) || ibanOptions.length === 0) {
      return undefined;
    }
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
      console.error('Error sending verification code:', error);
      // Fallback: generate a mock code
      const mockCode = Math.floor(100000 + Math.random() * 900000).toString();
      setGeneratedCode(mockCode);
      setIsCodeSent(true);
      setTimeout(() => {
        setVerificationCode(mockCode.split(''));
      }, 1000);
    }
  };

  const handleResendCode = () => {
    handleSendCode();
  };

  const handleVerifyCode = () => {
    console.log('handleVerifyCode called');
    console.log('Current state before verification - showSummary:', showSummary, 'show2FA:', show2FA, 'showFinalConfirmation:', showFinalConfirmation);
    console.log('verificationCode array:', verificationCode);
    const enteredCode = verificationCode.join('');
    console.log('Entered code:', enteredCode, 'Generated code:', generatedCode);
    console.log('Code comparison result:', enteredCode === generatedCode);
    console.log('Code lengths - entered:', enteredCode.length, 'generated:', generatedCode.length);
    
    if (enteredCode === generatedCode && enteredCode.length === 6) {
      console.log('Code verified successfully, showing final confirmation');
      setShow2FA(false);
      setShowFinalConfirmation(true);
    } else {
      console.log('Code verification failed');
      setErrors({ verification: 'Invalid verification code' });
    }
  };

  const calculateMaturityDate = () => {
    if (!selectedOption) return '';
    const today = new Date();
    const maturityDate = new Date(today);
    maturityDate.setDate(today.getDate() + (selectedOption.days || 365));
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
    valueDate.setDate(today.getDate() + 1);
    return valueDate.toLocaleDateString('en-GB', { 
      day: 'numeric', 
      month: 'short', 
      year: 'numeric' 
    });
  };

  if (loading) {
    return (
      <Box sx={{ p: 3, display: 'flex', justifyContent: 'center' }}>
        <Typography>Loading...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ pl: 3, pr: 3, maxWidth: '100%' }}>
      <BreadcrumbsSection />

      <AccountSummarySection accountData={accountData} />

      <IntroductoryTextSection accountData={accountData} />

      <SavingsOptionsSection 
        accountData={accountData}
        onOpenAccount={handleOpenAccount} 
      />

      <AccountOpeningModalSection
        modalOpen={modalOpen}
        onClose={handleCloseModal}
        selectedOption={selectedOption}
        amount={amount}
        setAmount={setAmount}
        selectedIban={selectedIban}
        setSelectedIban={setSelectedIban}
        showSummary={showSummary}
        show2FA={show2FA}
        showFinalConfirmation={showFinalConfirmation}
        termsAccepted={termsAccepted}
        setTermsAccepted={setTermsAccepted}
        errors={errors}
        ibanOptions={ibanOptions}
        verificationCode={verificationCode}
        setVerificationCode={setVerificationCode}
        isCodeSent={isCodeSent}
        onProceed={handleProceed}
        onEditTransaction={handleEditTransaction}
        onConfirmTransaction={handleConfirmTransaction}
        onVerifyCode={handleVerifyCode}
        onFinalDone={handleFinalDone}
        onResendCode={handleResendCode}
        getSelectedIbanDetails={getSelectedIbanDetails}
        calculateMaturityDate={calculateMaturityDate}
        calculateValueDate={calculateValueDate}
      />
    </Box>
  );
};

export default MaxiSpaarAccount;
