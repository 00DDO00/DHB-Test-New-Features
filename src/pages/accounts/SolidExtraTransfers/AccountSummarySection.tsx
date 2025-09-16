import React from 'react';
import { Box, Typography, Card, CardContent, Grid } from '@mui/material';
import { AccountData } from './types';

interface AccountSummarySectionProps {
  accountData?: AccountData;
  accountIban?: string;
  accountBalance?: string;
}

const AccountSummarySection: React.FC<AccountSummarySectionProps> = ({ accountData, accountIban, accountBalance }) => {
  return (
    <Card sx={{ mb: 0, backgroundColor: '#004996', color: 'white', borderRadius: '12px 12px 0 0' }}>
      <CardContent>
        <Grid container alignItems="center">
          {/* Left Side - Holder Name and IBAN */}
          <Grid item xs={12} md={4}>
            <Typography variant="h6" sx={{ mb: 1 }}>
              {accountData?.holder_name || 'Loading...'}
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.8 }}>
              {accountIban || 'NL24DHBN2018470601'}
            </Typography>
          </Grid>
          
          {/* Center - Balance */}
          <Grid item xs={12} md={4} sx={{ textAlign: 'center' }}>
            <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
              {accountBalance ? `€ ${parseFloat(accountBalance).toLocaleString('nl-NL', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : '€ 210.000,00'}
            </Typography>
          </Grid>
          
          {/* Right Side - Balance Classes and Rates Table */}
          <Grid item xs={12} md={4}>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', width: '100%' }}>
              <Box sx={{ width: '100%', maxWidth: '400px' }}>
                {/* Header Row */}
                <Box sx={{ display: 'flex', mb: 1, justifyContent: 'space-between' }}>
                  <Typography variant="body2" sx={{ fontWeight: 'bold', flex: 1, mr: 0.5 }}>
                    Balance class
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 'bold', minWidth: '60px', textAlign: 'right' }}>
                    Rente
                  </Typography>
                </Box>
                
                {/* Data Row 1 */}
                <Box sx={{ display: 'flex', mb: 1, justifyContent: 'space-between' }}>
                  <Typography variant="body2" sx={{ flex: 1, mr: 0.5, whiteSpace: 'nowrap' }}>
                    EUR 0,00 t/m EUR 100.000,00
                  </Typography>
                  <Typography variant="body2" sx={{ minWidth: '60px', textAlign: 'right' }}>
                    1.7 %
                  </Typography>
                </Box>
                
                {/* Data Row 2 */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2" sx={{ flex: 1, mr: 0.5, whiteSpace: 'nowrap' }}>
                    EUR 100.000,01 t/m EUR 500.000,00
                  </Typography>
                  <Typography variant="body2" sx={{ minWidth: '60px', textAlign: 'right' }}>
                    1.7 %
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
