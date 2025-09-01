import React from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Breadcrumbs,
  Link as MuiLink,
  Button,
  Fab,
} from '@mui/material';
import {
  Link as LinkIcon,
  ArrowForward,
  HeadsetMic,
  Home as HomeIcon,
} from '@mui/icons-material';
import { useNavigate, Link } from 'react-router-dom';
import { apiService } from '../services/api';

const OnlineIdentification: React.FC = () => {
  const navigate = useNavigate();
  const [userName, setUserName] = React.useState('Holder name');
  const [loading, setLoading] = React.useState(true);

  // Fetch user profile data on component mount
  React.useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const profile = await apiService.getUserProfile();
        setUserName(profile.holder_name);
      } catch (error) {
        console.error('Failed to fetch user profile:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  const handleCancel = () => {
    navigate('/settings');
  };

  const handleStartIdentification = () => {
    console.log('Starting online identification process');
    // TODO: Implement online identification process
  };

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      backgroundColor: '#f5f5f5',
      padding: '24px'
    }}>
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
          to="/settings"
          color="inherit"
          underline="hover"
          sx={{ cursor: 'pointer' }}
        >
          Settings
        </MuiLink>
        <Typography color="text.primary" fontWeight="bold">
          Online identification
        </Typography>
      </Breadcrumbs>

      {/* Main Content */}
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center',
        alignItems: 'flex-start',
        minHeight: 'calc(100vh - 120px)'
      }}>
        <Card sx={{ 
          width: '100%',
          maxWidth: 'none',
          backgroundColor: 'white',
          borderRadius: '8px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          minHeight: 'calc(100vh - 200px)'
        }}>
          <CardContent sx={{ padding: '32px' }}>
            {/* Title */}
            <Typography
              variant="h4"
              sx={{
                fontWeight: 700,
                color: '#333',
                mb: 2,
                fontSize: '24px',
              }}
            >
              Online identification
            </Typography>
            
            {/* Greeting */}
            <Typography
              variant="body1"
              sx={{
                color: '#333',
                mb: 8,
                fontSize: '16px',
              }}
            >
              Dear {userName},
            </Typography>

            {/* What should you do? Section */}
            <Box sx={{ mb: 4 }}>
              <Typography
                variant="h6"
                sx={{
                  color: '#333',
                  fontSize: '18px',
                  fontWeight: 600,
                  mb: 2,
                }}
              >
                What should you do?
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
                  Click on the Start online identification button below.
                </Typography>
                <Typography component="li" sx={{ mb: 2 }}>
                  Follow the on-screen prompt: take a photo of your valid passport (front and back) or identity card (front). Note: do not screen any data. We need these for reporting to the tax authorities. We do not accept a driving licence.
                </Typography>
                <Typography component="li" sx={{ mb: 2 }}>
                  Check the photo you took of your identity document. It must show your document clearly and completely.
                </Typography>
                <Typography component="li" sx={{ mb: 2 }}>
                  Click on Send.
                </Typography>
              </Box>
            </Box>

            {/* Joint account? Section */}
            <Box sx={{ mb: 4 }}>
              <Typography
                variant="h6"
                sx={{
                  color: '#333',
                  fontSize: '18px',
                  fontWeight: 600,
                  mb: 2,
                }}
              >
                Joint account?
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  color: '#333',
                  fontSize: '14px',
                  lineHeight: 1.6,
                }}
              >
                Do you also want to submit the valid ID of the joint account holder? They can do this themselves from their own online environment MijnNIBC. Unfortunately, it is not possible for you to do this here for your joint account holder as well.
              </Typography>
            </Box>

            {/* Action Buttons */}
            <Box sx={{ display: 'flex', gap: 2, mt: 4 }}>
              <Button
                variant="outlined"
                onClick={handleCancel}
                sx={{
                  borderColor: '#004996',
                  color: '#004996',
                  textTransform: 'none',
                  fontSize: '14px',
                  fontWeight: 500,
                  px: 3,
                  py: 1.5,
                  '&:hover': {
                    borderColor: '#003366',
                    backgroundColor: 'rgba(0, 73, 150, 0.04)',
                  },
                }}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                onClick={handleStartIdentification}
                sx={{
                  backgroundColor: '#FC9F15',
                  color: 'white',
                  textTransform: 'none',
                  fontSize: '14px',
                  fontWeight: 500,
                  px: 3,
                  py: 1.5,
                  '&:hover': {
                    backgroundColor: '#E68A0D',
                  },
                }}
                endIcon={<ArrowForward />}
              >
                Start online identification →
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Box>

      {/* Support FAB */}
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
        <HeadsetMic />
      </Fab>
    </Box>
  );
};

export default OnlineIdentification;
