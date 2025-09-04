import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { apiService, PersonalDetails as PersonalDetailsType } from '../../services/api';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Breadcrumbs,
  Link as MuiLink,
  TextField,
  Button,
  Fab,
  Modal,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  IconButton,
  Alert,
} from '@mui/material';
import {
  Link as LinkIcon,
  ArrowForward,
  HeadsetMic,
  ArrowBack,
  KeyboardArrowDown,
  CloudUpload,
  Warning,
  Home as HomeIcon,
} from '@mui/icons-material';

const PersonalDetails: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = React.useState<PersonalDetailsType>({
    updateId: 'PASSPORT',
    mobilePhone: '+31 123 456 789',
    password: '**********',
    email: 'example@dhbbank.com',
    telephone: '+31 987 654 321',
    address: 'GRONINGEN, STR. VONDELLAAN 172',
  });
  const [loading, setLoading] = React.useState(true);

  const [editing, setEditing] = React.useState<string | null>(null);

  // Load personal details from YAML API endpoints
  React.useEffect(() => {
    const loadPersonalDetails = async () => {
      try {
        // Use YAML endpoints to get customer data
        const [phoneData, emailData, addressData, identificationData] = await Promise.all([
          apiService.getCustomerPhone(),
          apiService.getCustomerEmail(),
          apiService.getCustomerAddress(),
          apiService.getCustomerIdentification()
        ]);

        // Transform YAML data to match PersonalDetails interface
        const transformedData: PersonalDetailsType = {
          updateId: `${identificationData.identityType} - ${identificationData.identitySerialNo}`,
          mobilePhone: phoneData[0]?.phoneNumber || '+31 123 456 789',
          password: '**********', // Password not available in YAML endpoints
          email: emailData[0]?.address || 'example@dhbbank.com',
          telephone: phoneData[0]?.phoneNumber || '+31 987 654 321',
          address: addressData[0]?.fullAddressInfo || 'GRONINGEN, STR. VONDELLAAN 172',
        };

        setFormData(transformedData);
      } catch (error) {
        console.error('Failed to load personal details:', error);
        // Fallback to legacy endpoint if YAML endpoints fail
        try {
          const data = await apiService.getPersonalDetails();
          setFormData(data);
        } catch (fallbackError) {
          console.error('Fallback also failed:', fallbackError);
        }
      } finally {
        setLoading(false);
      }
    };

    loadPersonalDetails();
  }, []);
  const [updateIdPopupOpen, setUpdateIdPopupOpen] = React.useState(false);
  const [updateIdData, setUpdateIdData] = React.useState({
    idType: 'PASSPORT',
    idDocumentNo: 'UZLQMADJU',
    idPlace: 'EMMA VERMALEN',
    idExpiryDay: '15',
    idExpiryMonth: '12',
    idExpiryYear: '2025',
    idIssuingCountry: 'Netherlands',
    selectedFile: 'Netherlands',
    explanation: '',
  });

  const handleEdit = (field: string) => {
    if (field === 'updateId') {
      // Initialize popup data with current form data if it exists
      const currentIdParts = formData.updateId.split(' - ');
      if (currentIdParts.length === 2) {
        setUpdateIdData(prev => ({
          ...prev,
          idType: currentIdParts[0],
          idDocumentNo: currentIdParts[1]
        }));
      }
      setUpdateIdPopupOpen(true);
    } else if (field === 'password') {
      navigate('/settings/change-password');
    } else {
      setEditing(field);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async (field: string) => {
    try {
      await apiService.updatePersonalDetails({ [field]: formData[field as keyof PersonalDetailsType] });
      setEditing(null);
      console.log(`Saved ${field}:`, formData[field as keyof PersonalDetailsType]);
    } catch (error) {
      console.error(`Failed to save ${field}:`, error);
    }
  };

  const handleChangeAll = () => {
    console.log('Change all clicked');
    // TODO: Implement change all functionality
  };

  const handleConfirm = async () => {
    try {
      await apiService.updatePersonalDetails(formData);
      console.log('Personal details confirmed:', formData);
      navigate('/settings');
    } catch (error) {
      console.error('Failed to save personal details:', error);
    }
  };

  const handleCloseUpdateIdPopup = () => {
    setUpdateIdPopupOpen(false);
  };

  const handleUpdateIdConfirm = () => {
    console.log('Update ID confirmed:', updateIdData);
    
    // Update the form data with the new ID information
    setFormData(prev => ({
      ...prev,
      updateId: `${updateIdData.idType} - ${updateIdData.idDocumentNo}`
    }));
    
    setUpdateIdPopupOpen(false);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setUpdateIdData(prev => ({
        ...prev,
        selectedFile: file.name
      }));
    }
  };

  const renderField = (field: string, label: string, value: string, type: string = 'text') => {
    const isEditing = editing === field;
    
    return (
      <Box sx={{ mb: 3 }}>
        <Typography
          variant="body2"
          sx={{
            color: '#004996',
            fontSize: '14px',
            mb: 1,
            fontWeight: 500,
          }}
        >
          {label}
        </Typography>
        <Box sx={{ position: 'relative' }}>
          <TextField
            fullWidth
            value={value}
            onChange={(e) => handleChange(field, e.target.value)}
            disabled={!isEditing}
            type={type}
            variant="outlined"
            size="small"
                          sx={{
                '& .MuiOutlinedInput-root': {
                  backgroundColor: 'white',
                  '& fieldset': {
                    borderColor: '#004996 !important',
                  },
                  '&:hover fieldset': {
                    borderColor: '#004996 !important',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#004996 !important',
                  },
                },
                '& .MuiInputBase-input': {
                  color: '#004996',
                  fontSize: '14px',
                  paddingRight: isEditing ? '16px' : '80px',
                  '&::placeholder': {
                    color: '#004996',
                    opacity: 1,
                  },
                },
              }}
          />
          {!isEditing && (
            <Typography
              variant="body2"
              onClick={() => handleEdit(field)}
              sx={{
                position: 'absolute',
                right: '16px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: '#004996',
                fontSize: '12px',
                fontWeight: 500,
                cursor: 'pointer',
                userSelect: 'none',
                '&:hover': {
                  color: '#003366',
                  textDecoration: 'underline',
                },
              }}
            >
              Edit
            </Typography>
          )}
          {isEditing && (
            <Typography
              variant="body2"
              onClick={() => handleSave(field)}
              sx={{
                position: 'absolute',
                right: '16px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: '#004996',
                fontSize: '12px',
                fontWeight: 500,
                cursor: 'pointer',
                userSelect: 'none',
                '&:hover': {
                  color: '#003366',
                  textDecoration: 'underline',
                },
              }}
            >
              Save
            </Typography>
          )}
        </Box>
      </Box>
    );
  };

  return (
    <Box sx={{ p: 3, backgroundColor: '#F5F5F5', minHeight: '100vh' }}>
      {/* Page heading */}
      <Typography
        component="h1"
        variant="h4"
        sx={{
          position: 'absolute',
          left: '-10000px',
          width: '1px',
          height: '1px',
          overflow: 'hidden'
        }}
      >
        Personal Details
      </Typography>
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
          Personal Details
        </Typography>
      </Breadcrumbs>

      {/* Main Content Card */}
      <Card
        sx={{
          backgroundColor: 'white',
          borderRadius: '8px',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
          maxWidth: '800px',
          margin: '0 auto',
        }}
      >
        <CardContent sx={{ p: 4 }}>
          {/* Personal Information Section */}
          <Typography
            component="h2"
            variant="h5"
            sx={{
              fontWeight: 700,
              color: '#333',
              mb: 2,
              fontSize: '24px',
            }}
          >
            Personal Information
          </Typography>

          {/* Description */}
          <Typography
            variant="body1"
            sx={{
              color: '#666',
              mb: 4,
              fontSize: '16px',
              lineHeight: 1.5,
            }}
          >
            The setting allows you to select or change the default account for incoming funds.
          </Typography>

          {/* Form Fields */}
          <Grid container spacing={4}>
            {/* Left Column */}
            <Grid item xs={12} md={6}>
              {renderField('updateId', 'Update ID', formData.updateId)}
              {renderField('mobilePhone', 'Change mobile phone number', formData.mobilePhone)}
              {renderField('password', 'Change password', formData.password, 'password')}
            </Grid>

            {/* Right Column */}
            <Grid item xs={12} md={6}>
              {renderField('email', 'Change E-mail', formData.email, 'email')}
              {renderField('telephone', 'Change telephone number', formData.telephone)}
              {renderField('address', 'Change Address', formData.address)}
            </Grid>
          </Grid>

          {/* Action Buttons */}
          <Box 
            sx={{ display: 'flex', gap: 2, mt: 4, justifyContent: 'flex-end' }}
            role="group"
            aria-label="Personal details actions"
          >
            <Button
              variant="outlined"
              onClick={handleChangeAll}
              aria-label="Change all personal details"
              sx={{
                borderColor: '#1976d2',
                color: '#1976d2',
                textTransform: 'none',
                fontSize: '16px',
                fontWeight: 500,
                px: 3,
                py: 1.5,
                '&:hover': {
                  borderColor: '#1565c0',
                  backgroundColor: 'rgba(25, 118, 210, 0.04)',
                },
              }}
            >
              Change
            </Button>
            <Button
              variant="contained"
              onClick={handleConfirm}
              endIcon={<ArrowForward aria-hidden="true" />}
              aria-label="Confirm personal details changes"
              sx={{
                backgroundColor: '#FC9F15',
                color: 'white',
                textTransform: 'none',
                fontSize: '16px',
                fontWeight: 500,
                px: 3,
                py: 1.5,
                '&:hover': {
                  backgroundColor: '#E68A0D',
                },
              }}
            >
              Confirm
            </Button>
          </Box>
        </CardContent>
      </Card>

      {/* Floating Action Button */}
      <Fab
        color="primary"
        aria-label="Contact customer support"
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
        <HeadsetMic aria-hidden="true" />
      </Fab>

      {/* Update ID Popup */}
      <Modal
        open={updateIdPopupOpen}
        onClose={handleCloseUpdateIdPopup}
        aria-labelledby="update-id-modal-title"
        aria-describedby="update-id-modal-description"
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
          {/* Back Button */}
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <IconButton
              onClick={handleCloseUpdateIdPopup}
              sx={{
                color: '#004996',
                mr: 1,
                '&:hover': {
                  backgroundColor: 'rgba(0, 73, 150, 0.04)',
                },
              }}
            >
              <ArrowBack />
            </IconButton>
            <Typography
              variant="body2"
              sx={{
                color: '#004996',
                fontSize: '14px',
                fontWeight: 500,
                cursor: 'pointer',
              }}
              onClick={handleCloseUpdateIdPopup}
            >
              Back
            </Typography>
          </Box>

                      {/* Title */}
            <Typography
              variant="h5"
              sx={{
                fontWeight: 700,
                color: '#333',
                mb: 5,
                fontSize: '20px',
              }}
            >
              Update Your ID
            </Typography>

          {/* Form Fields */}
          <Card sx={{ 
            backgroundColor: 'white', 
            borderRadius: '8px', 
            padding: '24px',
            mb: 3,
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            maxHeight: '80vh',
            overflow: 'auto'
          }}>
            <Box sx={{ mb: 3 }}>
              <Typography
                variant="body2"
                sx={{
                  color: '#004996',
                  fontSize: '14px',
                  mb: 1,
                  fontWeight: 500,
                }}
              >
                ID Type
              </Typography>
              <FormControl size="small" sx={{ width: '100%' }}>
                <Select
                  value={updateIdData.idType}
                  onChange={(e) => setUpdateIdData(prev => ({ ...prev, idType: e.target.value }))}
                  sx={{
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#004996 !important',
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#004996 !important',
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#004996 !important',
                    },
                    '& .MuiSelect-icon': {
                      color: '#004996',
                    },
                  }}
                  IconComponent={KeyboardArrowDown}
                >
                  <MenuItem value="PASSPORT">PASSPORT</MenuItem>
                  <MenuItem value="DRIVERS_LICENSE">DRIVERS LICENSE</MenuItem>
                  <MenuItem value="NATIONAL_ID">NATIONAL ID</MenuItem>
                </Select>
              </FormControl>
            </Box>

            <Box sx={{ mb: 3 }}>
              <Typography
                variant="body2"
                sx={{
                  color: '#004996',
                  fontSize: '14px',
                  mb: 1,
                  fontWeight: 500,
                }}
              >
                ID Document No
              </Typography>
              <FormControl size="small" sx={{ width: '100%' }}>
                <Select
                  value={updateIdData.idDocumentNo}
                  onChange={(e) => setUpdateIdData(prev => ({ ...prev, idDocumentNo: e.target.value }))}
                  sx={{
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#004996 !important',
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#004996 !important',
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#004996 !important',
                    },
                    '& .MuiSelect-icon': {
                      color: '#004996',
                    },
                  }}
                  IconComponent={KeyboardArrowDown}
                >
                  <MenuItem value="UZLQMADJU">UZLQMADJU</MenuItem>
                  <MenuItem value="ABC123456">ABC123456</MenuItem>
                  <MenuItem value="XYZ789012">XYZ789012</MenuItem>
                </Select>
              </FormControl>
            </Box>

            <Box sx={{ mb: 3 }}>
              <Typography
                variant="body2"
                sx={{
                  color: '#004996',
                  fontSize: '14px',
                  mb: 1,
                  fontWeight: 500,
                }}
              >
                ID Place
              </Typography>
              <FormControl size="small" sx={{ width: '100%' }}>
                <Select
                  value={updateIdData.idPlace}
                  onChange={(e) => setUpdateIdData(prev => ({ ...prev, idPlace: e.target.value }))}
                  sx={{
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#004996 !important',
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#004996 !important',
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#004996 !important',
                    },
                    '& .MuiSelect-icon': {
                      color: '#004996',
                    },
                  }}
                  IconComponent={KeyboardArrowDown}
                >
                  <MenuItem value="EMMA VERMALEN">EMMA VERMALEN</MenuItem>
                  <MenuItem value="JOHN SMITH">JOHN SMITH</MenuItem>
                  <MenuItem value="LUCY LAVENDER">LUCY LAVENDER</MenuItem>
                </Select>
              </FormControl>
            </Box>

            {/* ID Expiry Date */}
            <Box sx={{ mb: 3 }}>
              <Typography
                variant="body2"
                sx={{
                  color: '#004996',
                  fontSize: '14px',
                  mb: 1,
                  fontWeight: 500,
                }}
              >
                ID Expiry Date
              </Typography>
              <Box sx={{ display: 'flex', gap: 1 }}>
                              <FormControl size="small" sx={{ flex: 1, width: '25%' }}>
                <Select
                  value={updateIdData.idExpiryDay}
                    onChange={(e) => setUpdateIdData(prev => ({ ...prev, idExpiryDay: e.target.value }))}
                    sx={{
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#004996 !important',
                      },
                      '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#004996 !important',
                      },
                      '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#004996 !important',
                      },
                      '& .MuiSelect-icon': {
                        color: '#004996',
                      },
                    }}
                    IconComponent={KeyboardArrowDown}
                  >
                    {Array.from({ length: 31 }, (_, i) => i + 1).map(day => (
                      <MenuItem key={day} value={day.toString()}>{day}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <FormControl size="small" sx={{ flex: 1, width: '25%' }}>
                  <Select
                    value={updateIdData.idExpiryMonth}
                    onChange={(e) => setUpdateIdData(prev => ({ ...prev, idExpiryMonth: e.target.value }))}
                    sx={{
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#004996 !important',
                      },
                      '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#004996 !important',
                      },
                      '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#004996 !important',
                      },
                      '& .MuiSelect-icon': {
                        color: '#004996',
                      },
                    }}
                    IconComponent={KeyboardArrowDown}
                  >
                    {Array.from({ length: 12 }, (_, i) => i + 1).map(month => (
                      <MenuItem key={month} value={month.toString()}>{month}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <FormControl size="small" sx={{ flex: 1, width: '25%' }}>
                  <Select
                    value={updateIdData.idExpiryYear}
                    onChange={(e) => setUpdateIdData(prev => ({ ...prev, idExpiryYear: e.target.value }))}
                    sx={{
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#004996 !important',
                      },
                      '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#004996 !important',
                      },
                      '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#004996 !important',
                      },
                      '& .MuiSelect-icon': {
                        color: '#004996',
                      },
                    }}
                    IconComponent={KeyboardArrowDown}
                  >
                    {Array.from({ length: 10 }, (_, i) => new Date().getFullYear() + i).map(year => (
                      <MenuItem key={year} value={year.toString()}>{year}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>
            </Box>

            <Box sx={{ mb: 3 }}>
              <Typography
                variant="body2"
                sx={{
                  color: '#004996',
                  fontSize: '14px',
                  mb: 1,
                  fontWeight: 500,
                }}
              >
                ID Issuing Country
              </Typography>
              <FormControl size="small" sx={{ width: '100%' }}>
                <Select
                  value={updateIdData.idIssuingCountry}
                  onChange={(e) => setUpdateIdData(prev => ({ ...prev, idIssuingCountry: e.target.value }))}
                  sx={{
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#004996 !important',
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#004996 !important',
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#004996 !important',
                    },
                    '& .MuiSelect-icon': {
                      color: '#004996',
                    },
                  }}
                  IconComponent={KeyboardArrowDown}
                >
                  <MenuItem value="Netherlands">Netherlands</MenuItem>
                  <MenuItem value="Germany">Germany</MenuItem>
                  <MenuItem value="Belgium">Belgium</MenuItem>
                </Select>
              </FormControl>
            </Box>

            {/* File Upload */}
            <Box sx={{ mb: 3 }}>
              <Typography
                variant="body2"
                sx={{
                  color: '#004996',
                  fontSize: '14px',
                  mb: 1,
                  fontWeight: 500,
                }}
              >
                Select a file
              </Typography>
              <Box sx={{ position: 'relative' }}>
                <TextField
                  value={updateIdData.selectedFile}
                  size="small"
                  fullWidth
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      backgroundColor: 'white',
                      '& fieldset': {
                        borderColor: '#004996 !important',
                      },
                      '&:hover fieldset': {
                        borderColor: '#004996 !important',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#004996 !important',
                      },
                    },
                    '& .MuiInputBase-input': {
                      color: '#004996',
                      fontSize: '14px',
                      paddingRight: '48px',
                    },
                  }}
                />
                <input
                  accept=".pdf,.jpg,.jpeg,.png"
                  style={{ display: 'none' }}
                  id="file-upload"
                  type="file"
                  onChange={handleFileUpload}
                />
                <label htmlFor="file-upload">
                  <IconButton
                    component="span"
                    sx={{
                      position: 'absolute',
                      right: '8px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      color: '#004996',
                      '&:hover': {
                        backgroundColor: 'rgba(0, 73, 150, 0.04)',
                      },
                    }}
                  >
                    <CloudUpload />
                  </IconButton>
                </label>
              </Box>
            </Box>

            {/* File Format Warning */}
            <Typography
              variant="body2"
              sx={{
                color: '#333',
                fontSize: '11px',
                mb: 3,
                mt: 0.5,
              }}
            >
              PDF, JPG, and PNG file formats are acceptable
            </Typography>

            {/* Explanation */}
            <Box sx={{ mb: 3 }}>
              <Typography
                variant="body2"
                sx={{
                  color: '#004996',
                  fontSize: '14px',
                  mb: 1,
                  fontWeight: 500,
                }}
              >
                Explanation (optional)
              </Typography>
                              <TextField
                  placeholder="Explanation"
                  value={updateIdData.explanation}
                  onChange={(e) => setUpdateIdData(prev => ({ ...prev, explanation: e.target.value }))}
                  size="small"
                  fullWidth
                  sx={{
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: 'white',
                    '& fieldset': {
                      borderColor: '#004996 !important',
                    },
                    '&:hover fieldset': {
                      borderColor: '#004996 !important',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#004996 !important',
                    },
                  },
                  '& .MuiInputBase-input': {
                    color: '#004996',
                    fontSize: '14px',
                  },
                  '& .MuiInputBase-input::placeholder': {
                    color: '#004996',
                    opacity: 1,
                  },
                }}
              />
            </Box>

            {/* Confirm Button */}
            <Button
              variant="contained"
              onClick={handleUpdateIdConfirm}
              sx={{
                width: '100%',
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
              endIcon={<ArrowForward />}
            >
              Confirm
            </Button>
          </Card>
        </Box>
      </Modal>
    </Box>
  );
};

export default PersonalDetails;
