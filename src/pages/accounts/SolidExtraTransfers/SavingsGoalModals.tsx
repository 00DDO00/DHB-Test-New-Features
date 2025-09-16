import React from 'react';
import {
  Box,
  Modal,
  Typography,
  IconButton,
  Button,
  TextField,
  Card
} from '@mui/material';
import {
  Close as CloseIcon,
  ArrowForward as ArrowForwardIcon,
  CheckCircle as CheckCircleIcon
} from '@mui/icons-material';

interface SavingsGoalModalsProps {
  // Modal states
  savingsGoalModalOpen: boolean;
  savingsTargetModalOpen: boolean;
  congratulationsModalOpen: boolean;
  
  // Form data
  selectedGoal: string;
  savingsTargetName: string;
  amountWhole: string;
  amountDecimal: string;
  amountError: string;
  
  // Event handlers
  onCloseSavingsGoal: () => void;
  onCloseSavingsTarget: () => void;
  onCloseCongratulations: () => void;
  onSavingsGoalClick: (goal: string) => void;
  onCustomGoalClick: () => void;
  onConfirmSavingsTarget: () => void;
  
  // Setters
  setSavingsTargetName: (value: string) => void;
  setAmountWhole: (value: string) => void;
  setAmountDecimal: (value: string) => void;
  setAmountError: (value: string) => void;
  
  // Data
  savingsGoalOptions: string[];
}

const SavingsGoalModals: React.FC<SavingsGoalModalsProps> = ({
  savingsGoalModalOpen,
  savingsTargetModalOpen,
  congratulationsModalOpen,
  
  selectedGoal,
  savingsTargetName,
  amountWhole,
  amountDecimal,
  amountError,
  
  onCloseSavingsGoal,
  onCloseSavingsTarget,
  onCloseCongratulations,
  onSavingsGoalClick,
  onCustomGoalClick,
  onConfirmSavingsTarget,
  
  setSavingsTargetName,
  setAmountWhole,
  setAmountDecimal,
  setAmountError,
  
  savingsGoalOptions
}) => {
  return (
    <>
      {/* Savings Goal Modal */}
      <Modal
        open={savingsGoalModalOpen}
        onClose={onCloseSavingsGoal}
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
            width: '35%',
            height: '100vh',
            bgcolor: '#F3F3F3',
            borderRadius: '8px 0 0 8px',
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
            p: 3
          }}>
            <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#333' }}>
              Savings Goal Setting
            </Typography>
            <IconButton onClick={onCloseSavingsGoal}>
              <CloseIcon />
            </IconButton>
          </Box>

          {/* Modal Content - White Container */}
          <Box sx={{ p: 8, flex: 1 }}>
            <Card sx={{
              backgroundColor: 'white',
              borderRadius: 2,
              p: 3,
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
            }}>
              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 3 }}>
                What are you saving for?
              </Typography>

              {/* Savings Goal Options Grid */}
              <Box sx={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(3, 1fr)', 
                gap: 2, 
                mb: 4 
              }}>
                {savingsGoalOptions.map((goal, index) => (
                  <Button
                    key={index}
                    variant="outlined"
                    onClick={() => onSavingsGoalClick(goal)}
                    sx={{
                      py: 2,
                      px: 2,
                      borderColor: '#E0E0E0',
                      color: '#333',
                      backgroundColor: '#F5F5F5',
                      textTransform: 'none',
                      fontWeight: 'normal',
                      '&:hover': {
                        backgroundColor: '#E8E8E8',
                        borderColor: '#BDBDBD'
                      }
                    }}
                  >
                    {goal}
                  </Button>
                ))}
              </Box>

              {/* Custom Goal Button */}
              <Button
                variant="outlined"
                fullWidth
                onClick={onCustomGoalClick}
                sx={{
                  py: 2,
                  borderColor: '#2196F3',
                  color: '#2196F3',
                  backgroundColor: '#E3F2FD',
                  textTransform: 'none',
                  fontWeight: 'normal',
                  '&:hover': {
                    backgroundColor: '#BBDEFB',
                    borderColor: '#1976D2'
                  }
                }}
              >
                Or define your own goal
              </Button>
            </Card>
          </Box>
        </Box>
      </Modal>

      {/* Savings Target Modal */}
      <Modal
        open={savingsTargetModalOpen}
        onClose={onCloseSavingsTarget}
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
            width: '35%',
            height: '100vh',
            bgcolor: '#F3F3F3',
            borderRadius: '8px 0 0 8px',
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
            p: 3
          }}>
            <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#333' }}>
              Savings Goal Setting
            </Typography>
            <IconButton onClick={onCloseSavingsTarget}>
              <CloseIcon />
            </IconButton>
          </Box>

          {/* Modal Content - White Container */}
          <Box sx={{ p: 8, flex: 1 }}>
            <Card sx={{
              backgroundColor: 'white',
              borderRadius: 2,
              p: 3,
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
            }}>
              {/* What are you saving for? Section */}
              <Box sx={{ mb: 4 }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
                  What are you saving for?
                </Typography>
                <TextField
                  fullWidth
                  label="Savings target name"
                  value={savingsTargetName}
                  onChange={(e) => setSavingsTargetName(e.target.value)}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': {
                        borderColor: '#2196F3',
                      },
                      '&:hover fieldset': {
                        borderColor: '#1976D2',
                      },
                    },
                    '& .MuiInputLabel-root': {
                      color: '#2196F3',
                    },
                  }}
                />
              </Box>

              {/* Amount Section */}
              <Box sx={{ mb: 4 }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
                  Amount
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <TextField
                    sx={{
                      flex: 1,
                      '& .MuiOutlinedInput-root': {
                        '& fieldset': {
                          borderColor: amountError ? '#d32f2f' : '#2196F3',
                        },
                        '&:hover fieldset': {
                          borderColor: amountError ? '#d32f2f' : '#1976D2',
                        },
                      },
                      '& .MuiInputBase-input::placeholder': {
                        color: '#999 !important',
                        opacity: '1 !important',
                      },
                    }}
                    value={amountWhole}
                    onChange={(e) => {
                      const value = e.target.value.replace(/[^0-9]/g, ''); // Only allow numbers
                      setAmountWhole(value);
                      if (amountError) setAmountError(''); // Clear error when user starts typing
                    }}
                    placeholder="000"
                    error={!!amountError}
                  />
                  <TextField
                    sx={{
                      width: '80px',
                      '& .MuiOutlinedInput-root': {
                        '& fieldset': {
                          borderColor: '#2196F3',
                        },
                        '&:hover fieldset': {
                          borderColor: '#1976D2',
                        },
                      },
                      '& .MuiInputBase-input::placeholder': {
                        color: '#999 !important',
                        opacity: '1 !important',
                      },
                    }}
                    value={amountDecimal}
                    onChange={(e) => {
                      const value = e.target.value.replace(/[^0-9]/g, ''); // Only allow numbers
                      setAmountDecimal(value);
                    }}
                    placeholder="00"
                    error={!!amountError}
                  />
                  <Typography variant="h6" sx={{ color: '#2196F3', fontWeight: 'bold' }}>
                    €
                  </Typography>
                </Box>
                {amountError && (
                  <Typography variant="caption" sx={{ color: '#d32f2f', mt: 1, display: 'block' }}>
                    {amountError}
                  </Typography>
                )}
                
              </Box>
            </Card>
          </Box>

          {/* Confirm Button */}
          <Box sx={{ p: 3, borderTop: '1px solid #E0E0E0' }}>
            <Button
              variant="contained"
              fullWidth
              onClick={onConfirmSavingsTarget}
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
              Confirm
              <ArrowForwardIcon sx={{ ml: 1 }} />
            </Button>
          </Box>
        </Box>
      </Modal>

      {/* Congratulations Modal */}
      <Modal
        open={congratulationsModalOpen}
        onClose={onCloseCongratulations}
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
            width: '35%',
            height: '100vh',
            bgcolor: '#F3F3F3',
            borderRadius: '8px 0 0 8px',
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
            p: 3
          }}>
            <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#333' }}>
              Savings Goal Setting
            </Typography>
            <IconButton onClick={onCloseCongratulations}>
              <CloseIcon />
            </IconButton>
          </Box>

          {/* Modal Content - White Container */}
          <Box sx={{ p: 8, flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Card sx={{
              backgroundColor: 'white',
              borderRadius: 2,
              p: 4,
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
              width: '100%'
            }}>
              {/* Checkmark Icon */}
              <Box
                sx={{
                  width: 80,
                  height: 80,
                  borderRadius: '50%',
                  backgroundColor: '#4CAF50',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mb: 3
                }}
              >
                <CheckCircleIcon 
                  sx={{ 
                    fontSize: 50, 
                    color: 'white' 
                  }} 
                />
              </Box>

              {/* Congratulations Heading */}
              <Typography 
                variant="h4" 
                sx={{ 
                  fontWeight: 'bold', 
                  color: '#4CAF50', 
                  mb: 2 
                }}
              >
                Congratulations!
              </Typography>

              {/* Success Message */}
              <Typography 
                variant="body1" 
                sx={{ 
                  color: '#333', 
                  mb: 4,
                  lineHeight: 1.5
                }}
              >
                You have successfully opened Savings Goal
              </Typography>

              {/* Done Button */}
              <Button
                variant="contained"
                fullWidth
                onClick={onCloseCongratulations}
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
                Done
              </Button>
            </Card>
          </Box>
        </Box>
      </Modal>
    </>
  );
};

export default SavingsGoalModals;
