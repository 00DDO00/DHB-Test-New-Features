import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Box, Typography, CircularProgress, Breadcrumbs, Link as MuiLink, Button } from '@mui/material';
import { ArrowForward, Add, Home as HomeIcon } from '@mui/icons-material';
import { useNavigate, Link } from 'react-router-dom';
import { AccountWidget, StatsWidget } from '../../components/widgets';
import { apiService, Account } from "../../services/api";
import { formatCurrency, formatInterestRate } from "../../utils/formatters";

const AccountsDashboard: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saveOnlineAccount, setSaveOnlineAccount] = useState<Account | null>(null);
  const [maxiSpaarAccount, setMaxiSpaarAccount] = useState<Account | null>(null);
  const [solidExtraAccount, setSolidExtraAccount] = useState<Account | null>(null);
  const [combispaarData, setCombispaarData] = useState<any>(null);
  const [maxiSpaarData, setMaxiSpaarData] = useState<any>(null);
  const [solidExtraData, setSolidExtraData] = useState<any>(null);
  const [userName, setUserName] = useState("Lucy Lavender");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch all data in parallel
        const [accountsData, combispaarData, userData, maxiSpaarData, savingRates, newSavingOptions] = await Promise.all([
          apiService.getAccounts(), // YAML: /accounts/list/{customerId}
          apiService.getCombispaarAccounts(), // Legacy: /api/combispaar
          apiService.getUserInfo(), // Legacy: /api/user
          apiService.getMaxiSpaarPageData(), // Legacy: /api/maxispaar/page-data
          apiService.getSavingRates(), // YAML: /accounts/saving/rates/{customerId}
          apiService.getNewSavingAccountOptions() // YAML: /accounts/saving/new/{customerId}
        ]);
        
        // Try to fetch SolidExtra data separately (in case endpoint doesn't exist yet)
        let solidExtraData = null;
        try {
          solidExtraData = await apiService.getSolidExtraPageData();
        } catch (error) {
          console.log('SolidExtra API endpoint not available yet, using fallback data');
          // Use MaxiSpaar data as fallback for SolidExtra
          solidExtraData = {
            balance: 25000,
            iban: 'NL24DHBN2018470580',
            interest_rate: 1.8
          };
        }
        
        // Find specific accounts from the accounts list using product group codes
        const saveOnline = accountsData.find(acc => 
          acc.type === 'saveOnline' || 
          acc.name?.toLowerCase().includes('saveonline') ||
          acc.name?.toLowerCase().includes('saving')
        );
        
        const maxiSpaar = accountsData.find(acc => 
          acc.type === 'maxiSpaar' || 
          acc.name?.toLowerCase().includes('maxispaar')
        );
        
        const solidExtra = accountsData.find(acc => 
          acc.type === 'solidExtra' || 
          acc.name?.toLowerCase().includes('solidextra')
        );
        
        // If no SolidExtra account found in accounts list, create one from SolidExtra specific data
        const solidExtraAccount = solidExtra || (solidExtraData ? {
          id: 'solid-extra-001',
          name: 'DHB SolidExtra',
          type: 'solidExtra',
          balance: solidExtraData.balance || 25000,
          currency: 'EUR',
          iban: solidExtraData.iban || 'NL24DHBN2018470580',
          interest_rate: solidExtraData.interest_rate || 1.8,
          holder_name: userData.name
        } : null);
        
        // Debug logging
        console.log('Accounts Dashboard - API Data:', {
          accountsData,
          combispaarData,
          userData,
          maxiSpaarData,
          solidExtraData,
          savingRates,
          newSavingOptions,
          foundAccounts: {
            saveOnline,
            maxiSpaar,
            solidExtra,
            solidExtraAccount
          }
        });
        
        setSaveOnlineAccount(saveOnline || null);
        setMaxiSpaarAccount(maxiSpaar || null);
        setSolidExtraAccount(solidExtraAccount);
        setCombispaarData(combispaarData);
        setUserName(userData.name);

        // Fetch MaxiSpaar accounts data
        const maxiSpaarAccounts = await apiService.getMaxiSpaarAccountsList();
        const maxiSpaarTotalBalance = maxiSpaarAccounts.reduce((sum, acc) => sum + acc.balance, 0);
        setMaxiSpaarData({
          accounts: maxiSpaarAccounts,
          total_balance: maxiSpaarTotalBalance,
          count: maxiSpaarAccounts.length
        });

        // Fetch SolidExtra accounts data
        const solidExtraAccounts = await apiService.getSolidExtraAccountsList();
        const solidExtraTotalBalance = solidExtraAccounts.reduce((sum, acc) => sum + acc.balance, 0);
        setSolidExtraData({
          accounts: solidExtraAccounts,
          total_balance: solidExtraTotalBalance,
          count: solidExtraAccounts.length
        });
        
      } catch (error) {
        console.error('Error fetching accounts:', error);
        // Set fallback data on error
        setCombispaarData({
          count: 5,
          total_balance: 150000
        });
        setMaxiSpaarData({
          count: 5,
          total_balance: 260000
        });
        setSolidExtraData({
          count: 5,
          total_balance: 210000
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <Box sx={{ p: 3, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 1 }}>
      {/* Main page heading - hidden visually but available to screen readers */}
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
        Accounts Dashboard
      </Typography>
      
      {/* Breadcrumbs */}
      <Breadcrumbs sx={{ mb: 3 }} aria-label="breadcrumb navigation">
        <MuiLink
          component={Link}
          to="/private"
          sx={{ 
            display: 'flex', 
            alignItems: 'center',
            color: '#004996',
            fontWeight: 600,
          }}
        >
          <HomeIcon sx={{ mr: 0.5, fontSize: 20 }} />
          Home
        </MuiLink>
        <Typography color="text.primary">Accounts</Typography>
      </Breadcrumbs>

      {/* Widget Container - matching home page layout */}
      <Box 
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '16px',
          paddingLeft: '80px',
          paddingRight: '80px',
          maxWidth: '1200px',
          margin: '0 auto'
        }}
      >
        {/* Welcome Card - DHB SaveOnline */}
        <Box sx={{ flex: '0 0 calc(50% - 8px)' }} role="complementary" aria-label="Primary account summary">
          <AccountWidget
            accountName={`${t('welcome')}, ${userName}`}
            accountType="DHB SaveOnline"
            balance={saveOnlineAccount ? formatCurrency(saveOnlineAccount.balance) : "€ --.---,--"}
            iban={saveOnlineAccount?.iban || "NL24DHBN2018470578"}
            interestRate={saveOnlineAccount ? formatInterestRate(saveOnlineAccount.interest_rate) : "1.1%"}
            primaryAction={{
              label: "Make Transfer",
              onClick: () => navigate('/accounts/saveonline'),
              color: 'orange'
            }}
            onAccountTypeClick={() => navigate('/accounts/saveonline')}
          />
        </Box>

        {/* MaxiSpaar Accounts Card */}
        <Box sx={{ flex: '0 0 calc(50% - 8px)' }}>
          <StatsWidget
            title={`You have ${maxiSpaarData?.count || 5} ${t('maxiSpaar')}`}
            value={maxiSpaarData && maxiSpaarData.total_balance !== undefined ? formatCurrency(maxiSpaarData.total_balance) : "€ --.---,--"}
            subtitle={
              <Typography 
                variant="h3" 
                color="#004996" 
                fontWeight="bold"
                sx={{
                  cursor: 'pointer',
                  '&:hover': {
                    textDecoration: 'underline',
                    opacity: 0.8
                  }
                }}
                onClick={() => navigate('/accounts/maxispaar/dashboard')}
              >
                DHB MaxiSpaar
              </Typography>
            }
            onClick={() => navigate('/accounts/maxispaar/dashboard')}
            actions={
              <Button
                variant="outlined"
                endIcon={<Add />}
                onClick={() => navigate('/accounts/maxispaar')}
                sx={{
                  background: 'transparent',
                  color: '#004996',
                  border: '1px solid #004996',
                  textTransform: 'none',
                  borderRadius: '8px',
                  padding: '12px 24px',
                  width: '100%',
                  fontWeight: 500,
                  '&:hover': { 
                    background: 'rgba(0, 73, 150, 0.1)',
                    border: '1px solid #004996'
                  }
                }}
              >
                {t('accounts.open-account')}
              </Button>
            }
          />
        </Box>

        {/* SolidExtra Accounts Card */}
        <Box sx={{ flex: '0 0 calc(50% - 8px)' }}>
          <StatsWidget
            title={`You have ${solidExtraData?.count || 5} ${t('solidExtra') || 'SolidExtra'}`}
            value={solidExtraData && solidExtraData.total_balance !== undefined ? formatCurrency(solidExtraData.total_balance) : "€ --.---,--"}
            subtitle={
              <Typography 
                variant="h3" 
                color="#004996" 
                fontWeight="bold"
                sx={{
                  cursor: 'pointer',
                  '&:hover': {
                    textDecoration: 'underline',
                    opacity: 0.8
                  }
                }}
                onClick={() => navigate('/accounts/solidextra/dashboard')}
              >
                DHB SolidExtra
              </Typography>
            }
            onClick={() => navigate('/accounts/solidextra/dashboard')}
            actions={
              <Button
                variant="outlined"
                endIcon={<Add />}
                onClick={() => navigate('/accounts/solidextra')}
                sx={{
                  background: 'transparent',
                  color: '#004996',
                  border: '1px solid #004996',
                  textTransform: 'none',
                  borderRadius: '8px',
                  padding: '12px 24px',
                  width: '100%',
                  fontWeight: 500,
                  '&:hover': { 
                    background: 'rgba(0, 73, 150, 0.1)',
                    border: '1px solid #004996'
                  }
                }}
              >
                {t('accounts.open-account')}
              </Button>
            }
          />
        </Box>

        {/* Combispaar Accounts Card */}
        <Box sx={{ flex: '0 0 calc(50% - 8px)' }}>
          <StatsWidget
            title={`You have ${combispaarData?.count || 5} ${t('combiSpaar')}`}
            value={combispaarData && combispaarData.total_balance !== undefined ? formatCurrency(combispaarData.total_balance) : "€ --.---,--"}
            subtitle={
              <Typography 
                variant="h3" 
                color="#004996" 
                fontWeight="bold"
                sx={{
                  cursor: 'pointer',
                  '&:hover': {
                    textDecoration: 'underline',
                    opacity: 0.8
                  }
                }}
                onClick={() => navigate('/accounts/combispaar/dashboard')}
              >
                {`Total ${t('combiSpaar')} Balances`}
              </Typography>
            }
            onClick={() => navigate('/accounts/combispaar/dashboard')}
            actions={
              <Box display="flex" gap={1}>
                <Button
                  variant="contained"
                  endIcon={<ArrowForward />}
                  onClick={() => navigate('/accounts/combispaar/dashboard')}
                  sx={{
                    background: '#FF6B35',
                    color: 'white',
                    textTransform: 'none',
                    borderRadius: '8px',
                    padding: '12px 24px',
                    flex: 1,
                    fontWeight: 500,
                    '&:hover': { background: '#e55a2b' }
                  }}
                >
                  {t('payments.title')}
                </Button>
                <Button
                  variant="outlined"
                  endIcon={<Add />}
                  onClick={() => navigate('/accounts/combispaar')}
                  sx={{
                    background: 'transparent',
                    color: '#004996',
                    border: '1px solid #004996',
                    textTransform: 'none',
                    borderRadius: '8px',
                    padding: '12px 24px',
                    flex: 1,
                    fontWeight: 500,
                    '&:hover': { 
                      background: 'rgba(0, 73, 150, 0.1)',
                      border: '1px solid #004996'
                    }
                  }}
                >
                  {t('accounts.open-account')}
                </Button>
              </Box>
            }
          />
        </Box>
      </Box>
    </Box>
  );
};

export default AccountsDashboard;