import React, { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
} from '@mui/material';
import {
  RadioButtonUnchecked,
  CheckCircle
} from '@mui/icons-material';
import { AccountOptionsSectionProps } from './types';

const AccountOptionsSection: React.FC<AccountOptionsSectionProps> = ({
  loading,
  accountOptions,
  onOpenAccount
}) => {
  const [selectedCard, setSelectedCard] = useState<string>('1'); // Default to first card

  return (
    <>
      {/* Account Options Cards */}
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
          <Typography>Loading account options...</Typography>
        </Box>
      ) : (
        <Grid container spacing={3}>
          {accountOptions && Array.isArray(accountOptions) ? accountOptions.map((option) => {
            const isSelected = selectedCard === option.id;
            return (
              <Grid item xs={12} md={4} key={option.id}>
                <Card 
                  sx={{ 
                    backgroundColor: 'white', 
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
                        {option.days} days
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
                          lineHeight: 1
                        }}
                      >
                        {option.interest}
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            );
          }) : null}
        </Grid>
      )}

    </>
  );
};

export default AccountOptionsSection;
