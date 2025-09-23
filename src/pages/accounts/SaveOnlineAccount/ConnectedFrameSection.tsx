import React from 'react';
import {
  Box,
  Typography,
  Tabs,
  Tab,
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
import { TabPanelProps, TransferData, Transaction } from './types';

// TabPanel component
function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`transfer-tabpanel-${index}`}
      aria-labelledby={`transfer-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

interface ConnectedFrameSectionProps {
  tabValue: number;
  onTabChange: (event: React.SyntheticEvent, newValue: number) => void;
  onOpenModal: () => void;
  onOpenFilter: () => void;
  onDownloadStatement: () => void;
  scheduledTransfers: TransferData[];
  filteredTransactions: Transaction[];
  mockTransactions: Transaction[];
  quickActions: Array<{
    label: string;
    icon: React.ReactNode;
    onClick: () => void;
  }>;
  calculateCompletedPayments: (startDate: string, period: string) => number;
  getPaymentStatus: (transfer: TransferData) => { previous: string; next: string };
  toggleScheduledTransfer: (id: string) => void;
  onTransferClick: (transfer: TransferData) => void;
}

const ConnectedFrameSection: React.FC<ConnectedFrameSectionProps> = ({
  tabValue,
  onTabChange,
  onOpenModal,
  onOpenFilter,
  onDownloadStatement,
  scheduledTransfers,
  filteredTransactions,
  mockTransactions,
  quickActions,
  calculateCompletedPayments,
  getPaymentStatus,
  toggleScheduledTransfer,
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
          <Tabs 
            value={tabValue} 
            onChange={onTabChange}
            sx={{
              '& .MuiTab-root': {
                height: '48px',
                width: '288px',
                textTransform: 'none',
                fontSize: '18px',
                fontWeight: 700,
                color: '#000000'
              }
            }}
          >
            <Tab label="Completed transfers" />
            <Tab label="Scheduled transfers" />
          </Tabs>
        </Box>

        <TabPanel value={tabValue} index={0}>
          <Typography variant="body1" sx={{ mb: 3, color: 'text.primary', fontSize: '17px' }}> 
            Do you transfer funds to your contra account or savings account before 2.30pm on a working day? 
            Then the transfer will be processed the same day. After these times, the transfer will be processed 
            the next working day.
          </Typography>
          
          <Box sx={{ textAlign: 'center', mb: 3 }}>
            <Button
              variant="contained"
              size="large"
              onClick={onOpenModal}
              sx={{
                backgroundColor: '#FC9F15',
                '&:hover': { backgroundColor: '#e88a0a' },
                px: 4,
                py: 2,
                fontSize: '1.1rem',
                width: '100%'
              }}
              endIcon={<ArrowForwardIcon />}
            >
              Make New Transfer
            </Button>
          </Box>

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
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          {/* Scheduled Transfers Table */}
          <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                Scheduled Transfers
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
                  {scheduledTransfers.filter(transfer => {
                    const completedPayments = calculateCompletedPayments(transfer.startDate, transfer.period);
                    
                    // Parse date components directly to avoid timezone issues
                    const [day, month, year] = transfer.startDate.split('/').map(Number);
                    const startDate = new Date(year, month - 1, day); // month is 0-indexed
                    
                    const today = new Date();
                    const todayDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());
                    
                    const endDate = transfer.endDate ? (() => {
                      const [endDay, endMonth, endYear] = transfer.endDate.split('/').map(Number);
                      return new Date(endYear, endMonth - 1, endDay);
                    })() : null;
                    
                    // Show in scheduled if:
                    // 1. Start date is in the future, OR
                    // 2. It's recurring and not all payments are completed (even if it has started)
                    return startDate > todayDate || (transfer.period !== 'one-time' && completedPayments < transfer.totalPayments);
                  }).length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} sx={{ textAlign: 'center', py: 4, color: 'text.secondary' }}>
                        No scheduled transfers found.
                      </TableCell>
                    </TableRow>
                  ) : (
                    scheduledTransfers.filter(transfer => {
                      const completedPayments = calculateCompletedPayments(transfer.startDate, transfer.period);
                      
                      // Parse date components directly to avoid timezone issues
                      const [day, month, year] = transfer.startDate.split('/').map(Number);
                      const startDate = new Date(year, month - 1, day); // month is 0-indexed
                      
                      const today = new Date();
                      const todayDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());
                      
                      const endDate = transfer.endDate ? (() => {
                        const [endDay, endMonth, endYear] = transfer.endDate.split('/').map(Number);
                        return new Date(endYear, endMonth - 1, endDay);
                      })() : null;
                      
                      return startDate > todayDate || (transfer.period !== 'one-time' && completedPayments < transfer.totalPayments);
                    }).map((transfer) => {
                      // Format execution date to match image format (DD-MMM-YYYY)
                      const executionDate = new Date(transfer.executionDate);
                      const formattedDate = executionDate.toLocaleDateString('en-GB', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric'
                      }).toUpperCase();

                      // Determine status badge styling
                      const getStatusBadge = (status: string) => {
                        if (status === 'recurring') {
                          return {
                            backgroundColor: '#e8f5e8',
                            color: '#2e7d32',
                            text: 'Recurring'
                          };
                        } else {
                          return {
                            backgroundColor: '#e3f2fd',
                            color: '#1976d2',
                            text: 'Scheduled'
                          };
                        }
                      };

                      const statusBadge = getStatusBadge(transfer.status);

                      return (
                        <TableRow 
                          key={`scheduled-${transfer.id}`} 
                          sx={{ 
                            '&:hover': { backgroundColor: '#f9f9f9' },
                            cursor: 'pointer'
                          }}
                          onClick={() => onTransferClick(transfer)}
                        >
                          <TableCell sx={{ color: '#333' }}>
                            {formattedDate}
                          </TableCell>
                          <TableCell>
                            <Box>
                              <Typography variant="body2" sx={{ color: '#333', fontWeight: 500 }}>
                                {transfer.recipient.accountNumber}
                              </Typography>
                              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                                {transfer.recipient.name}
                              </Typography>
                            </Box>
                          </TableCell>
                          <TableCell sx={{ color: '#4caf50', fontWeight: 'bold' }}>
                            {transfer.amount}
                          </TableCell>
                          <TableCell>
                            <Box
                              sx={{
                                display: 'inline-block',
                                px: 1.5,
                                py: 0.5,
                                borderRadius: '12px',
                                backgroundColor: statusBadge.backgroundColor,
                                color: statusBadge.color,
                                fontSize: '0.75rem',
                                fontWeight: 500,
                                textTransform: 'capitalize'
                              }}
                            >
                              {statusBadge.text}
                            </Box>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        </TabPanel>


      </Box>

      {/* Quick Actions - Right Side */}
      <Box sx={{ width: '300px', p: 3, backgroundColor: '#E6EDF5', borderRadius: '0 0 16px 0' }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4, pt: 4, alignItems: 'center' }}>
          {quickActions.map((action, index) => (
            <Box
              key={index}
              onClick={action.onClick}
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                p: 1.5,
                borderRadius: 1,
                textDecoration: 'none',
                color: 'text.primary',
                backgroundColor: 'transparent',
                border: 'none',
                transition: 'all 0.2s',
                width: '240px',
                cursor: 'pointer',
                '&:hover': {
                  backgroundColor: 'rgba(0, 0, 0, 0.05)',
                  textDecoration: 'none'
                }
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, minWidth: '180px' }}>
                <Box sx={{ width: '24px', display: 'flex', justifyContent: 'center' }}>
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
