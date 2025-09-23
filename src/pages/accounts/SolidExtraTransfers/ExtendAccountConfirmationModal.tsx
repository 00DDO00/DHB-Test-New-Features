import React from 'react';
import {
  Box,
  Typography,
  Modal,
  IconButton,
  Button
} from '@mui/material';
import { Close as CloseIcon, ArrowForward } from '@mui/icons-material';

interface ExtendAccountConfirmationModalProps {
  open: boolean;
  onClose: () => void;
  onEdit: () => void;
  onConfirm: () => void;
  extensionType: string;
  amount?: string;
  selectedTerm: string;
}

const ExtendAccountConfirmationModal: React.FC<ExtendAccountConfirmationModalProps> = ({ 
  open, 
  onClose, 
  onEdit,
  onConfirm,
  extensionType,
  amount,
  selectedTerm
}) => {
  const getExtensionTypeLabel = (type: string) => {
    const typeMap: { [key: string]: string } = {
      'different-amount': 'Extend with a different amount',
      'principal-only': 'Extend principal amount only',
      'principal-interest': 'Extend principal amount and interest'
    };
    return typeMap[type] || type;
  };

  const getTermLabel = (term: string) => {
    const termMap: { [key: string]: string } = {
      '2-years': '2 years',
      '3-years': '3 years',
      '4-years': '4 years',
      '5-years': '5 years'
    };
    return termMap[term] || term;
  };

  // Calculate maturity date (1 year from now for SolidExtra)
  const getMaturityDate = () => {
    const date = new Date();
    date.setFullYear(date.getFullYear() + 1);
    return date.toLocaleDateString('en-GB', { 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric' 
    });
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
        },
      }}
    >
      <Box
        sx={{
          width: '500px',
          height: '100vh',
          backgroundColor: '#f3f3f3',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '-4px 0 8px rgba(0, 0, 0, 0.1)',
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
            Account details
          </Typography>
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>

        {/* Content */}
        <Box sx={{ flex: 1, p: 3, overflow: 'auto', display: 'flex', justifyContent: 'center' }}>
          <Box sx={{ 
            width: '100%', 
            maxWidth: '400px',
            backgroundColor: 'white',
            borderRadius: 2,
            p: 3,
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
          }}>
            {/* Account Details */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body2" sx={{ color: '#666' }}>Contra account:</Typography>
                <Typography variant="body2" sx={{ fontWeight: 'bold' }}>NLXX BANK 0000 000</Typography>
              </Box>
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body2" sx={{ color: '#666' }}>Term:</Typography>
                <Typography variant="body2" sx={{ fontWeight: 'bold' }}>{getTermLabel(selectedTerm)}</Typography>
              </Box>
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body2" sx={{ color: '#666' }}>Account holder(s):</Typography>
                <Typography variant="body2" sx={{ fontWeight: 'bold' }}>A DERWISH</Typography>
              </Box>
              
              {/* Only show amount if extension type is "different-amount" */}
              {extensionType === 'different-amount' && amount && (
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2" sx={{ color: '#666' }}>Amount:</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 'bold' }}>€ {amount}</Typography>
                </Box>
              )}
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body2" sx={{ color: '#666' }}>Maturity Date:</Typography>
                <Typography variant="body2" sx={{ fontWeight: 'bold' }}>{getMaturityDate()}</Typography>
              </Box>
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body2" sx={{ color: '#666' }}>Selected choose option:</Typography>
                <Typography variant="body2" sx={{ fontWeight: 'bold' }}>{getExtensionTypeLabel(extensionType)}</Typography>
              </Box>
            </Box>

            {/* Edit Link */}
            <Box sx={{ mt: 3, textAlign: 'center' }}>
              <Typography 
                variant="body2" 
                sx={{ 
                  color: '#1976d2', 
                  cursor: 'pointer',
                  textDecoration: 'underline',
                  '&:hover': {
                    textDecoration: 'none'
                  }
                }}
                onClick={onEdit}
              >
                Edit →
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* Footer */}
        <Box
          sx={{
            p: 3,
            borderTop: '1px solid #e0e0e0',
            display: 'flex',
            gap: 2,
            justifyContent: 'space-between',
          }}
        >
          <Button
            variant="contained"
            onClick={onConfirm}
            endIcon={<ArrowForward />}
            sx={{
              backgroundColor: '#FC9F15',
              '&:hover': {
                backgroundColor: '#e88a0a',
              },
            }}
          >
            Confirm
          </Button>
          <Button
            variant="outlined"
            onClick={onClose}
            sx={{
              borderColor: '#004996',
              color: '#004996',
              '&:hover': {
                borderColor: '#004996',
                backgroundColor: 'rgba(0, 73, 150, 0.1)',
              },
            }}
          >
            Cancel
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default ExtendAccountConfirmationModal;
