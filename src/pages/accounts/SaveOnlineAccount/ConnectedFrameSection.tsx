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
  toggleScheduledTransfer
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
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          {scheduledTransfers.length === 0 ? (
            <Typography variant="body2" color="text.secondary">
              No scheduled transfers found.
            </Typography>
          ) : (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {scheduledTransfers.map((transfer) => {
                const completedPayments = calculateCompletedPayments(transfer.startDate, transfer.period);
                const isCompleted = transfer.endDate && new Date(transfer.endDate) <= new Date();
                const paymentStatus = getPaymentStatus(transfer);
                
                return (
                  <Box
                    key={transfer.id}
                    onClick={() => toggleScheduledTransfer(transfer.id)}
                    sx={{
                      border: '1px solid #e0e0e0',
                      borderRadius: 1,
                      p: 2,
                      cursor: 'pointer',
                      '&:hover': {
                        backgroundColor: '#f5f5f5'
                      }
                    }}
                  >
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Box>
                        <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                          {transfer.description}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {transfer.amount} • {transfer.period} • {transfer.startDate}
                          {transfer.endDate && ` - ${transfer.endDate}`}
                        </Typography>
                      </Box>
                      <Box sx={{ textAlign: 'right' }}>
                        <Typography variant="body2" color={isCompleted ? 'success.main' : 'text.secondary'}>
                          {isCompleted ? 'Completed' : 'Active'}
                        </Typography>
                      </Box>
                    </Box>
                    
                    {transfer.isExpanded && (
                      <Box sx={{ mt: 2, pt: 2, borderTop: '1px solid #e0e0e0' }}>
                        <Typography variant="body2" sx={{ mb: 1 }}>
                          <strong>Payment Schedule:</strong> {transfer.period}
                        </Typography>
                        <Typography variant="body2" sx={{ mb: 1 }}>
                          <strong>Start Date:</strong> {transfer.startDate}
                        </Typography>
                        {transfer.endDate && (
                          <Typography variant="body2" sx={{ mb: 1 }}>
                            <strong>End Date:</strong> {transfer.endDate}
                          </Typography>
                        )}
                        <Typography variant="body2" sx={{ mb: 1 }}>
                          <strong>Amount per payment:</strong> {transfer.amount}
                        </Typography>
                        <Typography variant="body2" sx={{ mb: 1 }}>
                          <strong>Previous payment:</strong> {paymentStatus.previous}
                        </Typography>
                        <Typography variant="body2" sx={{ mb: 1 }}>
                          <strong>Next payment:</strong> {paymentStatus.next}
                        </Typography>
                      </Box>
                    )}
                  </Box>
                );
              })}
            </Box>
          )}
        </TabPanel>

        {/* Account Transfers Table - Inside the same frame */}
        <Box sx={{ mt: 4 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6">Account transfers</Typography>
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
                <TableRow>
                  <TableCell><strong>Date</strong></TableCell>
                  <TableCell><strong>Description</strong></TableCell>
                  <TableCell align="right"><strong>Balance</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {(filteredTransactions.length > 0 ? filteredTransactions : mockTransactions).map((transaction, index) => (
                  <TableRow key={transaction.id || index}>
                    <TableCell>{transaction.date}</TableCell>
                    <TableCell>
                      {transaction.description}
                      <br />
                      <Typography variant="caption" color="text.secondary">
                        {transaction.account}
                      </Typography>
                    </TableCell>
                    <TableCell 
                      align="right"
                      sx={{ 
                        color: transaction.type === 'debit' ? 'error.main' : 'success.main',
                        fontWeight: 'bold'
                      }}
                    >
                      {transaction.balance}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <Box sx={{ textAlign: 'center', mt: 2 }}>
            <MuiLink
              component={Link}
              to="/accounts/saveonline/statement"
              sx={{
                display: 'inline-flex',
                alignItems: 'center',
                textDecoration: 'none',
                color: '#FC9F15',
                fontWeight: 'bold',
                '&:hover': { textDecoration: 'underline' }
              }}
            >
              See All
              <ArrowForwardIcon sx={{ ml: 0.5, fontSize: '1rem' }} />
            </MuiLink>
          </Box>
        </Box>
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
