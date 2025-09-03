import React, { useState, useEffect } from 'react';
import {
  Box,
} from '@mui/material';
import { AmountState, AccountOption, IbanOption, PageData } from './types';

// Import section components
import BreadcrumbsSection from './BreadcrumbsSection';
import AccountSummarySection from './AccountSummarySection';
import AccountDescriptionSection from './AccountDescriptionSection';
import AccountOptionsSection from './AccountOptionsSection';
import AccountOpeningModalSection from './AccountOpeningModalSection';

const CombiSpaarAccount: React.FC = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState<AccountOption | null>(null);
  const [amount, setAmount] = useState<AmountState>({ whole: '', decimal: '' });
  const [noticePeriodDestination, setNoticePeriodDestination] = useState('combispaar');
  const [showSummary, setShowSummary] = useState(false);
  const [showFinalConfirmation, setShowFinalConfirmation] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [selectedIban, setSelectedIban] = useState('NL24DHBN2018470578');
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  
  // API data states with fallback initialization
  const [pageData, setPageData] = useState<PageData | null>({
    accountName: 'DHB SaveOnline',
    balance: '€ 12,345.67',
    iban: 'NL24DHBN2018470578',
    interestRate: '1.1%',
    title: 'Save and still be able to withdraw money',
    description: 'The DHB CombiSpaarrekening offers a higher interest rate than the DHB SaveOnline because withdrawals are planned in advance. Depending on the chosen account, you can give 33, 66, or 99 days\' notice for withdrawals. A longer notice period results in a higher interest rate.'
  });
  const [accountOptions, setAccountOptions] = useState<AccountOption[]>([
    {
      id: '1',
      title: 'CombiSpaar 33 days',
      description: '33 days notice period',
      interestRate: '2.5%',
      days: 33,
      minAmount: '€ 500',
      maxAmount: '€ 100,000',
      balanceClass: '€ 500 - € 100,000',
      noticePeriod: '33 days',
      interest: '2.5%',
      validFrom: '01 Jan 2024'
    },
    {
      id: '2',
      title: 'CombiSpaar 66 days',
      description: '66 days notice period',
      interestRate: '3.0%',
      days: 66,
      minAmount: '€ 500',
      maxAmount: '€ 100,000',
      balanceClass: '€ 500 - € 100,000',
      noticePeriod: '66 days',
      interest: '3.0%',
      validFrom: '01 Jan 2024'
    },
    {
      id: '3',
      title: 'CombiSpaar 99 days',
      description: '99 days notice period',
      interestRate: '3.5%',
      days: 99,
      minAmount: '€ 500',
      maxAmount: '€ 100,000',
      balanceClass: '€ 500 - € 100,000',
      noticePeriod: '99 days',
      interest: '3.5%',
      validFrom: '01 Jan 2024'
    }
  ]);
  const [ibanOptions, setIbanOptions] = useState<IbanOption[]>([
    {
      iban: 'NL24DHBN2018470578',
      accountName: 'DHB SaveOnline',
      balance: '€ 12,345.67'
    },
    {
      iban: 'NL91DHBN2018470579',
      accountName: 'DHB Business Account',
      balance: '€ 8,750.25'
    }
  ]);
  const [loading, setLoading] = useState(true);

  const handleOpenAccount = (option: AccountOption) => {
    setSelectedOption(option);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setShowSummary(false);
    setShowFinalConfirmation(false);
    setSelectedOption(null);
    setAmount({ whole: '', decimal: '' });
    setNoticePeriodDestination('combispaar');
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
      newErrors.amount = 'Please enter an amount';
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
      selectedIban,
      noticePeriodDestination
    });
    
    // Close modal and reset state
    handleCloseModal();
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
    if (!ibanOptions || !Array.isArray(ibanOptions) || ibanOptions.length === 0) {
      return undefined;
    }
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
          // Set default selected IBAN to first option
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

  return (
    <Box sx={{ p: 3 }}>
      <BreadcrumbsSection />

      <AccountSummarySection pageData={pageData} />

      <AccountDescriptionSection pageData={pageData} />

      <AccountOptionsSection
        loading={loading}
        accountOptions={accountOptions}
        onOpenAccount={handleOpenAccount}
      />

      <AccountOpeningModalSection
        modalOpen={modalOpen}
        onClose={handleCloseModal}
        selectedOption={selectedOption}
        setSelectedOption={setSelectedOption}
        accountOptions={accountOptions}
        amount={amount}
        setAmount={setAmount}
        noticePeriodDestination={noticePeriodDestination}
        setNoticePeriodDestination={setNoticePeriodDestination}
        showSummary={showSummary}
        showFinalConfirmation={showFinalConfirmation}
        termsAccepted={termsAccepted}
        setTermsAccepted={setTermsAccepted}
        selectedIban={selectedIban}
        setSelectedIban={setSelectedIban}
        errors={errors}
        ibanOptions={ibanOptions}
        onProceed={handleProceed}
        onEditTransaction={handleEditTransaction}
        onConfirmTransaction={handleConfirmTransaction}
        onFinalDone={handleFinalDone}
        calculateMaturityDate={calculateMaturityDate}
        calculateValueDate={calculateValueDate}
        getSelectedIbanDetails={getSelectedIbanDetails}
      />
    </Box>
  );
};

export default CombiSpaarAccount;
