import React from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Breadcrumbs,
  Link as MuiLink,
  Button,
  Fab,
  TextField,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
  Modal,
  IconButton,
} from '@mui/material';
import {
  Link as LinkIcon,
  ArrowForward,
  HeadsetMic,
  CheckCircleOutline,
  Home as HomeIcon,
} from '@mui/icons-material';
import { useNavigate, Link } from 'react-router-dom';

const DailyLimit: React.FC = () => {
  const navigate = useNavigate();
  const [amount, setAmount] = React.useState('');
  const [selectedDay, setSelectedDay] = React.useState('');
  const [selectedMonth, setSelectedMonth] = React.useState('');
  const [selectedYear, setSelectedYear] = React.useState('');
  const [showSuccessPopup, setShowSuccessPopup] = React.useState(false);

  const handleCancel = () => {
    navigate('/settings');
  };

  const handleConfirm = () => {
    console.log('Daily limit confirmed:', { amount, selectedDay, selectedMonth, selectedYear });
    setShowSuccessPopup(true);
  };

  const handleCloseSuccessPopup = () => {
    setShowSuccessPopup(false);
    navigate('/settings');
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Only allow numeric characters, decimal points, and commas
    const numericValue = value.replace(/[^0-9.,]/g, '');
    setAmount(numericValue);
  };

  // Validation function to check if all fields are filled and date is valid
  const isFormValid = () => {
    if (!amount || !selectedDay || !selectedMonth || !selectedYear) {
      return false;
    }

    // Check if selected date is later than today
    const today = new Date();
    const selectedDate = new Date(parseInt(selectedYear), parseInt(selectedMonth) - 1, parseInt(selectedDay));
    
    // Reset time to start of day for accurate comparison
    today.setHours(0, 0, 0, 0);
    selectedDate.setHours(0, 0, 0, 0);
    
    return selectedDate > today;
  };

  // Generate options for days, months, and years
  const days = Array.from({ length: 31 }, (_, i) => i + 1);
  const months = [
    { value: 1, label: 'January' },
    { value: 2, label: 'February' },
    { value: 3, label: 'March' },
    { value: 4, label: 'April' },
    { value: 5, label: 'May' },
    { value: 6, label: 'June' },
    { value: 7, label: 'July' },
    { value: 8, label: 'August' },
    { value: 9, label: 'September' },
    { value: 10, label: 'October' },
    { value: 11, label: 'November' },
    { value: 12, label: 'December' },
  ];
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 10 }, (_, i) => currentYear + i);

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      backgroundColor: '#f5f5f5',
      padding: '24px'
    }}>
      {/* Breadcrumbs */}
      <Breadcrumbs sx={{ mb: 3 }} aria-label="breadcrumb navigation">
        <MuiLink
          component={Link}
          to="/private"
          color="inherit"
          underline="hover"
          sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}
        >
          <HomeIcon sx={{ mr: 0.5, fontSize: 20 }} />
          Home
        </MuiLink>
        <MuiLink
          component={Link}
          to="/settings"
          color="inherit"
          underline="hover"
          sx={{ cursor: 'pointer' }}
        >
          Settings
        </MuiLink>
        <Typography color="text.primary" fontWeight="bold">
          Daily limit
        </Typography>
      </Breadcrumbs>

      {/* Main Content */}
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center',
        alignItems: 'flex-start',
        minHeight: 'calc(100vh - 120px)'
      }}>
        <Card sx={{ 
          width: '100%',
          maxWidth: '800px',
          backgroundColor: 'white',
          borderRadius: '8px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}>
          <CardContent sx={{ padding: '32px' }}>
            {/* Title */}
            <Typography
              variant="h4"
              sx={{
                fontWeight: 700,
                color: '#333',
                mb: 4,
                fontSize: '24px',
              }}
            >
              Daily limit
            </Typography>
            
            {/* Section 1: Set your daily limit */}
            <Box sx={{ mb: 4 }}>
              <Typography
                variant="body1"
                sx={{
                  color: '#333',
                  mb: 2,
                  fontSize: '16px',
                }}
              >
                Set your daily limit (max. € 250.000,00)
              </Typography>
              
              <Box sx={{ mb: 2 }}>
                <Typography
                  variant="body2"
                  sx={{
                    color: '#333',
                    fontSize: '14px',
                    mb: 1,
                    fontWeight: 500,
                  }}
                >
                  Enter amount
                </Typography>
                <TextField
                  fullWidth
                  placeholder="€ --.---,--"
                  value={amount}
                  onChange={handleAmountChange}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      backgroundColor: 'white',
                      '& fieldset': {
                        borderColor: '#004996',
                      },
                      '&:hover fieldset': {
                        borderColor: '#004996',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#004996',
                      },
                    },
                    '& .MuiInputBase-input': {
                      color: '#333',
                      fontSize: '14px',
                    },
                    '& .MuiInputBase-input::placeholder': {
                      color: '#999',
                      opacity: 1,
                    },
                  }}
                />
              </Box>
            </Box>

            {/* Section 2: Choose an end date */}
            <Box sx={{ mb: 4 }}>
              <Typography
                variant="body1"
                sx={{
                  color: '#333',
                  mb: 2,
                  fontSize: '14px',
                  lineHeight: 1.6,
                }}
              >
                Your change will take effect 4 hours after confirmation. A temporary daily limit applies for a maximum of 7 days.
              </Typography>
              
              <Box sx={{ mb: 2 }}>
                <Typography
                  variant="body2"
                  sx={{
                    color: '#333',
                    fontSize: '14px',
                    mb: 1,
                    fontWeight: 500,
                  }}
                >
                  Choose period
                </Typography>
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <FormControl sx={{ flex: 1 }}>
                    <Select
                      value={selectedDay}
                      onChange={(e) => setSelectedDay(e.target.value)}
                      displayEmpty
                      sx={{
                        backgroundColor: 'white',
                        '& .MuiOutlinedInput-notchedOutline': {
                          borderColor: '#004996',
                        },
                        '&:hover .MuiOutlinedInput-notchedOutline': {
                          borderColor: '#004996',
                        },
                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                          borderColor: '#004996',
                        },
                      }}
                    >
                      <MenuItem value="" disabled>Day</MenuItem>
                      {days.map((day) => (
                        <MenuItem key={day} value={day}>{day}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  
                  <FormControl sx={{ flex: 1 }}>
                    <Select
                      value={selectedMonth}
                      onChange={(e) => setSelectedMonth(e.target.value)}
                      displayEmpty
                      sx={{
                        backgroundColor: 'white',
                        '& .MuiOutlinedInput-notchedOutline': {
                          borderColor: '#004996',
                        },
                        '&:hover .MuiOutlinedInput-notchedOutline': {
                          borderColor: '#004996',
                        },
                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                          borderColor: '#004996',
                        },
                      }}
                    >
                      <MenuItem value="" disabled>Month</MenuItem>
                      {months.map((month) => (
                        <MenuItem key={month.value} value={month.value}>{month.label}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  
                  <FormControl sx={{ flex: 1 }}>
                    <Select
                      value={selectedYear}
                      onChange={(e) => setSelectedYear(e.target.value)}
                      displayEmpty
                      sx={{
                        backgroundColor: 'white',
                        '& .MuiOutlinedInput-notchedOutline': {
                          borderColor: '#004996',
                        },
                        '&:hover .MuiOutlinedInput-notchedOutline': {
                          borderColor: '#004996',
                        },
                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                          borderColor: '#004996',
                        },
                      }}
                    >
                      <MenuItem value="" disabled>Year</MenuItem>
                      {years.map((year) => (
                        <MenuItem key={year} value={year}>{year}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Box>
              </Box>
            </Box>

            {/* Action Buttons */}
            <Box sx={{ display: 'flex', gap: 2, mt: 4 }}>
              <Button
                variant="outlined"
                onClick={handleCancel}
                sx={{
                  borderColor: '#004996',
                  color: '#004996',
                  textTransform: 'none',
                  fontSize: '14px',
                  fontWeight: 500,
                  px: 3,
                  py: 1.5,
                  '&:hover': {
                    borderColor: '#003366',
                    backgroundColor: 'rgba(0, 73, 150, 0.04)',
                  },
                }}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                onClick={handleConfirm}
                disabled={!isFormValid()}
                sx={{
                  backgroundColor: isFormValid() ? '#FC9F15' : '#ccc',
                  color: 'white',
                  textTransform: 'none',
                  fontSize: '14px',
                  fontWeight: 500,
                  px: 3,
                  py: 1.5,
                  '&:hover': {
                    backgroundColor: isFormValid() ? '#E68A0D' : '#ccc',
                  },
                  '&:disabled': {
                    backgroundColor: '#ccc',
                    cursor: 'not-allowed',
                  },
                }}
                endIcon={<ArrowForward />}
              >
                Confirm →
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Box>

      {/* Support FAB */}
      <Fab
        color="primary"
        aria-label="support"
        sx={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          backgroundColor: '#4CAF50',
          '&:hover': {
            backgroundColor: '#45a049',
          },
        }}
      >
        <HeadsetMic />
      </Fab>

      {/* Success Popup */}
      <Modal
        open={showSuccessPopup}
        onClose={handleCloseSuccessPopup}
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-end',
        }}
      >
        <Box
          sx={{
            width: '35%',
            height: '100vh',
            backgroundColor: '#F3F3F3',
            overflow: 'auto',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            padding: '24px',
          }}
        >
          <Card sx={{
            backgroundColor: 'white',
            borderRadius: '8px',
            padding: '32px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            minHeight: '300px',
            justifyContent: 'space-between',
          }}>
            {/* Close Button */}
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', width: '100%', mb: 2 }}>
              <IconButton
                onClick={handleCloseSuccessPopup}
                sx={{
                  color: '#666',
                  '&:hover': {
                    backgroundColor: 'rgba(0, 0, 0, 0.04)',
                  },
                }}
              >
                ✕
              </IconButton>
            </Box>

            {/* Success Icon */}
            <Box sx={{
              backgroundColor: '#4CAF50',
              borderRadius: '50%',
              width: '60px',
              height: '60px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mb: 3,
            }}>
              <CheckCircleOutline sx={{ color: 'white', fontSize: '36px' }} />
            </Box>

            {/* Congratulations Text */}
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                color: '#4CAF50',
                mb: 1,
                fontSize: '18px',
              }}
            >
              Congratulations!
            </Typography>

            {/* Success Message */}
            <Typography
              variant="body1"
              sx={{
                color: '#333',
                mb: 0.5,
                fontSize: '16px',
              }}
            >
              You have successfully
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: '#333',
                fontWeight: 700,
                mb: 4,
                fontSize: '16px',
              }}
            >
              Set your daily limit
            </Typography>

            {/* Done Button */}
            <Button
              variant="contained"
              onClick={handleCloseSuccessPopup}
              fullWidth
              sx={{
                backgroundColor: '#FC9F15',
                color: 'white',
                py: 2,
                borderRadius: '4px',
                textTransform: 'none',
                fontSize: '16px',
                fontWeight: 500,
                '&:hover': {
                  backgroundColor: '#E68A0D',
                },
              }}
            >
              Done
            </Button>
          </Card>
        </Box>
      </Modal>
    </Box>
  );
};

export default DailyLimit;
