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

interface SolidExtraOption {
  id: string;
  term: string;
  interest: string;
  validFrom: string;
  balanceClass: string;
  days: number;
  guaranteedRate: string;
}

interface ExtendAccountModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (selectedPeriod: string) => void;
}

const ExtendAccountModal: React.FC<ExtendAccountModalProps> = ({ open, onClose, onConfirm }) => {
  const [selectedPeriod, setSelectedPeriod] = useState('');
  const [solidExtraOptions, setSolidExtraOptions] = useState<SolidExtraOption[]>([]);
  const [loading, setLoading] = useState(false);

  // Fetch SolidExtra options from API
  useEffect(() => {
    if (open) {
      fetchSolidExtraOptions();
    }
  }, [open]);

  const fetchSolidExtraOptions = async () => {
    setLoading(true);
    try {
      const options = await apiService.getSolidExtraOptions();
      setSolidExtraOptions(options);
    } catch (error) {
      console.error('Error fetching SolidExtra options:', error);
      // Fallback data
      setSolidExtraOptions([
        {
          id: '2-years',
          term: '2 years',
          interest: '3 months Euribor + 0.05%',
          validFrom: '11.06.2025',
          balanceClass: 'EUR 0,00 t/m EUR 100.000,00',
          days: 730,
          guaranteedRate: '1.50%'
        },
        {
          id: '3-years',
          term: '3 years',
          interest: '3 months Euribor + 0.05%',
          validFrom: '11.06.2025',
          balanceClass: 'EUR 0,00 t/m EUR 100.000,00',
          days: 1095,
          guaranteedRate: '2.00%'
        },
        {
          id: '4-years',
          term: '4 years',
          interest: '3 months Euribor + 0.05%',
          validFrom: '11.06.2025',
          balanceClass: 'EUR 0,00 t/m EUR 100.000,00',
          days: 1460,
          guaranteedRate: '2.25%'
        },
        {
          id: '5-years',
          term: '5 years',
          interest: '3 months Euribor + 0.05%',
          validFrom: '11.06.2025',
          balanceClass: 'EUR 0,00 t/m EUR 100.000,00',
          days: 1825,
          guaranteedRate: '2.50%'
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
              Choose a new period for your SolidExtra account
            </Typography>
            
            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                <CircularProgress />
              </Box>
            ) : (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {solidExtraOptions.map((option) => {
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
                              {option.interest} (guaranteed base rate {option.guaranteedRate})
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
                              + 0,05%
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
