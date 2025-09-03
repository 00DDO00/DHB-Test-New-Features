import React from 'react';
import {
  Typography,
  Breadcrumbs,
  Link as MuiLink,
} from '@mui/material';
import {
  Home as HomeIcon,
} from '@mui/icons-material';
import { Link } from 'react-router-dom';
import { BreadcrumbsSectionProps } from './types';

const BreadcrumbsSection: React.FC<BreadcrumbsSectionProps> = () => {
  return (
    <>
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
        Solidextra Deposit Account
      </Typography>
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
          to="/accounts" 
          color="inherit" 
          underline="hover"
          sx={{ cursor: 'pointer' }}
        >
          Accounts
        </MuiLink>
        <MuiLink 
          component={Link}
          to="/accounts/open" 
          color="inherit" 
          underline="hover"
          sx={{ cursor: 'pointer' }}
        >
          Open account
        </MuiLink>
        <Typography color="text.primary" fontWeight="bold">
          Solidextra Deposit Account
        </Typography>
      </Breadcrumbs>
    </>
  );
};

export default BreadcrumbsSection;
