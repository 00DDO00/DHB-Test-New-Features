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
  onOpenModal: () => void;
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
  onOpenModal,
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

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Recent transfers
          </Typography>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              variant="outlined"
              startIcon={<FilterIcon />}
              onClick={onOpenFilter}
              sx={{
                borderColor: '#1976d2',
                color: '#1976d2',
                textTransform: 'none',
                borderRadius: '8px',
                px: 2,
                py: 1
              }}
            >
              Filter
            </Button>
            <Button
              variant="outlined"
              startIcon={<DownloadIcon />}
              onClick={onDownloadStatement}
              sx={{
                borderColor: '#1976d2',
                color: '#1976d2',
                textTransform: 'none',
                borderRadius: '8px',
                px: 2,
                py: 1
              }}
            >
              Download statement
            </Button>
          </Box>
        </Box>

        <TableContainer component={Paper} sx={{ boxShadow: 'none', border: '1px solid #e0e0e0' }}>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                <TableCell sx={{ fontWeight: 600, borderBottom: '1px solid #e0e0e0' }}>Date</TableCell>
                <TableCell sx={{ fontWeight: 600, borderBottom: '1px solid #e0e0e0' }}>Description</TableCell>
                <TableCell sx={{ fontWeight: 600, borderBottom: '1px solid #e0e0e0' }}>Amount</TableCell>
                <TableCell sx={{ fontWeight: 600, borderBottom: '1px solid #e0e0e0' }}>Status</TableCell>
                <TableCell sx={{ fontWeight: 600, borderBottom: '1px solid #e0e0e0' }}>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {(filteredTransactions.length > 0 ? filteredTransactions : mockTransactions).map((transaction, index) => (
                <TableRow key={index} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                  <TableCell sx={{ borderBottom: '1px solid #e0e0e0' }}>{transaction.date}</TableCell>
                  <TableCell sx={{ borderBottom: '1px solid #e0e0e0' }}>{transaction.description}</TableCell>
                  <TableCell sx={{ borderBottom: '1px solid #e0e0e0' }}>{transaction.amount}</TableCell>
                  <TableCell sx={{ borderBottom: '1px solid #e0e0e0' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Box sx={{ 
                        width: 8, 
                        height: 8, 
                        borderRadius: '50%', 
                        backgroundColor: 'green' 
                      }} />
                      <Typography variant="body2" sx={{ color: 'green' }}>
                        {transaction.status}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell sx={{ borderBottom: '1px solid #e0e0e0' }}>
                    <MuiLink
                      component="button"
                      onClick={() => onTransferClick(transaction as any)}
                      sx={{
                        color: '#1976d2',
                        textDecoration: 'none',
                        fontWeight: 500,
                        '&:hover': {
                          textDecoration: 'underline'
                        }
                      }}
                    >
                      View details
                    </MuiLink>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
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