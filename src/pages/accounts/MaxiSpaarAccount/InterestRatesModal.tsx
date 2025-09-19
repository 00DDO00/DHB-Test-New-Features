import React, { useState } from 'react';
import {
  Box,
  Typography,
  Modal,
  IconButton,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper
} from '@mui/material';
import { Close as CloseIcon, ArrowForward as ArrowForwardIcon } from '@mui/icons-material';

interface InterestRatesModalProps {
  open: boolean;
  onClose: () => void;
  onCalculate?: (data: CalculationData) => void;
}

interface CalculationData {
  amount: number;
  duration: string;
  interestRate: string;
  valueDate: string;
}

const InterestRatesModal: React.FC<InterestRatesModalProps> = ({ open, onClose, onCalculate }) => {
  const [amountWhole, setAmountWhole] = useState('');
  const [amountDecimal, setAmountDecimal] = useState('');
  const [selectedDuration, setSelectedDuration] = useState('3-months');
  // Fixed current date - not modifiable
  const getCurrentDate = () => {
    const now = new Date();
    const day = now.getDate().toString().padStart(2, '0');
    const month = now.toLocaleString('default', { month: 'long' });
    const year = now.getFullYear().toString();
    return { day, month, year };
  };

  const currentDate = getCurrentDate();
  const [amountError, setAmountError] = useState('');

  const interestRates = [
    { term: '3 Months', rate: '2.40%' },
    { term: '6 Months', rate: '2.50%' },
    { term: '9 Months', rate: '2.60%' },
    { term: '1 Year', rate: '3.00%' },
    { term: '2 Years', rate: '2.85%' },
    { term: '3 Years', rate: '2.70%' },
    { term: '4 Years', rate: '2.65%' },
    { term: '5 Years', rate: '2.60%' }
  ];

  const durationOptions = [
    { value: '3-months', label: '3 Months / 2.40%' },
    { value: '6-months', label: '6 Months / 2.50%' },
    { value: '9-months', label: '9 Months / 2.60%' },
    { value: '1-year', label: '1 Year / 3.00%' },
    { value: '2-years', label: '2 Years / 2.85%' },
    { value: '3-years', label: '3 Years / 2.70%' },
    { value: '4-years', label: '4 Years / 2.65%' },
    { value: '5-years', label: '5 Years / 2.60%' }
  ];


  const validateAmount = () => {
    const wholeAmount = parseFloat(amountWhole) || 0;
    const decimalAmount = parseFloat(amountDecimal) || 0;
    const totalAmount = wholeAmount + (decimalAmount / 100);
    
    if (totalAmount > 500000) {
      setAmountError('Amount cannot exceed €500,000');
      return false;
    }
    setAmountError('');
    return true;
  };

  const handleCalculate = () => {
    if (!validateAmount()) {
      return;
    }

    const wholeAmount = parseFloat(amountWhole) || 0;
    const decimalAmount = parseFloat(amountDecimal) || 0;
    const totalAmount = wholeAmount + (decimalAmount / 100);
    
    const selectedRate = interestRates.find(rate => 
      rate.term.toLowerCase().replace(' ', '-') === selectedDuration
    )?.rate || '0%';

    const valueDate = `${currentDate.day}/${currentDate.month}/${currentDate.year}`;

    if (onCalculate) {
      onCalculate({
        amount: totalAmount,
        duration: selectedDuration,
        interestRate: selectedRate,
        valueDate: valueDate
      });
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
          width: '400px',
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
            Interest Rates
          </Typography>
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>

        {/* Content */}
        <Box sx={{ flex: 1, p: 3, overflow: 'auto' }}>
          {/* Interest Rates Table */}
          <Box sx={{ 
            backgroundColor: 'white', 
            borderRadius: 2, 
            p: 3, 
            mb: 3,
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
          }}>
            <TableContainer 
              component={Paper} 
              sx={{ 
                boxShadow: 'none', 
                border: '1px solid #e0e0e0',
                maxHeight: 200,
                overflow: 'auto'
              }}
            >
              <Table stickyHeader>
                <TableHead>
                  <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                    <TableCell sx={{ fontWeight: 'bold', color: '#004996' }}>Duration</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', color: '#004996' }}>Interest Rate</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {interestRates.map((rate, index) => (
                    <TableRow key={index} sx={{ '&:hover': { backgroundColor: '#f9f9f9' } }}>
                      <TableCell>{rate.term}</TableCell>
                      <TableCell>{rate.rate}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>

          {/* Input Form */}
          <Box sx={{ 
            backgroundColor: 'white', 
            borderRadius: 2, 
            p: 3,
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
          }}>
            {/* Amount Entry */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="body2" color="#666" sx={{ mb: 2 }}>
                Amount
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                <TextField
                  value={amountWhole}
                  onChange={(e) => {
                    setAmountWhole(e.target.value);
                    setAmountError('');
                  }}
                  placeholder="0"
                  size="small"
                  sx={{ flex: 1 }}
                  error={!!amountError}
                />
                <TextField
                  value={amountDecimal}
                  onChange={(e) => {
                    setAmountDecimal(e.target.value);
                    setAmountError('');
                  }}
                  placeholder="00"
                  size="small"
                  sx={{ flex: 1 }}
                  error={!!amountError}
                />
                <Typography variant="body1" sx={{ ml: 1, fontWeight: 'bold' }}>
                  €
                </Typography>
              </Box>
              {amountError && (
                <Typography variant="caption" color="error" sx={{ mt: 1, display: 'block' }}>
                  {amountError}
                </Typography>
              )}
            </Box>

            {/* Duration */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="body2" color="#666" sx={{ mb: 1 }}>
                Duration
              </Typography>
              <FormControl fullWidth size="small">
                <Select
                  value={selectedDuration}
                  onChange={(e) => setSelectedDuration(e.target.value)}
                  sx={{
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#1976d2'
                    }
                  }}
                >
                  {durationOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>

            {/* Value Date - Fixed Current Date */}
            <Box sx={{ mb: 0 }}>
              <Typography variant="body2" color="#666" sx={{ mb: 1 }}>
                Value date
              </Typography>
              <Box sx={{ 
                p: 2, 
                backgroundColor: 'white', 
                borderRadius: 1,
                border: '1px solid #e0e0e0'
              }}>
                <Typography variant="body2" color="#333" sx={{ fontWeight: 500 }}>
                  {currentDate.day} {currentDate.month} {currentDate.year}
                </Typography>
              </Box>
            </Box>
          </Box>
        </Box>

        {/* Calculate Button */}
        <Box sx={{ p: 3 }}>
          <Button
            variant="contained"
            fullWidth
            onClick={handleCalculate}
            sx={{
              backgroundColor: '#FC9F15',
              color: 'white',
              textTransform: 'none',
              borderRadius: 2,
              py: 1.5,
              fontWeight: 500,
              fontSize: '1.1rem',
              '&:hover': {
                backgroundColor: '#e88a0a',
              }
            }}
            endIcon={<ArrowForwardIcon />}
          >
            Calculate
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default InterestRatesModal;
