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
import { SavingsOptionsSectionProps, SolidExtraOption } from './types';

const SavingsOptionsSection: React.FC<SavingsOptionsSectionProps> = ({
  accountData,
  solidExtraOptions,
  onOpenAccount
}) => {

  return (
    <Box sx={{ width: '100%' }}>
      <Grid container spacing={2}>
        {solidExtraOptions.map((option) => (
          <Grid item xs={12} sm={6} md={3} key={option.id}>
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

              {/* Guaranteed Basic Interest Rate */}
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                py: 2,
                borderBottom: '1px solid #E0E0E0'
              }}>
                <Typography variant="body1" fontWeight="bold" color="#000">
                  Guaranteed basic interest rate
                </Typography>
                <Typography variant="body1" color="#000">
                  {option.id === '2-years' ? '1.50%' : 
                   option.id === '3-years' ? '2.00%' : 
                   option.id === '4-years' ? '2.25%' : '2.50%'}
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
