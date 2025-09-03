import React from 'react';
import {
  Card,
  CardContent,
  Grid,
  Typography,
} from '@mui/material';
import { AccountSummarySectionProps } from './types';

const AccountSummarySection: React.FC<AccountSummarySectionProps> = ({ accountData }) => {
  return (
    <Card 
      sx={{ 
        mb: 3,
        backgroundColor: 'white',
        borderRadius: 2,
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        border: '1px solid #E0E0E0'
      }}
      role="region"
      aria-label="SolidExtra account summary"
    >
      <CardContent sx={{ p: 3 }}>
        <Grid container spacing={3} alignItems="center">
          {/* Left Side */}
          <Grid item xs={12} md={6}>
            <Typography variant="h4" fontWeight="bold" color="#004996" sx={{ mb: 1 }}>
              {accountData?.main_account?.name || 'DHB SaveOnline'}
            </Typography>
            <Typography variant="body1" color="#666" sx={{ mb: 0.5 }} id="iban-label-solidextra">
              IBAN Number
            </Typography>
            <Typography variant="body1" color="#666" id="interest-label-solidextra">
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
              aria-labelledby="iban-label-solidextra"
              aria-label={`IBAN: ${accountData?.iban || 'NL24DHBN2018470578'}`}
            >
              {accountData?.iban || 'NL24DHBN2018470578'}
            </Typography>
            <Typography 
              variant="body1" 
              color="#666"
              aria-labelledby="interest-label-solidextra"
              aria-label={`Interest rate: ${accountData?.interest_rate || '1.1%'}`}
            >
              {accountData?.interest_rate || '1.1%'}
            </Typography>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default AccountSummarySection;
