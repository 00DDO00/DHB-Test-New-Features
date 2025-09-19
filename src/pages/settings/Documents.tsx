import React from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Breadcrumbs,
  Link as MuiLink,
  Fab,
  IconButton,
} from '@mui/material';
import {
  ArrowForward,
  HeadsetMic,
  Home as HomeIcon,
  Visibility as PreviewIcon,
  Download as DownloadIcon,
} from '@mui/icons-material';
import { Link, useNavigate } from 'react-router-dom';

const Documents: React.FC = () => {
  const navigate = useNavigate();

  // Document data matching the first image
  const documents = [
    {
      id: 'terms-conditions',
      title: 'Terms & Conditions',
      subtitle: 'Main rules, tax and deposit information, and reference documents',
      isClickable: true,
      hasPreview: false,
      hasDownload: false,
    },
    {
      id: 'depositor-template',
      title: 'Depositor Information Template',
      subtitle: 'Forms for account changes, contact updates, and cancellations',
      isClickable: false,
      hasPreview: true,
      hasDownload: true,
    },
    {
      id: 'financial-overview',
      title: 'Financial Annual Overview',
      subtitle: 'Terms for accounts, deposits, and online services',
      isClickable: false,
      hasPreview: true,
      hasDownload: true,
    },
    {
      id: 'account-statements',
      title: 'Account Statements',
      subtitle: 'Terms for accounts, deposits, and online services',
      isClickable: false,
      hasPreview: true,
      hasDownload: true,
    },
    {
      id: 'contracts',
      title: 'Your contracts',
      subtitle: 'Terms for accounts, deposits, and online services',
      isClickable: false,
      hasPreview: true,
      hasDownload: true,
    },
    {
      id: 'faq',
      title: 'Frequently Asked Questions',
      subtitle: 'A section that provides quick and easy access to answers',
      isClickable: false,
      hasPreview: true,
      hasDownload: true,
    },
  ];

  const handleCardClick = (documentId: string) => {
    if (documentId === 'terms-conditions') {
      navigate('/settings/documents/terms-conditions');
    }
  };

  const handlePreview = (documentId: string) => {
    console.log(`Preview ${documentId}`);
    // Implement preview functionality
  };

  const handleDownload = (documentId: string) => {
    console.log(`Download ${documentId}`);
    // Implement download functionality
  };

  return (
    <Box sx={{ p: 3, backgroundColor: '#F5F5F5', minHeight: '100vh' }}>
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
        <Typography color="text.primary" fontWeight="bold">
          Documents
        </Typography>
      </Breadcrumbs>

      {/* Main Heading */}
      <Typography 
        variant="h4" 
        fontWeight="bold" 
        sx={{ mb: 4, color: '#333' }}
      >
        Below please find the conditions regarding out internet services.
      </Typography>

      {/* Documents Grid - 3 rows of 2 columns */}
      <Grid container spacing={3}>
        {documents.map((document) => (
          <Grid item xs={12} sm={6} key={document.id}>
            <Card 
              sx={{ 
                borderRadius: 2,
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                border: '1px solid #e0e0e0',
                transition: 'all 0.2s ease-in-out',
                cursor: document.isClickable ? 'pointer' : 'default',
                minHeight: 'auto', // Allow natural sizing
                position: 'relative',
                '&:hover': document.isClickable ? {
                  boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                  transform: 'translateY(-2px)',
                } : {}
              }}
              onClick={() => handleCardClick(document.id)}
            >
              <CardContent sx={{ p: 2, display: 'flex', flexDirection: 'column', alignItems: 'flex-start', textAlign: 'left', position: 'relative' }}>
                {/* Title */}
                <Typography 
                  variant="h6" 
                  fontWeight="bold" 
                  color="#333"
                  sx={{ mb: 1 }}
                >
                  {document.title}
                </Typography>

                {/* Icons positioned at vertical center */}
                <Box sx={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', display: 'flex', gap: 1, alignItems: 'center' }}>
                    {document.isClickable && (
                      <ArrowForward sx={{ color: '#1976d2', fontSize: 20 }} />
                    )}

                    {!document.isClickable && (
                      <>
                        {document.hasPreview && (
                          <IconButton
                            size="small"
                            onClick={(e) => {
                              e.stopPropagation();
                              handlePreview(document.id);
                            }}
                            sx={{ 
                              color: '#1976d2',
                              '&:hover': { backgroundColor: 'rgba(25, 118, 210, 0.1)' }
                            }}
                          >
                            <PreviewIcon />
                          </IconButton>
                        )}
                        {document.hasDownload && (
                          <IconButton
                            size="small"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDownload(document.id);
                            }}
                            sx={{ 
                              color: '#1976d2',
                              '&:hover': { backgroundColor: 'rgba(25, 118, 210, 0.1)' }
                            }}
                          >
                            <DownloadIcon />
                          </IconButton>
                        )}
                      </>
                    )}
                  </Box>

                {/* Subtitle */}
                <Typography 
                  variant="body2" 
                  color="#666" 
                  sx={{ lineHeight: 1.4 }}
                >
                  {document.subtitle}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Floating Action Button */}
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
        <HeadsetMic />
      </Fab>
    </Box>
  );
};

export default Documents;
