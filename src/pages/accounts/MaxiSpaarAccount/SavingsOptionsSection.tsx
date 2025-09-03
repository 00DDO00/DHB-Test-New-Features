import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Grid,
  Typography,
  Button,
} from '@mui/material';
import {
  Add,
} from '@mui/icons-material';
import { SavingsOptionsSectionProps, MaxiSpaarOption, AccountData } from './types';

interface SavingsOptionsSectionWithDataProps extends SavingsOptionsSectionProps {
  accountData: AccountData | null;
}

const SavingsOptionsSection: React.FC<SavingsOptionsSectionWithDataProps> = ({
  accountData,
  onOpenAccount
}) => {
  const maxiSpaarOptions: MaxiSpaarOption[] = accountData?.account_options || [
    {
      id: '3-months',
      term: '3 maanden',
      interest: '1,85%',
      validFrom: '11.06.2025',
      balanceClass: '€ 500 to € 500,000',
      days: 90
    },
    {
      id: '6-months',
      term: '6 maanden',
      interest: '1,90%',
      validFrom: '18.07.2025',
      balanceClass: '€ 500 to € 500,000',
      days: 180
    },
    {
      id: '9-months',
      term: '9 maanden',
      interest: '1,95%',
      validFrom: '18.07.2025',
      balanceClass: '€ 500 to € 500,000',
      days: 270
    },
    {
      id: '12-months',
      term: '12 maanden',
      interest: '2,05%',
      validFrom: '11.06.2025',
      balanceClass: '€ 500 to € 500,000',
      days: 365
    },
    {
      id: '2-years',
      term: '2 jaar',
      interest: '2,10%',
      validFrom: '11.06.2025',
      balanceClass: '€ 500 to € 500,000',
      days: 730
    },
    {
      id: '3-years',
      term: '3 jaar',
      interest: '2,20%',
      validFrom: '18.07.2025',
      balanceClass: '€ 500 to € 500,000',
      days: 1095
    },
    {
      id: '4-years',
      term: '4 jaar',
      interest: '2,25%',
      validFrom: '11.06.2025',
      balanceClass: '€ 500 to € 500,000',
      days: 1460
    },
    {
      id: '5-years',
      term: '5 jaar',
      interest: '2,30%',
      validFrom: '11.06.2025',
      balanceClass: '€ 500 to € 500,000',
      days: 1825
    }
  ];

  return (
    <Box sx={{ width: '100%' }}>
      <Grid container spacing={2}>
        {maxiSpaarOptions.map((option) => (
          <Grid item xs={12} sm={6} md={4} key={option.id}>
          <Card sx={{ 
            borderRadius: 2,
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            border: '1px solid #E0E0E0',
            minHeight: '280px'
          }}>
            <CardContent sx={{ pl: 6, pr: 6, py: 4, flex: 1, display: 'flex', flexDirection: 'column' }}>
              {/* Balance Class */}
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                py: 2,
                borderBottom: '1px solid #E0E0E0'
              }}>
                <Typography variant="body1" fontWeight="bold" color="#000">
                  Balance Class
                </Typography>
                <Typography variant="body1" color="#000">
                  {option.balanceClass}
                </Typography>
              </Box>

              {/* Term */}
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                py: 2,
                borderBottom: '1px solid #E0E0E0'
              }}>
                <Typography variant="body1" fontWeight="bold" color="#000">
                  Term
                </Typography>
                <Typography variant="body1" color="#000">
                  {option.term}
                </Typography>
              </Box>

              {/* Interest */}
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                py: 2,
                borderBottom: '1px solid #E0E0E0'
              }}>
                <Typography variant="body1" fontWeight="bold" color="#000">
                  Interest
                </Typography>
                <Typography variant="body1" color="#000">
                  {option.interest}
                </Typography>
              </Box>

              {/* Valid From */}
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                py: 2,
                borderBottom: '1px solid #E0E0E0'
              }}>
                <Typography variant="body1" fontWeight="bold" color="#000">
                  Valid from
                </Typography>
                <Typography variant="body1" color="#000">
                  {option.validFrom}
                </Typography>
              </Box>

              {/* Open Account Button */}
              <Button
                variant="contained"
                startIcon={<Add />}
                onClick={() => onOpenAccount(option)}
                sx={{
                  backgroundColor: '#FC9F15',
                  color: 'white',
                  textTransform: 'none',
                  borderRadius: 2,
                  py: 4,
                  mt: 'auto',
                  fontWeight: 500,
                  width: '100%',
                  '&:hover': {
                    backgroundColor: '#e58a0d'
                  }
                }}
              >
                Open account +
              </Button>
            </CardContent>
          </Card>
        </Grid>
      ))}
      </Grid>
    </Box>
  );
};

export default SavingsOptionsSection;
