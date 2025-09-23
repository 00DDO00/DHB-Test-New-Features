import React from 'react';
import {
  Box,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Link as MuiLink
} from '@mui/material';
import {
  ArrowForward as ArrowForwardIcon,
  Download as DownloadIcon,
  FilterList as FilterIcon
} from '@mui/icons-material';
import { Link } from 'react-router-dom';
import { TransferData, Transaction } from './types';

interface ConnectedFrameSectionProps {
  onOpenFilter: () => void;
  onDownloadStatement: () => void;
  filteredTransactions: Transaction[];
  mockTransactions: Transaction[];
  quickActions: Array<{
    label: string;
    icon: React.ReactNode;
    onClick: () => void;
  }>;
  onTransferClick: (transfer: TransferData) => void;
}

const ConnectedFrameSection: React.FC<ConnectedFrameSectionProps> = ({
  onOpenFilter,
  onDownloadStatement,
  filteredTransactions,
  mockTransactions,
  quickActions,
  onTransferClick
}) => {
  return (
    <Box sx={{ 
      display: 'flex', 
      backgroundColor: 'white',
      border: '1px solid #e0e0e0',
      borderTop: 'none',
      borderRadius: '0 0 16px 16px'
    }}>
      {/* Transfer Section - Left Side */}
      <Box sx={{ flex: 1, p: 3, borderRight: '1px solid #e0e0e0' }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 700, color: '#000000', py: 2 }}>
            Completed transfers
          </Typography>
        </Box>

        <Typography variant="body1" sx={{ mb: 3, color: 'text.primary', fontSize: '17px' }}> 
          Do you transfer funds to your contra account or savings account before 2.30pm on a working day? 
          Then the transfer will be processed the same day. After these times, the transfer will be processed 
          the next working day.
        </Typography>
        

        {/* Completed Transfers Table */}
        <Box sx={{ mt: 4 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
              Completed Transfers
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <IconButton size="small" onClick={onDownloadStatement}>
                  <DownloadIcon />
                </IconButton>
                <Typography variant="caption" color="text.secondary">
                  Download
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <IconButton size="small" onClick={onOpenFilter}>
                  <FilterIcon />
                </IconButton>
                <Typography variant="caption" color="text.secondary">
                  Filter
                </Typography>
              </Box>
            </Box>
          </Box>
          <TableContainer component={Paper} variant="outlined">
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                  <TableCell sx={{ fontWeight: 'bold', textTransform: 'uppercase', color: '#333' }}>
                    EXECUTION DATE
                  </TableCell>
                  <TableCell sx={{ fontWeight: 'bold', textTransform: 'uppercase', color: '#333' }}>
                    RECIPIENT
                  </TableCell>
                  <TableCell sx={{ fontWeight: 'bold', textTransform: 'uppercase', color: '#333' }}>
                    AMOUNT
                  </TableCell>
                  <TableCell sx={{ fontWeight: 'bold', textTransform: 'uppercase', color: '#333' }}>
                    STATUS
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {(filteredTransactions.length > 0 ? filteredTransactions : mockTransactions).length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} sx={{ textAlign: 'center', py: 4, color: 'text.secondary' }}>
                      No completed transfers found.
                    </TableCell>
                  </TableRow>
                ) : (
                  (filteredTransactions.length > 0 ? filteredTransactions : mockTransactions).map((transaction, index) => (
                    <TableRow 
                      key={transaction.id || index}
                      sx={{ 
                        '&:hover': { backgroundColor: '#f9f9f9' },
                        cursor: 'pointer'
                      }}
                    >
                      <TableCell sx={{ color: '#333' }}>
                        {transaction.date}
                      </TableCell>
                      <TableCell>
                        <Box>
                          <Typography variant="body2" sx={{ color: '#333', fontWeight: 500 }}>
                            {transaction.description}
                          </Typography>
                          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                            {transaction.account}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell 
                        sx={{ 
                          color: transaction.type === 'debit' ? '#f44336' : '#4caf50', 
                          fontWeight: 'bold' 
                        }}
                      >
                        {transaction.balance}
                      </TableCell>
                      <TableCell>
                        <Box
                          sx={{
                            display: 'inline-block',
                            px: 1.5,
                            py: 0.5,
                            borderRadius: '12px',
                            backgroundColor: '#e8f5e8',
                            color: '#2e7d32',
                            fontSize: '0.75rem',
                            fontWeight: 500,
                            textTransform: 'capitalize'
                          }}
                        >
                          Completed
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Box>

      {/* Quick Actions - Right Side */}
      <Box sx={{ width: '300px', p: 3 }}>
        <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 3 }}>
          Quick actions
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {quickActions.map((action, index) => (
            <Box
              key={index}
              onClick={action.onClick}
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                p: 2,
                border: '1px solid #e0e0e0',
                borderRadius: 1,
                cursor: 'pointer',
                '&:hover': {
                  backgroundColor: '#f5f5f5'
                }
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box sx={{ color: '#1976d2' }}>
                  {action.icon}
                </Box>
                <Typography variant="body2">{action.label}</Typography>
              </Box>
              <ArrowForwardIcon sx={{ fontSize: '1rem' }} />
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
};

export default ConnectedFrameSection;