import React from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Button,
  Breadcrumbs,
  Link as MuiLink,
} from '@mui/material';
import {
  AccountBalance,
  Euro,
  TrendingUp,
  CheckCircle,
  Add,
  ArrowForward,
  Home as HomeIcon,
} from '@mui/icons-material';
import { Link, useNavigate } from 'react-router-dom';

const OpenAccount: React.FC = () => {
  const navigate = useNavigate();
  const accountTypes = [
    {
      id: 'combispaar',
      title: 'DHB CombiSpaarrekening',
      subtitle: 'Your term deposits',
      icon: <AccountBalance sx={{ color: '#4CAF50', fontSize: 32 }} />,
      interestRate: '2.10%',
      term: '1 year fixed',
      basis: '(Annual basis)',
      description: 'Lock in your savings for a term that you choose yourself. You decide when you think you will need it. At a guaranteed fixed interest rate. For a secure future, that new car or kitchen or sustainable renovation. Nice, right!',
      features: [
        'No deposit account required',
        'Deposit when you want',
        'Investment € 500 to € 500,000'
      ]
    },
    {
      id: 'maxispaar',
      title: 'DHB MaxiSpaarrekening',
      subtitle: 'Your term deposits',
      icon: <Euro sx={{ color: '#4CAF50', fontSize: 32 }} />,
      interestRate: '2.10%',
      term: '1 year fixed',
      basis: '(Annual basis)',
      description: 'Lock in your savings for a term that you choose yourself. You decide when you think you will need it. At a guaranteed fixed interest rate. For a secure future, that new car or kitchen or sustainable renovation. Nice, right!',
      features: [
        'Terms from 3 months up to 5 years',
        'One-time investment € 500 to € 500,000',
        'Fixed interest rate'
      ]
    },
    {
      id: 'solidextra',
      title: 'Solidextra Deposit Account',
      subtitle: 'Your term deposits',
      icon: <TrendingUp sx={{ color: '#4CAF50', fontSize: 32 }} />,
      interestRate: '2.10%',
      term: '1 year fixed',
      basis: '(Annual basis)',
      description: 'Lock in your savings for a term that you choose yourself. You decide when you think you will need it. At a guaranteed fixed interest rate. For a secure future, that new car or kitchen or sustainable renovation. Nice, right!',
      features: [
        'Terms from 2 up to 5 years',
        'One-time investment € 500 to € 500,000',
        'Annual interest payment to DHB SaveOnline account'
      ]
    }
  ];

  const handleOpenAccount = (accountType: string) => {
    if (accountType === 'combispaar') {
      navigate('/accounts/combispaar');
    } else if (accountType === 'maxispaar') {
      navigate('/accounts/maxispaar');
    } else if (accountType === 'solidextra') {
      navigate('/accounts/solidextra');
    } else {
      console.log(`Opening ${accountType} account`);
      // TODO: Implement account opening logic for other account types
    }
  };

  const handleMoreDetails = (accountType: string) => {
    console.log(`More details for ${accountType}`);
    // TODO: Implement more details logic
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Breadcrumbs */}
      <Breadcrumbs sx={{ mb: 3 }} aria-label="breadcrumb navigation">
        <MuiLink 
          component={Link}
          to="/private" 
          color="inherit" 
          underline="hover"
          sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}
        >
          <HomeIcon sx={{ mr: 0.5, fontSize: 20 }} />
          Home
        </MuiLink>
        <MuiLink 
          component={Link}
          to="/accounts" 
          color="inherit" 
          underline="hover" 
          sx={{ cursor: 'pointer' }}
        >
          Accounts
        </MuiLink>
        <Typography color="text.primary" fontWeight="bold">
          Open account
        </Typography>
      </Breadcrumbs>



      {/* Account Cards Grid */}
      <Grid container spacing={3} sx={{ maxWidth: 1020, mx: 'auto' }}>
        {accountTypes.map((account, index) => (
          <Grid item xs={12} md={6} lg={4} key={account.id}>
            <Card sx={{ 
              borderRadius: 3, 
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
              height: '100%',
              display: 'flex',
              flexDirection: 'column'
            }}>
              <CardContent sx={{ p: 3, flex: 1, display: 'flex', flexDirection: 'column' }}>
                {/* Header with icon, title, subtitle and interest rate */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    {account.icon}
                    <Box>
                      <Typography variant="h6" fontWeight="bold" sx={{ color: '#333' }}>
                        {account.title}
                      </Typography>
                      <Typography variant="body2" color="#666">
                        {account.subtitle}
                      </Typography>
                    </Box>
                  </Box>
                  <Box sx={{ textAlign: 'right' }}>
                    <Typography variant="h4" fontWeight="bold" color="#4CAF50">
                      {account.interestRate}
                    </Typography>
                    <Typography variant="body2" color="#666">
                      {account.term}
                    </Typography>
                    <Typography variant="caption" color="#666">
                      {account.basis}
                    </Typography>
                  </Box>
                </Box>

                {/* Description */}
                <Typography variant="body2" color="#666" sx={{ mb: 3, flex: 1 }}>
                  {account.description}
                </Typography>

                {/* Features */}
                <Box sx={{ mb: 3 }}>
                  {account.features.map((feature, featureIndex) => (
                    <Box key={featureIndex} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <CheckCircle sx={{ color: '#4CAF50', fontSize: 20, mr: 1 }} />
                      <Typography variant="body2" color="#666">
                        {feature}
                      </Typography>
                    </Box>
                  ))}
                </Box>

                {/* Buttons */}
                <Box sx={{ display: 'flex', gap: 2, mt: 'auto' }}>
                  <Button
                    variant="contained"
                    onClick={() => handleOpenAccount(account.id)}
                    sx={{
                      backgroundColor: '#FC9F15',
                      color: 'white',
                      textTransform: 'none',
                      borderRadius: 2,
                      px: 3,
                      py: 2,
                      flex: 1,
                      fontWeight: 500,
                      '&:hover': {
                        backgroundColor: '#e58a0d'
                      }
                    }}
                  >
                    Open account +
                  </Button>
                  <Button
                    variant="outlined"
                    onClick={() => handleMoreDetails(account.id)}
                    sx={{
                      borderColor: '#004996',
                      color: '#004996',
                      textTransform: 'none',
                      borderRadius: 2,
                      px: 3,
                      py: 2,
                      flex: 1,
                      fontWeight: 500,
                      '&:hover': {
                        borderColor: '#004996',
                        backgroundColor: 'rgba(0, 73, 150, 0.1)'
                      }
                    }}
                  >
                    More details →
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default OpenAccount;
