import React from 'react';
import {
  Box,
  Modal,
  Typography,
  IconButton,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel
} from '@mui/material';
import {
  Close as CloseIcon,
  ArrowForward as ArrowForwardIcon
} from '@mui/icons-material';
import { FormErrors, DateObject, AmountObject } from './types';

interface TransferModalProps {
  open: boolean;
  onClose: () => void;
  accountSelectorOpen: boolean;
  selectedAccount: string;
  beneficiaryAccount: string;
  amount: AmountObject;
  explanation: string;
  period: string;
  startDate: DateObject;
  endDate: DateObject;
  errors: FormErrors;
  
  onAccountSelectorToggle: () => void;
  onAccountChange: (accountId: string) => void;
  onBeneficiaryAccountChange: (event: any) => void;
  onAmountChange: (field: string, value: string) => void;
  onExplanationChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onPeriodChange: (event: any) => void;
  onStartDateChange: (field: string, value: string) => void;
  onEndDateChange: (field: string, value: string) => void;
  onConfirmTransfer: () => void;
  
  accounts: Array<{
    id: string;
    name: string;
    iban: string;
    balance: string;
  }>;
  selectedAccountData: {
    name: string;
    iban: string;
    balance: string;
  };
  days: string[];
  months: Array<{ value: string; label: string }>;
  years: string[];
}

const TransferModal: React.FC<TransferModalProps> = ({
  open,
  onClose,
  accountSelectorOpen,
  selectedAccount,
  beneficiaryAccount,
  amount,
  explanation,
  period,
  startDate,
  endDate,
  errors,
  
  onAccountSelectorToggle,
  onAccountChange,
  onBeneficiaryAccountChange,
  onAmountChange,
  onExplanationChange,
  onPeriodChange,
  onStartDateChange,
  onEndDateChange,
  onConfirmTransfer,
  
  accounts,
  selectedAccountData,
  days,
  months,
  years
}) => {
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
          backdropFilter: 'blur(4px)'
        }
      }}
    >
      <Box
        sx={{
          position: 'relative',
          width: '50%',
          height: '100vh',
          bgcolor: '#F3F3F3',
          borderRadius: '16px 0 0 0',
          boxShadow: 24,
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
          borderBottom: '1px solid #e0e0e0',
          bgcolor: 'white'
        }}>
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
            Account opening
          </Typography>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>

        {/* Account Information Section */}
        <Typography
          component="h2"
          variant="h5"
          sx={{
            position: 'absolute',
            left: '-10000px',
            width: '1px',
            height: '1px',
            overflow: 'hidden'
          }}
        >
          Account Information
        </Typography>
        
        {/* Account Details Section */}
        <Box 
          sx={{ 
            p: 3, 
            bgcolor: 'white', 
            m: 3, 
            borderRadius: 1, 
            position: 'relative',
            cursor: 'pointer'
          }}
          onClick={onAccountSelectorToggle}
        >
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6" sx={{ color: '#004996', fontWeight: 'bold' }}>
              {selectedAccountData.name}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography>{selectedAccountData.balance}</Typography>
              <ArrowForwardIcon sx={{ transform: accountSelectorOpen ? 'rotate(270deg)' : 'rotate(90deg)', transition: 'transform 0.2s' }} />
            </Box>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="body2">IBAN Number</Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography variant="body2">{selectedAccountData.iban}</Typography>
              <ArrowForwardIcon sx={{ transform: accountSelectorOpen ? 'rotate(270deg)' : 'rotate(90deg)', transition: 'transform 0.2s' }} />
            </Box>
          </Box>

          {/* Account Selector Dropdown */}
          {accountSelectorOpen && (
            <Box sx={{ 
              position: 'absolute', 
              top: '100%', 
              left: 0, 
              right: 0, 
              bgcolor: 'white', 
              border: '1px solid #e0e0e0', 
              borderRadius: 1, 
              mt: 1, 
              zIndex: 1000,
              boxShadow: 3
            }}>
              {accounts.map((account) => (
                <Box
                  key={account.id}
                  sx={{
                    p: 2,
                    cursor: 'pointer',
                    borderBottom: '1px solid #f0f0f0',
                    '&:last-child': { borderBottom: 'none' },
                    bgcolor: selectedAccount === account.id ? '#f0f8ff' : 'transparent'
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    onAccountChange(account.id);
                  }}
                >
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    <Typography variant="body1" sx={{ fontWeight: 'bold', color: '#004996' }}>
                      {account.name}
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                      {account.balance}
                    </Typography>
                  </Box>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    {account.iban}
                  </Typography>
                </Box>
              ))}
            </Box>
          )}
        </Box>

        {/* Form Fields */}
        <Box sx={{ p: 3, bgcolor: 'white', mx: 3, mb: 3, borderRadius: 1, flex: 1 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {/* Beneficiary Account */}
            <FormControl fullWidth error={!!errors.beneficiaryAccount}>
              <InputLabel>Beneficiary Account</InputLabel>
              <Select
                value={beneficiaryAccount}
                label="Beneficiary Account"
                onChange={onBeneficiaryAccountChange}
              >
                <MenuItem value="">Select a beneficiary account</MenuItem>
                {accounts.map((account) => (
                  <MenuItem key={account.id} value={account.iban}>
                    {account.name} (IBAN: {account.iban})
                  </MenuItem>
                ))}
              </Select>
              {errors.beneficiaryAccount && (
                <Typography variant="body2" color="error">{errors.beneficiaryAccount}</Typography>
              )}
            </FormControl>

            {/* Amount */}
            <Box>
              <Typography variant="body2" sx={{ mb: 1 }}>Amount</Typography>
              <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                <TextField
                  placeholder="000"
                  sx={{ flex: 1 }}
                  size="small"
                  value={amount.whole}
                  onChange={(e) => onAmountChange('whole', e.target.value)}
                  error={!!errors.amount}
                />
                <TextField
                  placeholder="00"
                  sx={{ width: '80px' }}
                  size="small"
                  value={amount.decimal}
                  onChange={(e) => onAmountChange('decimal', e.target.value)}
                  error={!!errors.amount}
                />
                <Typography>€</Typography>
              </Box>
              {errors.amount && (
                <Typography variant="body2" color="error">{errors.amount}</Typography>
              )}
            </Box>

            {/* Explanation */}
            <TextField
              fullWidth
              label="Explanation"
              placeholder="Text"
              inputProps={{ maxLength: 50 }}
              helperText={`${(explanation || '').length}/50 characters`}
              onChange={onExplanationChange}
              error={!!errors.explanation}
              value={explanation}
            />

            {/* Period */}
            <FormControl fullWidth error={!!errors.period}>
              <InputLabel>Period *</InputLabel>
              <Select
                value={period}
                label="Period *"
                onChange={onPeriodChange}
              >
                <MenuItem value="every-day">Every day</MenuItem>
                <MenuItem value="every-week">Every week</MenuItem>
                <MenuItem value="every-month">Every month</MenuItem>
                <MenuItem value="every-year">Every year</MenuItem>
                <MenuItem value="one-time">One time</MenuItem>
              </Select>
              {errors.period && (
                <Typography variant="body2" color="error">{errors.period}</Typography>
              )}
            </FormControl>

            {/* Start Date */}
            {period !== 'one-time' && (
              <Box>
                <Typography variant="body2" sx={{ mb: 1 }}>Start Date</Typography>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <FormControl size="small" sx={{ flex: 1 }} error={!!errors.startDate}>
                    <InputLabel>Day</InputLabel>
                    <Select value={startDate.day} label="Day" onChange={(e) => onStartDateChange('day', e.target.value)}>
                      {days.map(day => (
                        <MenuItem key={day} value={day}>{day}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  <FormControl size="small" sx={{ flex: 1 }} error={!!errors.startDate}>
                    <InputLabel>Month</InputLabel>
                    <Select value={startDate.month} label="Month" onChange={(e) => onStartDateChange('month', e.target.value)}>
                      {months.map(month => (
                        <MenuItem key={month.value} value={month.value}>{month.label}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  <FormControl size="small" sx={{ flex: 1 }} error={!!errors.startDate}>
                    <InputLabel>Year</InputLabel>
                    <Select value={startDate.year} label="Year" onChange={(e) => onStartDateChange('year', e.target.value)}>
                      {years.map(year => (
                        <MenuItem key={year} value={year}>{year}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Box>
                {errors.startDate && (
                  <Typography variant="body2" color="error">{errors.startDate}</Typography>
                )}
              </Box>
            )}

            {/* End Date */}
            {period !== 'one-time' && (
              <Box>
                <Typography variant="body2" sx={{ mb: 1 }}>End Date</Typography>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <FormControl size="small" sx={{ flex: 1 }} error={!!errors.endDate}>
                    <InputLabel>Day</InputLabel>
                    <Select value={endDate.day} label="Day" onChange={(e) => onEndDateChange('day', e.target.value)}>
                      {days.map(day => (
                        <MenuItem key={day} value={day}>{day}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  <FormControl size="small" sx={{ flex: 1 }} error={!!errors.endDate}>
                    <InputLabel>Month</InputLabel>
                    <Select value={endDate.month} label="Month" onChange={(e) => onEndDateChange('month', e.target.value)}>
                      {months.map(month => (
                        <MenuItem key={month.value} value={month.value}>{month.label}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  <FormControl size="small" sx={{ flex: 1 }} error={!!errors.endDate}>
                    <InputLabel>Year</InputLabel>
                    <Select value={endDate.year} label="Year" onChange={(e) => onEndDateChange('year', e.target.value)}>
                      {years.map(year => (
                        <MenuItem key={year} value={year}>{year}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Box>
                {errors.endDate && (
                  <Typography variant="body2" color="error">{errors.endDate}</Typography>
                )}
              </Box>
            )}

            {/* Single Date for One Time */}
            {period === 'one-time' && (
              <Box>
                <Typography variant="body2" sx={{ mb: 1 }}>Date</Typography>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <FormControl size="small" sx={{ flex: 1 }} error={!!errors.startDate}>
                    <InputLabel>Day</InputLabel>
                    <Select value={startDate.day} label="Day" onChange={(e) => onStartDateChange('day', e.target.value)}>
                      {days.map(day => (
                        <MenuItem key={day} value={day}>{day}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  <FormControl size="small" sx={{ flex: 1 }} error={!!errors.startDate}>
                    <InputLabel>Month</InputLabel>
                    <Select value={startDate.month} label="Month" onChange={(e) => onStartDateChange('month', e.target.value)}>
                      {months.map(month => (
                        <MenuItem key={month.value} value={month.value}>{month.label}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  <FormControl size="small" sx={{ flex: 1 }} error={!!errors.startDate}>
                    <InputLabel>Year</InputLabel>
                    <Select value={startDate.year} label="Year" onChange={(e) => onStartDateChange('year', e.target.value)}>
                      {years.map(year => (
                        <MenuItem key={year} value={year}>{year}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Box>
                {errors.startDate && (
                  <Typography variant="body2" color="error">{errors.startDate}</Typography>
                )}
              </Box>
            )}
          </Box>
        </Box>

        {/* Confirm Button */}
        <Box sx={{ p: 3, bgcolor: 'white', mx: 3, mb: 3, borderRadius: 1 }}>
          <Button
            variant="contained"
            fullWidth
            onClick={onConfirmTransfer}
            sx={{
              backgroundColor: '#FC9F15',
              '&:hover': { backgroundColor: '#e88a0a' },
              py: 2,
              fontSize: '1.1rem'
            }}
            endIcon={<ArrowForwardIcon />}
          >
            Confirm →
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default TransferModal;
