import React, { useState } from 'react';
import {
  Box,
  Typography,
  IconButton,
  Button,
  Card,
  Modal,
  Collapse
} from '@mui/material';
import {
  Close as CloseIcon,
  ArrowForward as ArrowForwardIcon,
  KeyboardArrowUp as KeyboardArrowUpIcon,
  KeyboardArrowDown as KeyboardArrowDownIcon
} from '@mui/icons-material';
import { TransferData } from './types';

interface TransferDetailsPopupProps {
  open: boolean;
  onClose: () => void;
  transfer: TransferData | null;
  onEditTransfer: () => void;
  onConfirmTransfer: () => void;
  onCancelTransfer: () => void;
  calculateCompletedPayments: (startDate: string, period: string) => number;
  allTransfers: TransferData[];
}

const TransferDetailsPopup: React.FC<TransferDetailsPopupProps> = ({
  open,
  onClose,
  transfer,
  onEditTransfer,
  onConfirmTransfer,
  onCancelTransfer,
  calculateCompletedPayments,
  allTransfers
}) => {
  const [historyExpanded, setHistoryExpanded] = useState(false);
  
  if (!transfer) return null;

  const completedPayments = calculateCompletedPayments(transfer.startDate, transfer.period);
  
  // Parse date components directly to avoid timezone issues
  const [day, month, year] = transfer.startDate.split('/').map(Number);
  const startDate = new Date(year, month - 1, day); // month is 0-indexed
  
  const today = new Date();
  const todayDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  
  // Calculate next execution date
  const getNextExecutionDate = () => {
    console.log('=== NEW DEBUG ===');
    console.log('Transfer period:', transfer.period);
    console.log('Start date string:', transfer.startDate);
    console.log('Parsed startDate:', startDate);
    console.log('Today date:', todayDate);
    console.log('Completed payments:', completedPayments);
    console.log('Start > Today?', startDate > todayDate);
    console.log('Start === Today?', startDate.getTime() === todayDate.getTime());
    
    if (transfer.period === 'one-time') {
      // For one-time transfers, if it's completed, show "Done"
      if (completedPayments > 0) {
        return 'Done';
      }
      // If it's scheduled for the future, show the date
      return startDate.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      }).toUpperCase();
    }
    
    // If start date is in the future, return it
    if (startDate > todayDate) {
      console.log('Start date is in future, returning start date');
      return startDate.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      }).toUpperCase();
    }
    
    // For recurring transfers, calculate next payment date
    const nextDate = new Date(startDate);
    console.log('Original nextDate:', nextDate);
    
    if (transfer.period === 'daily' || transfer.period === 'every-day') {
      nextDate.setDate(nextDate.getDate() + completedPayments);
      console.log('Daily: adding', completedPayments, 'days');
    } else if (transfer.period === 'weekly' || transfer.period === 'every-week') {
      nextDate.setDate(nextDate.getDate() + completedPayments * 7);
      console.log('Weekly: adding', completedPayments * 7, 'days');
    } else if (transfer.period === 'monthly' || transfer.period === 'every-month') {
      nextDate.setMonth(nextDate.getMonth() + completedPayments);
      console.log('Monthly: adding', completedPayments, 'months');
    }
    
    console.log('Final nextDate:', nextDate);
    console.log('=== END DEBUG ===');
    
    return nextDate.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    }).toUpperCase();
  };

  // Generate transfer history from actual completed transfers
  const generateTransferHistory = () => {
    if (!transfer) return [];
    
    // Find all transfers that are linked to this transfer operation
    // (same recipient, same amount, same period, but with completed payments)
    const linkedTransfers = allTransfers.filter(t => {
      const completedPayments = calculateCompletedPayments(t.startDate, t.period);
      const tStartDate = new Date(t.startDate.split('/').reverse().join('-'));
      const tToday = new Date();
      tToday.setHours(0, 0, 0, 0);
      const tEndDate = t.endDate ? new Date(t.endDate.split('/').reverse().join('-')) : null;
      
      // Check if this transfer has completed payments
      const hasCompletedPayments = tStartDate.toDateString() === tToday.toDateString() || 
                                   completedPayments > 0 || 
                                   (tEndDate && tEndDate <= tToday);
      
      // Check if it's linked to the current transfer (same recipient and amount)
      const isLinked = t.recipient.accountNumber === transfer.recipient.accountNumber &&
                       t.amount === transfer.amount &&
                       t.period === transfer.period;
      
      return hasCompletedPayments && isLinked;
    });
    
    // Sort by execution date (most recent first) and limit to 3
    const history = linkedTransfers
      .sort((a, b) => new Date(b.executionDate).getTime() - new Date(a.executionDate).getTime())
      .slice(0, 3)
      .map(t => {
        const executionDate = new Date(t.executionDate);
        return {
          date: executionDate.toLocaleDateString('en-GB', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
          }).toUpperCase(),
          status: 'Completed',
          amount: t.amount
        };
      });
    
    return history;
  };

  const transferHistory = generateTransferHistory();

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
          overflow: 'auto',
          display: 'flex',
          flexDirection: 'column',
          borderRadius: '8px 0 0 8px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.15)'
        }}
      >
        {/* Modal Header */}
        <Box sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          p: 3
        }}>
          <Typography variant="h5" fontWeight="bold" color="#333">
            Transfer Details
          </Typography>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>

        {/* Modal Content */}
        <Box sx={{ p: 8, flex: 1 }}>
        {/* Transfer Details Section */}
        <Card sx={{ 
          backgroundColor: 'white', 
          borderRadius: 2, 
          p: 3, 
          mb: 3,
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="body2" color="text.secondary">Amount:</Typography>
              <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#4caf50' }}>
                {transfer.amount}
              </Typography>
            </Box>
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="body2" color="text.secondary">Recipient name:</Typography>
              <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#333' }}>
                {transfer.recipient.name}
              </Typography>
            </Box>
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="body2" color="text.secondary">Account:</Typography>
              <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#333' }}>
                {transfer.recipient.accountNumber}
              </Typography>
            </Box>
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="body2" color="text.secondary">Next Execution:</Typography>
              <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#333' }}>
                {getNextExecutionDate()}
              </Typography>
            </Box>
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="body2" color="text.secondary">Frequency:</Typography>
              <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#333' }}>
                {transfer.period.charAt(0).toUpperCase() + transfer.period.slice(1)}
              </Typography>
            </Box>
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="body2" color="text.secondary">Status:</Typography>
              <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#333' }}>
                {transfer.period === 'one-time' && completedPayments > 0 
                  ? 'Done' 
                  : transfer.status.charAt(0).toUpperCase() + transfer.status.slice(1)}
              </Typography>
            </Box>
          </Box>
          
          <Box sx={{ mt: 2, pt: 2, borderTop: '1px solid #e0e0e0' }}>
            <Button
              variant="text"
              onClick={onEditTransfer}
              sx={{
                color: '#1976d2',
                textTransform: 'none',
                p: 0,
                '&:hover': {
                  backgroundColor: 'transparent',
                  textDecoration: 'underline'
                }
              }}
              endIcon={<ArrowForwardIcon sx={{ fontSize: '1rem' }} />}
            >
              Edit Transfer
            </Button>
          </Box>
        </Card>

        {/* Transfer History Section */}
        <Card sx={{ 
          backgroundColor: 'white', 
          borderRadius: 2, 
          p: 3, 
          mb: 3,
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}>
          <Box 
            sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 1, 
              mb: 2,
              cursor: 'pointer'
            }}
            onClick={() => setHistoryExpanded(!historyExpanded)}
          >
            <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#333' }}>
              Transfer History
            </Typography>
            {historyExpanded ? (
              <KeyboardArrowUpIcon sx={{ fontSize: '1.2rem', color: '#666' }} />
            ) : (
              <KeyboardArrowDownIcon sx={{ fontSize: '1.2rem', color: '#666' }} />
            )}
          </Box>
          
          <Collapse in={historyExpanded}>
            {transferHistory.length > 0 ? (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                {transferHistory.map((entry, index) => (
                  <Box key={index} sx={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    py: 1
                  }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Typography variant="body2" sx={{ color: '#333', minWidth: '80px' }}>
                        {entry.date}
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#4caf50', fontWeight: 500 }}>
                        {entry.status}
                      </Typography>
                    </Box>
                    <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#4caf50' }}>
                      {entry.amount}
                    </Typography>
                  </Box>
                ))}
              </Box>
            ) : (
              <Typography variant="body2" color="text.secondary">
                No transfer history available.
              </Typography>
            )}
          </Collapse>
        </Card>
      </Box>

        {/* Apply Button */}
        <Box sx={{ p: 3 }}>
          <Button
            variant="contained"
            fullWidth
            onClick={onConfirmTransfer}
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
            Confirm
            <ArrowForwardIcon sx={{ ml: 1 }} />
          </Button>
          
          <Button
            variant="outlined"
            fullWidth
            onClick={onCancelTransfer}
            sx={{
              mt: 2,
              borderColor: '#1976d2',
              color: '#1976d2',
              textTransform: 'none',
              py: 1.5,
              fontSize: '1.1rem',
              fontWeight: 500,
              '&:hover': {
                borderColor: '#1976d2',
                backgroundColor: 'rgba(25, 118, 210, 0.04)'
              }
            }}
          >
            Cancel transfer
          </Button>
      </Box>
      </Box>
    </Modal>
  );
};

export default TransferDetailsPopup;
