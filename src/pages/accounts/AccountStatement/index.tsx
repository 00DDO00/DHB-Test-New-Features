import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Breadcrumbs,
  Link as MuiLink,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  IconButton
} from '@mui/material';
import {
  ChevronRight as ChevronRightIcon,
  Download as DownloadIcon,
  PictureAsPdf as PdfIcon
} from '@mui/icons-material';
import { Link } from 'react-router-dom';

interface StatementData {
  id: number;
  date: string;
  statementNumber: number;
}

const AccountStatement: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Get search parameters from navigation
  const searchParams = new URLSearchParams(location.search);
  const selectedMonth = searchParams.get('month') || 'January';
  const selectedYear = searchParams.get('year') || '2024';
  const selectedAccount = searchParams.get('account') || 'SaveOnline';

  const [statements, setStatements] = useState<StatementData[]>([]);

  // Generate mock statement data based on selected month/year
  useEffect(() => {
    const generateStatements = () => {
      const monthNames = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
      ];
      
      const year = parseInt(selectedYear);
      const generatedStatements: StatementData[] = [];
      
      if (selectedMonth === '--') {
        // Generate statements for all months up to the current point in the year
        const currentDate = new Date();
        const currentYear = currentDate.getFullYear();
        const currentMonth = currentDate.getMonth(); // 0-based (0 = January, 8 = September)
        
        // If selected year is current year, only show months up to current month (excluding current month)
        // If selected year is past year, show all 12 months
        const endMonth = (year === currentYear) ? currentMonth - 1 : 11;
        
        for (let monthIndex = 0; monthIndex <= endMonth; monthIndex++) {
          const monthName = monthNames[monthIndex];
          const lastDay = new Date(year, monthIndex + 1, 0).getDate();
          const date = `${lastDay.toString().padStart(2, '0')}-${monthName.substring(0, 3).toUpperCase()}-${year}`;
          
          generatedStatements.push({
            id: monthIndex + 1,
            date,
            statementNumber: Math.floor(Math.random() * 20) + 1
          });
        }
        
        // Sort by date (newest first)
        generatedStatements.sort((a, b) => {
          const dateA = new Date(a.date.split('-').reverse().join('-'));
          const dateB = new Date(b.date.split('-').reverse().join('-'));
          return dateB.getTime() - dateA.getTime();
        });
      } else {
        // Generate only one statement for the selected month
        const monthIndex = monthNames.indexOf(selectedMonth);
        const lastDay = new Date(year, monthIndex + 1, 0).getDate();
        const date = `${lastDay.toString().padStart(2, '0')}-${selectedMonth.substring(0, 3).toUpperCase()}-${year}`;
        
        generatedStatements.push({
          id: 1,
          date,
          statementNumber: Math.floor(Math.random() * 20) + 1
        });
      }
      
      setStatements(generatedStatements);
    };

    generateStatements();
  }, [selectedMonth, selectedYear]);

  const handleDownload = (statement: StatementData) => {
    // Mock download functionality
    console.log(`Downloading statement ${statement.statementNumber} for ${statement.date}`);
    // In a real app, this would trigger a PDF download
  };

  const formatDateRange = () => {
    const year = parseInt(selectedYear);
    
    if (selectedMonth === '--') {
      // Show first day of year to last day of year
      const firstDate = `01-JAN-${year}`;
      const lastDate = `31-DEC-${year}`;
      return `${firstDate} - ${lastDate}`;
    } else {
      // Show first day of selected month to last day of selected month
      const monthNames = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
      ];
      const monthIndex = monthNames.indexOf(selectedMonth);
      const firstDay = '01';
      const lastDay = new Date(year, monthIndex + 1, 0).getDate();
      const monthAbbr = selectedMonth.substring(0, 3).toUpperCase();
      
      return `01-${monthAbbr}-${year} - ${lastDay.toString().padStart(2, '0')}-${monthAbbr}-${year}`;
    }
  };

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      backgroundColor: '#f5f5f5',
      p: 3
    }}>
      {/* Breadcrumbs */}
      <Breadcrumbs 
        separator={<ChevronRightIcon fontSize="small" />}
        sx={{ mb: 3 }}
      >
        <MuiLink 
          component={Link} 
          to="/" 
          sx={{ 
            textDecoration: 'none', 
            color: '#666',
            '&:hover': { textDecoration: 'underline' }
          }}
        >
          Home
        </MuiLink>
        <MuiLink 
          component={Link} 
          to="/accounts" 
          sx={{ 
            textDecoration: 'none', 
            color: '#666',
            '&:hover': { textDecoration: 'underline' }
          }}
        >
          Accounts
        </MuiLink>
        <MuiLink 
          component={Link} 
          to="/accounts/saveonline" 
          sx={{ 
            textDecoration: 'none', 
            color: '#666',
            '&:hover': { textDecoration: 'underline' }
          }}
        >
          DHB SaveOnline
        </MuiLink>
        <Typography color="text.primary">Download statement</Typography>
      </Breadcrumbs>

      {/* Blue Header Bar */}
      <Box sx={{
        backgroundColor: '#1e3a8a', // DHB blue color
        color: 'white',
        p: 4, // Increased padding for taller box
        mb: 0, // Remove bottom margin to connect to table
        borderRadius: '16px 16px 0 0', // Round only top edges
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        minHeight: '80px' // Ensure minimum height
      }}>
        <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
          Download statement
        </Typography>
        <Typography variant="body1" sx={{ fontWeight: 500 }}>
          {formatDateRange()}
        </Typography>
      </Box>

      {/* Statement Table Container */}
      <Paper sx={{
        backgroundColor: 'white',
        borderRadius: '0 0 16px 16px', // Round only bottom edges
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        overflow: 'hidden',
        mt: 0 // Remove top margin to connect to header
      }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: '#f8f9fa' }}>
                <TableCell sx={{ 
                  fontWeight: 'bold', 
                  color: '#333',
                  borderBottom: '2px solid #e0e0e0'
                }}>
                  DATE
                </TableCell>
                <TableCell sx={{ 
                  fontWeight: 'bold', 
                  color: '#333',
                  textAlign: 'center',
                  borderBottom: '2px solid #e0e0e0'
                }}>
                  STATEMENT NUMBER
                </TableCell>
                <TableCell sx={{ 
                  fontWeight: 'bold', 
                  color: '#333',
                  textAlign: 'right',
                  borderBottom: '2px solid #e0e0e0'
                }}>
                  ACCOUNT STATEMENT
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {statements.map((statement) => (
                <TableRow 
                  key={statement.id}
                  sx={{ 
                    '&:hover': { backgroundColor: '#f8f9fa' },
                    '&:last-child td': { borderBottom: 0 }
                  }}
                >
                  <TableCell sx={{ color: '#333' }}>
                    {statement.date}
                  </TableCell>
                  <TableCell sx={{ 
                    color: '#333',
                    textAlign: 'center'
                  }}>
                    {statement.statementNumber}
                  </TableCell>
                  <TableCell sx={{ textAlign: 'right' }}>
                    <Box sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'flex-end',
                      gap: 1
                    }}>
                      <Box sx={{
                        position: 'relative',
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        {/* PDF Icon Background */}
                        <Box sx={{
                          width: 24,
                          height: 24,
                          backgroundColor: '#1976d2',
                          borderRadius: 1,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          position: 'relative'
                        }}>
                          <Typography 
                            variant="caption" 
                            sx={{ 
                              color: 'white', 
                              fontSize: '8px',
                              fontWeight: 'bold',
                              lineHeight: 1
                            }}
                          >
                            PDF
                          </Typography>
                          {/* Download Arrow Overlay */}
                          <DownloadIcon 
                            sx={{ 
                              position: 'absolute',
                              top: -2,
                              right: -2,
                              fontSize: 12,
                              color: 'white',
                              backgroundColor: '#1976d2',
                              borderRadius: '50%',
                              p: 0.2
                            }} 
                          />
                        </Box>
                      </Box>
                      <Typography
                        component="button"
                        onClick={() => handleDownload(statement)}
                        sx={{
                          color: '#1976d2',
                          fontWeight: 500,
                          textDecoration: 'none',
                          border: 'none',
                          background: 'none',
                          cursor: 'pointer',
                          fontSize: 'inherit',
                          fontFamily: 'inherit',
                          '&:hover': {
                            textDecoration: 'underline'
                          }
                        }}
                      >
                        Download
                      </Typography>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
};

export default AccountStatement;