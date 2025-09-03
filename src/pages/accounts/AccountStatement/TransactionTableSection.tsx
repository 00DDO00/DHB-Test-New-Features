import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
} from '@mui/material';
import {
  ArrowForward as ArrowForwardIcon,
} from '@mui/icons-material';
import { TransactionTableSectionProps } from './types';

const TransactionTableSection: React.FC<TransactionTableSectionProps> = ({
  transactions,
  filteredTransactions
}) => {
  const { t } = useTranslation();

  const displayTransactions = filteredTransactions.length > 0 ? filteredTransactions : transactions;

  return (
    <>
      {/* Transaction History Section */}
      <Typography
        component="h3"
        variant="h6"
        sx={{
          position: 'absolute',
          left: '-10000px',
          width: '1px',
          height: '1px',
          overflow: 'hidden'
        }}
      >
        Transaction History
      </Typography>
      
      {/* Table */}
      <TableContainer 
        component={Paper} 
        variant="outlined"
        role="region"
        aria-label="Transaction history table"
      >
        <Table 
          aria-label="Account transactions"
          role="table"
        >
          <TableHead>
            <TableRow role="row">
              <TableCell role="columnheader"><strong>{t('statement-date')}</strong></TableCell>
              <TableCell role="columnheader"><strong>{t('payments.explanation')}</strong></TableCell>
              <TableCell align="right" role="columnheader"><strong>{t('accounts.balance')}</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {displayTransactions.map((transaction, index) => (
              <TableRow 
                key={transaction.id || index}
                role="row"
                aria-label={`Transaction on ${transaction.date} for ${transaction.balance}`}
              >
                <TableCell role="cell">{transaction.date}</TableCell>
                <TableCell role="cell">
                  {transaction.description}
                  <br />
                  <Typography variant="caption" color="text.secondary">
                    {transaction.account}
                  </Typography>
                </TableCell>
                <TableCell 
                  align="right"
                  role="cell"
                  sx={{ 
                    color: transaction.type === 'debit' ? 'error.main' : 'success.main',
                    fontWeight: 'bold'
                  }}
                  aria-label={`${transaction.type === 'debit' ? 'Debit' : 'Credit'} of ${transaction.balance}`}
                >
                  {transaction.balance}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination */}
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        mt: 3, 
        p: 2, 
        borderTop: '1px solid #e0e0e0',
        bgcolor: '#f9f9f9'
      }}>
        <IconButton size="small">
          <ArrowForwardIcon sx={{ transform: 'rotate(180deg)' }} />
        </IconButton>
        <Typography variant="body2" sx={{ mx: 2 }}>
          1-{displayTransactions.length} out of {displayTransactions.length}
        </Typography>
        <IconButton size="small">
          <ArrowForwardIcon />
        </IconButton>
      </Box>
    </>
  );
};

export default TransactionTableSection;
