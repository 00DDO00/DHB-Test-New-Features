import React from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Breadcrumbs,
  Link as MuiLink,
  IconButton,
  Fab,
} from '@mui/material';
import { useNavigate, Link } from 'react-router-dom';
import {
  Link as LinkIcon,
  ArrowForward,
  AccountBalance,
  Description,
  Person,
  PhoneAndroid,
  Computer,
  Schedule,
  Help,
  HeadsetMic,
  Home as HomeIcon,
} from '@mui/icons-material';

const Settings: React.FC = () => {
  const navigate = useNavigate();
  
  const settingsCards = [
    {
      id: 'counter-account',
      title: 'Counter account change',
      description: 'The setting allows you to select or change the default account for incoming funds.',
      icon: <AccountBalance sx={{ fontSize: 24, color: '#004996' }} />,
    },
    {
      id: 'documents',
      title: 'Documents',
      description: 'Allows you to view and manage files downloaded from online banking.',
      icon: <Description sx={{ fontSize: 24, color: '#004996' }} />,
    },
    {
      id: 'personal-info',
      title: 'Personal information',
      description: 'Allows you to update your contact details and personal information.',
      icon: <Person sx={{ fontSize: 24, color: '#004996' }} />,
    },
    {
      id: 'online-identification',
      title: 'Online identification',
      description: 'Used for remote identity verification via video call or digital documents.',
      icon: <PhoneAndroid sx={{ fontSize: 24, color: '#004996' }} />,
    },
    {
      id: 'devices',
      title: 'Devices',
      description: 'Allows you to view and manage devices connected to your account.',
      icon: <Computer sx={{ fontSize: 24, color: '#004996' }} />,
    },
    {
      id: 'day-limit',
      title: 'Change day limit',
      description: 'Allows you to set or change the maximum daily transaction limit.',
      icon: <Schedule sx={{ fontSize: 24, color: '#004996' }} />,
    },
    {
      id: 'sof-questions',
      title: 'SOF questions',
      description: 'Allows you to set or change the maximum daily transaction limit.',
      icon: <Help sx={{ fontSize: 24, color: '#004996' }} />,
    },
  ];

  const handleCardClick = (cardId: string) => {
    console.log(`Clicked on ${cardId}`);
    
    switch (cardId) {
      case 'counter-account':
        navigate('/settings/change-counter-account');
        break;
      case 'documents':
        navigate('/settings/documents');
        break;
      case 'personal-info':
        navigate('/settings/personal-details');
        break;
      case 'online-identification':
        navigate('/settings/online-identification');
        break;
      case 'devices':
        navigate('/settings/devices/registered');
        break;
      case 'day-limit':
        navigate('/settings/daily-limit');
        break;
      case 'sof-questions':
        navigate('/settings/sof-questions');
        break;
      default:
        // TODO: Implement navigation to other settings pages
        console.log(`Navigation for ${cardId} not implemented yet`);
    }
  };

  return (
    <Box sx={{ p: 3, backgroundColor: '#F5F5F5', minHeight: '100vh' }}>
      {/* Page heading */}
      <Typography
        component="h1"
        variant="h4"
        sx={{
          position: 'absolute',
          left: '-10000px',
          width: '1px',
          height: '1px',
          overflow: 'hidden'
        }}
      >
        Settings
      </Typography>
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
        <Typography color="text.primary" fontWeight="bold">
          Settings
        </Typography>
      </Breadcrumbs>

      {/* Account Settings Section */}
      <Typography
        component="h2"
        variant="h5"
        sx={{
          position: 'absolute',
          left: '-10000px',
          width: '1px',
          height: '1px',
          overflow: 'hidden'
        }}
      >
        Account Settings
      </Typography>
      
      {/* Settings Grid */}
      <Grid container spacing={4}>
        {settingsCards.map((card) => (
          <Grid item xs={12} sm={6} md={4} key={card.id}>
            <Card 
              sx={{ 
                borderRadius: 2,
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                cursor: 'pointer',
                transition: 'all 0.2s ease-in-out',
                '&:hover': {
                  boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                  transform: 'translateY(-2px)',
                }
              }}
              onClick={() => handleCardClick(card.id)}
              role="button"
              tabIndex={0}
              aria-label={`Navigate to ${card.title} settings`}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleCardClick(card.id);
                }
              }}
            >
              <CardContent sx={{ p: 3 }}>
                {/* Header with Icon and Arrow */}
                <Box sx={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'flex-start',
                  mb: 2
                }}>
                  {/* Icon */}
                  <Box 
                    sx={{
                      width: 48,
                      height: 48,
                      borderRadius: '50%',
                      backgroundColor: '#F0F0F0',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                    aria-hidden="true"
                  >
                    {card.icon}
                  </Box>
                  
                  {/* Arrow */}
                  <ArrowForward 
                    sx={{ color: '#666', fontSize: 20 }} 
                    aria-hidden="true"
                  />
                </Box>

                {/* Title */}
                <Typography 
                  variant="h6" 
                  fontWeight="bold" 
                  color="#333" 
                  sx={{ mb: 1 }}
                >
                  {card.title}
                </Typography>

                {/* Description */}
                <Typography 
                  variant="body2" 
                  color="#666" 
                  sx={{ lineHeight: 1.5 }}
                >
                  {card.description}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Floating Action Button */}
      <Fab
        color="primary"
        aria-label="support"
        sx={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          backgroundColor: '#4CAF50',
          '&:hover': {
            backgroundColor: '#45a049',
          },
        }}
      >
        <HeadsetMic sx={{ color: 'white' }} />
      </Fab>

    </Box>
  );
};

export default Settings;
