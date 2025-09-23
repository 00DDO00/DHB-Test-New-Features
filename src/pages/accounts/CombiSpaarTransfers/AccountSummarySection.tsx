import React from 'react';
import { Box, Typography, Card, CardContent, Grid } from '@mui/material';
import { AccountData } from './types';

interface AccountSummarySectionProps {
  accountData?: AccountData;
  accountIban?: string;
  accountBalance?: string;
}

const AccountSummarySection: React.FC<AccountSummarySectionProps> = ({ accountData, accountIban, accountBalance }) => {
  const parseEuroToNumber = (value?: string) => {
    if (!value) return 0;
    const cleaned = value.replace(/[^0-9,.-]/g, '').replace(/\./g, '').replace(/,(\d{2})$/, '.$1');
    const num = parseFloat(cleaned);
    return isNaN(num) ? 0 : num;
  };
  const formatEuro = (value: number) => `€ ${value.toLocaleString('nl-NL', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  const balanceNumber = accountBalance ? parseEuroToNumber(accountBalance) : 150000;
  const ratePct = 2.2;
  const accrued = balanceNumber * (ratePct / 100);
  return (
      <Card sx={{ mb: 0, backgroundColor: '#004996', color: 'white', borderRadius: '12px 12px 0 0' }}>
      <CardContent>
        <Grid container alignItems="center">
          {/* Left Side - Holder Name and IBAN */}
          <Grid item xs={12} md={4}>
            <Typography variant="h6" sx={{ mb: 1 }}>
              {accountData?.holder_name || 'Loading...'} ⏐ CombiSpaar
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.8 }}>
              {accountIban || 'NL24DHBN2018470581'}
            </Typography>
          </Grid>
          
          {/* Center - Balance */}
          <Grid item xs={12} md={4} sx={{ textAlign: 'center' }}>
            <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
              {accountBalance ? `€ ${parseFloat(accountBalance).toLocaleString('nl-NL', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : '€ 150.000,00'}
            </Typography>
          </Grid>
          
          {/* Right Side - Cumulative and Accrued interest */}
          <Grid item xs={12} md={4}>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', width: '100%' }}>
              <Box sx={{ width: '100%', maxWidth: '400px' }}>
                <Box sx={{ display: 'flex', mb: 1, justifyContent: 'space-between' }}>
                  <Typography variant="body2" sx={{ fontWeight: 'bold', flex: 1, mr: 0.5, color: 'white' }}>
                    Cumulative interest rate
                  </Typography>
                  <Typography variant="body2" sx={{ minWidth: '60px', textAlign: 'right', color: 'white' }}>
                    {ratePct.toFixed(1)}%
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2" sx={{ flex: 1, mr: 0.5, color: 'white' }}>
                    Accrued interest
                  </Typography>
                  <Typography variant="body2" sx={{ minWidth: '60px', textAlign: 'right', color: 'white' }}>
                    {formatEuro(accrued)}
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default AccountSummarySection;
