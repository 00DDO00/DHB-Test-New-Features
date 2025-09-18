import React from 'react';
import {
  Box,
  Typography,
  Modal,
  IconButton,
  Button
} from '@mui/material';
import { Close as CloseIcon, CheckCircle as CheckCircleIcon } from '@mui/icons-material';

interface ExtendAccountCongratulationsModalProps {
  open: boolean;
  onClose: () => void;
  selectedPeriod: string;
}

const ExtendAccountCongratulationsModal: React.FC<ExtendAccountCongratulationsModalProps> = ({ 
  open, 
  onClose, 
  selectedPeriod 
}) => {
  const getPeriodLabel = (period: string) => {
    const periodMap: { [key: string]: string } = {
      '3-months': '3 months',
      '6-months': '6 months',
      '9-months': '9 months',
      '12-months': '12 months',
      '2-years': '2 years',
      '3-years': '3 years',
      '4-years': '4 years',
      '5-years': '5 years'
    };
    return periodMap[period] || period;
  };

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
        {/* Header */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            p: 3,
            borderBottom: '1px solid #e0e0e0',
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#004996' }}>
            Account Extended
          </Typography>
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>

        {/* Content */}
        <Box sx={{ flex: 1, p: 4, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          {/* Success icon */}
          <CheckCircleIcon 
            sx={{ 
              fontSize: 64, 
              color: '#4caf50', 
              mb: 3 
            }} 
          />

          {/* Title */}
          <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 2, color: '#004996', textAlign: 'center' }}>
            Congratulations!
          </Typography>

          {/* Message */}
          <Typography variant="body1" sx={{ mb: 3, color: '#666', textAlign: 'center' }}>
            Your MaxiSpaar account has been successfully extended for{' '}
            <strong>{getPeriodLabel(selectedPeriod)}</strong>.
          </Typography>

          <Typography variant="body2" sx={{ mb: 4, color: '#666', textAlign: 'center' }}>
            You will receive a confirmation email with all the details shortly.
          </Typography>

          {/* Close button */}
          <Button
            variant="contained"
            onClick={onClose}
            fullWidth
            sx={{
              backgroundColor: '#FC9F15',
              '&:hover': {
                backgroundColor: '#e88a0a',
              },
            }}
          >
            Close
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default ExtendAccountCongratulationsModal;
