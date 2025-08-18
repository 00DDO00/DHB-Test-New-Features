import React, { useState, useEffect } from 'react';
import { Box, Grid, Button, Typography, CircularProgress } from '@mui/material';
import { Add, ArrowForward, Headset } from '@mui/icons-material';
import { AccountWidget, StatsWidget, Widget, SettingsWidget, ChartWidget, SupportButton } from '../../components/widgets';
import { apiService, Account, ChartData } from "../../services/api";
import { formatCurrency, formatInterestRate } from "../../utils/formatters";

const Home: React.FC = () => {
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
    { icon: "🔧", label: "Account Settings", onClick: () => console.log('Account Settings') },
    { icon: "🔒", label: "Security", onClick: () => console.log('Security') },
    { icon: "📱", label: "Notifications", onClick: () => console.log('Notifications') },
    { icon: "🌍", label: "Language", onClick: () => console.log('Language') },
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
        setError('Failed to load dashboard data');
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
      <Box sx={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '16px',
        paddingLeft: '80px',
        paddingRight: '80px',
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        {/* Welcome Card - DHB SaveOnline */}
        <Box sx={{ flex: '0 0 calc(50% - 8px)' }}>
          <AccountWidget
            accountName={`Welcome, ${userName}`}
            accountType="DHB SaveOnline"
            balance={saveOnlineAccount ? formatCurrency(saveOnlineAccount.balance) : "€ --.---,--"}
            iban={saveOnlineAccount?.iban || "NL24DHBN2018470578"}
            interestRate={saveOnlineAccount ? formatInterestRate(saveOnlineAccount.interest_rate) : "1.1%"}
            primaryAction={{
              label: "Make Transfer",
              onClick: () => console.log('Make Transfer'),
              color: 'orange'
            }}
          />
        </Box>

        {/* Accounts Card - DHB MaxiSpaar */}
        <Box sx={{ flex: '0 0 calc(50% - 8px)' }}>
          <AccountWidget
            accountName="Accounts"
            accountType="DHB MaxiSpaar"
            balance={maxiSpaarAccount ? formatCurrency(maxiSpaarAccount.balance) : "€ --.---,--"}
            iban={maxiSpaarAccount?.iban || "NL24DHBN2018470579"}
            interestRate={maxiSpaarAccount ? formatInterestRate(maxiSpaarAccount.interest_rate) : "1.1%"}
            primaryAction={{
              label: "Open account +",
              onClick: () => console.log('Open account'),
              color: 'primary'
            }}
          />
        </Box>

        {/* Account Opening Card */}
        <Box sx={{ flex: '0 0 calc(50% - 8px)' }}>
          <Widget
            title="Account opening"
            subtitle="DHB MaxiSpaar Account"
            onMenuClick={() => console.log('Menu clicked')}
            actions={
              <Button
                variant="outlined"
                endIcon={<Add />}
                onClick={() => console.log('Open account')}
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
                Open account +
              </Button>
            }
          >
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Savings deposit with fixed maturity and fixed high interest rate
            </Typography>
            <Box sx={{ width: 80, height: 80, ml: 'auto', mt: 2 }}>
              <img 
                src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iODAiIHZpZXdCb3g9IjAgMCA4MCA4MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjgwIiBoZWlnaHQ9IjgwIiByeD0iOCIgZmlsbD0iI0Y4RjlGQSIvPgo8Y2lyY2xlIGN4PSIzMCIgY3k9IjMwIiByPSI4IiBmaWxsPSIjRkY2QjM1Ii8+CjxjaXJjbGUgY3g9IjUwIiBjeT0iMzAiIHI9IjgiIGZpbGw9IiMwMDQ5OTYiLz4KPGNpcmNsZSBjeD0iNDAiIGN5PSI0NSIgcj0iNiIgZmlsbD0iIzI4QTE0NSIvPgo8L3N2Zz4K" 
                alt="Family illustration"
                style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '8px' }}
              />
            </Box>
          </Widget>
        </Box>

        {/* Combispaar Accounts Card */}
        <Box sx={{ flex: '0 0 calc(50% - 8px)' }}>
          <StatsWidget
            title={`You have ${combispaarData?.count || 10} Combispaar Accounts`}
            value={combispaarData && combispaarData.total_balance !== undefined ? formatCurrency(combispaarData.total_balance) : "€ --.---,--"}
            subtitle="Total Combispaar Balances"
            actions={
              <Box display="flex" gap={1}>
                <Button
                  variant="contained"
                  endIcon={<ArrowForward />}
                  onClick={() => console.log('Make Transfer')}
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
                  Make Transfer
                </Button>
                <Button
                  variant="outlined"
                  endIcon={<Add />}
                  onClick={() => console.log('Open account')}
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
                  Open account +
                </Button>
              </Box>
            }
          />
        </Box>

        {/* Settings Card */}
        <Box sx={{ flex: '0 0 calc(50% - 8px)' }}>
          <SettingsWidget items={settingsItems} />
        </Box>

        {/* Financial Overview Card */}
        <Box sx={{ flex: '0 0 calc(50% - 8px)' }}>
          <ChartWidget
            title="Financial Overview"
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
      <SupportButton>
        <Headset />
      </SupportButton>
    </Box>
  );
};

export default Home;
