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
  Grid,
  Paper,
  TextField,
} from '@mui/material';
import {
  Link,
  ArrowForward,
  HeadsetMic,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { apiService } from '../services/api-yaml-compliant';

const SOFQuestions: React.FC = () => {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = React.useState(false);
  const [loading, setLoading] = React.useState(true);
  const [saving, setSaving] = React.useState(false);

  const [questions, setQuestions] = React.useState([
    {
      question: "What is the origin of the money in your NIBC Savings Account?",
      answer: "Leftover from my income"
    },
    {
      question: "What is the source of your income?",
      answer: "Director, Major Shareholder"
    },
    {
      question: "What is your (joint) gross annual income?",
      answer: "Between €0 and €30,000"
    },
    {
      question: "What amount do you expect to save/deposit annually with NIBC?",
      answer: "Nothing or less than €1,000"
    },
    {
      question: "How often do you expect to deposit money into your Savings Account?",
      answer: "Never or on average once a month"
    },
    {
      question: "Do you expect to make one or more occasional (larger) deposits with us?",
      answer: "Yes"
    },
    {
      question: "What is the amount if these are the amounts you plan to deposit?",
      answer: "Less than €10,000"
    }
  ]);

  // Load SOF questions data from API
  React.useEffect(() => {
    const loadSOFQuestions = async () => {
      try {
        setLoading(true);
        const data = await apiService.getSOFQuestions();
        if (data && data.length > 0) {
          setQuestions(data);
        }
      } catch (error) {
        console.error('Failed to load SOF questions:', error);
        // Keep default data if API fails
      } finally {
        setLoading(false);
      }
    };

    loadSOFQuestions();
  }, []);

  const handleEditDetails = () => {
    setIsEditing(true);
  };

  const handleConfirmProfile = async () => {
    setSaving(true);
    try {
      const updatedQuestions = await apiService.updateSOFQuestions(questions);
      console.log('SOF questions saved successfully:', updatedQuestions);
      setIsEditing(false);
      navigate('/settings');
    } catch (error) {
      console.error('Failed to save SOF questions:', error);
      // Show error to user (you could add a toast notification here)
    } finally {
      setSaving(false);
    }
  };

  const handleAnswerChange = (index: number, newAnswer: string) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index].answer = newAnswer;
    setQuestions(updatedQuestions);
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
        <Typography sx={{ color: '#333' }}>
          SOF questions
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
          maxWidth: '1000px',
          backgroundColor: 'white',
          borderRadius: '8px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          minHeight: 'calc(100vh - 200px)'
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
              SOF questions
            </Typography>

            {/* Loading State */}
            {loading && (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <Typography variant="body1" sx={{ color: '#666' }}>
                  Loading SOF questions...
                </Typography>
              </Box>
            )}

            {/* Questions and Answers Grid - Properly Aligned */}
            {!loading && (
              <Grid container spacing={4} sx={{ mb: 4 }}>
                {/* Row 1 */}
                <Grid item xs={12} md={6}>
                  <Box sx={{ mb: 3 }}>
                    <Typography
                      variant="body2"
                      sx={{
                        color: '#004996',
                        fontSize: '14px',
                        mb: 1,
                        fontWeight: 600,
                      }}
                    >
                      {questions[0].question}
                    </Typography>
                    {isEditing ? (
                      <TextField
                        fullWidth
                        value={questions[0].answer}
                        onChange={(e) => handleAnswerChange(0, e.target.value)}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            backgroundColor: 'white',
                            '& fieldset': {
                              borderColor: '#e0e0e0',
                            },
                            '&:hover fieldset': {
                              borderColor: '#e0e0e0',
                            },
                            '&.Mui-focused fieldset': {
                              borderColor: '#004996',
                            },
                          },
                          '& .MuiInputBase-input': {
                            color: '#333',
                            fontSize: '14px',
                            padding: '8px 12px',
                          },
                        }}
                      />
                    ) : (
                      <Paper
                        sx={{
                          backgroundColor: '#f5f5f5',
                          padding: '8px 12px',
                          borderRadius: '4px',
                          border: '1px solid #e0e0e0',
                          minHeight: '36px',
                          display: 'flex',
                          alignItems: 'center',
                        }}
                      >
                        <Typography
                          variant="body2"
                          sx={{
                            color: '#666',
                            fontSize: '14px',
                          }}
                        >
                          {questions[0].answer}
                        </Typography>
                      </Paper>
                    )}
                  </Box>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Box sx={{ mb: 3 }}>
                    <Typography
                      variant="body2"
                      sx={{
                        color: '#004996',
                        fontSize: '14px',
                        mb: 1,
                        fontWeight: 600,
                      }}
                    >
                      {questions[1].question}
                    </Typography>
                    {isEditing ? (
                      <TextField
                        fullWidth
                        value={questions[1].answer}
                        onChange={(e) => handleAnswerChange(1, e.target.value)}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            backgroundColor: 'white',
                            '& fieldset': {
                              borderColor: '#e0e0e0',
                            },
                            '&:hover fieldset': {
                              borderColor: '#e0e0e0',
                            },
                            '&.Mui-focused fieldset': {
                              borderColor: '#004996',
                            },
                          },
                          '& .MuiInputBase-input': {
                            color: '#333',
                            fontSize: '14px',
                            padding: '8px 12px',
                          },
                        }}
                      />
                    ) : (
                      <Paper
                        sx={{
                          backgroundColor: '#f5f5f5',
                          padding: '8px 12px',
                          borderRadius: '4px',
                          border: '1px solid #e0e0e0',
                          minHeight: '36px',
                          display: 'flex',
                          alignItems: 'center',
                        }}
                      >
                        <Typography
                          variant="body2"
                          sx={{
                            color: '#666',
                            fontSize: '14px',
                          }}
                        >
                          {questions[1].answer}
                        </Typography>
                      </Paper>
                    )}
                  </Box>
                </Grid>

                {/* Row 2 */}
                <Grid item xs={12} md={6}>
                  <Box sx={{ mb: 3 }}>
                    <Typography
                      variant="body2"
                      sx={{
                        color: '#004996',
                        fontSize: '14px',
                        mb: 1,
                        fontWeight: 600,
                      }}
                    >
                      {questions[2].question}
                    </Typography>
                    {isEditing ? (
                      <TextField
                        fullWidth
                        value={questions[2].answer}
                        onChange={(e) => handleAnswerChange(2, e.target.value)}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            backgroundColor: 'white',
                            '& fieldset': {
                              borderColor: '#e0e0e0',
                            },
                            '&:hover fieldset': {
                              borderColor: '#e0e0e0',
                            },
                            '&.Mui-focused fieldset': {
                              borderColor: '#004996',
                            },
                          },
                          '& .MuiInputBase-input': {
                            color: '#333',
                            fontSize: '14px',
                            padding: '8px 12px',
                          },
                        }}
                      />
                    ) : (
                      <Paper
                        sx={{
                          backgroundColor: '#f5f5f5',
                          padding: '8px 12px',
                          borderRadius: '4px',
                          border: '1px solid #e0e0e0',
                          minHeight: '36px',
                          display: 'flex',
                          alignItems: 'center',
                        }}
                      >
                        <Typography
                          variant="body2"
                          sx={{
                            color: '#666',
                            fontSize: '14px',
                          }}
                        >
                          {questions[2].answer}
                        </Typography>
                      </Paper>
                    )}
                  </Box>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Box sx={{ mb: 3 }}>
                    <Typography
                      variant="body2"
                      sx={{
                        color: '#004996',
                        fontSize: '14px',
                        mb: 1,
                        fontWeight: 600,
                      }}
                    >
                      {questions[3].question}
                    </Typography>
                    {isEditing ? (
                      <TextField
                        fullWidth
                        value={questions[3].answer}
                        onChange={(e) => handleAnswerChange(3, e.target.value)}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            backgroundColor: 'white',
                            '& fieldset': {
                              borderColor: '#e0e0e0',
                            },
                            '&:hover fieldset': {
                              borderColor: '#e0e0e0',
                            },
                            '&.Mui-focused fieldset': {
                              borderColor: '#004996',
                            },
                          },
                          '& .MuiInputBase-input': {
                            color: '#333',
                            fontSize: '14px',
                            padding: '8px 12px',
                          },
                        }}
                      />
                    ) : (
                      <Paper
                        sx={{
                          backgroundColor: '#f5f5f5',
                          padding: '8px 12px',
                          borderRadius: '4px',
                          border: '1px solid #e0e0e0',
                          minHeight: '36px',
                          display: 'flex',
                          alignItems: 'center',
                        }}
                      >
                        <Typography
                          variant="body2"
                          sx={{
                            color: '#666',
                            fontSize: '14px',
                          }}
                        >
                          {questions[3].answer}
                        </Typography>
                      </Paper>
                    )}
                  </Box>
                </Grid>

                {/* Row 3 */}
                <Grid item xs={12} md={6}>
                  <Box sx={{ mb: 3 }}>
                    <Typography
                      variant="body2"
                      sx={{
                        color: '#004996',
                        fontSize: '14px',
                        mb: 1,
                        fontWeight: 600,
                      }}
                    >
                      {questions[4].question}
                    </Typography>
                    {isEditing ? (
                      <TextField
                        fullWidth
                        value={questions[4].answer}
                        onChange={(e) => handleAnswerChange(4, e.target.value)}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            backgroundColor: 'white',
                            '& fieldset': {
                              borderColor: '#e0e0e0',
                            },
                            '&:hover fieldset': {
                              borderColor: '#e0e0e0',
                            },
                            '&.Mui-focused fieldset': {
                              borderColor: '#004996',
                            },
                          },
                          '& .MuiInputBase-input': {
                            color: '#333',
                            fontSize: '14px',
                            padding: '8px 12px',
                          },
                        }}
                      />
                    ) : (
                      <Paper
                        sx={{
                          backgroundColor: '#f5f5f5',
                          padding: '8px 12px',
                          borderRadius: '4px',
                          border: '1px solid #e0e0e0',
                          minHeight: '36px',
                          display: 'flex',
                          alignItems: 'center',
                        }}
                      >
                        <Typography
                          variant="body2"
                          sx={{
                            color: '#666',
                            fontSize: '14px',
                          }}
                        >
                          {questions[4].answer}
                        </Typography>
                      </Paper>
                    )}
                  </Box>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Box sx={{ mb: 3 }}>
                    <Typography
                      variant="body2"
                      sx={{
                        color: '#004996',
                        fontSize: '14px',
                        mb: 1,
                        fontWeight: 600,
                      }}
                    >
                      {questions[5].question}
                    </Typography>
                    {isEditing ? (
                      <TextField
                        fullWidth
                        value={questions[5].answer}
                        onChange={(e) => handleAnswerChange(5, e.target.value)}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            backgroundColor: 'white',
                            '& fieldset': {
                              borderColor: '#e0e0e0',
                            },
                            '&:hover fieldset': {
                              borderColor: '#e0e0e0',
                            },
                            '&.Mui-focused fieldset': {
                              borderColor: '#004996',
                            },
                          },
                          '& .MuiInputBase-input': {
                            color: '#333',
                            fontSize: '14px',
                            padding: '8px 12px',
                          },
                        }}
                      />
                    ) : (
                      <Paper
                        sx={{
                          backgroundColor: '#f5f5f5',
                          padding: '8px 12px',
                          borderRadius: '4px',
                          border: '1px solid #e0e0e0',
                          minHeight: '36px',
                          display: 'flex',
                          alignItems: 'center',
                        }}
                      >
                        <Typography
                          variant="body2"
                          sx={{
                            color: '#666',
                            fontSize: '14px',
                          }}
                        >
                          {questions[5].answer}
                        </Typography>
                      </Paper>
                    )}
                  </Box>
                </Grid>

                {/* Row 4 - Only left column */}
                <Grid item xs={12} md={6}>
                  <Box sx={{ mb: 3 }}>
                    <Typography
                      variant="body2"
                      sx={{
                        color: '#004996',
                        fontSize: '14px',
                        mb: 1,
                        fontWeight: 600,
                      }}
                    >
                      {questions[6].question}
                    </Typography>
                    {isEditing ? (
                      <TextField
                        fullWidth
                        value={questions[6].answer}
                        onChange={(e) => handleAnswerChange(6, e.target.value)}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            backgroundColor: 'white',
                            '& fieldset': {
                              borderColor: '#e0e0e0',
                            },
                            '&:hover fieldset': {
                              borderColor: '#e0e0e0',
                            },
                            '&.Mui-focused fieldset': {
                              borderColor: '#004996',
                            },
                          },
                          '& .MuiInputBase-input': {
                            color: '#333',
                            fontSize: '14px',
                            padding: '8px 12px',
                          },
                        }}
                      />
                    ) : (
                      <Paper
                        sx={{
                          backgroundColor: '#f5f5f5',
                          padding: '8px 12px',
                          borderRadius: '4px',
                          border: '1px solid #e0e0e0',
                          minHeight: '36px',
                          display: 'flex',
                          alignItems: 'center',
                        }}
                      >
                        <Typography
                          variant="body2"
                          sx={{
                            color: '#666',
                            fontSize: '14px',
                          }}
                        >
                          {questions[6].answer}
                        </Typography>
                      </Paper>
                    )}
                  </Box>
                </Grid>
              </Grid>
            )}

            {/* Action Buttons */}
            <Box sx={{ display: 'flex', gap: 2, mt: 4 }}>
              <Button
                variant="outlined"
                onClick={handleEditDetails}
                disabled={isEditing || saving}
                sx={{
                  borderColor: '#004996',
                  color: '#004996',
                  textTransform: 'none',
                  fontSize: '14px',
                  fontWeight: 500,
                  px: 3,
                  py: 1.5,
                  minWidth: '200px',
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
                {isEditing ? 'Editing...' : 'Edit details'}
              </Button>
              <Button
                variant="contained"
                onClick={handleConfirmProfile}
                disabled={!isEditing || saving}
                sx={{
                  backgroundColor: isEditing && !saving ? '#FC9F15' : '#ccc',
                  color: 'white',
                  textTransform: 'none',
                  fontSize: '14px',
                  fontWeight: 500,
                  px: 3,
                  py: 1.5,
                  minWidth: '200px',
                  '&:hover': {
                    backgroundColor: isEditing && !saving ? '#E68A0D' : '#ccc',
                  },
                  '&:disabled': {
                    backgroundColor: '#ccc',
                    cursor: 'not-allowed',
                  },
                }}
                endIcon={!saving ? <ArrowForward /> : null}
              >
                {saving ? 'Saving...' : 'Confirm savings profile →'}
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
    </Box>
  );
};

export default SOFQuestions;
