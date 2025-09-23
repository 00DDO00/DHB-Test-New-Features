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
import { Link } from 'react-router-dom';

const TermsConditions: React.FC = () => {
  // Terms & Conditions data with actual PDF files
  const termsDocuments = [
    {
      id: 'saveonline-terms',
      title: 'DHB SaveOnline Account',
      filename: 'DHB SaveOnline Account.pdf',
      filePath: '/DHB SaveOnline Account.pdf',
      hasPreview: true,
      hasDownload: true,
    },
    {
      id: 'solidextra-terms',
      title: 'DHB Solidextra Account',
      filename: 'DHB Solidextra Deposit Account.pdf',
      filePath: '/DHB Solidextra Deposit Account.pdf',
      hasPreview: true,
      hasDownload: true,
    },
    {
      id: 'combispaar-terms',
      title: 'DHB Combispaar Account',
      filename: 'DHB CombiSpaar Account.pdf',
      filePath: '/DHB CombiSpaar Account.pdf',
      hasPreview: true,
      hasDownload: true,
    },
    {
      id: 'maxispaar-terms',
      title: 'DHB Maxispaar Account',
      filename: 'DHB MaxiSpaar Account.pdf',
      filePath: '/DHB MaxiSpaar Account.pdf',
      hasPreview: true,
      hasDownload: true,
    },
  ];

  const handlePreview = (documentId: string) => {
    const document = termsDocuments.find(doc => doc.id === documentId);
    if (document) {
      // Open PDF in new tab for preview
      window.open(document.filePath, '_blank');
    }
  };

  const handleDownload = (documentId: string) => {
    const doc = termsDocuments.find(doc => doc.id === documentId);
    if (doc) {
      // Create a temporary link element to trigger download
      const link = document.createElement('a');
      link.href = doc.filePath;
      link.download = doc.filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
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
        <MuiLink 
          component={Link}
          to="/settings/documents" 
          color="inherit" 
          underline="hover"
          sx={{ cursor: 'pointer' }}
        >
          Documents
        </MuiLink>
        <Typography color="text.primary" fontWeight="bold">
          Terms & Conditions
        </Typography>
      </Breadcrumbs>

      {/* Main Heading */}
      <Typography 
        variant="h4" 
        fontWeight="bold" 
        sx={{ mb: 2, color: '#333' }}
      >
        Terms & Conditions
      </Typography>

      {/* Instruction Text */}
      <Typography 
        variant="body1" 
        sx={{ mb: 4, color: '#666' }}
      >
        Below please find the conditions regarding out internet services. Please click a link to open the document.
      </Typography>

      {/* Terms & Conditions Grid - 2x2 Layout */}
      <Grid container spacing={3}>
        {termsDocuments.map((document) => (
          <Grid item xs={12} sm={6} key={document.id}>
            <Card 
              sx={{ 
                borderRadius: 2,
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                border: '1px solid #e0e0e0',
                transition: 'all 0.2s ease-in-out',
                height: '90px', // Fixed height to match Documents page
                '&:hover': {
                  boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                  transform: 'translateY(-2px)',
                }
              }}
            >
              <CardContent sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'center', textAlign: 'left', position: 'relative' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', height: '100%' }}>
                {/* Title */}
                <Typography 
                  variant="h6" 
                  fontWeight="bold" 
                  color="#333"
                >
                  {document.title}
                </Typography>

                </Box>
                {/* Icons positioned at vertical center */}
                <Box sx={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', display: 'flex', gap: 1 }}>
                    <IconButton
                      size="small"
                      onClick={() => handlePreview(document.id)}
                      sx={{ 
                        color: '#1976d2',
                        '&:hover': { backgroundColor: 'rgba(25, 118, 210, 0.1)' }
                      }}
                    >
                      <PreviewIcon />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => handleDownload(document.id)}
                      sx={{ 
                        color: '#1976d2',
                        '&:hover': { backgroundColor: 'rgba(25, 118, 210, 0.1)' }
                      }}
                    >
                      <DownloadIcon />
                    </IconButton>
                  </Box>
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

export default TermsConditions;
