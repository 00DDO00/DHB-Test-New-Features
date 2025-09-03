import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Typography,
  IconButton,
} from '@mui/material';
import {
  Download as DownloadIcon,
  FilterList as FilterIcon,
} from '@mui/icons-material';
import { AccountStatementHeaderSectionProps } from './types';

const AccountStatementHeaderSection: React.FC<AccountStatementHeaderSectionProps> = ({
  onDownload,
  onFilterOpen
}) => {
  const { t } = useTranslation();

  return (
    <>
      {/* Transaction Filters Section */}
      <Typography
        component="h2"
        variant="h5"
        sx={{
          position: 'absolute',
          left: '-10000px',
          width: '1px',
          height: '1px',
          overflow: 'hidden'
        }}
      >
        Transaction Filters
      </Typography>
      
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h5" fontWeight="bold" sx={{ mb: 1 }}>
            {t('account-statement')}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            NN-LLL-NNNN - NN-LLL-NNNN
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <IconButton size="small" onClick={onDownload}>
              <DownloadIcon />
            </IconButton>
            <Typography variant="caption" color="text.secondary">
              {t('accounts.download')}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <IconButton size="small" onClick={onFilterOpen}>
              <FilterIcon />
            </IconButton>
            <Typography variant="caption" color="text.secondary">
              {t('account-history.filter-button')}
            </Typography>
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default AccountStatementHeaderSection;
