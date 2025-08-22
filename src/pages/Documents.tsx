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
} from '@mui/material';
import {
  Link,
  ArrowForward,
  HeadsetMic,
} from '@mui/icons-material';

const Documents: React.FC = () => {
  const documents = [
    {
      id: 'terms-conditions',
      title: 'Terms & Conditions',
      downloadUrl: '/documents/terms-conditions.pdf',
    },
    {
      id: 'depositor-template',
      title: 'Depositor Information Template',
      downloadUrl: '/documents/depositor-template.pdf',
    },
    {
      id: 'financial-overview',
      title: 'Financial Annual Overview',
      downloadUrl: '/documents/financial-overview.pdf',
    },
    {
      id: 'account-statements',
      title: 'Account Statements',
      downloadUrl: '/documents/account-statements.pdf',
    },
    {
      id: 'contracts',
      title: 'Your contracts',
      downloadUrl: '/documents/contracts.pdf',
    },
  ];

  const handleDownload = async (documentId: string, downloadUrl: string) => {
    try {
      console.log(`Downloading ${documentId}: ${downloadUrl}`);
      
      // Create a temporary link element to trigger download
      const link = document.createElement('a');
      link.href = `http://localhost:5002/api/documents/download?type=${documentId}`;
      link.download = ''; // Let the server set the filename
      link.target = '_blank';
      
      // Append to body, click, and remove
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
    } catch (error) {
      console.error('Download failed:', error);
      alert('Download failed. Please try again.');
    }
  };

  return (
    <Box sx={{ p: 3, backgroundColor: '#F5F5F5', minHeight: '100vh' }}>
      {/* Breadcrumbs */}
      <Breadcrumbs sx={{ mb: 3 }}>
        <MuiLink 
          component={Link}
          to="/private" 
          color="inherit" 
          underline="hover"
          sx={{ cursor: 'pointer', color: '#666' }}
        >
          Home
        </MuiLink>
        <MuiLink 
          component={Link}
          to="/settings" 
          color="inherit" 
          underline="hover"
          sx={{ cursor: 'pointer', color: '#666' }}
        >
          Settings
        </MuiLink>
        <Typography color="text.primary" sx={{ color: '#666' }}>
          Documents
        </Typography>
      </Breadcrumbs>

      {/* Documents Grid */}
      <Grid container spacing={4}>
        {documents.map((document) => (
          <Grid item xs={12} sm={6} md={4} key={document.id}>
            <Card 
              sx={{ 
                borderRadius: 2,
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                transition: 'all 0.2s ease-in-out',
                '&:hover': {
                  boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                  transform: 'translateY(-2px)',
                }
              }}
            >
              <CardContent sx={{ p: 3, textAlign: 'center', minHeight: '160px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                {/* Title */}
                <Typography 
                  variant="h6" 
                  fontWeight="bold" 
                  color="#333" 
                  sx={{ mb: 3 }}
                >
                  {document.title}
                </Typography>

                {/* Download Link */}
                <MuiLink
                  component="button"
                  onClick={() => handleDownload(document.id, document.downloadUrl)}
                  sx={{
                    color: '#1976d2',
                    textDecoration: 'none',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 1,
                    fontSize: '14px',
                    fontWeight: 500,
                    margin: '0 auto',
                    '&:hover': {
                      color: '#1565c0',
                    },
                  }}
                >
                  Download PDF
                  <ArrowForward sx={{ fontSize: 16 }} />
                </MuiLink>
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
