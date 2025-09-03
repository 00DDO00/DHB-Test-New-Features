import React from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
} from '@mui/material';
import { AccountSummarySectionProps } from './types';

const AccountSummarySection: React.FC<AccountSummarySectionProps> = ({ pageData }) => {
  return (
    <Card 
      sx={{ mb: 3, backgroundColor: 'white' }}
      role="region"
      aria-label="CombiSpaar account summary"
    >
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h4" color="#004996" fontWeight="bold">
            {pageData?.accountName || 'DHB SaveOnline'}
          </Typography>
          <Box sx={{ textAlign: 'right' }}>
            <Typography 
              variant="h5" 
              fontWeight="bold" 
              sx={{ mb: 1 }}
              aria-label={`Account balance: ${pageData?.balance || '€ 0,00'}`}
            >
              {pageData?.balance || '€ 0,00'}
            </Typography>
            <Typography 
              variant="body2" 
              color="text.secondary" 
              sx={{ mb: 0.5 }}
              aria-label={`IBAN Number: ${pageData?.iban || 'NL24DHBN2018470578'}`}
            >
              IBAN Number: {pageData?.iban || 'NL24DHBN2018470578'}
            </Typography>
            <Typography 
              variant="body2" 
              color="text.secondary"
              aria-label={`Cumulative Interest Amount: ${pageData?.interestRate || '1.1%'}`}
            >
              Cumulative Interest Amount: {pageData?.interestRate || '1.1%'}
            </Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default AccountSummarySection;
