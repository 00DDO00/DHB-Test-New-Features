import React from 'react';
import {
  Box,
  Typography,
  Modal,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';

interface HistoricalRateModalProps {
  open: boolean;
  onClose: () => void;
}

const HistoricalRateModal: React.FC<HistoricalRateModalProps> = ({ open, onClose }) => {
  // Mock data for the last 12 months - MaxiSpaar specific rates
  const rateHistory = [
    { month: 'January 2024', rate: '1.8%' },
    { month: 'February 2024', rate: '1.8%' },
    { month: 'March 2024', rate: '1.7%' },
    { month: 'April 2024', rate: '1.7%' },
    { month: 'May 2024', rate: '1.6%' },
    { month: 'June 2024', rate: '1.6%' },
    { month: 'July 2024', rate: '1.5%' },
    { month: 'August 2024', rate: '1.5%' },
    { month: 'September 2024', rate: '1.4%' },
    { month: 'October 2024', rate: '1.4%' },
    { month: 'November 2024', rate: '1.4%' },
    { month: 'December 2024', rate: '1.4%' }
  ];

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
          backgroundColor: 'white',
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
            Historical Rate Change
          </Typography>
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>

        {/* Content */}
        <Box sx={{ flex: 1, p: 3, overflow: 'auto' }}>
          <Typography variant="body2" sx={{ mb: 3, color: '#666' }}>
            Interest rate changes for the last 12 months
          </Typography>
          
          <TableContainer component={Paper} sx={{ boxShadow: 'none', border: '1px solid #e0e0e0' }}>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                  <TableCell sx={{ fontWeight: 'bold', color: '#004996' }}>Month</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', color: '#004996', textAlign: 'right' }}>Rate</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rateHistory.map((entry, index) => (
                  <TableRow key={index} sx={{ '&:hover': { backgroundColor: '#f9f9f9' } }}>
                    <TableCell>{entry.month}</TableCell>
                    <TableCell sx={{ textAlign: 'right', fontWeight: 'bold' }}>{entry.rate}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Box>
    </Modal>
  );
};

export default HistoricalRateModal;
