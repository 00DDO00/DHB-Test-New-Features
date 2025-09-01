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
  Modal,
  IconButton,
} from '@mui/material';
import {
  Link as LinkIcon,
  ArrowForward,
  HeadsetMic,
  Home as HomeIcon,
} from '@mui/icons-material';
import { useNavigate, Link } from 'react-router-dom';

const RegisteredDevices: React.FC = () => {
  const navigate = useNavigate();
  const [lockAppPopupOpen, setLockAppPopupOpen] = React.useState(false);

  const handleLockApp = () => {
    setLockAppPopupOpen(true);
  };

  const handleCloseLockAppPopup = () => {
    setLockAppPopupOpen(false);
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
          Registered Devices
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
          maxWidth: '800px',
          backgroundColor: 'white',
          borderRadius: '8px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}>
          <CardContent sx={{ padding: '32px' }}>
            {/* Title */}
            <Typography
              variant="h4"
              sx={{
                fontWeight: 700,
                color: '#333',
                mb: 4,
                fontSize: '24px',
              }}
            >
              Registered devices
            </Typography>
            
            {/* Device Information */}
            <Box sx={{ mb: 4 }}>
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'flex-start',
                mb: 2
              }}>
                <Typography
                  variant="h6"
                  sx={{
                    color: '#333',
                    fontSize: '18px',
                    fontWeight: 600,
                  }}
                >
                  iPhone 12 Mini
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: '#4CAF50',
                    fontSize: '14px',
                    fontWeight: 500,
                  }}
                >
                  Active
                </Typography>
              </Box>
              
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center'
              }}>
                <Typography
                  variant="body2"
                  sx={{
                    color: '#666',
                    fontSize: '14px',
                  }}
                >
                  Last login on
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: '#333',
                    fontSize: '14px',
                    fontWeight: 500,
                  }}
                >
                  10.07.2025 15:26:16
                </Typography>
              </Box>
            </Box>

            {/* Action Button */}
            <Box sx={{ mt: 4 }}>
              <Button
                variant="contained"
                onClick={handleLockApp}
                fullWidth
                sx={{
                  backgroundColor: '#FC9F15',
                  color: 'white',
                  textTransform: 'none',
                  fontSize: '16px',
                  fontWeight: 500,
                  py: 2,
                  borderRadius: '4px',
                  '&:hover': {
                    backgroundColor: '#E68A0D',
                  },
                }}
                endIcon={<ArrowForward />}
              >
                Lock app →
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

      {/* Lock App Popup */}
      <Modal
        open={lockAppPopupOpen}
        onClose={handleCloseLockAppPopup}
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-end',
        }}
      >
        <Box
          sx={{
            width: '40%',
            height: '100vh',
            backgroundColor: 'white',
            overflow: 'auto',
            display: 'flex',
            flexDirection: 'column',
            backdropFilter: 'blur(4px)',
            padding: '24px',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
          }}
        >
          {/* Close Button */}
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
            <IconButton
              onClick={handleCloseLockAppPopup}
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

          {/* Title */}
          <Typography
            variant="h5"
            sx={{
              fontWeight: 700,
              color: '#333',
              mb: 4,
              fontSize: '20px',
            }}
          >
            Lock app
          </Typography>

          {/* Device Details Card */}
          <Card sx={{ 
            backgroundColor: 'white', 
            borderRadius: '8px', 
            padding: '24px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            mb: 4,
            border: '1px solid #E0E0E0',
          }}>
            <Box sx={{ mb: 2 }}>
              <Typography
                variant="h6"
                sx={{
                  color: '#333',
                  fontSize: '18px',
                  fontWeight: 600,
                  mb: 1,
                }}
              >
                iPhone 12 Mini
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: '#4CAF50',
                  fontSize: '14px',
                  fontWeight: 500,
                  mb: 2,
                }}
              >
                Active
              </Typography>
            </Box>
            
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center'
            }}>
              <Typography
                variant="body2"
                sx={{
                  color: '#666',
                  fontSize: '14px',
                }}
              >
                Last login on
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: '#333',
                  fontSize: '14px',
                  fontWeight: 500,
                }}
              >
                10.07.2025 15:26:16
              </Typography>
            </Box>
          </Card>

          {/* Action Buttons */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 'auto' }}>
            <Button
              variant="contained"
              onClick={handleCloseLockAppPopup}
              fullWidth
              sx={{
                backgroundColor: '#FC9F15',
                color: 'white',
                textTransform: 'none',
                fontSize: '16px',
                fontWeight: 500,
                py: 2,
                borderRadius: '4px',
                '&:hover': {
                  backgroundColor: '#E68A0D',
                },
              }}
              endIcon={<ArrowForward />}
            >
              Lock app →
            </Button>
            <Button
              variant="outlined"
              onClick={handleCloseLockAppPopup}
              fullWidth
              sx={{
                borderColor: '#333',
                color: '#333',
                textTransform: 'none',
                fontSize: '16px',
                fontWeight: 500,
                py: 2,
                borderRadius: '4px',
                '&:hover': {
                  borderColor: '#000',
                  backgroundColor: 'rgba(0, 0, 0, 0.04)',
                },
              }}
            >
              Cancel
            </Button>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
};

export default RegisteredDevices;
