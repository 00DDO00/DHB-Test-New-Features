import React, { useState } from 'react';
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
  CheckCircle,
  RadioButtonUnchecked,
} from '@mui/icons-material';
import { SavingsOptionsSectionProps, MaxiSpaarOption, AccountData } from './types';

interface SavingsOptionsSectionWithDataProps extends SavingsOptionsSectionProps {
  accountData: AccountData | null;
}

const SavingsOptionsSection: React.FC<SavingsOptionsSectionWithDataProps> = ({
  accountData,
  onOpenAccount
}) => {
  const [selectedCard, setSelectedCard] = useState<string>('3-months');

  const maxiSpaarOptions: MaxiSpaarOption[] = accountData?.account_options || [
    {
      id: '3-months',
      term: '3 months',
      interest: '1,85%',
      validFrom: '11.06.2025',
      balanceClass: '€ 500 to € 500,000',
      days: 90
    },
    {
      id: '6-months',
      term: '6 months',
      interest: '1,90%',
      validFrom: '18.07.2025',
      balanceClass: '€ 500 to € 500,000',
      days: 180
    },
    {
      id: '9-months',
      term: '9 months',
      interest: '1,95%',
      validFrom: '18.07.2025',
      balanceClass: '€ 500 to € 500,000',
      days: 270
    },
    {
      id: '12-months',
      term: '12 months',
      interest: '2,05%',
      validFrom: '11.06.2025',
      balanceClass: '€ 500 to € 500,000',
      days: 365
    },
    {
      id: '2-years',
      term: '2 years',
      interest: '2,10%',
      validFrom: '11.06.2025',
      balanceClass: '€ 500 to € 500,000',
      days: 730
    },
    {
      id: '3-years',
      term: '3 years',
      interest: '2,20%',
      validFrom: '18.07.2025',
      balanceClass: '€ 500 to € 500,000',
      days: 1095
    },
    {
      id: '4-years',
      term: '4 years',
      interest: '2,25%',
      validFrom: '11.06.2025',
      balanceClass: '€ 500 to € 500,000',
      days: 1460
    },
    {
      id: '5-years',
      term: '5 years',
      interest: '2,30%',
      validFrom: '11.06.2025',
      balanceClass: '€ 500 to € 500,000',
      days: 1825
    }
  ];

  return (
    <Box sx={{ width: '100%' }}>
      {/* 2x4 Grid of Cards */}
      <Grid container spacing={2} sx={{ mb: 4 }}>
        {maxiSpaarOptions.map((option) => {
          const isSelected = selectedCard === option.id;
          return (
            <Grid item xs={12} sm={6} md={3} key={option.id}>
              <Card 
                sx={{ 
                  borderRadius: 2,
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  border: isSelected ? '2px solid #4CAF50' : '2px solid #E0E0E0',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease-in-out',
                  position: 'relative',
                  '&:hover': {
                    borderColor: isSelected ? '#4CAF50' : '#BDBDBD'
                  }
                }}
                onClick={() => {
                  setSelectedCard(option.id);
                  onOpenAccount(option);
                }}
              >
                <CardContent sx={{ p: 3, flex: 1, display: 'flex', flexDirection: 'column', position: 'relative' }}>
                  {/* Selection Icon - Top Right */}
                  <Box sx={{
                    position: 'absolute',
                    top: 12,
                    right: 12,
                    width: 24,
                    height: 24,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    {isSelected ? (
                      <CheckCircle sx={{ color: '#4CAF50', fontSize: 24 }} />
                    ) : (
                      <RadioButtonUnchecked sx={{ color: '#E0E0E0', fontSize: 24 }} />
                    )}
                  </Box>

                  {/* Duration - Top Left */}
                  <Typography variant="h6" fontWeight="bold" sx={{ color: '#333', mb: 1, fontSize: '1.1rem' }}>
                    {option.term}
                  </Typography>

                  {/* Interest Label */}
                  <Typography variant="body2" sx={{ color: '#666', mb: 2, fontSize: '0.9rem' }}>
                    Interest on annual basis
                  </Typography>

                  {/* Interest Rate - Large and Bold */}
                  <Typography variant="h3" fontWeight="bold" sx={{ color: '#333', fontSize: '2.5rem', lineHeight: 1 }}>
                    {option.interest}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>

      {/* Calculate Button */}
      <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
        <Button
          variant="text"
          onClick={() => {
            const selectedOption = maxiSpaarOptions.find(option => option.id === selectedCard);
            if (selectedOption) {
              // Calculate action - could show a calculation popup or navigate to a calculator page
              console.log('Calculate clicked for option:', selectedOption);
              // For now, just log the selection - you can implement calculation logic here
            }
          }}
          sx={{
            color: '#004996',
            textTransform: 'none',
            fontSize: '1.1rem',
            fontWeight: 500,
            '&:hover': {
              backgroundColor: 'rgba(0, 73, 150, 0.1)'
            }
          }}
        >
          Calculate →
        </Button>
      </Box>
    </Box>
  );
};

export default SavingsOptionsSection;
