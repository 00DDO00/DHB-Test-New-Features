import React from 'react';
import {
  Card,
  CardContent,
  Typography,
} from '@mui/material';
import { IntroductoryTextSectionProps, AccountData } from './types';

interface IntroductoryTextSectionWithDataProps extends IntroductoryTextSectionProps {
  accountData: AccountData | null;
}

const IntroductoryTextSection: React.FC<IntroductoryTextSectionWithDataProps> = ({ accountData }) => {
  return (
    <Card sx={{ 
      mb: 4,
      backgroundColor: 'white',
      borderRadius: 2,
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
    }}>
      <CardContent sx={{ p: 3 }}>
        <Typography variant="h5" fontWeight="bold" color="#333" sx={{ mb: 2 }}>
          {accountData?.title || 'Many choices of different terms'}
        </Typography>
        <Typography variant="body1" color="#666" sx={{ mb: 2, lineHeight: 1.6 }}>
          {accountData?.description || 'Do you want to benefit from a higher interest rate by fixing your savings for a certain period? With a DHB MaxiSpaar account, you can easily choose from different terms, from three months up to 5 years.'}
        </Typography>
        <Typography variant="body1" color="#666" sx={{ lineHeight: 1.6 }}>
          {accountData?.additional || 'If you already have a DHB SaveOnline account, you can immediately open a DHB MaxiSpaar account online. That is free.'}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default IntroductoryTextSection;
