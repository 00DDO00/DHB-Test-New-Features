import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Box, Grid, Button, Typography, CircularProgress, Breadcrumbs, Link as MuiLink } from '@mui/material';
import { Add, ArrowForward, Headset, Home as HomeIcon } from '@mui/icons-material';
import { useNavigate, Link } from 'react-router-dom';
import { AccountWidget, StatsWidget, Widget, SettingsWidget, ChartWidget, SupportButton } from '../../components/widgets';
import { apiService, Account, ChartData } from "../../services/api";
import { formatCurrency, formatInterestRate } from "../../utils/formatters";

const Home: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [combispaarData, setCombispaarData] = useState<{
    accounts: any[];
    total_balance: number;
    count: number;
  } | null>(null);
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [userName, setUserName] = useState("Holder name");

  // Sample data for settings
  const settingsItems = [
    { icon: "🔧", label: t('settings.nav.application_settings'), onClick: () => console.log('Account Settings') },
    { icon: "🔒", label: t('security'), onClick: () => console.log('Security') },
    { icon: "📱", label: t('application-settings.notification.title'), onClick: () => console.log('Notifications') },
    { icon: "🌍", label: t('application-settings.language.title'), onClick: () => console.log('Language') },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch all data in parallel
        const [accountsData, combispaarData, chartData, userData] = await Promise.all([
          apiService.getAccounts(),
          apiService.getCombispaarAccounts(),
          apiService.getChartData(),
          apiService.getUserInfo(),
        ]);

        setAccounts(accountsData);
        setCombispaarData(combispaarData);
        setChartData(chartData);
        setUserName(userData.name);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError(t('something-went-wrong'));
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

  if (error) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography color="error" variant="h6">
          {error}
        </Typography>
      </Box>
    );
  }

  // Find specific accounts
  const saveOnlineAccount = accounts.find(acc => acc.name === "DHB SaveOnline");
  const maxiSpaarAccount = accounts.find(acc => acc.name === "DHB MaxiSpaar");

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
        Dashboard - {t('welcome')} {userName}
      </Typography>
      
      {/* Breadcrumbs */}
      <Breadcrumbs sx={{ mb: 3 }} aria-label="breadcrumb navigation">
        <MuiLink
          component="span"
          sx={{ 
            display: 'flex', 
            alignItems: 'center',
            color: '#004996',
            fontWeight: 600,
          }}
        >
          <HomeIcon sx={{ mr: 0.5, fontSize: 20 }} />
          {t('home')}
        </MuiLink>
      </Breadcrumbs>
      
      <Box sx={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '16px',
        paddingLeft: '80px',
        paddingRight: '80px',
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        {/* Account Overview Section */}
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
          Account Overview
        </Typography>
        
        {/* Welcome Card - DHB SaveOnline */}
        <Box sx={{ flex: '0 0 calc(50% - 8px)' }} role="complementary" aria-label="Primary account summary">
          <AccountWidget
            accountName={`${t('welcome')}, ${userName}`}
            accountType={t('saveOnline')}
            balance={saveOnlineAccount ? formatCurrency(saveOnlineAccount.balance) : "€ --.---,--"}
            iban={saveOnlineAccount?.iban || "NL24DHBN2018470578"}
            interestRate={saveOnlineAccount ? formatInterestRate(saveOnlineAccount.interest_rate) : "1.1%"}
            primaryAction={{
              label: "Make Transfer",
              onClick: () => navigate('/accounts'),
              color: 'orange'
            }}
            onAccountTypeClick={() => navigate('/accounts')}
          />
        </Box>

        {/* Accounts Card - DHB MaxiSpaar */}
        <Box sx={{ flex: '0 0 calc(50% - 8px)' }} role="complementary" aria-label="MaxiSpaar account summary">
          <AccountWidget
            accountName={t('accounts.title')}
            accountType={t('maxiSpaar')}
            balance={maxiSpaarAccount ? formatCurrency(maxiSpaarAccount.balance) : "€ --.---,--"}
            iban={maxiSpaarAccount?.iban || "NL24DHBN2018470579"}
            interestRate={maxiSpaarAccount ? formatInterestRate(maxiSpaarAccount.interest_rate) : "1.1%"}
            primaryAction={{
              label: "Open account",
              onClick: () => navigate('/accounts/maxispaar'),
              color: 'primary'
            }}
            onAccountTypeClick={() => navigate('/accounts/maxispaar')}
          />
        </Box>

        {/* Account Opening Card */}
        <Box sx={{ flex: '0 0 calc(50% - 8px)' }}>
          <Widget
            title={t('accounts.title') || 'Accounts (missing key)'}
            /*subtitle="DHB Accounts"*/
            onMenuClick={() => console.log('Menu clicked')}
            actions={
              <Button
                variant="outlined"
                endIcon={<Add />}
                onClick={() => navigate('/accounts/open')}
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
                Open account
              </Button>
            }
          >
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Typography 
                variant="h3" 
                color="#004996" 
                fontWeight="bold"
                sx={{
                  cursor: 'pointer',
                  fontSize: '1.5rem',
                  lineHeight: 1.2,
                  '&:hover': {
                    textDecoration: 'underline',
                    opacity: 0.8
                  }
                }}
                onClick={() => navigate('/accounts/open')}
              >
                {t('accounts.dhb') || 'DHB Accounts (missing key)'}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {t('account_opening.maxispaar-description') || 'Your fixed-term deposit with a guaranteed high interest rate:'}
              </Typography>
            </Box>
          </Widget>
        </Box>

        {/* Combispaar Accounts Card */}
        <Box sx={{ flex: '0 0 calc(50% - 8px)' }}>
          <StatsWidget
            title={`You have ${combispaarData?.count || 10} ${t('combiSpaar')}`}
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
                onClick={() => navigate('/accounts/combispaar')}
              >
                {`Total ${t('combiSpaar')} Balances`}
              </Typography>
            }
            actions={
              <Box display="flex" gap={1}>
                <Button
                  variant="contained"
                  endIcon={<ArrowForward />}
                  onClick={() => navigate('/accounts/saveonline')}
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

        {/* Quick Actions Section */}
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
          Quick Actions
        </Typography>
        
        {/* Settings Card */}
        <Box sx={{ flex: '0 0 calc(50% - 8px)' }} role="complementary" aria-label="Quick settings and actions">
          <SettingsWidget items={settingsItems} />
        </Box>

        {/* Financial Overview Section */}
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
          Financial Overview
        </Typography>
        
        {/* Financial Overview Card */}
        <Box sx={{ flex: '0 0 calc(50% - 8px)' }}>
          <ChartWidget
            title={t('accounts')}
            filterLabel="Filter"
            filterValue="last year"
            chartData={chartData.map(item => ({
              label: item.label,
              value: formatCurrency(item.value),
              color: item.color
            }))}
          />
        </Box>
      </Box>

      {/* Support Button */}
      <SupportButton
        role="button"
        aria-label="Contact customer support"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            // Add support action here
            console.log('Support clicked');
          }
        }}
      >
        <Headset aria-hidden="true" />
      </SupportButton>
    </Box>
  );
};

export default Home;
