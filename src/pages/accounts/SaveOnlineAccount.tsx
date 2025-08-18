import React, { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Tabs,
  Tab,
  Chip,
  IconButton,
  Breadcrumbs,
  Link as MuiLink,
} from '@mui/material';
import {
  ArrowForward as ArrowForwardIcon,
  Download as DownloadIcon,
  FilterList as FilterIcon,
  Settings as SettingsIcon,
  People as PeopleIcon,
  FileUpload as FileUploadIcon,
  TrackChanges as TrackChangesIcon,
  Tune as TuneIcon,
  Close as CloseIcon,
} from '@mui/icons-material';
import { Link } from 'react-router-dom';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`transfer-tabpanel-${index}`}
      aria-labelledby={`transfer-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

const SaveOnlineAccount: React.FC = () => {
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const transactions = [
    {
      date: '01-Jan-2024',
      description: 'Holder name NL24DHBN2018470578',
      balance: '€ 1.250,00',
      type: 'credit'
    },
    {
      date: '28-Dec-2023',
      description: 'Holder name NL24DHBN2018470578',
      balance: '- € 500,00',
      type: 'debit'
    },
    {
      date: '15-Dec-2023',
      description: 'Holder name NL24DHBN2018470578',
      balance: '€ 2.000,00',
      type: 'credit'
    },
    {
      date: '01-Dec-2023',
      description: 'Holder name NL24DHBN2018470578',
      balance: '- € 750,00',
      type: 'debit'
    }
  ];

  const quickActions = [
    { icon: <SettingsIcon />, label: 'Savings Goal Setting', href: '#' },
    { icon: <PeopleIcon />, label: 'Counteraccount change', href: '#' },
    { icon: <FileUploadIcon />, label: 'Transcript download', href: '#' },
    { icon: <TrackChangesIcon />, label: 'Set savings target', href: '#' },
    { icon: <TuneIcon />, label: 'Adjustment', href: '#' },
    { icon: <CloseIcon />, label: 'Account Closure', href: '#' },
  ];

  return (
    <Box sx={{ p: 3 }}>
      {/* Breadcrumbs */}
      <Breadcrumbs sx={{ mb: 3 }}>
        <MuiLink component={Link} to="/private" color="inherit" underline="hover">
          Home
        </MuiLink>
        <MuiLink component={Link} to="/dashboard/analytics" color="inherit" underline="hover">
          Accounts
        </MuiLink>
        <Typography color="text.primary">DHB SaveOnline</Typography>
      </Breadcrumbs>

      {/* Account Summary - Full Width Blue Card */}
      <Card sx={{ mb: 0, backgroundColor: '#004996', color: 'white' }}>
        <CardContent>
          <Grid container alignItems="center" justifyContent="space-between">
            <Grid item xs={12} md={8}>
              <Typography variant="h6" sx={{ mb: 1 }}>
                Holder name
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.8 }}>
                NL24DHBN2018470578
              </Typography>
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
                € 2.000,00
              </Typography>
              <Box sx={{ mt: 2 }}>
                <Typography variant="body2" sx={{ mb: 0.5 }}>
                  <strong>Balance class:</strong> EUR 0,00 t/m EUR 100.000,00
                </Typography>
                <Typography variant="body2">
                  <strong>Rente:</strong> 1.7%
                </Typography>
                <Typography variant="body2">
                  <strong>Balance class:</strong> EUR 100.000,01 t/m EUR 500.000,00
                </Typography>
                <Typography variant="body2">
                  <strong>Rente:</strong> 1.7%
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Connected Frame: Transfer Section + Quick Actions */}
      <Box sx={{ 
        display: 'flex', 
        backgroundColor: 'white',
        border: '1px solid #e0e0e0',
        borderTop: 'none',
        borderRadius: '0 0 8px 8px'
      }}>
        {/* Transfer Section - Left Side */}
        <Box sx={{ flex: 1, p: 3, borderRight: '1px solid #e0e0e0' }}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
            <Tabs 
              value={tabValue} 
              onChange={handleTabChange}
              sx={{
                '& .MuiTab-root': {
                  height: '48px',
                  width: '288px',
                  textTransform: 'none',
                  fontSize: '18px',
                  fontWeight: 700,
                  color: '#000000'
                }
              }}
            >
              <Tab label="Completed transfers" />
              <Tab label="Scheduled transfers" />
            </Tabs>
          </Box>

          <TabPanel value={tabValue} index={0}>
            <Typography variant="body1" sx={{ mb: 3, color: 'text.primary', fontSize: '17px' }}> 
              Do you transfer funds to your contra account or savings account before 2.30pm on a working day? 
              Then the transfer will be processed the same day. After these times, the transfer will be processed 
              the next working day.
            </Typography>
            
            <Box sx={{ textAlign: 'center', mb: 3 }}>
              <Button
                variant="contained"
                size="large"
                sx={{
                  backgroundColor: '#FC9F15',
                  '&:hover': { backgroundColor: '#e88a0a' },
                  px: 4,
                  py: 2,
                  fontSize: '1.1rem',
                  width: '100%'
                }}
                endIcon={<ArrowForwardIcon />}
              >
                Make New Transfer
              </Button>
            </Box>
          </TabPanel>

          <TabPanel value={tabValue} index={1}>
            <Typography variant="body2" color="text.secondary">
              No scheduled transfers found.
            </Typography>
          </TabPanel>

          {/* Account Transfers Table - Inside the same frame */}
          <Box sx={{ mt: 4 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">Account transfers</Typography>
              <Box>
                <IconButton size="small" sx={{ mr: 1 }}>
                  <DownloadIcon />
                </IconButton>
                <IconButton size="small">
                  <FilterIcon />
                </IconButton>
              </Box>
            </Box>

            <TableContainer component={Paper} variant="outlined">
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell><strong>Date</strong></TableCell>
                    <TableCell><strong>Description</strong></TableCell>
                    <TableCell align="right"><strong>Balance</strong></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {transactions.map((transaction, index) => (
                    <TableRow key={index}>
                      <TableCell>{transaction.date}</TableCell>
                      <TableCell>{transaction.description}</TableCell>
                      <TableCell 
                        align="right"
                        sx={{ 
                          color: transaction.type === 'debit' ? 'error.main' : 'success.main',
                          fontWeight: 'bold'
                        }}
                      >
                        {transaction.balance}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            <Box sx={{ textAlign: 'center', mt: 2 }}>
              <MuiLink
                component={Link}
                to="#"
                sx={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  textDecoration: 'none',
                  color: '#FC9F15',
                  fontWeight: 'bold',
                  '&:hover': { textDecoration: 'underline' }
                }}
              >
                See All
                <ArrowForwardIcon sx={{ ml: 0.5, fontSize: '1rem' }} />
              </MuiLink>
            </Box>
          </Box>
        </Box>

        {/* Quick Actions - Right Side */}
        <Box sx={{ width: '300px', p: 3, backgroundColor: '#E6EDF5' }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4, pt: 4, alignItems: 'center' }}>
            {quickActions.map((action, index) => (
              <MuiLink
                key={index}
                href={action.href}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  p: 1.5,
                  borderRadius: 1,
                  textDecoration: 'none',
                  color: 'text.primary',
                  backgroundColor: 'transparent',
                  border: 'none',
                  transition: 'all 0.2s',
                  width: '240px',
                  '&:hover': {
                    backgroundColor: 'rgba(0, 0, 0, 0.05)',
                    textDecoration: 'none'
                  }
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, minWidth: '180px' }}>
                  <Box sx={{ width: '24px', display: 'flex', justifyContent: 'center' }}>
                    {action.icon}
                  </Box>
                  <Typography variant="body2">{action.label}</Typography>
                </Box>
                <ArrowForwardIcon sx={{ fontSize: '1rem' }} />
              </MuiLink>
            ))}
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default SaveOnlineAccount;
