import React from 'react';
import { apiService } from '../services/api';
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
  Link as LinkIcon,
  ArrowForward,
  HeadsetMic,
  Home as HomeIcon,
} from '@mui/icons-material';
import { Link } from 'react-router-dom';

const Documents: React.FC = () => {
  const [documents, setDocuments] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);

  // Load documents from YAML API
  React.useEffect(() => {
    const loadDocuments = async () => {
      try {
        // Use YAML endpoints to get documents
        const [financialDocs, contracts] = await Promise.all([
          apiService.getFinancialAnnualOverview(),
          apiService.getCustomerContracts()
        ]);

        // Transform YAML data to documents array
        const transformedDocs = [
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
          ...financialDocs.map((doc: any) => ({
            id: doc.id,
            title: doc.name,
            downloadUrl: `/documents/${doc.id}.pdf`,
          })),
          ...contracts.map((contract: any) => ({
            id: contract.id,
            title: contract.name,
            downloadUrl: `/documents/${contract.id}.pdf`,
          }))
        ];

        setDocuments(transformedDocs);
      } catch (error) {
        console.error('Failed to load documents:', error);
        // Fallback to static documents
        setDocuments([
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
        ]);
      } finally {
        setLoading(false);
      }
    };

    loadDocuments();
  }, []);

  const handleDownload = async (documentId: string, downloadUrl: string) => {
    try {
      console.log(`Downloading ${documentId}: ${downloadUrl}`);
      
      // Make API call with proper headers
      const headers = {
        'Content-Type': 'application/json',
        'channelCode': 'WEB',
        'username': 'testuser',
        'lang': 'en',
        'countryCode': 'NL',
        'sessionId': 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
        'customerId': 'CUST001'
      };
      
      const response = await fetch(`http://localhost:5003/api/documents/download?type=${documentId}`, {
        method: 'GET',
        headers
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      // Get the filename from the Content-Disposition header
      const contentDisposition = response.headers.get('Content-Disposition');
      let filename = `${documentId}.txt`;
      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
        if (filenameMatch && filenameMatch[1]) {
          filename = filenameMatch[1].replace(/['"]/g, '');
        }
      }
      
      // Convert response to blob and create download link
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      
      // Append to body, click, and remove
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Clean up the URL object
      window.URL.revokeObjectURL(url);
      
    } catch (error) {
      console.error('Download failed:', error);
      alert('Download failed. Please try again.');
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
          to="/settings" 
          color="inherit" 
          underline="hover"
          sx={{ cursor: 'pointer' }}
        >
          Settings
        </MuiLink>
        <Typography color="text.primary" fontWeight="bold">
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
