import React from 'react';
import {
  Box,
  Typography,
  Modal,
  TextField,
  Select,
  MenuItem,
  FormControl,
  IconButton,
  Checkbox,
  Card,
  Button,
  Link as MuiLink,
} from '@mui/material';
import {
  Close,
  Check,
  ContentCopy,
  ArrowForward,
} from '@mui/icons-material';
import { AccountOpeningModalSectionProps } from './types';

const AccountOpeningModalSection: React.FC<AccountOpeningModalSectionProps> = ({
  modalOpen,
  onClose,
  selectedOption,
  amount,
  setAmount,
  selectedIban,
  setSelectedIban,
  showSummary,
  show2FA,
  showFinalConfirmation,
  termsAccepted,
  setTermsAccepted,
  errors,
  ibanOptions,
  verificationCode,
  setVerificationCode,
  isCodeSent,
  onProceed,
  onEditTransaction,
  onConfirmTransaction,
  onVerifyCode,
  onFinalDone,
  onResendCode,
  getSelectedIbanDetails,
  calculateMaturityDate,
  calculateValueDate
}) => {
  const handleAmountChange = (field: 'whole' | 'decimal', value: string) => {
    setAmount(prev => ({ ...prev, [field]: value }));
  };

  const handleVerificationCodeChange = (index: number, value: string) => {
    const newCode = [...verificationCode];
    newCode[index] = value;
    setVerificationCode(newCode);
    
    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`verification-input-${index + 1}`);
      if (nextInput) {
        nextInput.focus();
      }
    }
  };

  return (
    <Modal
      open={modalOpen}
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
      <Box sx={{
        width: '35%',
        height: '100vh',
        backgroundColor: '#F3F3F3',
        overflow: 'auto',
        display: 'flex',
        flexDirection: 'column'
      }}>
        {/* Modal Header */}
        <Box sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          p: 3,
          borderBottom: '1px solid #E0E0E0'
        }}>
          <Typography variant="h5" fontWeight="bold" color="#333">
            Account opening
          </Typography>
          <IconButton onClick={onClose}>
            <Close />
          </IconButton>
        </Box>

        {/* Modal Content */}
        <Box sx={{ p: 3, flex: 1 }}>
          {!showSummary && !show2FA && !showFinalConfirmation ? (
            /* Form Content */
            <Card sx={{ backgroundColor: 'white', borderRadius: 2, p: 3 }}>
              {/* IBAN Section */}
              <Box sx={{ mb: 3 }}>
                <Typography variant="body2" color="#000" fontWeight="medium" sx={{ mb: 1 }}>
                  IBAN
                </Typography>
                <FormControl fullWidth>
                  <Select
                    value={selectedIban}
                    onChange={(e) => setSelectedIban(e.target.value)}
                    displayEmpty
                    size="small"
                    sx={{ 
                      backgroundColor: 'white',
                      '& .MuiOutlinedInput-root': {
                        '& fieldset': {
                          borderColor: '#004996',
                        },
                      }
                    }}
                  >
                    {ibanOptions && Array.isArray(ibanOptions) ? ibanOptions.map((option) => (
                      <MenuItem key={option.iban} value={option.iban}>
                        {option.iban}
                      </MenuItem>
                    )) : null}
                  </Select>
                </FormControl>
                {selectedIban && getSelectedIbanDetails() && (
                  <Box sx={{ mt: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2" color="#000">Balance</Typography>
                      <Typography variant="body2" fontWeight="medium">{getSelectedIbanDetails()?.balance}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2" color="#000">Account</Typography>
                      <Typography variant="body2" fontWeight="medium">{getSelectedIbanDetails()?.accountName}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body2" color="#000">Account holder(s)</Typography>
                      <Typography variant="body2" fontWeight="medium">{getSelectedIbanDetails()?.accountName}</Typography>
                    </Box>
                  </Box>
                )}
              </Box>

              {/* Amount Entry Section */}
              <Box sx={{ mb: 3 }}>
                <Typography variant="body2" color="#000" fontWeight="medium" sx={{ mb: 2 }}>
                  Amount entry
                </Typography>
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 1
                }}>
                  <TextField
                    placeholder="000"
                    size="small"
                    value={amount.whole}
                    onChange={(e) => handleAmountChange('whole', e.target.value)}
                    sx={{ width: '220px' }}
                    inputProps={{ style: { textAlign: 'center' } }}
                  />
                  <Typography variant="h6">,</Typography>
                  <TextField
                    placeholder="00"
                    size="small"
                    value={amount.decimal}
                    onChange={(e) => handleAmountChange('decimal', e.target.value)}
                    sx={{ width: '140px' }}
                    inputProps={{ style: { textAlign: 'center' } }}
                  />
                  <Box sx={{ ml: 4 }}>
                    <Typography variant="h6">€</Typography>
                  </Box>
                </Box>
              </Box>

              {/* Notice Period Section */}
              <Box sx={{ mb: 3 }}>
                <Typography variant="body2" color="#000" fontWeight="medium" sx={{ mb: 2 }}>
                  Notice period
                </Typography>
                <Typography variant="body2" color="#666" sx={{ mb: 1 }}>
                  Selected: {selectedOption?.term || 'None'}
                </Typography>
                <Typography variant="body2" color="#666" sx={{ mb: 1 }}>
                  Interest: {selectedOption?.interest || 'N/A'}
                </Typography>
              </Box>

              {/* Date Fields */}
              <Box sx={{ mb: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <Typography variant="body2" color="#666">Maturity Date</Typography>
                  <Typography variant="body2" fontWeight="medium">{calculateMaturityDate()}</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2" color="#666">Value Date</Typography>
                  <Typography variant="body2" fontWeight="medium">{calculateValueDate()}</Typography>
                </Box>
              </Box>

              {/* Proceed Button */}
              <Button
                variant="contained"
                fullWidth
                onClick={onProceed}
                sx={{
                  backgroundColor: '#FC9F15',
                  color: 'white',
                  textTransform: 'none',
                  borderRadius: 2,
                  py: 1.5,
                  fontWeight: 500,
                  mt: 3,
                  '&:hover': {
                    backgroundColor: '#e58a0d'
                  }
                }}
              >
                Proceed
              </Button>
              {errors.form && (
                <Typography color="error" variant="body2" sx={{ mt: 1, textAlign: 'center' }}>
                  {errors.form}
                </Typography>
              )}
            </Card>
          ) : showSummary && !show2FA && !showFinalConfirmation ? (
            /* Summary Content */
            <Box>
              <Typography variant="h5" fontWeight="bold" sx={{ mb: 3, color: '#333' }}>
                Account details
              </Typography>
              
              <Card sx={{ 
                backgroundColor: 'white', 
                borderRadius: 2, 
                p: 3, 
                mb: 3,
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
              }}>
                <Box sx={{ mb: 3 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                    <Typography variant="body2" color="#666">Selected account</Typography>
                    <Typography variant="body2" fontWeight="bold">{selectedIban}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                    <Typography variant="body2" color="#666">Amount</Typography>
                    <Typography variant="body2" fontWeight="bold">
                      € {amount.whole || '--.---'},{amount.decimal || '--'}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                    <Typography variant="body2" color="#666">Term</Typography>
                    <Typography variant="body2" fontWeight="bold">{selectedOption?.term}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                    <Typography variant="body2" color="#666">Interest Rate</Typography>
                    <Typography variant="body2" fontWeight="bold">{selectedOption?.interest}</Typography>
                  </Box>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, cursor: 'pointer' }} onClick={onEditTransaction}>
                  <Typography variant="body2" color="#004996" sx={{ textDecoration: 'underline' }}>
                    Edit
                  </Typography>
                  <ArrowForward sx={{ fontSize: 16, color: '#004996' }} />
                </Box>
              </Card>

              {/* Terms and Conditions */}
              <Card sx={{ backgroundColor: '#F5F5F5', borderRadius: 2, p: 2, mb: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                  <Checkbox
                    checked={termsAccepted}
                    onChange={(e) => setTermsAccepted(e.target.checked)}
                    sx={{ color: '#004996', '&.Mui-checked': { color: '#004996' } }}
                  />
                  <Typography variant="body2" color="#666" sx={{ lineHeight: 1.5 }}>
                    We accept the Terms and Conditions of DHB Bank MaxiSpaar Account
                  </Typography>
                </Box>
              </Card>

              <Button
                variant="contained"
                fullWidth
                onClick={onConfirmTransaction}
                sx={{
                  backgroundColor: '#FC9F15',
                  color: 'white',
                  textTransform: 'none',
                  borderRadius: 2,
                  py: 1.5,
                  fontWeight: 500,
                  '&:hover': {
                    backgroundColor: '#e58a0d'
                  }
                }}
              >
                Confirm
              </Button>
              {errors.terms && (
                <Typography color="error" variant="body2" sx={{ mt: 1, textAlign: 'center' }}>
                  {errors.terms}
                </Typography>
              )}
            </Box>
          ) : show2FA && !showFinalConfirmation ? (
            /* 2FA Verification Content */
            <Box>
              <Typography variant="h5" fontWeight="bold" sx={{ mb: 3, color: '#333' }}>
                Two-Factor Authentication
              </Typography>
              
              <Card sx={{ backgroundColor: 'white', borderRadius: 2, p: 3, mb: 3 }}>
                <Typography variant="body1" sx={{ mb: 3, color: '#333' }}>
                  Please enter the verification code sent to your device.
                </Typography>
                
                <Box sx={{ 
                  display: 'flex', 
                  gap: 1, 
                  justifyContent: 'center',
                  mb: 3
                }}>
                  {verificationCode.map((digit, index) => (
                    <TextField
                      key={index}
                      id={`verification-input-${index}`}
                      value={digit}
                      onChange={(e) => handleVerificationCodeChange(index, e.target.value)}
                      inputProps={{
                        maxLength: 1,
                        style: { textAlign: 'center', fontSize: '1.5rem' }
                      }}
                      sx={{ width: 50 }}
                    />
                  ))}
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
                  <Typography variant="body2" color="#666">
                    Didn't receive the code?{' '}
                    <Button variant="text" onClick={onResendCode} sx={{ color: '#004996', p: 0, minWidth: 'auto' }}>
                      Resend
                    </Button>
                  </Typography>
                </Box>
              </Card>

              <Button
                variant="contained"
                fullWidth
                onClick={onVerifyCode}
                sx={{
                  backgroundColor: '#FC9F15',
                  color: 'white',
                  textTransform: 'none',
                  borderRadius: 2,
                  py: 1.5,
                  fontWeight: 500,
                  '&:hover': {
                    backgroundColor: '#e58a0d'
                  }
                }}
              >
                Verify Code
              </Button>
            </Box>
          ) : (
            /* Final Confirmation Content */
            <Card sx={{ backgroundColor: 'white', borderRadius: 2, p: 3, textAlign: 'center' }}>
              <Box sx={{ mb: 3 }}>
                <Box sx={{
                  width: 80,
                  height: 80,
                  borderRadius: '50%',
                  backgroundColor: '#4CAF50',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto',
                  mb: 3
                }}>
                  <Check sx={{ color: 'white', fontSize: 40 }} />
                </Box>

                <Typography variant="h5" fontWeight="bold" sx={{ mb: 2, color: '#2E7D32' }}>
                  Congratulations!
                </Typography>

                <Typography variant="body1" sx={{ mb: 4, color: '#333' }}>
                  You have successfully opened your account with DHB MaxiSpaar
                </Typography>
              </Box>

              <Button
                variant="contained"
                fullWidth
                onClick={onFinalDone}
                sx={{
                  backgroundColor: '#F5A623',
                  color: 'white',
                  textTransform: 'none',
                  borderRadius: 2,
                  py: 1.5,
                  fontWeight: 500,
                  '&:hover': {
                    backgroundColor: '#e6951a'
                  }
                }}
              >
                Done
              </Button>
            </Card>
          )}
        </Box>
      </Box>
    </Modal>
  );
};

export default AccountOpeningModalSection;
