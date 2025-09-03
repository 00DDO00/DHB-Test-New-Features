import React from 'react';
import {
  Box,
  Modal,
  Typography,
  IconButton,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  Switch,
  Card
} from '@mui/material';
import {
  Close as CloseIcon,
  ArrowForward as ArrowForwardIcon
} from '@mui/icons-material';
import { AmountObject } from './types';

interface FilterModalProps {
  open: boolean;
  onClose: () => void;
  onApplyFilters: () => void;
  
  // Filter states
  periodFilter: string;
  periodFilterEnabled: boolean;
  amountFilter: boolean;
  minAmount: AmountObject;
  maxAmount: AmountObject;
  transactionsCount: string;
  debitTransactions: boolean;
  creditTransactions: boolean;
  
  // Filter setters
  setPeriodFilter: (value: string) => void;
  setPeriodFilterEnabled: (value: boolean) => void;
  setAmountFilter: (value: boolean) => void;
  setMinAmount: (value: AmountObject) => void;
  setMaxAmount: (value: AmountObject) => void;
  setTransactionsCount: (value: string) => void;
  setDebitTransactions: (value: boolean) => void;
  setCreditTransactions: (value: boolean) => void;
}

const FilterModal: React.FC<FilterModalProps> = ({
  open,
  onClose,
  onApplyFilters,
  
  periodFilter,
  periodFilterEnabled,
  amountFilter,
  minAmount,
  maxAmount,
  transactionsCount,
  debitTransactions,
  creditTransactions,
  
  setPeriodFilter,
  setPeriodFilterEnabled,
  setAmountFilter,
  setMinAmount,
  setMaxAmount,
  setTransactionsCount,
  setDebitTransactions,
  setCreditTransactions
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
      <Box sx={{
        width: '35%',
        height: '100vh',
        backgroundColor: '#F3F3F3',
        overflow: 'auto',
        display: 'flex',
        flexDirection: 'column',
        borderRadius: '8px 0 0 8px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.15)'
      }}>
        {/* Modal Header */}
        <Box sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          p: 3
        }}>
          <Typography variant="h5" fontWeight="bold" color="#333">
            Filter
          </Typography>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>

        {/* Modal Content */}
        <Box sx={{ p: 8, flex: 1 }}>
          {/* White Container for Filtering Options */}
          <Card sx={{ 
            backgroundColor: 'white', 
            borderRadius: 2, 
            p: 3,
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
          }}>
          {/* Period Section */}
          <Box sx={{ mb: 6 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6" fontWeight="bold" color="#333">
                Period
              </Typography>
              <Switch 
                checked={periodFilterEnabled} 
                onChange={(e) => setPeriodFilterEnabled(e.target.checked)}
                sx={{
                  '& .MuiSwitch-track': {
                    backgroundColor: periodFilterEnabled ? '#4CAF50' : '#E0E0E0',
                    borderRadius: 22 / 2,
                    opacity: 1,
                    height: 22,
                  },
                  '& .MuiSwitch-thumb': {
                    backgroundColor: '#FFFFFF',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                    width: 18,
                    height: 18,
                  },
                  '& .MuiSwitch-switchBase': {
                    color: '#FFFFFF',
                    top: 4.2,
                    left: 2,
                  },
                }}
              />
            </Box>
            <Box sx={{ display: 'flex', gap: 1 }}>
              {['today', 'week', 'month', '6 month'].map((period) => (
                <Button
                  key={period}
                  variant={periodFilter === period ? 'contained' : 'outlined'}
                  onClick={() => setPeriodFilter(period)}
                  sx={{
                    flex: 1,
                    height: 36,
                    lineHeight: '36px',
                    backgroundColor: periodFilter === period ? '#004996' : 'transparent',
                    color: periodFilter === period ? 'white' : '#333',
                    borderColor: '#004996',
                    textTransform: 'none',
                    '&:hover': {
                      backgroundColor: periodFilter === period ? '#004996' : 'rgba(0, 73, 150, 0.1)',
                    }
                  }}
                >
                  {period === '6 month' ? '6 month' : period.charAt(0).toUpperCase() + period.slice(1)}
                </Button>
              ))}
            </Box>
            
            {/* Value Date Section - Only show when periodFilterEnabled is enabled */}
            {periodFilterEnabled && (
              <Box sx={{ mt: 3, mb: 6 }}>
                {/* Value Date From */}
                <Box sx={{ mb: 3 }}>
                  <Typography variant="body1" color="#333" sx={{ mb: 1 }}>
                    Value Date: From
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <FormControl size="small" sx={{ flex: 1 }}>
                      <Select
                        displayEmpty
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderColor: '#004996',
                            '& fieldset': {
                              borderColor: '#004996',
                            },
                          },
                        }}
                      >
                        <MenuItem value="">Day</MenuItem>
                        {Array.from({ length: 31 }, (_, i) => i + 1).map(day => (
                          <MenuItem key={day} value={day}>{day}</MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                    <FormControl size="small" sx={{ flex: 1 }}>
                      <Select
                        displayEmpty
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderColor: '#004996',
                            '& fieldset': {
                              borderColor: '#004996',
                            },
                          },
                        }}
                      >
                        <MenuItem value="">Month</MenuItem>
                        {Array.from({ length: 12 }, (_, i) => i + 1).map(month => (
                          <MenuItem key={month} value={month}>{month}</MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                    <FormControl size="small" sx={{ flex: 1 }}>
                      <Select
                        displayEmpty
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderColor: '#004996',
                            '& fieldset': {
                              borderColor: '#004996',
                            },
                          },
                        }}
                      >
                        <MenuItem value="">Year</MenuItem>
                        {Array.from({ length: 10 }, (_, i) => new Date().getFullYear() + i).map(year => (
                          <MenuItem key={year} value={year}>{year}</MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Box>
                </Box>
                
                {/* Value Date To */}
                <Box>
                  <Typography variant="body1" color="#333" sx={{ mb: 1 }}>
                    Value Date: To
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <FormControl size="small" sx={{ flex: 1 }}>
                      <Select
                        displayEmpty
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderColor: '#004996',
                            '& fieldset': {
                              borderColor: '#004996',
                            },
                          },
                        }}
                      >
                        <MenuItem value="">Day</MenuItem>
                        {Array.from({ length: 31 }, (_, i) => i + 1).map(day => (
                          <MenuItem key={day} value={day}>{day}</MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                    <FormControl size="small" sx={{ flex: 1 }}>
                      <Select
                        displayEmpty
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderColor: '#004996',
                            '& fieldset': {
                              borderColor: '#004996',
                            },
                          },
                        }}
                      >
                        <MenuItem value="">Month</MenuItem>
                        {Array.from({ length: 12 }, (_, i) => i + 1).map(month => (
                          <MenuItem key={month} value={month}>{month}</MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                    <FormControl size="small" sx={{ flex: 1 }}>
                      <Select
                        displayEmpty
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderColor: '#004996',
                            '& fieldset': {
                              borderColor: '#004996',
                            },
                          },
                        }}
                      >
                        <MenuItem value="">Year</MenuItem>
                        {Array.from({ length: 10 }, (_, i) => new Date().getFullYear() + i).map(year => (
                          <MenuItem key={year} value={year}>{year}</MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Box>
                </Box>
              </Box>
            )}
          </Box>

          {/* Amount Section */}
          <Box sx={{ mb: 6 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6" fontWeight="bold" color="#333">
                Amount
              </Typography>
              <Switch 
                checked={amountFilter} 
                onChange={(e) => setAmountFilter(e.target.checked)}
                sx={{
                  '& .MuiSwitch-track': {
                    backgroundColor: amountFilter ? '#4CAF50' : '#E0E0E0',
                    borderRadius: 22 / 2,
                    opacity: 1,
                    height: 22,
                  },
                  '& .MuiSwitch-thumb': {
                    backgroundColor: '#FFFFFF',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                    width: 18,
                    height: 18,
                  },
                  '& .MuiSwitch-switchBase': {
                    color: '#FFFFFF',
                    top: 4,
                    left: 2,
                  },
                }}
              />
            </Box>
            
            {/* Amount Input Fields - Only show when amountFilter is enabled */}
            {amountFilter && (
              <Box sx={{ mt: 3 }}>
                {/* Minimal Amount */}
                <Box sx={{ mb: 3 }}>
                  <Typography variant="body1" color="#333" sx={{ mb: 1 }}>
                    Minimal Amount
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <TextField
                      placeholder="000"
                      size="small"
                      value={minAmount.whole}
                      onChange={(e) => setMinAmount(prev => ({ ...prev, whole: e.target.value }))}
                      sx={{
                        flex: 1,
                        '& .MuiOutlinedInput-root': {
                          borderColor: '#004996',
                          '& fieldset': {
                            borderColor: '#004996',
                          },
                        },
                      }}
                    />
                    <TextField
                      placeholder="00"
                      size="small"
                      value={minAmount.decimal}
                      onChange={(e) => setMinAmount(prev => ({ ...prev, decimal: e.target.value }))}
                      sx={{
                        width: '80px',
                        '& .MuiOutlinedInput-root': {
                          borderColor: '#004996',
                          '& fieldset': {
                            borderColor: '#004996',
                          },
                        },
                      }}
                    />
                    <Typography variant="body1" color="#333">
                      €
                    </Typography>
                  </Box>
                </Box>
                
                {/* Maximum Amount */}
                <Box>
                  <Typography variant="body1" color="#333" sx={{ mb: 1 }}>
                    Maximum Amount
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <TextField
                      placeholder="000"
                      size="small"
                      value={maxAmount.whole}
                      onChange={(e) => setMaxAmount(prev => ({ ...prev, whole: e.target.value }))}
                      sx={{
                        flex: 1,
                        '& .MuiOutlinedInput-root': {
                          borderColor: '#004996',
                          '& fieldset': {
                            borderColor: '#004996',
                          },
                        },
                      }}
                    />
                    <TextField
                      placeholder="00"
                      size="small"
                      value={maxAmount.decimal}
                      onChange={(e) => setMaxAmount(prev => ({ ...prev, decimal: e.target.value }))}
                      sx={{
                        width: '80px',
                        '& .MuiOutlinedInput-root': {
                          borderColor: '#004996',
                          '& fieldset': {
                            borderColor: '#004996',
                          },
                        },
                      }}
                    />
                    <Typography variant="body1" color="#333">
                      €
                    </Typography>
                  </Box>
                </Box>
              </Box>
            )}
          </Box>

          {/* Show transactions Section */}
          <Box sx={{ mb: 6 }}>
            <Typography variant="h6" fontWeight="bold" color="#333" sx={{ mb: 2 }}>
              Show transactions
            </Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              {['5', '10', '20', '30'].map((count) => (
                <Button
                  key={count}
                  variant={transactionsCount === count ? 'contained' : 'outlined'}
                  onClick={() => setTransactionsCount(count)}
                  sx={{
                    flex: 1,
                    height: 36,
                    lineHeight: '36px',
                    backgroundColor: transactionsCount === count ? '#004996' : 'transparent',
                    color: transactionsCount === count ? 'white' : '#333',
                    borderColor: '#004996',
                    textTransform: 'none',
                    fontSize: '0.75rem',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    '&:hover': {
                      backgroundColor: transactionsCount === count ? '#004996' : 'rgba(0, 73, 150, 0.1)',
                    }
                  }}
                >
                  {count} Transfers
                </Button>
              ))}
            </Box>
          </Box>

          {/* Type of transaction Section */}
          <Box sx={{ mb: 6 }}>
            <Typography variant="h6" fontWeight="bold" color="#333" sx={{ mb: 2 }}>
              Type of transaction
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="body1" color="#333">
                  Debit transactions
                </Typography>
                <Switch 
                  checked={debitTransactions} 
                  onChange={(e) => setDebitTransactions(e.target.checked)}
                  sx={{
                    '& .MuiSwitch-track': {
                      backgroundColor: '#E0E0E0',
                      borderRadius: 22 / 2,
                      opacity: 1,
                      height: 22,
                    },
                    '& .MuiSwitch-thumb': {
                      backgroundColor: '#FFFFFF',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                      width: 18,
                      height: 18,
                    },
                    '& .MuiSwitch-switchBase': {
                      color: '#FFFFFF',
                      top: 4.2,
                      left: 2,
                    },
                    '& .MuiSwitch-switchBase.Mui-checked': {
                      color: '#4CAF50',
                    },
                    '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                      backgroundColor: '#4CAF50',
                    },
                  }}
                />
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="body1" color="#333">
                  Credit transactions
                </Typography>
                <Switch 
                  checked={creditTransactions} 
                  onChange={(e) => setCreditTransactions(e.target.checked)}
                  sx={{
                    '& .MuiSwitch-track': {
                      backgroundColor: '#E0E0E0',
                      borderRadius: 22 / 2,
                      opacity: 1,
                      height: 22,
                    },
                    '& .MuiSwitch-thumb': {
                      backgroundColor: '#FFFFFF',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                      width: 18,
                      height: 18,
                    },
                    '& .MuiSwitch-switchBase': {
                      color: '#FFFFFF',
                      top: 4,
                      left: 2,
                    },
                    '& .MuiSwitch-switchBase.Mui-checked': {
                      color: '#4CAF50',
                    },
                    '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                      backgroundColor: '#4CAF50',
                    },
                  }}
                />
              </Box>
            </Box>
          </Box>
          </Card>
        </Box>

        {/* Apply Button */}
        <Box sx={{ p: 3, borderTop: '1px solid #E0E0E0' }}>
          <Button
            variant="contained"
            fullWidth
            onClick={onApplyFilters}
            sx={{
              background: 'linear-gradient(45deg, #FC9F15, #FFB74D)',
              color: 'white',
              textTransform: 'none',
              borderRadius: 2,
              py: 1.5,
              fontWeight: 500,
              fontSize: '1.1rem',
              '&:hover': {
                background: 'linear-gradient(45deg, #e58a0d, #FFA726)',
              }
            }}
          >
            Apply
            <ArrowForwardIcon sx={{ ml: 1 }} />
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default FilterModal;
