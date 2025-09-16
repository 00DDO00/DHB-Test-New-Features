import React from 'react';
import {
  Box,
  Typography,
  Modal,
  TextField,
  Select,
  MenuItem,
  FormControl,
  Radio,
  RadioGroup,
  FormControlLabel,
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
  setSelectedOption,
  accountOptions,
  amount,
  setAmount,
  showSummary,
  showFinalConfirmation,
  termsAccepted,
  setTermsAccepted,
  selectedIban,
  setSelectedIban,
  errors,
  ibanOptions,
  onProceed,
  onEditTransaction,
  onConfirmTransaction,
  onFinalDone,
  calculateMaturityDate,
  calculateValueDate,
  getSelectedIbanDetails
}) => {
  const handleAmountChange = (field: 'whole' | 'decimal', value: string) => {
    setAmount(prev => ({ ...prev, [field]: value }));
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
          {!showSummary && !showFinalConfirmation ? (
            /* Form Content */
            <Card sx={{ backgroundColor: 'white', borderRadius: 2, p: 3 }}>
            {/* IBAN Section */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="body2" color="#004996" fontWeight="medium" sx={{ mb: 1 }}>
                IBAN
              </Typography>
              <FormControl fullWidth>
                <Select
                  value={selectedIban}
                  onChange={(e) => setSelectedIban(e.target.value)}
                  displayEmpty
                  size="small"
                  sx={{ 
                    backgroundColor: '#F9F9F9',
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
                    <Typography variant="body2" color="#666">Balance</Typography>
                    <Typography variant="body2" fontWeight="medium">{getSelectedIbanDetails()?.balance}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2" color="#666">Account</Typography>
                    <Typography variant="body2" fontWeight="medium">{getSelectedIbanDetails()?.accountName}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2" color="#666">Account holder(s)</Typography>
                    <Typography variant="body2" fontWeight="medium">{getSelectedIbanDetails()?.accountName}</Typography>
                  </Box>
                </Box>
              )}
            </Box>

            {/* Amount Entry Section */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="body2" color="#004996" fontWeight="medium" sx={{ mb: 2 }}>
                Amount entry
              </Typography>
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 1
              }}>
                <TextField
                  value={amount.whole}
                  onChange={(e) => handleAmountChange('whole', e.target.value)}
                  placeholder="000"
                  size="small"
                  sx={{ width: '220px' }}
                  inputProps={{ style: { textAlign: 'center' } }}
                />
                <Typography variant="h6">,</Typography>
                <TextField
                  value={amount.decimal}
                  onChange={(e) => handleAmountChange('decimal', e.target.value)}
                  placeholder="00"
                  size="small"
                  sx={{ width: '140px' }}
                  inputProps={{ style: { textAlign: 'center' } }}
                />
                <Box sx={{ ml: 4 }}>
                  <Typography variant="h6">€</Typography>
                </Box>
              </Box>
            </Box>

            {/* Notice Period Dropdown */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="body2" color="#004996" fontWeight="medium" sx={{ mb: 1 }}>
                Notice period
              </Typography>
                          <FormControl fullWidth>
              <Select
                value={selectedOption ? selectedOption.id : ''}
                onChange={(e) => {
                  const option = accountOptions.find(opt => opt.id === e.target.value);
                  setSelectedOption(option || null);
                }}
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
                {accountOptions && Array.isArray(accountOptions) ? accountOptions.map((option) => (
                  <MenuItem key={option.id} value={option.id}>
                    {option.days} days ({option.interest})
                  </MenuItem>
                )) : null}
              </Select>
            </FormControl>
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
              {errors.iban && (
                <Typography color="error" variant="body2" sx={{ mt: 1, textAlign: 'center' }}>
                  {errors.iban}
                </Typography>
              )}
              {errors.noticePeriod && (
                <Typography color="error" variant="body2" sx={{ mt: 1, textAlign: 'center' }}>
                  {errors.noticePeriod}
                </Typography>
              )}
              {errors.amount && (
                <Typography color="error" variant="body2" sx={{ mt: 1, textAlign: 'center' }}>
                  {errors.amount}
                </Typography>
              )}
            </Card>
          ) : showSummary && !showFinalConfirmation ? (
            /* Summary Content */
            <Box>
              <Typography variant="h5" fontWeight="bold" sx={{ mb: 3, color: '#333' }}>
                Account details
              </Typography>
              
              {/* Account Details Card */}
              <Card sx={{ 
                backgroundColor: 'white', 
                borderRadius: 2, 
                p: 3, 
                mb: 3,
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
              }}>
                <Box sx={{ mb: 3 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="body2" color="#666">Selected account</Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography variant="body2" fontWeight="bold">{selectedIban}</Typography>
                      <IconButton size="small" sx={{ p: 0 }}>
                        <ContentCopy sx={{ fontSize: 16, color: '#666' }} />
                      </IconButton>
                    </Box>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                    <Typography variant="body2" color="#666">Balance</Typography>
                    <Typography variant="body2" fontWeight="bold">{getSelectedIbanDetails()?.balance}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                    <Typography variant="body2" color="#666">Account holder(s)</Typography>
                    <Typography variant="body2" fontWeight="bold">{getSelectedIbanDetails()?.accountName}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                    <Typography variant="body2" color="#666">Amount</Typography>
                    <Typography variant="body2" fontWeight="bold">
                      € {amount.whole || '--.---'},{amount.decimal || '--'}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                    <Typography variant="body2" color="#666">Maturity Date</Typography>
                    <Typography variant="body2" fontWeight="bold">{calculateMaturityDate()}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                    <Typography variant="body2" color="#666">Value Date</Typography>
                    <Typography variant="body2" fontWeight="bold">{calculateValueDate()}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                    <Typography variant="body2" color="#666">Term</Typography>
                    <Typography variant="body2" fontWeight="bold">
                      {selectedOption ? `${selectedOption.days} dagen` : ''}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                    <Typography variant="body2" color="#666">Interest Rate</Typography>
                    <Typography variant="body2" fontWeight="bold">
                      {selectedOption ? selectedOption.interestRate : ''}
                    </Typography>
                  </Box>
                </Box>

                {/* Edit Link */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, cursor: 'pointer' }} onClick={onEditTransaction}>
                  <Typography variant="body2" color="#004996" sx={{ textDecoration: 'underline' }}>
                    Edit
                  </Typography>
                  <ArrowForward sx={{ fontSize: 16, color: '#004996' }} />
                </Box>
              </Card>

              {/* Disclaimer Card */}
              <Card sx={{ 
                backgroundColor: '#F5F5F5', 
                borderRadius: 2, 
                p: 2,
                mb: 3
              }}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={termsAccepted}
                      onChange={(e) => setTermsAccepted(e.target.checked)}
                      sx={{
                        color: '#004996',
                        '&.Mui-checked': {
                          color: '#004996',
                        },
                      }}
                    />
                  }
                  label={
                    <Typography variant="body2" color="#666" sx={{ lineHeight: 1.5 }}>
                      We accept the{' '}
                      <MuiLink href="#" sx={{ color: '#004996', textDecoration: 'underline' }}>
                        Terms and Conditions
                      </MuiLink>
                      {' '}of DHB Bank CombiSpaar Account and acknowledge the receipt of the{' '}
                      <MuiLink href="#" sx={{ color: '#004996', textDecoration: 'underline' }}>
                        Depositor Information Template
                      </MuiLink>.
                    </Typography>
                  }
                  sx={{ alignItems: 'flex-start', margin: 0 }}
                />
              </Card>

              {/* Confirm Button */}
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
          ) : showFinalConfirmation ? (
            /* Final Confirmation Content */
            <Card sx={{ backgroundColor: 'white', borderRadius: 2, p: 3, textAlign: 'center' }}>
              {/* Success Icon */}
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

              {/* Heading */}
              <Typography variant="h5" fontWeight="bold" sx={{ mb: 2, color: '#2E7D32' }}>
                Congratulations!
              </Typography>

              {/* Body Text */}
              <Typography variant="body1" sx={{ mb: 4, color: '#333' }}>
                You have successfully opened your account with DHB CombiSpaar
              </Typography>

              {/* Done Button */}
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
          ) : null}
        </Box>
      </Box>
    </Modal>
  );
};

export default AccountOpeningModalSection;
