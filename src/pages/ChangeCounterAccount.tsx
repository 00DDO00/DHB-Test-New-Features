import React from 'react';
import {
  Box,
  Card,
  Typography,
  Button,
  Breadcrumbs,
  Link,
  Fab,
  Modal,
  TextField,
  Checkbox,
  FormControlLabel,
  IconButton,
  Backdrop,
} from '@mui/material';
import {
  ArrowForward as ArrowForwardIcon,
  HeadsetMic as HeadsetIcon,
  Close as CloseIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { apiService, AccountByIban } from '../services/api';

const ChangeCounterAccount: React.FC = () => {
  const navigate = useNavigate();
  const [popupOpen, setPopupOpen] = React.useState(false);
  const [confirmPopupOpen, setConfirmPopupOpen] = React.useState(false);
  const [finalConfirmPopupOpen, setFinalConfirmPopupOpen] = React.useState(false);
  const [ibanNumber, setIbanNumber] = React.useState('AAAAA');
  const [confirmChecked, setConfirmChecked] = React.useState(true);
  const [accountDetails, setAccountDetails] = React.useState<AccountByIban | null>(null);
  const [loading, setLoading] = React.useState(false);

  const handleChangeCounterAccount = () => {
    setPopupOpen(true);
  };

  const handleClosePopup = () => {
    setPopupOpen(false);
  };

  const handleConfirm = async () => {
    console.log('Counter account change confirmed:', ibanNumber);
    setLoading(true);
    
    try {
      const accountData = await apiService.getAccountByIban(ibanNumber);
      setAccountDetails(accountData);
      setPopupOpen(false);
      setConfirmPopupOpen(true);
    } catch (error) {
      console.error('Failed to fetch account details:', error);
      // Still show the popup but with default data
      setPopupOpen(false);
      setConfirmPopupOpen(true);
    } finally {
      setLoading(false);
    }
  };

  const handleCloseConfirmPopup = () => {
    setConfirmPopupOpen(false);
  };

  const handleEditProfile = () => {
    console.log('Confirm change clicked');
    setConfirmPopupOpen(false);
    setFinalConfirmPopupOpen(true);
  };

  const handleCloseFinalConfirmPopup = () => {
    setFinalConfirmPopupOpen(false);
  };

  const handleFinalConfirm = () => {
    console.log('Counter account change finalized');
    setFinalConfirmPopupOpen(false);
    // TODO: Implement actual counter account change logic
  };

  const handleLogout = () => {
    console.log('Logout clicked');
    // TODO: Implement logout logic
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        backgroundColor: '#F5F5F5',
        padding: '24px 108px',
        position: 'relative',
      }}
    >
      {/* Breadcrumbs */}
      <Box sx={{ mb: 3 }}>
        <Breadcrumbs aria-label="breadcrumb">
          <Link
            underline="hover"
            color="inherit"
            href="/private"
            sx={{ color: '#333', cursor: 'pointer' }}
          >
            Home
          </Link>
          <Link
            underline="hover"
            color="inherit"
            href="/settings"
            sx={{ color: '#333', cursor: 'pointer' }}
          >
            Settings
          </Link>
          <Typography color="text.primary" sx={{ color: '#333' }}>
            Change counter account
          </Typography>
        </Breadcrumbs>
      </Box>

      {/* Main Content Card */}
      <Card
        sx={{
          backgroundColor: 'white',
          borderRadius: '8px',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
          padding: '32px',
          maxWidth: '600px',
          margin: '0 auto',
        }}
      >
        {/* First Counter Account Section */}
        <Box sx={{ mb: 4 }}>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 700,
              color: '#000',
              mb: 2,
              fontSize: '18px',
            }}
          >
            Counter account
          </Typography>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              padding: '12px 16px',
              border: '1px solid #E0E0E0',
              borderRadius: '4px',
              backgroundColor: '#FAFAFA',
              position: 'relative',
            }}
          >
            {/* L-shaped icon */}
            <Box
              sx={{
                width: '16px',
                height: '16px',
                borderLeft: '2px solid #BDBDBD',
                borderBottom: '2px solid #BDBDBD',
                marginRight: '12px',
                flexShrink: 0,
              }}
            />
            <Box>
              <Typography
                variant="body2"
                sx={{
                  color: '#000',
                  fontSize: '14px',
                  mb: 0.5,
                }}
              >
                Holder Name
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  color: '#000',
                  fontSize: '16px',
                  fontWeight: 500,
                }}
              >
                NL28DHBN026326642
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* Second Counter Account Section */}
        <Box sx={{ mb: 4 }}>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 700,
              color: '#000',
              mb: 2,
              fontSize: '18px',
            }}
          >
            Counter account
          </Typography>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              padding: '12px 16px',
              border: '1px solid #E0E0E0',
              borderRadius: '4px',
              backgroundColor: '#FAFAFA',
              position: 'relative',
            }}
          >
            {/* L-shaped icon */}
            <Box
              sx={{
                width: '16px',
                height: '16px',
                borderLeft: '2px solid #BDBDBD',
                borderBottom: '2px solid #BDBDBD',
                marginRight: '12px',
                flexShrink: 0,
              }}
            />
            <Box>
              <Typography
                variant="body2"
                sx={{
                  color: '#000',
                  fontSize: '14px',
                  mb: 0.5,
                }}
              >
                Beneficiary Name
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  color: '#000',
                  fontSize: '16px',
                  fontWeight: 500,
                }}
              >
                NL28DHBN026326642
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* Change Counter Account Button */}
        <Button
          variant="contained"
          onClick={handleChangeCounterAccount}
          sx={{
            backgroundColor: '#FC9F15',
            color: 'white',
            width: '100%',
            py: 2,
            borderRadius: '4px',
            textTransform: 'none',
            fontSize: '16px',
            fontWeight: 500,
            '&:hover': {
              backgroundColor: '#E68A0D',
            },
          }}
          endIcon={<ArrowForwardIcon />}
        >
          Change counter account
        </Button>
      </Card>

      {/* Support Fab */}
      <Fab
        color="primary"
        aria-label="support"
        sx={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          backgroundColor: '#4CAF50',
          '&:hover': {
            backgroundColor: '#45A049',
          },
        }}
      >
        <HeadsetIcon />
      </Fab>

      {/* Change Counter Account Popup */}
      <Modal
        open={popupOpen}
        onClose={handleClosePopup}
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
            justifyContent: 'flex-start',
            backdropFilter: 'blur(4px)',
            padding: '24px',
          }}
        >
            {/* Header */}
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                mb: 3,
              }}
            >
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 700,
                  color: '#333',
                  fontSize: '18px',
                }}
              >
                Change counter account
              </Typography>
              <IconButton
                onClick={handleClosePopup}
                sx={{
                  color: '#666',
                  '&:hover': {
                    backgroundColor: 'rgba(0, 0, 0, 0.04)',
                  },
                }}
              >
                <CloseIcon />
              </IconButton>
            </Box>

            {/* IBAN Input Section */}
            <Card
              sx={{
                backgroundColor: 'white',
                borderRadius: '8px',
                padding: '16px',
                mb: 3,
                border: '1px solid #E0E0E0',
              }}
            >
              <Typography
                variant="body2"
                sx={{
                  color: '#666',
                  mb: 2,
                  fontSize: '14px',
                }}
              >
                Enter the IBAN number
              </Typography>
              <TextField
                fullWidth
                value={ibanNumber}
                onChange={(e) => setIbanNumber(e.target.value)}
                variant="outlined"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: '#1976d2',
                    },
                    '&:hover fieldset': {
                      borderColor: '#1976d2',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#1976d2',
                    },
                  },
                }}
              />
            </Card>

            {/* Confirmation Checkbox Section */}
            <Card
              sx={{
                backgroundColor: 'white',
                borderRadius: '8px',
                padding: '16px',
                mb: 3,
                border: '1px solid #E0E0E0',
              }}
            >
              <FormControlLabel
                control={
                  <Checkbox
                    checked={confirmChecked}
                    onChange={(e) => setConfirmChecked(e.target.checked)}
                    sx={{
                      color: '#4CAF50',
                      '&.Mui-checked': {
                        color: '#4CAF50',
                      },
                    }}
                  />
                }
                label={
                  <Typography
                    variant="body2"
                    sx={{
                      color: '#333',
                      fontSize: '14px',
                    }}
                  >
                    I confirm that this account is in the name of {accountDetails?.holder_name || 'Holder name'}
                  </Typography>
                }
              />
            </Card>

            {/* Confirm Button */}
            <Button
              variant="contained"
              onClick={handleConfirm}
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
              endIcon={<ArrowForwardIcon />}
            >
              Confirm
            </Button>
        </Box>
      </Modal>

      {/* Account Details Confirmation Popup */}
      <Modal
        open={confirmPopupOpen}
        onClose={handleCloseConfirmPopup}
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
            backgroundColor: '#F5F5F5',
            overflow: 'auto',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-start',
            backdropFilter: 'blur(4px)',
            padding: '24px',
            position: 'relative',
          }}
        >
          {/* Close Button */}
          <IconButton
            onClick={handleCloseConfirmPopup}
            sx={{
              position: 'absolute',
              top: '24px',
              right: '24px',
              color: '#666',
              zIndex: 1,
              '&:hover': {
                backgroundColor: 'rgba(0, 0, 0, 0.04)',
              },
            }}
          >
            <CloseIcon />
          </IconButton>

          {/* Account Title */}
          <Typography
            variant="h6"
            sx={{
              fontWeight: 700,
              color: '#333',
              fontSize: '18px',
              mb: 2,
              mt: '15vh',
            }}
          >
            Account
          </Typography>

          {/* Account Details Card */}
          <Card
            sx={{
              backgroundColor: 'white',
              borderRadius: '8px',
              padding: '24px',
              mb: 3,
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
            }}
          >

            {/* Account Details */}
            <Box sx={{ mb: 2 }}>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  mb: 2,
                }}
              >
                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: 700,
                    color: '#333',
                    fontSize: '14px',
                  }}
                >
                  {accountDetails?.holder_name || 'Holder Name'}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: '#333',
                    fontSize: '14px',
                  }}
                >
                  {accountDetails?.email || 'example@dhbbank.com'}
                </Typography>
              </Box>
            </Box>

            <Box sx={{ borderBottom: '1px solid #E0E0E0', mb: 2 }} />

            <Box sx={{ mb: 2 }}>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  mb: 2,
                }}
              >
                <Typography
                  variant="body2"
                  sx={{
                    color: '#333',
                    fontSize: '14px',
                  }}
                >
                  Institution Name
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: 700,
                    color: '#333',
                    fontSize: '14px',
                  }}
                >
                  {accountDetails?.institution_name || 'DHB BANK N.V.'}
                </Typography>
              </Box>
            </Box>

            <Box sx={{ mb: 2 }}>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  mb: 2,
                }}
              >
                <Typography
                  variant="body2"
                  sx={{
                    color: '#333',
                    fontSize: '14px',
                  }}
                >
                  BIC
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: 700,
                    color: '#333',
                    fontSize: '14px',
                  }}
                >
                  {accountDetails?.bic || 'DHBNNL2R'}
                </Typography>
              </Box>
            </Box>

            <Box sx={{ mb: 2 }}>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  mb: 2,
                }}
              >
                <Typography
                  variant="body2"
                  sx={{
                    color: '#333',
                    fontSize: '14px',
                  }}
                >
                  Customer Number
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: 700,
                    color: '#333',
                    fontSize: '14px',
                  }}
                >
                  {accountDetails?.customer_number || '103098'}
                </Typography>
              </Box>
            </Box>

            <Box sx={{ mb: 2 }}>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  mb: 2,
                }}
              >
                <Typography
                  variant="body2"
                  sx={{
                    color: '#333',
                    fontSize: '14px',
                  }}
                >
                  Support REG Number
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: 700,
                    color: '#333',
                    fontSize: '14px',
                  }}
                >
                  {accountDetails?.support_reg_number || '301278947'}
                </Typography>
              </Box>
            </Box>

            <Box sx={{ mb: 2 }}>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  mb: 2,
                }}
              >
                <Typography
                  variant="body2"
                  sx={{
                    color: '#333',
                    fontSize: '14px',
                  }}
                >
                  My Support Packages
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: 700,
                    color: '#333',
                    fontSize: '14px',
                  }}
                >
                  {accountDetails?.support_packages || '301278947'}
                </Typography>
              </Box>
            </Box>
          </Card>

          {/* Action Buttons */}
          <Box sx={{ marginTop: 'auto', pt: 3 }}>
            <Button
              variant="contained"
              onClick={handleEditProfile}
              fullWidth
              sx={{
                backgroundColor: '#FC9F15',
                color: 'white',
                py: 2,
                mb: 2,
                borderRadius: '4px',
                textTransform: 'none',
                fontSize: '16px',
                fontWeight: 500,
                '&:hover': {
                  backgroundColor: '#E68A0D',
                },
              }}
              endIcon={<ArrowForwardIcon />}
            >
              Confirm change
            </Button>

            <Button
              variant="outlined"
              onClick={handleLogout}
              fullWidth
              sx={{
                borderColor: '#1976d2',
                color: '#1976d2',
                py: 2,
                borderRadius: '4px',
                textTransform: 'none',
                fontSize: '16px',
                fontWeight: 500,
                '&:hover': {
                  borderColor: '#1565c0',
                  backgroundColor: 'rgba(25, 118, 210, 0.04)',
                },
              }}
            >
              Logout
            </Button>
          </Box>
        </Box>
      </Modal>

      {/* Final Confirmation Popup */}
      <Modal
        open={finalConfirmPopupOpen}
        onClose={handleCloseFinalConfirmPopup}
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
          {/* Popup Content */}
          <Card
            sx={{
              backgroundColor: 'white',
              borderRadius: '8px',
              padding: '32px',
              textAlign: 'center',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
            }}
          >
            {/* Success Icon */}
            <Box
              sx={{
                width: '80px',
                height: '80px',
                borderRadius: '50%',
                backgroundColor: '#4CAF50',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 24px auto',
              }}
            >
              <Typography
                variant="h4"
                sx={{
                  color: 'white',
                  fontWeight: 700,
                }}
              >
                ✓
              </Typography>
            </Box>

            {/* Success Title */}
            <Typography
              variant="h5"
              sx={{
                fontWeight: 700,
                color: '#333',
                mb: 2,
                fontSize: '24px',
              }}
            >
              Success!
            </Typography>

            {/* Success Message */}
            <Typography
              variant="body1"
              sx={{
                color: '#666',
                mb: 4,
                fontSize: '16px',
                lineHeight: 1.5,
              }}
            >
              Your counter account has been successfully changed to {ibanNumber}.
            </Typography>

            {/* Done Button */}
            <Button
              variant="contained"
              onClick={handleFinalConfirm}
              sx={{
                backgroundColor: '#FC9F15',
                color: 'white',
                py: 2,
                px: 4,
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

export default ChangeCounterAccount;
