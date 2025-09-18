import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Modal,
  IconButton,
  Button,
  Card,
  CardContent,
  Grid,
  CircularProgress
} from '@mui/material';
import { Close as CloseIcon, CheckCircle, RadioButtonUnchecked } from '@mui/icons-material';
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
}

const ExtendAccountModal: React.FC<ExtendAccountModalProps> = ({ open, onClose, onConfirm }) => {
  const [selectedPeriod, setSelectedPeriod] = useState('');
  const [maxiSpaarOptions, setMaxiSpaarOptions] = useState<MaxiSpaarOption[]>([]);
  const [loading, setLoading] = useState(false);

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
    if (selectedPeriod) {
      onConfirm(selectedPeriod);
    }
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
            Extend Account
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
            <Typography variant="body2" sx={{ mb: 3, color: '#666', textAlign: 'center' }}>
              Choose a new period for your MaxiSpaar account
            </Typography>
            
            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                <CircularProgress />
              </Box>
            ) : (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {maxiSpaarOptions.map((option) => {
                  const isSelected = selectedPeriod === option.id;
                  return (
                    <Card 
                      key={option.id}
                      sx={{ 
                        borderRadius: 1,
                        border: isSelected ? '2px solid #004996' : '1px solid #e0e0e0',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease-in-out',
                        '&:hover': {
                          borderColor: isSelected ? '#004996' : '#004996',
                          backgroundColor: isSelected ? 'rgba(0, 73, 150, 0.05)' : 'rgba(0, 73, 150, 0.02)'
                        },
                        backgroundColor: isSelected ? 'rgba(0, 73, 150, 0.05)' : 'white'
                      }}
                      onClick={() => setSelectedPeriod(option.id)}
                    >
                      <CardContent sx={{ p: 2.5 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          {/* Left side - Duration and details */}
                          <Box sx={{ flex: 1 }}>
                            <Typography 
                              variant="h6" 
                              sx={{ 
                                fontWeight: 'bold', 
                                color: '#004996',
                                mb: 0.5,
                                fontSize: '1rem'
                              }}
                            >
                              {option.term}
                            </Typography>
                            
                            <Typography 
                              variant="body2" 
                              sx={{ 
                                color: '#666',
                                mb: 1,
                                fontSize: '0.85rem'
                              }}
                            >
                              Interest on annual basis
                            </Typography>

                            <Typography 
                              variant="body2" 
                              sx={{ 
                                color: '#666',
                                fontSize: '0.8rem',
                                lineHeight: 1.3
                              }}
                            >
                              {option.balanceClass}
                            </Typography>
                          </Box>

                          {/* Right side - Interest rate and selection */}
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Typography 
                              variant="h5" 
                              sx={{ 
                                fontWeight: 'bold', 
                                color: '#004996',
                                fontSize: '1.5rem'
                              }}
                            >
                              {option.interest}
                            </Typography>
                            
                            {isSelected ? (
                              <CheckCircle sx={{ color: '#004996', fontSize: 20 }} />
                            ) : (
                              <RadioButtonUnchecked sx={{ color: '#ccc', fontSize: 20 }} />
                            )}
                          </Box>
                        </Box>
                      </CardContent>
                    </Card>
                  );
                })}
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
            disabled={!selectedPeriod}
            sx={{
              backgroundColor: '#FC9F15',
              '&:hover': {
                backgroundColor: '#e88a0a',
              },
            }}
          >
            Confirm
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default ExtendAccountModal;
