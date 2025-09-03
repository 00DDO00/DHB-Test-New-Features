import React from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Button,
} from '@mui/material';
import {
  Add,
} from '@mui/icons-material';
import { AccountOptionsSectionProps } from './types';

const AccountOptionsSection: React.FC<AccountOptionsSectionProps> = ({
  loading,
  accountOptions,
  onOpenAccount
}) => {
  return (
    <>
      {/* Account Options Cards */}
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
          <Typography>Loading account options...</Typography>
        </Box>
      ) : (
        <Grid container spacing={3}>
          {accountOptions && Array.isArray(accountOptions) ? accountOptions.map((option) => (
          <Grid item xs={12} md={4} key={option.id}>
            <Card sx={{ 
              backgroundColor: 'white', 
              borderRadius: 2, 
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              height: '100%',
              display: 'flex',
              flexDirection: 'column'
            }}>
              <CardContent sx={{ p: 3, flex: 1, display: 'flex', flexDirection: 'column' }}>
                {/* Account Details */}
                <Box sx={{ mb: 3, flex: 1 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="body2" color="#666">Balance Class</Typography>
                    <Typography variant="body2" fontWeight="medium">{option.balanceClass}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="body2" color="#666">Notice Period</Typography>
                    <Typography variant="body2" fontWeight="medium">{option.noticePeriod}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="body2" color="#666">Interest</Typography>
                    <Typography variant="body2" fontWeight="medium" color="#4CAF50">{option.interest}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="body2" color="#666">Valid from</Typography>
                    <Typography variant="body2" fontWeight="medium">{option.validFrom}</Typography>
                  </Box>
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
                    py: 1.5,
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
        )) : null}
        </Grid>
      )}
    </>
  );
};

export default AccountOptionsSection;
