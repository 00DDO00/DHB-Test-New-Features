import React from 'react';
import {
  Card,
  CardContent,
  Typography,
} from '@mui/material';
import { IntroductoryTextSectionProps } from './types';

const IntroductoryTextSection: React.FC<IntroductoryTextSectionProps> = ({ accountData }) => {
  return (
    <Card sx={{ 
      mb: 4,
      backgroundColor: 'white',
      borderRadius: 2,
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
    }}>
      <CardContent sx={{ p: 3 }}>
        <Typography variant="h5" fontWeight="bold" color="#333" sx={{ mb: 2 }}>
          {accountData?.title || 'Save and profit from interest rate increases'}
        </Typography>
        <Typography variant="body1" color="#666" sx={{ mb: 2, lineHeight: 1.6 }}>
          {accountData?.description || 'With the DHB SolidExtra Deposit Account, you benefit from Euribor interest rate increases while having a guaranteed basic interest rate. This means you always receive at least the guaranteed interest rate, but you can also benefit from higher interest rates when Euribor rises.'}
        </Typography>
        <Typography variant="body1" color="#666" sx={{ lineHeight: 1.6 }}>
          {accountData?.additional || 'If you already have a DHB SaveOnline account, you can immediately open a DHB SolidExtra Deposit Account online for free.'}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default IntroductoryTextSection;
