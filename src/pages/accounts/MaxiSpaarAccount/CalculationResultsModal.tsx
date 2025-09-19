import React from 'react';
import {
  Box,
  Typography,
  Modal,
  IconButton,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper
} from '@mui/material';
import { Close as CloseIcon, ArrowForward as ArrowForwardIcon } from '@mui/icons-material';

interface CalculationResultsModalProps {
  open: boolean;
  onClose: () => void;
  onOpenAccount: () => void;
  calculationData: {
    amount: number;
    duration: string;
    interestRate: string;
    valueDate: string;
  };
}

const CalculationResultsModal: React.FC<CalculationResultsModalProps> = ({ 
  open, 
  onClose, 
  onOpenAccount,
  calculationData 
}) => {
  // Early return if no calculation data
  if (!calculationData || !calculationData.valueDate) {
    return null;
  }

  const calculateMaturityDate = () => {
    const [day, month, year] = calculationData.valueDate.split('/');
    const valueDate = new Date(parseInt(year), getMonthIndex(month), parseInt(day));
    
    const durationYears = getDurationYears(calculationData.duration);
    const maturityDate = new Date(valueDate);
    maturityDate.setFullYear(maturityDate.getFullYear() + durationYears);
    
    return formatDate(maturityDate);
  };

  const getMonthIndex = (month: string) => {
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 
                   'July', 'August', 'September', 'October', 'November', 'December'];
    return months.indexOf(month);
  };

  const getDurationYears = (duration: string) => {
    const durationMap: { [key: string]: number } = {
      '3-months': 0.25,
      '6-months': 0.5,
      '9-months': 0.75,
      '1-year': 1,
      '2-years': 2,
      '3-years': 3,
      '4-years': 4,
      '5-years': 5
    };
    return durationMap[duration] || 1;
  };

  const formatDate = (date: Date) => {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const calculatePaymentDates = () => {
    const [day, month, year] = calculationData.valueDate.split('/');
    const valueDate = new Date(parseInt(year), getMonthIndex(month), parseInt(day));
    const durationYears = getDurationYears(calculationData.duration);
    
    const paymentDates = [];
    
    if (durationYears <= 1) {
      // For 1 year or less, only one payment date (at maturity)
      const maturityDate = new Date(valueDate);
      maturityDate.setFullYear(maturityDate.getFullYear() + durationYears);
      paymentDates.push(formatDate(maturityDate));
    } else {
      // For more than 1 year, annual payment dates
      for (let i = 1; i <= Math.floor(durationYears); i++) {
        const paymentDate = new Date(valueDate);
        paymentDate.setFullYear(paymentDate.getFullYear() + i);
        paymentDates.push(formatDate(paymentDate));
      }
    }
    
    return paymentDates;
  };

  const calculateInterestAmount = () => {
    const principal = calculationData.amount;
    const rate = parseFloat(calculationData.interestRate.replace('%', '')) / 100;
    const durationYears = getDurationYears(calculationData.duration);
    
    // Calculate total interest for the full period
    const totalInterest = principal * rate * durationYears;
    
    // For periods > 1 year, divide interest equally among payment periods
    if (durationYears > 1) {
      const numberOfPayments = Math.floor(durationYears);
      return totalInterest / numberOfPayments;
    }
    
    // For periods <= 1 year, return full interest amount
    return totalInterest;
  };

  const paymentDates = calculatePaymentDates();
  const maturityDate = calculateMaturityDate();
  const interestAmount = calculateInterestAmount();

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
          {/* Interest Rate & Maturity Date Card */}
          <Box sx={{ 
            backgroundColor: 'white', 
            borderRadius: 2, 
            p: 3, 
            mb: 3,
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
          }}>
            <TableContainer component={Paper} sx={{ boxShadow: 'none', border: '1px solid #e0e0e0' }}>
              <Table>
                <TableHead>
                  <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                    <TableCell sx={{ fontWeight: 'bold', color: '#004996' }}>Interest Rate</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', color: '#004996' }}>Maturity date</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell>{calculationData.interestRate}</TableCell>
                    <TableCell>{maturityDate}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </Box>

          {/* Interest Payment Details Card */}
          <Box sx={{ 
            backgroundColor: 'white', 
            borderRadius: 2, 
            p: 3,
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
          }}>
            <TableContainer component={Paper} sx={{ boxShadow: 'none', border: '1px solid #e0e0e0' }}>
              <Table>
                <TableHead>
                  <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                    <TableCell sx={{ fontWeight: 'bold', color: '#004996' }}>Interest payment date</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', color: '#004996' }}>Interest amount</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {paymentDates.map((date, index) => (
                    <TableRow key={index}>
                      <TableCell>{date}</TableCell>
                      <TableCell>€ {interestAmount.toFixed(2).replace('.', ',')}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        </Box>

        {/* Open Account Button */}
        <Box sx={{ p: 3 }}>
          <Button
            variant="contained"
            fullWidth
            onClick={onOpenAccount}
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
            Open account
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default CalculationResultsModal;
