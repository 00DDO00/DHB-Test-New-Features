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
  Modal,
  Backdrop,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import {
  Link,
  ArrowForward,
  AccountBalance,
  Description,
  Person,
  PhoneAndroid,
  Security,
  Save,
  Computer,
  Schedule,
  Help,
  HeadsetMic,
  ArrowBack,
} from '@mui/icons-material';

const Settings: React.FC = () => {
  const navigate = useNavigate();
  const [devicesPopupOpen, setDevicesPopupOpen] = React.useState(false);
  
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
      id: 'login-confirmation',
      title: 'Login and confirmation',
      description: 'Allows you to manage login and transaction confirmation methods.',
      icon: <Security sx={{ fontSize: 24, color: '#004996' }} />,
    },
    {
      id: 'saving-profile',
      title: 'Saving Profile',
      description: 'Saves your settings and preferences for faster access on your next login.',
      icon: <Save sx={{ fontSize: 24, color: '#004996' }} />,
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
        setDevicesPopupOpen(true);
        // Wait 3 seconds then navigate to registered devices page
        setTimeout(() => {
          setDevicesPopupOpen(false);
          navigate('/settings/devices/registered');
        }, 3000);
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
      <Breadcrumbs sx={{ mb: 3 }}>
        <MuiLink 
          component={Link}
          to="/private" 
          color="inherit" 
          underline="hover"
          sx={{ cursor: 'pointer', color: '#666' }}
        >
          Home
        </MuiLink>
        <Typography color="text.primary" sx={{ color: '#666' }}>
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
                  <Box sx={{
                    width: 48,
                    height: 48,
                    borderRadius: '50%',
                    backgroundColor: '#F0F0F0',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                    {card.icon}
                  </Box>
                  
                  {/* Arrow */}
                  <ArrowForward sx={{ color: '#666', fontSize: 20 }} />
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

      {/* Devices QR Code Popup */}
      <Modal
        open={devicesPopupOpen}
        onClose={() => setDevicesPopupOpen(false)}
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-end',
        }}
      >
        <Box
          sx={{
            width: '35%',
            height: '100vh',
            backgroundColor: '#F3F3F3',
            overflow: 'auto',
            display: 'flex',
            flexDirection: 'column',
            backdropFilter: 'blur(4px)',
            padding: '24px',
          }}
        >
          {/* Close Button */}
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
            <IconButton
              onClick={() => setDevicesPopupOpen(false)}
              sx={{
                color: '#666',
                '&:hover': {
                  backgroundColor: 'rgba(0, 0, 0, 0.04)',
                },
              }}
            >
              ✕
            </IconButton>
          </Box>

          {/* Header */}
          <Box sx={{ mb: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <IconButton
                onClick={() => setDevicesPopupOpen(false)}
                sx={{
                  color: '#333',
                  mr: 1,
                  '&:hover': {
                    backgroundColor: 'rgba(0, 0, 0, 0.04)',
                  },
                }}
              >
                <ArrowBack />
              </IconButton>
              <Typography
                variant="body2"
                sx={{
                  color: '#333',
                  fontSize: '14px',
                  cursor: 'pointer',
                  '&:hover': {
                    textDecoration: 'underline',
                  },
                }}
              >
                Back
              </Typography>
            </Box>
            <Typography
              variant="h5"
              sx={{
                fontWeight: 700,
                color: '#333',
                fontSize: '20px',
              }}
            >
              Scan the QR code
            </Typography>
          </Box>

          {/* Main Content Card */}
          <Card sx={{ 
            backgroundColor: 'white', 
            borderRadius: '8px', 
            padding: '24px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
          }}>
            {/* How does it work? Section */}
            <Box sx={{ mb: 4 }}>
              <Typography
                variant="h6"
                sx={{
                  color: '#333',
                  fontSize: '16px',
                  fontWeight: 600,
                  mb: 2,
                }}
              >
                How does it work?
              </Typography>
              
              <Box component="ol" sx={{ 
                pl: 2,
                '& li': {
                  mb: 2,
                  color: '#333',
                  fontSize: '14px',
                  lineHeight: 1.6,
                }
              }}>
                <Typography component="li" sx={{ mb: 2 }}>
                  Grab your mobile phone and open the camera app.
                </Typography>
                <Typography component="li" sx={{ mb: 2 }}>
                  Point your smartphone at the QR code below. A yellow frame will appear around the QR code.
                </Typography>
                <Typography component="li" sx={{ mb: 2 }}>
                  Below the QR code, you will see where the code leads you. Tap it and the website will open automatically in your default browser. If it doesn't work, download a QR code scanner from the Google Play or App Store.
                </Typography>
              </Box>
            </Box>

            {/* QR Code */}
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'center', 
              mb: 4,
              flex: 1,
              alignItems: 'center'
            }}>
              <Box sx={{
                width: 200,
                height: 200,
                backgroundColor: 'white',
                border: '2px solid #333',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
              }}>
                {/* QR Code Pattern (simplified representation) */}
                <Box sx={{
                  width: '100%',
                  height: '100%',
                  backgroundImage: `
                    linear-gradient(90deg, #333 1px, transparent 1px),
                    linear-gradient(0deg, #333 1px, transparent 1px)
                  `,
                  backgroundSize: '20px 20px',
                  position: 'relative',
                }}>
                  {/* DHB Logo in center */}
                  <Box sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    backgroundColor: 'white',
                    padding: '8px',
                    borderRadius: '4px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    border: '1px solid #333',
                  }}>
                    <Typography
                      sx={{
                        color: '#004996',
                        fontSize: '12px',
                        fontWeight: 700,
                        lineHeight: 1,
                      }}
                    >
                      DHB
                    </Typography>
                    <Typography
                      sx={{
                        color: '#004996',
                        fontSize: '8px',
                        fontWeight: 400,
                        lineHeight: 1,
                      }}
                    >
                      BANK
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Box>

            {/* SMS Link */}
            <Box sx={{ textAlign: 'center' }}>
              <Typography
                variant="body2"
                sx={{
                  color: '#666',
                  fontSize: '14px',
                  cursor: 'pointer',
                  textDecoration: 'underline',
                  '&:hover': {
                    color: '#333',
                  },
                }}
              >
                Receive the link via SMS
              </Typography>
            </Box>
          </Card>
        </Box>
      </Modal>
    </Box>
  );
};

export default Settings;
