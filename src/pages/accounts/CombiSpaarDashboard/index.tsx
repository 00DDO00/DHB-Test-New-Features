import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Box, Typography, CircularProgress, Breadcrumbs, Link as MuiLink, Button, Card, CardContent } from '@mui/material';
import { ArrowForward, Add, Home as HomeIcon } from '@mui/icons-material';
import { useNavigate, Link } from 'react-router-dom';
import { apiService, Account } from "../../../services/api";
import { formatCurrency, formatInterestRate } from "../../../utils/formatters";
import styled from '@emotion/styled';

interface CombiSpaarAccount extends Account {
  term?: string;
  maturity_date?: string;
}

// Custom styled card for CombiSpaar dashboard with tighter spacing
const CompactCard = styled(Card)`
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: box-shadow 0.3s ease;
  height: 200px;
  max-width: 525px;
  margin: 0 auto;
  
  &:hover {
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
  }
`;

const CompactCardContent = styled(CardContent)`
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: 24px !important;
  padding-bottom: 24px !important;
`;

const CombiSpaarDashboard: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [combiSpaarAccounts, setCombiSpaarAccounts] = useState<CombiSpaarAccount[]>([]);
  const [userName, setUserName] = useState("Lucy Lavender");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch CombiSpaar accounts and user data
        const [accountsData, userData] = await Promise.all([
          apiService.getCombispaarAccountsList(), // New endpoint for individual accounts
          apiService.getUserInfo()
        ]);
        
        setCombiSpaarAccounts(accountsData);
        setUserName(userData.name);
        
        // Debug logging
        console.log('CombiSpaar Dashboard - API Data:', {
          accountsData,
          userData,
          combiSpaarAccounts: accountsData
        });
        
      } catch (error) {
        console.error('Error fetching CombiSpaar accounts:', error);
        // Set fallback data on error
        setCombiSpaarAccounts([
          {
            id: 'combispaar_001',
            name: 'DHB Combispaar - Short Term',
            type: 'combispaar',
            balance: 25000.00,
            currency: 'EUR',
            iban: 'NL24DHBN2018470581',
            interest_rate: 1.1,
            holder_name: 'Lucy Lavender',
            term: '3 months',
            maturity_date: '2025-04-15'
          },
          {
            id: 'combispaar_002',
            name: 'DHB Combispaar - Medium Term',
            type: 'combispaar',
            balance: 35000.00,
            currency: 'EUR',
            iban: 'NL24DHBN2018470582',
            interest_rate: 1.3,
            holder_name: 'Lucy Lavender',
            term: '1 year',
            maturity_date: '2026-01-15'
          },
          {
            id: 'combispaar_003',
            name: 'DHB Combispaar - Long Term',
            type: 'combispaar',
            balance: 45000.00,
            currency: 'EUR',
            iban: 'NL24DHBN2018470583',
            interest_rate: 1.5,
            holder_name: 'Lucy Lavender',
            term: '2 years',
            maturity_date: '2027-01-15'
          },
          {
            id: 'combispaar_004',
            name: 'DHB Combispaar - Premium',
            type: 'combispaar',
            balance: 30000.00,
            currency: 'EUR',
            iban: 'NL24DHBN2018470584',
            interest_rate: 1.4,
            holder_name: 'Lucy Lavender',
            term: '18 months',
            maturity_date: '2026-07-15'
          },
          {
            id: 'combispaar_005',
            name: 'DHB Combispaar - Extended',
            type: 'combispaar',
            balance: 15000.00,
            currency: 'EUR',
            iban: 'NL24DHBN2018470585',
            interest_rate: 1.2,
            holder_name: 'Lucy Lavender',
            term: '6 months',
            maturity_date: '2025-07-15'
          }
        ]);
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
        CombiSpaar Accounts Dashboard
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
        <MuiLink
          component={Link}
          to="/accounts"
          sx={{ 
            display: 'flex', 
            alignItems: 'center',
            color: '#004996',
            fontWeight: 600,
          }}
        >
          Accounts
        </MuiLink>
        <Typography color="text.primary">CombiSpaar</Typography>
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
        {/* Render CombiSpaar accounts as widgets */}
        {combiSpaarAccounts.map((account, index) => (
          <Box 
            key={account.id} 
            sx={{ flex: '0 0 calc(50% - 8px)' }} 
            role="complementary" 
            aria-label={`${account.name} account summary`}
          >
            <CompactCard 
              role="region" 
              aria-label={`${account.name} account summary`}
            >
              <CompactCardContent>
                {/* Title - matching original Widget component */}
                <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={3}>
                  <Box flex={1}>
                    <Typography 
                      variant="h5" 
                      fontWeight="bold" 
                      color="text.primary"
                    >
                      Account
                    </Typography>
                  </Box>
                </Box>
                
                {/* Account Details - matching original AccountWidget layout exactly */}
                <Box 
                  sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
                  role="region"
                  aria-label="DHB Combispaar account details"
                >
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
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
                      onClick={() => navigate(`/accounts/combispaar/transfers?accountId=${account.id}&iban=${account.iban}&balance=${account.balance}`)}
                      role="button"
                      aria-label="View details for DHB Combispaar account"
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          navigate(`/accounts/combispaar/transfers?accountId=${account.id}&iban=${account.iban}&balance=${account.balance}`);
                        }
                      }}
                    >
                      DHB Combispaar
                    </Typography>
                    <Typography 
                      variant="h3" 
                      fontWeight="bold" 
                      color="text.primary"
                      aria-label={`Account balance: ${formatCurrency(account.balance)}`}
                    >
                      {formatCurrency(account.balance)}
                    </Typography>
                  </Box>
                  
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    <Typography variant="body2" color="text.secondary" id={`iban-label-${account.iban}`}>
                      IBAN Number
                    </Typography>
                    <Typography 
                      variant="body2" 
                      color="text.secondary" 
                      fontWeight="medium"
                      aria-labelledby={`iban-label-${account.iban}`}
                      aria-label={`IBAN: ${account.iban}`}
                    >
                      {account.iban}
                    </Typography>
                  </Box>
                  
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="body2" color="text.secondary" id={`interest-label-${account.iban}`}>
                      Cumulative Interest Amount
                    </Typography>
                    <Typography 
                      variant="body2" 
                      color="text.secondary" 
                      fontWeight="medium"
                      aria-labelledby={`interest-label-${account.iban}`}
                      aria-label={`Interest rate: ${formatInterestRate(account.interest_rate)}`}
                    >
                      {formatInterestRate(account.interest_rate)}
                    </Typography>
                  </Box>
                </Box>
              </CompactCardContent>
            </CompactCard>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default CombiSpaarDashboard;
