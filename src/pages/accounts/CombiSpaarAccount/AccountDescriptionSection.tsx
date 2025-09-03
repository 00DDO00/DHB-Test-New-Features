import React from 'react';
import {
  Typography,
  Card,
  CardContent,
} from '@mui/material';
import { AccountDescriptionSectionProps } from './types';

const AccountDescriptionSection: React.FC<AccountDescriptionSectionProps> = ({ pageData }) => {
  return (
    <Card sx={{ mb: 3, backgroundColor: 'white', borderRadius: 2, boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
      <CardContent sx={{ p: 3 }}>
        <Typography variant="h5" fontWeight="bold" sx={{ mb: 2, color: '#333' }}>
          {pageData?.title || 'Save and still be able to withdraw money'}
        </Typography>
        <Typography variant="body1" color="#666" sx={{ lineHeight: 1.6 }}>
          {pageData?.description || 'The DHB CombiSpaarrekening offers a higher interest rate than the DHB SaveOnline because withdrawals are planned in advance. Depending on the chosen account, you can give 33, 66, or 99 days\' notice for withdrawals. A longer notice period results in a higher interest rate.'}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default AccountDescriptionSection;
