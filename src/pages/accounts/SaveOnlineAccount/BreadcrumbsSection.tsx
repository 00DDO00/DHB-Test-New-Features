import React from 'react';
import { Breadcrumbs, Link as MuiLink, Typography } from '@mui/material';
import { Link } from 'react-router-dom';

const BreadcrumbsSection: React.FC = () => {
  return (
    <Breadcrumbs sx={{ mb: 3 }}>
      <MuiLink component={Link} to="/private" color="inherit" underline="hover">
        Home
      </MuiLink>
      <MuiLink component={Link} to="/dashboard/analytics" color="inherit" underline="hover">
        Accounts
      </MuiLink>
      <Typography color="text.primary">DHB SaveOnline</Typography>
    </Breadcrumbs>
  );
};

export default BreadcrumbsSection;
