import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  Typography,
  Breadcrumbs,
  Link as MuiLink,
} from '@mui/material';
import { Link } from 'react-router-dom';
import { BreadcrumbsSectionProps } from './types';

const BreadcrumbsSection: React.FC<BreadcrumbsSectionProps> = () => {
  const { t } = useTranslation();

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
        Account Statement
      </Typography>
      {/* Breadcrumbs */}
      <Breadcrumbs sx={{ mb: 3 }}>
        <MuiLink component={Link} to="/" color="inherit" sx={{ textDecoration: 'none' }}>
          {t('home')}
        </MuiLink>
        <MuiLink component={Link} to="/accounts" color="inherit" sx={{ textDecoration: 'none' }}>
          {t('accounts.title')}
        </MuiLink>
        <MuiLink component={Link} to="/accounts/saveonline" color="inherit" sx={{ textDecoration: 'none' }}>
          {t('account-statements.select-account.title.saveOnline')}
        </MuiLink>
        <Typography color="text.primary">{t('account-statement')}</Typography>
      </Breadcrumbs>
    </>
  );
};

export default BreadcrumbsSection;
