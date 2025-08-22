import React from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Breadcrumbs,
  Link as MuiLink,
  TextField,
  Button,
  Fab,
  InputAdornment,
  IconButton,
  Modal,
} from '@mui/material';
import {
  Link,
  ArrowForward,
  HeadsetMic,
  Visibility,
  VisibilityOff,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { apiService } from '../services/api';

const ChangePassword: React.FC = () => {
  const navigate = useNavigate();
  const [showCurrentPassword, setShowCurrentPassword] = React.useState(false);
  const [showNewPassword, setShowNewPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);
  const [formData, setFormData] = React.useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = React.useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [showConfirmationPopup, setShowConfirmationPopup] = React.useState(false);
  const [smsCode, setSmsCode] = React.useState(['', '', '', '', '', '']);
  const [activeCodeIndex, setActiveCodeIndex] = React.useState(0);
  const [phoneNumber, setPhoneNumber] = React.useState('+31 6****1234');
  const [verificationCode, setVerificationCode] = React.useState('');

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors[field as keyof typeof errors]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const handleCancel = () => {
    navigate('/settings/personal-details');
  };

  const validateForm = async () => {
    const newErrors = {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    };
    
    // Validate current password using API
    if (!formData.currentPassword) {
      newErrors.currentPassword = 'Current password is required';
    } else {
      try {
        const validation = await apiService.validatePassword(formData.currentPassword);
        if (!validation.valid) {
          newErrors.currentPassword = 'Current password is incorrect';
        }
      } catch (error) {
        newErrors.currentPassword = 'Failed to validate password';
      }
    }
    
    // Validate new password
    if (!formData.newPassword) {
      newErrors.newPassword = 'New password is required';
    } else if (formData.newPassword.length < 6) {
      newErrors.newPassword = 'New password must be at least 6 characters';
    }
    
    // Validate confirm password
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your new password';
    } else if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    setErrors(newErrors);
    return !Object.values(newErrors).some(error => error !== '');
  };

  const handleConfirm = async () => {
    if (await validateForm()) {
      try {
        // Get phone number from API
        const phoneData = await apiService.getPhoneNumber();
        setPhoneNumber(phoneData.phone);
        
        // Send verification code
        const codeResponse = await apiService.sendVerificationCode();
        console.log('API verification code response:', codeResponse);
        
        setShowConfirmationPopup(true);
        
        // Set verification code after popup is opened
        setTimeout(() => {
          setVerificationCode(codeResponse.code);
        }, 100);
      } catch (error) {
        console.error('Failed to get phone number or send code:', error);
        setShowConfirmationPopup(true); // Still show popup with default data
      }
    }
  };

  const handleCodeChange = (index: number, value: string) => {
    if (value.length <= 1 && /^\d*$/.test(value)) {
      const newCode = [...smsCode];
      newCode[index] = value;
      setSmsCode(newCode);
      
      // Auto-focus next field
      if (value && index < 5) {
        setActiveCodeIndex(index + 1);
      }
    }
  };

  const handleCodeKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !smsCode[index] && index > 0) {
      setActiveCodeIndex(index - 1);
    }
  };

  const handleSendCode = async () => {
    const code = smsCode.join('');
    if (code.length === 6) {
      setIsSubmitting(true);
      
      try {
        // Update password in API
        await apiService.updatePassword(formData.newPassword);
        console.log('SMS code verified:', code);
        console.log('Password change confirmed:', formData);
        
        // Navigate back to personal details
        navigate('/settings/personal-details');
      } catch (error) {
        console.error('Failed to update password:', error);
        setIsSubmitting(false);
      }
    }
  };

  // Auto-fill verification code when it's received
  React.useEffect(() => {
    console.log('Verification code received:', verificationCode);
    if (verificationCode && verificationCode.length === 6) {
      console.log('Auto-filling SMS code with:', verificationCode);
      setSmsCode(verificationCode.split(''));
    }
  }, [verificationCode]);

  const handleCloseConfirmationPopup = () => {
    setShowConfirmationPopup(false);
    setSmsCode(['', '', '', '', '', '']);
    setActiveCodeIndex(0);
  };

  const togglePasswordVisibility = (field: string) => {
    switch (field) {
      case 'current':
        setShowCurrentPassword(!showCurrentPassword);
        break;
      case 'new':
        setShowNewPassword(!showNewPassword);
        break;
      case 'confirm':
        setShowConfirmPassword(!showConfirmPassword);
        break;
    }
  };

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      backgroundColor: '#f5f5f5',
      padding: '24px'
    }}>
      {/* Breadcrumbs */}
      <Breadcrumbs sx={{ mb: 3, color: '#666' }}>
        <MuiLink
          component={Link}
          to="/"
          sx={{ 
            color: '#666', 
            textDecoration: 'none',
            '&:hover': { color: '#333' }
          }}
        >
          Home
        </MuiLink>
        <MuiLink
          component={Link}
          to="/settings"
          sx={{ 
            color: '#666', 
            textDecoration: 'none',
            '&:hover': { color: '#333' }
          }}
        >
          Settings
        </MuiLink>
        <MuiLink
          component={Link}
          to="/settings/personal-details"
          sx={{ 
            color: '#666', 
            textDecoration: 'none',
            '&:hover': { color: '#333' }
          }}
        >
          Personal Details
        </MuiLink>
        <Typography sx={{ color: '#333' }}>
          Change password
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
          maxWidth: '600px',
          backgroundColor: 'white',
          borderRadius: '8px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}>
          <CardContent sx={{ padding: '32px' }}>
            {/* Title and Description */}
            <Typography
              variant="h4"
              sx={{
                fontWeight: 700,
                color: '#333',
                mb: 2,
                fontSize: '24px',
              }}
            >
              Change password
            </Typography>
            
            <Typography
              variant="body1"
              sx={{
                color: '#333',
                mb: 4,
                fontSize: '14px',
                lineHeight: 1.5,
              }}
            >
              The setting allows you to select or change the default account for incoming funds.
            </Typography>

            {/* Form Fields */}
            <Box sx={{ mb: 4 }}>
              {/* Current Password */}
              <Box sx={{ mb: 3 }}>
                <Typography
                  variant="body2"
                  sx={{
                    color: '#333',
                    fontSize: '14px',
                    mb: 1,
                    fontWeight: 500,
                  }}
                >
                  Current password
                </Typography>
                <TextField
                  fullWidth
                  type={showCurrentPassword ? 'text' : 'password'}
                  placeholder="Password"
                  value={formData.currentPassword}
                  onChange={(e) => handleChange('currentPassword', e.target.value)}
                  size="small"
                  error={!!errors.currentPassword}
                  helperText={errors.currentPassword}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      backgroundColor: 'white',
                      '& fieldset': {
                        borderColor: errors.currentPassword ? '#d32f2f' : '#004996',
                      },
                      '&:hover fieldset': {
                        borderColor: errors.currentPassword ? '#d32f2f' : '#004996',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: errors.currentPassword ? '#d32f2f' : '#004996',
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
                    '& .MuiFormHelperText-root': {
                      color: '#d32f2f',
                      fontSize: '12px',
                      marginLeft: 0,
                    },
                  }}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => togglePasswordVisibility('current')}
                          edge="end"
                          sx={{ color: '#004996' }}
                        >
                          {showCurrentPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </Box>

              {/* New Password */}
              <Box sx={{ mb: 3 }}>
                <Typography
                  variant="body2"
                  sx={{
                    color: '#333',
                    fontSize: '14px',
                    mb: 1,
                    fontWeight: 500,
                  }}
                >
                  New password
                </Typography>
                <TextField
                  fullWidth
                  type={showNewPassword ? 'text' : 'password'}
                  placeholder="Password"
                  value={formData.newPassword}
                  onChange={(e) => handleChange('newPassword', e.target.value)}
                  size="small"
                  error={!!errors.newPassword}
                  helperText={errors.newPassword}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      backgroundColor: 'white',
                      '& fieldset': {
                        borderColor: errors.newPassword ? '#d32f2f' : '#004996',
                      },
                      '&:hover fieldset': {
                        borderColor: errors.newPassword ? '#d32f2f' : '#004996',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: errors.newPassword ? '#d32f2f' : '#004996',
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
                    '& .MuiFormHelperText-root': {
                      color: '#d32f2f',
                      fontSize: '12px',
                      marginLeft: 0,
                    },
                  }}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => togglePasswordVisibility('new')}
                          edge="end"
                          sx={{ color: '#004996' }}
                        >
                          {showNewPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </Box>

              {/* Confirm New Password */}
              <Box sx={{ mb: 4 }}>
                <Typography
                  variant="body2"
                  sx={{
                    color: '#333',
                    fontSize: '14px',
                    mb: 1,
                    fontWeight: 500,
                  }}
                >
                  Confirm New password
                </Typography>
                <TextField
                  fullWidth
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="Password"
                  value={formData.confirmPassword}
                  onChange={(e) => handleChange('confirmPassword', e.target.value)}
                  size="small"
                  error={!!errors.confirmPassword}
                  helperText={errors.confirmPassword}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      backgroundColor: 'white',
                      '& fieldset': {
                        borderColor: errors.confirmPassword ? '#d32f2f' : '#004996',
                      },
                      '&:hover fieldset': {
                        borderColor: errors.confirmPassword ? '#d32f2f' : '#004996',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: errors.confirmPassword ? '#d32f2f' : '#004996',
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
                    '& .MuiFormHelperText-root': {
                      color: '#d32f2f',
                      fontSize: '12px',
                      marginLeft: 0,
                    },
                  }}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => togglePasswordVisibility('confirm')}
                          edge="end"
                          sx={{ color: '#004996' }}
                        >
                          {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </Box>

              {/* Action Buttons */}
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Button
                  variant="outlined"
                  onClick={handleCancel}
                  disabled={isSubmitting}
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
                    '&:disabled': {
                      borderColor: '#ccc',
                      color: '#ccc',
                    },
                  }}
                >
                  Cancel
                </Button>
                <Button
                  variant="contained"
                  onClick={handleConfirm}
                  disabled={isSubmitting}
                  sx={{
                    backgroundColor: isSubmitting ? '#ccc' : '#FC9F15',
                    color: 'white',
                    textTransform: 'none',
                    fontSize: '14px',
                    fontWeight: 500,
                    px: 3,
                    py: 1.5,
                    '&:hover': {
                      backgroundColor: isSubmitting ? '#ccc' : '#E68A0D',
                    },
                    '&:disabled': {
                      backgroundColor: '#ccc',
                    },
                  }}
                  endIcon={isSubmitting ? null : <ArrowForward />}
                >
                  {isSubmitting ? 'Updating...' : 'Confirm'}
                </Button>
              </Box>
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

      {/* SMS Confirmation Popup */}
      <Modal
        open={showConfirmationPopup}
        onClose={handleCloseConfirmationPopup}
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
            backdropFilter: 'blur(4px)',
            padding: '24px',
          }}
        >
          <Card sx={{ 
            backgroundColor: 'white', 
            borderRadius: '8px', 
            padding: '24px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
          }}>
            {/* Close Button */}
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
              <IconButton
                onClick={handleCloseConfirmationPopup}
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

            {/* Title */}
            <Typography
              variant="h5"
              sx={{
                fontWeight: 700,
                color: '#333',
                mb: 3,
                fontSize: '20px',
              }}
            >
              Confirm your action
            </Typography>

            {/* SMS Notification */}
            <Box sx={{ mb: 4 }}>
              <Typography
                variant="body1"
                sx={{
                  color: '#333',
                  fontSize: '14px',
                  fontWeight: 600,
                  mb: 1,
                }}
              >
                We will send you a code via SMS to:
              </Typography>
              <Typography
                variant="h6"
                sx={{
                  color: '#333',
                  fontSize: '16px',
                  fontWeight: 700,
                  mb: 1,
                }}
              >
                {phoneNumber}
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: '#333',
                  fontSize: '12px',
                }}
              >
                Please update your personal details if this number is incorrect.
              </Typography>
            </Box>

            {/* Code Entry */}
            <Box sx={{ mb: 4 }}>
              <Typography
                variant="body2"
                sx={{
                  color: '#333',
                  fontSize: '14px',
                  mb: 2,
                }}
              >
                Enter your code here
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, mb: 3 }}>
                {smsCode.map((digit, index) => (
                  <TextField
                    key={index}
                    value={digit}
                    onChange={(e) => handleCodeChange(index, e.target.value)}
                    onKeyDown={(e) => handleCodeKeyDown(index, e)}
                    onFocus={() => setActiveCodeIndex(index)}
                    size="small"
                    inputProps={{
                      maxLength: 1,
                      style: { textAlign: 'center', fontSize: '18px', fontWeight: 600 }
                    }}
                    sx={{
                      width: '50px',
                      '& .MuiOutlinedInput-root': {
                        backgroundColor: 'white',
                        '& fieldset': {
                          borderColor: activeCodeIndex === index ? '#004996' : '#E0E0E0',
                          borderWidth: activeCodeIndex === index ? '2px' : '1px',
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
                      },
                    }}
                  />
                ))}
              </Box>
            </Box>

            {/* Action Links */}
            <Box sx={{ mb: 4 }}>
              <Typography
                variant="body2"
                sx={{
                  color: '#FC9F15',
                  fontSize: '14px',
                  cursor: 'pointer',
                  mb: 2,
                  '&:hover': {
                    textDecoration: 'underline',
                  },
                }}
              >
                Resend code
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: '#666',
                  fontSize: '14px',
                  cursor: 'pointer',
                  '&:hover': {
                    textDecoration: 'underline',
                  },
                }}
              >
                Do you have another number?
              </Typography>
            </Box>

            {/* Action Buttons */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Button
                variant="contained"
                onClick={handleSendCode}
                disabled={smsCode.join('').length !== 6 || isSubmitting}
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
                  '&:disabled': {
                    backgroundColor: '#ccc',
                  },
                }}
                endIcon={<ArrowForward />}
              >
                {isSubmitting ? 'Verifying...' : 'Send →'}
              </Button>
              <Button
                variant="outlined"
                onClick={handleCloseConfirmationPopup}
                disabled={isSubmitting}
                fullWidth
                sx={{
                  borderColor: '#004996',
                  color: '#004996',
                  py: 2,
                  borderRadius: '4px',
                  textTransform: 'none',
                  fontSize: '16px',
                  fontWeight: 500,
                  '&:hover': {
                    borderColor: '#003366',
                    backgroundColor: 'rgba(0, 73, 150, 0.04)',
                  },
                  '&:disabled': {
                    borderColor: '#ccc',
                    color: '#ccc',
                  },
                }}
              >
                Cancel
              </Button>
            </Box>
          </Card>
        </Box>
      </Modal>
    </Box>
  );
};

export default ChangePassword;
