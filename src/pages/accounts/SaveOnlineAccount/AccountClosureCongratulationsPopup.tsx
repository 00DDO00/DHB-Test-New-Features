import React from 'react';
import {
  Modal,
  Box,
  Typography,
  Button,
  IconButton,
  Card
} from '@mui/material';
import {
  Close as CloseIcon,
  Check as CheckIcon
} from '@mui/icons-material';

interface AccountClosureCongratulationsPopupProps {
  open: boolean;
  onClose: () => void;
  accountNumber: string;
}

const AccountClosureCongratulationsPopup: React.FC<AccountClosureCongratulationsPopupProps> = ({ 
  open, 
  onClose, 
  accountNumber 
}) => {
  return (
    <Modal
      open={open}
      onClose={onClose}
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        '& .MuiBackdrop-root': {
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          backdropFilter: 'blur(4px)',
        }
      }}
    >
      <Box
        sx={{
          width: '400px',
          height: '100vh',
          backgroundColor: '#F3F3F3',
          borderRadius: '8px 0 0 8px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
          overflow: 'auto',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        {/* Modal Header */}
        <Box sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          p: 3,
          borderBottom: '1px solid #e0e0e0'
        }}>
          <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#333' }}>
            Account Closure
          </Typography>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>

        {/* Modal Content - White Container */}
        <Box sx={{ p: 4, flex: 1, display: 'flex', alignItems: 'flex-start', justifyContent: 'center', pt: 6 }}>
          <Card sx={{
            backgroundColor: 'white',
            borderRadius: 2,
            p: 4,
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            width: '100%'
          }}>
            {/* Success Icon */}
            <Box sx={{
              width: 80,
              height: 80,
              borderRadius: '50%',
              backgroundColor: '#4CAF50',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto',
              mb: 3
            }}>
              <CheckIcon sx={{ color: 'white', fontSize: 40 }} />
            </Box>

            {/* Congratulations Heading */}
            <Typography variant="h5" fontWeight="bold" sx={{ mb: 2, color: '#2E7D32' }}>
              Congratulations!
            </Typography>

            {/* Success Message */}
            <Typography variant="body1" sx={{ mb: 4, color: '#333' }}>
              You have successfully delete {accountNumber} account
            </Typography>

            {/* Done Button */}
            <Button
              variant="contained"
              fullWidth
              onClick={onClose}
              sx={{
                backgroundColor: '#F5A623',
                color: 'white',
                textTransform: 'none',
                borderRadius: 2,
                py: 1.5,
                fontWeight: 500,
                '&:hover': {
                  backgroundColor: '#e6951a'
                }
              }}
            >
              Done
            </Button>
          </Card>
        </Box>
      </Box>
    </Modal>
  );
};

export default AccountClosureCongratulationsPopup;
