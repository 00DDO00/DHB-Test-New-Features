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
  tabValue,
  onTabChange,
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
          </Tabs>
        </Box>

        <TabPanel value={tabValue} index={0}>
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