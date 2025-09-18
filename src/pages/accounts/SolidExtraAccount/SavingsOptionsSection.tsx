import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Grid,
  Typography,
} from '@mui/material';
import {
  RadioButtonUnchecked,
  CheckCircle
} from '@mui/icons-material';
import { SavingsOptionsSectionProps, SolidExtraOption } from './types';

const SavingsOptionsSection: React.FC<SavingsOptionsSectionProps> = ({
  accountData,
  solidExtraOptions,
  onOpenAccount
}) => {
  const [selectedCard, setSelectedCard] = useState<string>('');

  return (
    <Box sx={{ width: '100%' }}>
      <Grid container spacing={2}>
        {solidExtraOptions.map((option) => {
          const isSelected = selectedCard === option.id;
          const guaranteedRate = option.id === '2-years' ? '1.50%' : 
                                option.id === '3-years' ? '2.00%' : 
                                option.id === '4-years' ? '2.25%' : '2.50%';
          
          return (
            <Grid item xs={12} sm={6} md={3} key={option.id}>
              <Card 
                sx={{ 
                  borderRadius: 2,
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                  border: isSelected ? '2px solid #4CAF50' : '2px solid #E0E0E0',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease-in-out',
                  '&:hover': {
                    borderColor: isSelected ? '#4CAF50' : '#BDBDBD'
                  }
                }}
                onClick={() => {
                  setSelectedCard(option.id);
                  onOpenAccount(option);
                }}
              >
                <CardContent sx={{ p: 3, position: 'relative' }}>
                  {/* Selection Icon */}
                  <Box sx={{ 
                    position: 'absolute', 
                    top: 16, 
                    right: 16 
                  }}>
                    {isSelected ? (
                      <CheckCircle sx={{ color: '#4CAF50', fontSize: 24 }} />
                    ) : (
                      <RadioButtonUnchecked sx={{ color: '#BDBDBD', fontSize: 24 }} />
                    )}
                  </Box>

                  {/* Card Content */}
                  <Box sx={{ pr: 4 }}>
                    {/* Duration */}
                    <Typography 
                      variant="h6" 
                      sx={{ 
                        fontWeight: 'bold', 
                        color: '#333',
                        mb: 1,
                        fontSize: '1.1rem'
                      }}
                    >
                      {option.term}
                    </Typography>

                    {/* Interest Label */}
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        color: '#333',
                        mb: 2,
                        fontSize: '0.9rem'
                      }}
                    >
                      Interest on annual basis
                    </Typography>

                    {/* Interest Rate */}
                    <Typography 
                      variant="h3" 
                      sx={{ 
                        fontWeight: 'bold', 
                        color: '#333',
                        fontSize: '2.5rem',
                        lineHeight: 1,
                        mb: 2
                      }}
                    >
                      + 0,05%
                    </Typography>

                    {/* Detailed Interest Information */}
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        color: '#666',
                        fontSize: '0.8rem',
                        lineHeight: 1.4
                      }}
                    >
                      {option.interest} (guaranteed base rate {guaranteedRate})
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>

    </Box>
  );
};

export default SavingsOptionsSection;
