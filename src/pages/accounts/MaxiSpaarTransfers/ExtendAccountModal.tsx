import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Modal,
  IconButton,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  CircularProgress
} from '@mui/material';
import { Close as CloseIcon, ArrowForward } from '@mui/icons-material';
import { apiService } from '../../../services/api';

interface MaxiSpaarOption {
  id: string;
  term: string;
  interest: string;
  validFrom: string;
  balanceClass: string;
  days: number;
}

interface ExtendAccountModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (selectedPeriod: string) => void;
  onShowConfirmation: (extensionType: string, amount: string, selectedTerm: string) => void;
}

const ExtendAccountModal: React.FC<ExtendAccountModalProps> = ({ open, onClose, onConfirm, onShowConfirmation }) => {
  const [extensionType, setExtensionType] = useState('different-amount');
  const [amount, setAmount] = useState('');
  const [selectedTerm, setSelectedTerm] = useState('');
  const [maxiSpaarOptions, setMaxiSpaarOptions] = useState<MaxiSpaarOption[]>([]);
  const [loading, setLoading] = useState(false);

  // Extension type options
  const extensionOptions = [
    { value: 'different-amount', label: 'Extend with a different amount' },
    { value: 'principal-only', label: 'Extend principal amount only' },
    { value: 'principal-interest', label: 'Extend principal amount and interest' }
  ];

  // Fetch MaxiSpaar options from API
  useEffect(() => {
    if (open) {
      fetchMaxiSpaarOptions();
    }
  }, [open]);

  const fetchMaxiSpaarOptions = async () => {
    setLoading(true);
    try {
      const options = await apiService.getMaxiSpaarOptions();
      setMaxiSpaarOptions(options);
    } catch (error) {
      console.error('Error fetching MaxiSpaar options:', error);
      // Fallback data
      setMaxiSpaarOptions([
        {
          id: '3-months',
          term: '3 months',
          interest: '1,85%',
          validFrom: '11.06.2025',
          balanceClass: '€ 500 to € 500,000',
          days: 90
        },
        {
          id: '6-months',
          term: '6 months',
          interest: '1,90%',
          validFrom: '18.07.2025',
          balanceClass: '€ 500 to € 500,000',
          days: 180
        },
        {
          id: '9-months',
          term: '9 months',
          interest: '1,95%',
          validFrom: '18.07.2025',
          balanceClass: '€ 500 to € 500,000',
          days: 270
        },
        {
          id: '12-months',
          term: '12 months',
          interest: '2,05%',
          validFrom: '11.06.2025',
          balanceClass: '€ 500 to € 500,000',
          days: 365
        },
        {
          id: '2-years',
          term: '2 years',
          interest: '2,10%',
          validFrom: '11.06.2025',
          balanceClass: '€ 500 to € 500,000',
          days: 730
        },
        {
          id: '3-years',
          term: '3 years',
          interest: '2,20%',
          validFrom: '18.07.2025',
          balanceClass: '€ 500 to € 500,000',
          days: 1095
        },
        {
          id: '4-years',
          term: '4 years',
          interest: '2,25%',
          validFrom: '11.06.2025',
          balanceClass: '€ 500 to € 500,000',
          days: 1460
        },
        {
          id: '5-years',
          term: '5 years',
          interest: '2,30%',
          validFrom: '18.07.2025',
          balanceClass: '€ 500 to € 500,000',
          days: 1825
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirm = () => {
    if (selectedTerm) {
      onShowConfirmation(extensionType, amount, selectedTerm);
    }
  };

  const isFormValid = () => {
    if (extensionType === 'different-amount') {
      return selectedTerm && amount && parseFloat(amount) > 0;
    }
    return selectedTerm;
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
            Account extension
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
            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                <CircularProgress />
              </Box>
            ) : (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                {/* Close option selection */}
                <FormControl fullWidth>
                  <InputLabel id="extension-type-label">Close option selection</InputLabel>
                  <Select
                    labelId="extension-type-label"
                    value={extensionType}
                    label="Close option selection"
                    onChange={(e) => setExtensionType(e.target.value)}
                    sx={{
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#1976d2',
                      },
                      '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#1976d2',
                      },
                      '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#1976d2',
                      },
                    }}
                  >
                    {extensionOptions.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                {/* Amount entry - only show for "different amount" option */}
                {extensionType === 'different-amount' && (
                  <Box>
                    <Typography variant="body2" sx={{ mb: 1, color: '#666' }}>
                      Amount entry
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                      <TextField
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder="000"
                        variant="outlined"
                        size="small"
                        sx={{ flex: 1 }}
                        inputProps={{ style: { textAlign: 'center' } }}
                      />
                      <TextField
                        placeholder="00"
                        variant="outlined"
                        size="small"
                        sx={{ width: '60px' }}
                        inputProps={{ style: { textAlign: 'center' } }}
                      />
                      <Typography variant="body1" sx={{ color: '#666', ml: 1 }}>
                        €
                      </Typography>
                    </Box>
                  </Box>
                )}

                {/* Term selection */}
                <FormControl fullWidth>
                  <InputLabel id="term-selection-label">Term selection</InputLabel>
                  <Select
                    labelId="term-selection-label"
                    value={selectedTerm}
                    label="Term selection"
                    onChange={(e) => setSelectedTerm(e.target.value)}
                    sx={{
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#1976d2',
                      },
                      '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#1976d2',
                      },
                      '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#1976d2',
                      },
                    }}
                  >
                    {maxiSpaarOptions.map((option) => (
                      <MenuItem key={option.id} value={option.id}>
                        {option.term}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>
            )}
          </Box>
        </Box>

        {/* Footer */}
        <Box
          sx={{
            p: 3,
            borderTop: '1px solid #e0e0e0',
            display: 'flex',
            gap: 2,
            justifyContent: 'flex-end',
          }}
        >
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
          <Button
            variant="contained"
            onClick={handleConfirm}
            disabled={!isFormValid()}
            endIcon={<ArrowForward />}
            sx={{
              backgroundColor: '#FC9F15',
              '&:hover': {
                backgroundColor: '#e88a0a',
              },
            }}
          >
            Next
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default ExtendAccountModal;