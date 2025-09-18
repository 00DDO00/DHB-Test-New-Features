import React from 'react';
import { Box, Breadcrumbs, Link as MuiLink, Typography, Tooltip, IconButton, Card as MuiCard } from '@mui/material';
import { InfoOutlined } from '@mui/icons-material';
import { Link } from 'react-router-dom';

const BreadcrumbsSection: React.FC = () => {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
      <Breadcrumbs>
        <MuiLink component={Link} to="/private" color="inherit" underline="hover">
          Home
        </MuiLink>
        <MuiLink component={Link} to="/dashboard/analytics" color="inherit" underline="hover">
          Accounts
        </MuiLink>
        <Typography color="text.primary">DHB SaveOnline</Typography>
      </Breadcrumbs>

      <Tooltip
        arrow
        placement="left"
        componentsProps={{
          tooltip: {
            sx: {
              backgroundColor: 'white',
              color: '#333',
              border: '1px solid #004996',
              borderRadius: '8px',
              minWidth: '350px',
              '& .MuiTooltip-arrow': {
                color: '#004996',
                '&::before': {
                  border: '1px solid #004996'
                }
              }
            }
          }
        }}
        title={
          <Box sx={{ p: 2 }}>
            <Box sx={{ display: 'flex', mb: 1, justifyContent: 'space-between' }}>
              <Typography variant="body2" sx={{ fontWeight: 'bold', flex: 1, mr: 2, color: '#333' }}>
                Balance class
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 'bold', minWidth: '80px', textAlign: 'right', color: '#333' }}>
                Rente
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', mb: 1, justifyContent: 'space-between' }}>
              <Typography variant="body2" sx={{ flex: 1, mr: 2, whiteSpace: 'nowrap', color: '#333' }}>
                EUR 0,00 t/m EUR 100.000,00
              </Typography>
              <Typography variant="body2" sx={{ minWidth: '80px', textAlign: 'right', color: '#333' }}>
                1.7 %
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="body2" sx={{ flex: 1, mr: 2, whiteSpace: 'nowrap', color: '#333' }}>
                EUR 100.000,01 t/m EUR 500.000,00
              </Typography>
              <Typography variant="body2" sx={{ minWidth: '80px', textAlign: 'right', color: '#333' }}>
                1.7 %
              </Typography>
            </Box>
          </Box>
        }
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#333' }}>
            Balance class
          </Typography>
          <IconButton size="small" sx={{ color: '#333', border: '1px solid rgba(0,0,0,0.2)', width: 24, height: 24 }}>
            <InfoOutlined sx={{ fontSize: 16 }} />
          </IconButton>
        </Box>
      </Tooltip>
    </Box>
  );
};

export default BreadcrumbsSection;
