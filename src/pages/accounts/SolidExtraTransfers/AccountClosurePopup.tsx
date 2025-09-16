import React, { useState, useEffect } from 'react';
import {
  Modal,
  Box,
  Typography,
  Button,
  IconButton,
  Select,
  MenuItem,
  FormControl
} from '@mui/material';
import {
  Close as CloseIcon,
  ArrowForward as ArrowForwardIcon
} from '@mui/icons-material';
import { apiService } from '../../../services/api';

interface AccountClosurePopupProps {
  open: boolean;
  onClose: () => void;
  onAccountClosed?: (accountNumber: string) => void;
}

interface AccountData {
  id: string;
  name: string;
  iban: string;
  balance: number;
  currency: string;
}

const AccountClosurePopup: React.FC<AccountClosurePopupProps> = ({ open, onClose, onAccountClosed }) => {
  const [selectedAccount, setSelectedAccount] = useState('');
  const [accounts, setAccounts] = useState<AccountData[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedAccountData, setSelectedAccountData] = useState<AccountData | null>(null);

  // Fetch accounts when popup opens
  useEffect(() => {
    if (open) {
      fetchAccounts();
    }
  }, [open]);

  // Update selected account data when selection changes
  useEffect(() => {
    if (selectedAccount && accounts.length > 0) {
      const account = accounts.find(acc => acc.iban === selectedAccount);
      setSelectedAccountData(account || null);
    }
  }, [selectedAccount, accounts]);

  const fetchAccounts = async () => {
    setLoading(true);
    try {
      const accountList = await apiService.getAccounts();
      console.log('API returned accounts:', accountList);
      
      // Always add the 0 balance account to the list
      const accountsWithZeroBalance = [
        ...accountList,
        { id: '4', name: 'DHB Savings Account', iban: 'NLXX BANK 0000 000', balance: 0.00, currency: 'EUR' }
      ];
      
      setAccounts(accountsWithZeroBalance);
      if (accountsWithZeroBalance.length > 0) {
        setSelectedAccount(accountsWithZeroBalance[0].iban);
      }
    } catch (error) {
      console.error('Failed to fetch accounts:', error);
      // Fallback to mock data
      const mockAccounts: AccountData[] = [
        { id: '1', name: 'DHB SaveOnline', iban: 'NL24DHBN2018470578', balance: 1750.00, currency: 'EUR' },
        { id: '2', name: 'DHB Combispaar', iban: 'NL24DHBN2018470579', balance: 2500.00, currency: 'EUR' },
        { id: '3', name: 'DHB Current Account', iban: 'NL24DHBN2018470580', balance: 3200.00, currency: 'EUR' },
        { id: '4', name: 'DHB Savings Account', iban: 'NLXX BANK 0000 000', balance: 0.00, currency: 'EUR' }
      ];
      setAccounts(mockAccounts);
      setSelectedAccount(mockAccounts[0].iban);
    } finally {
      setLoading(false);
    }
  };

  const handleContinue = () => {
    // Check if selected account has 0 balance
    if (selectedAccountData && selectedAccountData.balance === 0) {
      // Call the callback to show congratulations popup in parent
      if (onAccountClosed) {
        onAccountClosed(selectedAccountData.iban);
      }
      onClose(); // Close the main popup
    } else {
      // For non-zero balance accounts, show alert
      const balanceText = selectedAccountData ? 
        `${selectedAccountData.currency} ${selectedAccountData.balance.toLocaleString('nl-NL', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : 
        'unknown balance';
      
      alert(`Cannot close account. Account balance must be € 0,00 before closure. Current balance: ${balanceText}`);
    }
  };

  if (!open) return null;

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
          borderRadius: '8px 0 0 8px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
          overflow: 'auto',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        {/* Modal Header */}
        <Box sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          p: 3,
          borderBottom: '1px solid #e0e0e0'
        }}>
          <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#333' }}>
            Account Closure
          </Typography>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>

        {/* Modal Content */}
        <Box sx={{ p: 3, flex: 1 }}>
          {/* All Details in White Container */}
          <Box sx={{ 
            backgroundColor: 'white',
            borderRadius: 2,
            p: 3,
            mb: 4,
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
          }}>
            {/* Select Account Section */}
            <Box sx={{ mb: 4 }}>
              <Typography variant="body1" sx={{ mb: 2, fontWeight: 500, color: '#333' }}>
                Select account to close
              </Typography>
              <FormControl fullWidth>
                <Select
                  value={selectedAccount}
                  onChange={(e) => setSelectedAccount(e.target.value)}
                  disabled={loading}
                  sx={{
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#e0e0e0',
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#1976d2',
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#1976d2',
                    }
                  }}
                >
                  {accounts.map((account) => (
                    <MenuItem key={account.iban} value={account.iban}>
                      {account.iban} - {account.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>

            {/* Account Details Section */}
            <Box>
              {/* Balance Field */}
              <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="body2" sx={{ color: '#666' }}>
                  Balance
                </Typography>
                <Typography variant="body1" sx={{ color: '#333' }}>
                  {selectedAccountData ? 
                    `${selectedAccountData.currency} ${selectedAccountData.balance.toLocaleString('nl-NL', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : 
                    '€ --,--,--'
                  }
                </Typography>
              </Box>

              {/* Account Number Field */}
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="body2" sx={{ color: '#666' }}>
                  Account number
                </Typography>
                <Typography variant="body1" sx={{ color: '#333' }}>
                  {selectedAccountData ? selectedAccountData.iban : 'NLXX BANK 0000 000'}
                </Typography>
              </Box>
            </Box>
          </Box>
        </Box>

        {/* Action Buttons */}
        <Box sx={{ p: 3, borderTop: '1px solid #e0e0e0' }}>
          {/* Continue Button */}
          <Button
            variant="contained"
            fullWidth
            onClick={handleContinue}
            sx={{
              background: 'linear-gradient(45deg, #FC9F15, #FFB74D)',
              color: 'white',
              textTransform: 'none',
              borderRadius: 2,
              py: 1.5,
              fontWeight: 500,
              fontSize: '1.1rem',
              mb: 2,
              '&:hover': {
                background: 'linear-gradient(45deg, #e58a0d, #FFA726)',
              }
            }}
          >
            Continue
            <ArrowForwardIcon sx={{ ml: 1, fontSize: '1.2rem' }} />
          </Button>

          {/* Cancel Button */}
          <Button
            variant="outlined"
            fullWidth
            onClick={onClose}
            sx={{
              borderColor: '#1976d2',
              color: '#1976d2',
              textTransform: 'none',
              borderRadius: 2,
              py: 1.5,
              fontWeight: 500,
              fontSize: '1.1rem',
              '&:hover': {
                borderColor: '#1565c0',
                backgroundColor: 'rgba(25, 118, 210, 0.04)',
              }
            }}
          >
            Cancel
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default AccountClosurePopup;