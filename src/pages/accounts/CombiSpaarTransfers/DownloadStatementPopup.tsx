import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
  KeyboardArrowDown as KeyboardArrowDownIcon
} from '@mui/icons-material';

interface DownloadStatementPopupProps {
  open: boolean;
  onClose: () => void;
}

const DownloadStatementPopup: React.FC<DownloadStatementPopupProps> = ({
  open,
  onClose
}) => {
  const navigate = useNavigate();
  const [selectedAccount, setSelectedAccount] = useState('SaveOnline');
  const [selectedMonth, setSelectedMonth] = useState('January');
  const [selectedYear, setSelectedYear] = useState('2024');

  const months = [
    '--', 'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const years = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i);

  const handleSearch = () => {
    // Navigate to AccountStatement page with search parameters
    const searchParams = new URLSearchParams({
      account: selectedAccount,
      month: selectedMonth,
      year: selectedYear
    });
    
    navigate(`/accounts/saveonline/statement?${searchParams.toString()}`);
    onClose();
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
          boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
          position: 'relative'
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
            Download statement
          </Typography>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>

        {/* Modal Content */}
        <Box sx={{ p: 3, flex: 1 }}>
          {/* White Container with All Content */}
          <Box sx={{ 
            backgroundColor: 'white', 
            borderRadius: 2, 
            p: 3, 
            mb: 4,
            mx: 3,
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
          }}>
            {/* Information Text */}
            <Typography variant="body2" color="text.secondary" sx={{ mb: 6, lineHeight: 1.6 }}>
              Here below, you can search and access your digital statements back to 12 months. 
              The account statement download -monthly can be downloaded from the 1st business day of the following month.
            </Typography>

            {/* Select Account */}
            <Box sx={{ mb: 6 }}>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2, fontWeight: 500 }}>
                Select account
              </Typography>
              <FormControl fullWidth>
                <Select
                  value={selectedAccount}
                  onChange={(e) => setSelectedAccount(e.target.value)}
                  displayEmpty
                  sx={{
                    '& .MuiSelect-select': {
                      py: 1.5,
                      px: 2
                    },
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#E0E0E0'
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#1976d2'
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#1976d2'
                    }
                  }}
                  IconComponent={KeyboardArrowDownIcon}
                >
                  <MenuItem value="" disabled>
                    <Typography variant="body2" color="text.secondary">
                      NLXX BANK 0000 000
                    </Typography>
                  </MenuItem>
                  <MenuItem value="dhb-combispaar">
                    <Typography variant="body2">NL24 DHBN 2018 4705 78</Typography>
                  </MenuItem>
                  <MenuItem value="dhb-saveonline">
                    <Typography variant="body2">NL24 DHBN 2018 4705 79</Typography>
                  </MenuItem>
                  <MenuItem value="dhb-maxispaar">
                    <Typography variant="body2">NL24 DHBN 2018 4705 80</Typography>
                  </MenuItem>
                </Select>
              </FormControl>
            </Box>

            {/* Select Month and Year */}
            <Box sx={{ mb: 0 }}>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2, fontWeight: 500 }}>
                Select month and year
              </Typography>
              <Box sx={{ display: 'flex', gap: 2 }}>
                {/* Month Selector */}
                <FormControl sx={{ flex: 1 }}>
                  <Select
                    value={selectedMonth}
                    onChange={(e) => setSelectedMonth(e.target.value)}
                    displayEmpty
                    sx={{
                      '& .MuiSelect-select': {
                        py: 1.5,
                        px: 2
                      },
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#E0E0E0'
                      },
                      '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#1976d2'
                      },
                      '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#1976d2'
                      }
                    }}
                    IconComponent={KeyboardArrowDownIcon}
                  >
                    <MenuItem value="" disabled>
                      <Typography variant="body2" color="text.secondary">
                        May
                      </Typography>
                    </MenuItem>
                    {months.map((month) => (
                      <MenuItem key={month} value={month}>
                        <Typography variant="body2">{month}</Typography>
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                {/* Year Selector */}
                <FormControl sx={{ flex: 1 }}>
                  <Select
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(e.target.value)}
                    displayEmpty
                    sx={{
                      '& .MuiSelect-select': {
                        py: 1.5,
                        px: 2
                      },
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#E0E0E0'
                      },
                      '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#1976d2'
                      },
                      '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#1976d2'
                      }
                    }}
                    IconComponent={KeyboardArrowDownIcon}
                  >
                    <MenuItem value="" disabled>
                      <Typography variant="body2" color="text.secondary">
                        2025
                      </Typography>
                    </MenuItem>
                    {years.map((year) => (
                      <MenuItem key={year} value={year.toString()}>
                        <Typography variant="body2">{year}</Typography>
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>
            </Box>
          </Box>
        </Box>

        {/* Search Button */}
        <Box sx={{ 
          position: 'absolute',
          bottom: '5%',
          left: 0,
          right: 0,
          p: 3
        }}>
          <Button
            variant="contained"
            fullWidth
            onClick={handleSearch}
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
            Search
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default DownloadStatementPopup;
