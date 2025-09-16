import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Box, Grid, Button, Typography, CircularProgress, Breadcrumbs, Link as MuiLink } from '@mui/material';
import { Add, ArrowForward, Headset, Home as HomeIcon } from '@mui/icons-material';
import { useNavigate, Link } from 'react-router-dom';
import { AccountWidget, StatsWidget, Widget, SettingsWidget, ChartWidget, SupportButton } from '../../components/widgets';
import { apiService, Account, ChartData } from "../../services/api";
import { formatCurrency, formatInterestRate } from "../../utils/formatters";
import { DragDropContext, DropResult, Droppable } from 'react-beautiful-dnd';
import { flushSync } from 'react-dom';
import EditModeFAB from '../dashboards/Default/EditModeFAB';
import WidgetCatalog from '../dashboards/Default/WidgetCatalog';
import NativeDraggableWidget from '../dashboards/Default/NativeDraggableWidget';
import DraggableWidget from '../dashboards/Default/DraggableWidget';
import WidgetDragPreview from '../dashboards/Default/WidgetDragPreview';

const Home: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [combispaarData, setCombispaarData] = useState<{
    accounts: any[];
    total_balance: number;
    count: number;
  } | null>(null);
  const [solidExtraAccount, setSolidExtraAccount] = useState<Account | null>(null);
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [userName, setUserName] = useState("Holder name");
  const [isEditMode, setIsEditMode] = useState(false);
  const [visibleWidgets, setVisibleWidgets] = useState([
    'welcome-card',
    'accounts-card', 
    'solidextra-card',
    'combispaar-stats',
    'chart-widget'
  ]);
  const [isDragActive, setIsDragActive] = useState(false);
  const [draggedWidget, setDraggedWidget] = useState<string | null>(null);


  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch all data in parallel
        const [accountsData, combispaarData, chartData, userData, solidExtraData] = await Promise.all([
          apiService.getAccounts(),
          apiService.getCombispaarAccounts(),
          apiService.getChartData(),
          apiService.getUserInfo(),
          apiService.getMaxiSpaarPageData(), // Use same endpoint for SolidExtra
        ]);

        setAccounts(accountsData);
        setCombispaarData(combispaarData);
        setChartData(chartData);
        setUserName(userData.name);
        
        // Create SolidExtra account from the data
        const solidExtraAccountData = {
          id: 'solid-extra-001',
          name: 'DHB SolidExtra',
          type: 'solid-extra',
          balance: 25000, // Sample balance
          currency: 'EUR',
          iban: 'NL24DHBN2018470580',
          interest_rate: 1.8, // Higher interest rate for SolidExtra
          holder_name: userData.name
        };
        setSolidExtraAccount(solidExtraAccountData);
        console.log('SolidExtra account created:', solidExtraAccountData);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError(t('something-went-wrong'));
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);


  const handleToggleEditMode = () => {
    setIsEditMode(!isEditMode);
  };

  const renderAdditionalWidget = (widgetId: string, index: number) => {
    switch (widgetId) {
      case 'stats':
        return (
          <Box sx={{ flex: '0 0 calc(50% - 8px)' }}>
            {isEditMode ? (
              <DraggableWidget
                widgetId={widgetId}
                index={index}
                isEditMode={isEditMode}
              >
                <StatsWidget
                  title="Additional Stats"
                  value="€ 1,234.56"
                  subtitle="Sample Statistics"
                  actions={
                    <Button variant="outlined" size="small">
                      View Details
                    </Button>
                  }
                />
              </DraggableWidget>
            ) : (
              <StatsWidget
                title="Additional Stats"
                value="€ 1,234.56"
                subtitle="Sample Statistics"
                actions={
                  <Button variant="outlined" size="small">
                    View Details
                  </Button>
                }
              />
            )}
          </Box>
        );
      case 'line-chart':
        return (
          <Box sx={{ flex: '0 0 calc(50% - 8px)' }}>
            {isEditMode ? (
              <DraggableWidget
                widgetId={widgetId}
                index={index}
                isEditMode={isEditMode}
              >
                <ChartWidget
                  title="Line Chart"
                  filterLabel="Period"
                  filterValue="Last 6 months"
                  chartData={[
                    { label: 'Jan', value: '€ 1,000', color: '#004996' },
                    { label: 'Feb', value: '€ 1,200', color: '#004996' },
                    { label: 'Mar', value: '€ 1,100', color: '#004996' },
                    { label: 'Apr', value: '€ 1,300', color: '#004996' },
                    { label: 'May', value: '€ 1,250', color: '#004996' },
                    { label: 'Jun', value: '€ 1,400', color: '#004996' }
                  ]}
                />
              </DraggableWidget>
            ) : (
              <ChartWidget
                title="Line Chart"
                filterLabel="Period"
                filterValue="Last 6 months"
                chartData={[
                  { label: 'Jan', value: '€ 1,000', color: '#004996' },
                  { label: 'Feb', value: '€ 1,200', color: '#004996' },
                  { label: 'Mar', value: '€ 1,100', color: '#004996' },
                  { label: 'Apr', value: '€ 1,300', color: '#004996' },
                  { label: 'May', value: '€ 1,250', color: '#004996' },
                  { label: 'Jun', value: '€ 1,400', color: '#004996' }
                ]}
              />
            )}
          </Box>
        );
      case 'bar-chart':
        return (
          <Box sx={{ flex: '0 0 calc(50% - 8px)' }}>
            {isEditMode ? (
              <DraggableWidget
                widgetId={widgetId}
                index={index}
                isEditMode={isEditMode}
              >
                <ChartWidget
                  title="Bar Chart"
                  filterLabel="Category"
                  filterValue="All categories"
                  chartData={[
                    { label: 'Savings', value: '€ 5,000', color: '#FF6B35' },
                    { label: 'Investments', value: '€ 3,000', color: '#004996' },
                    { label: 'Checking', value: '€ 2,000', color: '#28a745' }
                  ]}
                />
              </DraggableWidget>
            ) : (
              <ChartWidget
                title="Bar Chart"
                filterLabel="Category"
                filterValue="All categories"
                chartData={[
                  { label: 'Savings', value: '€ 5,000', color: '#FF6B35' },
                  { label: 'Investments', value: '€ 3,000', color: '#004996' },
                  { label: 'Checking', value: '€ 2,000', color: '#28a745' }
                ]}
              />
            )}
          </Box>
        );
      case 'doughnut-chart':
        return (
          <Box sx={{ flex: '0 0 calc(50% - 8px)' }}>
            {isEditMode ? (
              <DraggableWidget
                widgetId={widgetId}
                index={index}
                isEditMode={isEditMode}
              >
                <ChartWidget
                  title="Doughnut Chart"
                  filterLabel="Portfolio"
                  filterValue="Current allocation"
                  chartData={[
                    { label: 'Stocks', value: '60%', color: '#004996' },
                    { label: 'Bonds', value: '30%', color: '#FF6B35' },
                    { label: 'Cash', value: '10%', color: '#28a745' }
                  ]}
                />
              </DraggableWidget>
            ) : (
              <ChartWidget
                title="Doughnut Chart"
                filterLabel="Portfolio"
                filterValue="Current allocation"
                chartData={[
                  { label: 'Stocks', value: '60%', color: '#004996' },
                  { label: 'Bonds', value: '30%', color: '#FF6B35' },
                  { label: 'Cash', value: '10%', color: '#28a745' }
                ]}
              />
            )}
          </Box>
        );
      case 'table':
        return (
          <Box sx={{ flex: '0 0 calc(50% - 8px)' }}>
            {isEditMode ? (
              <DraggableWidget
                widgetId={widgetId}
                index={index}
                isEditMode={isEditMode}
              >
                <Widget
                  title="Data Table"
                  onMenuClick={() => console.log('Table menu clicked')}
                >
                  <Box sx={{ p: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      Sample table data would go here
                    </Typography>
                  </Box>
                </Widget>
              </DraggableWidget>
            ) : (
              <Widget
                title="Data Table"
                onMenuClick={() => console.log('Table menu clicked')}
              >
                <Box sx={{ p: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    Sample table data would go here
                  </Typography>
                </Box>
              </Widget>
            )}
          </Box>
        );
      default:
        return null;
    }
  };

  const handleWidgetReorder = (result: DropResult) => {
    console.log('Drag result:', result);
    
    if (!result.destination) {
      console.log('No destination, drag cancelled');
      return;
    }
    
    // Handle dropping from dashboard to catalog (removal)
    if (result.source.droppableId === 'dashboard' && result.destination.droppableId === 'catalog') {
      const widgetId = result.draggableId;
      console.log('Removing widget:', widgetId);
      setVisibleWidgets(prev => {
        const newWidgets = prev.filter(id => id !== widgetId);
        console.log('Updated visible widgets after removal:', newWidgets);
        return newWidgets;
      });
      return;
    }

    // Handle dropping from catalog to dashboard (addition)
    if (result.source.droppableId === 'catalog' && result.destination?.droppableId === 'dashboard') {
      const widgetId = result.draggableId;
      console.log('Adding widget:', widgetId, 'to position:', result.destination.index);
      
      setVisibleWidgets(prev => {
        if (!prev.includes(widgetId)) {
          const newWidgets = [...prev];
          newWidgets.splice(result.destination!.index, 0, widgetId);
          console.log('New visible widgets after addition:', newWidgets);
          return newWidgets;
        }
        return prev;
      });
      return;
    }

    // Handle reordering within dashboard
    if (result.source.droppableId === 'dashboard' && result.destination?.droppableId === 'dashboard') {
      setVisibleWidgets(prev => {
        const newWidgets = Array.from(prev);
        const [reorderedWidget] = newWidgets.splice(result.source.index, 1);
        newWidgets.splice(result.destination!.index, 0, reorderedWidget);
        console.log('Reordered widgets within dashboard:', newWidgets);
        return newWidgets;
      });
    }
  };

  if (loading) {
    return (
      <Box sx={{ p: 3, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography color="error" variant="h6">
          {error}
        </Typography>
      </Box>
    );
  }

  // Find specific accounts
  const saveOnlineAccount = accounts.find(acc => acc.name === "DHB SaveOnline");
  const maxiSpaarAccount = accounts.find(acc => acc.name === "DHB MaxiSpaar");



  // Native drag handlers
  const handleNativeDragStart = (widgetId: string, event: React.DragEvent) => {
    console.log('Native drag start:', widgetId);
    setIsDragActive(true);
    setDraggedWidget(widgetId);
  };

  const handleNativeDragEnd = (widgetId: string, event: React.DragEvent) => {
    console.log('Native drag end:', widgetId);
    setIsDragActive(false);
    setDraggedWidget(null);
    
    // Force cleanup of any stuck drag previews
    setTimeout(() => {
      setIsDragActive(false);
      setDraggedWidget(null);
    }, 100);
  };

  const handleNativeDrop = (event: React.DragEvent) => {
    event.preventDefault();
    const widgetId = event.dataTransfer.getData('text/plain');
    console.log('Native drop on catalog:', widgetId);
    console.log('Current visibleWidgets before removal:', visibleWidgets);
    
    // Remove widget from dashboard
    setVisibleWidgets(prev => {
      const newWidgets = prev.filter(id => id !== widgetId);
      console.log('New visibleWidgets after removal:', newWidgets);
      return newWidgets;
    });
    
    // Force cleanup of drag state
    setIsDragActive(false);
    setDraggedWidget(null);
  };

  const handleNativeDragOver = (event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  };

  const handleDragStart = (start: any) => {
    setIsDragActive(true);
    // Only set dragged widget if it's from catalog
    if (start.source.droppableId === 'catalog') {
      setDraggedWidget(start.draggableId);
    }
  };

  const handleDragEnd = (result: DropResult) => {
    handleWidgetReorder(result);
    setIsDragActive(false);
    setDraggedWidget(null);
  };

  return (
    <DragDropContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <Box 
        sx={{ 
          p: 1
        }}
      >
      {/* Main page heading - hidden visually but available to screen readers */}
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
        Dashboard - {t('welcome')} {userName}
      </Typography>
      
      {/* Breadcrumbs */}
      <Breadcrumbs sx={{ mb: 3 }} aria-label="breadcrumb navigation">
        <MuiLink
          component="span"
          sx={{ 
            display: 'flex', 
            alignItems: 'center',
            color: '#004996',
            fontWeight: 600,
          }}
        >
          <HomeIcon sx={{ mr: 0.5, fontSize: 20 }} />
          {t('home')}
        </MuiLink>
      </Breadcrumbs>
      
        <Droppable droppableId="dashboard" direction="vertical">
          {(provided, snapshot) => (
            <Box 
              ref={provided.innerRef}
              {...provided.droppableProps}
              sx={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '16px',
                paddingLeft: '80px',
                paddingRight: '80px',
                maxWidth: '1200px',
                margin: '0 auto',
                minHeight: '200px',
                backgroundColor: snapshot.isDraggingOver ? 'rgba(0, 73, 150, 0.05)' : 'transparent',
                borderRadius: '8px',
                transition: 'background-color 0.2s ease'
              }}
            >
        {/* Account Overview Section */}
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
          Account Overview
        </Typography>
        
        {/* Welcome Card - DHB SaveOnline */}
        {visibleWidgets.includes('welcome-card') && (
          <Box sx={{ flex: '0 0 calc(50% - 8px)' }} role="complementary" aria-label="Primary account summary">
            <NativeDraggableWidget
              widgetId="welcome-card"
              isEditMode={isEditMode}
              onDragStart={handleNativeDragStart}
              onDragEnd={handleNativeDragEnd}
            >
              <AccountWidget
                accountName={`${t('welcome')}, ${userName}`}
                accountType={t('saveOnline')}
                balance={saveOnlineAccount ? formatCurrency(saveOnlineAccount.balance) : "€ --.---,--"}
                iban={saveOnlineAccount?.iban || "NL24DHBN2018470578"}
                interestRate={saveOnlineAccount ? formatInterestRate(saveOnlineAccount.interest_rate) : "1.1%"}
                primaryAction={{
                  label: "Make Transfer",
                  onClick: () => navigate('/accounts'),
                  color: 'orange'
                }}
                onAccountTypeClick={() => navigate('/accounts')}
              />
            </NativeDraggableWidget>
          </Box>
        )}

        {/* Accounts Card - DHB MaxiSpaar */}
        {visibleWidgets.includes('accounts-card') && (
          <Box sx={{ flex: '0 0 calc(50% - 8px)' }} role="complementary" aria-label="MaxiSpaar account summary">
            <NativeDraggableWidget
              widgetId="accounts-card"
              isEditMode={isEditMode}
              onDragStart={handleNativeDragStart}
              onDragEnd={handleNativeDragEnd}
            >
              <AccountWidget
                accountName={t('accounts.title')}
                accountType={t('maxiSpaar')}
                balance={maxiSpaarAccount ? formatCurrency(maxiSpaarAccount.balance) : "€ --.---,--"}
                iban={maxiSpaarAccount?.iban || "NL24DHBN2018470579"}
                interestRate={maxiSpaarAccount ? formatInterestRate(maxiSpaarAccount.interest_rate) : "1.1%"}
                primaryAction={{
                  label: "Open account",
                  onClick: () => navigate('/accounts/maxispaar'),
                  color: 'primary'
                }}
                onAccountTypeClick={() => navigate('/accounts/maxispaar')}
              />
            </NativeDraggableWidget>
          </Box>
        )}

        {/* SolidExtra Account Card */}
        {visibleWidgets.includes('solidextra-card') && (
          <Box sx={{ flex: '0 0 calc(50% - 8px)' }} role="complementary" aria-label="SolidExtra account summary">
            <NativeDraggableWidget
              widgetId="solidextra-card"
              isEditMode={isEditMode}
              onDragStart={handleNativeDragStart}
              onDragEnd={handleNativeDragEnd}
            >
              <AccountWidget
                accountName={t('solidExtra') || 'DHB SolidExtra'}
                accountType={t('solidExtra') || 'SolidExtra'}
                balance={solidExtraAccount ? formatCurrency(solidExtraAccount.balance) : "€ --.---,--"}
                iban={solidExtraAccount?.iban || "NL24DHBN2018470580"}
                interestRate={solidExtraAccount ? formatInterestRate(solidExtraAccount.interest_rate) : "1.8%"}
                primaryAction={{
                  label: "Open account",
                  onClick: () => navigate('/accounts/solidextra'),
                  color: 'primary'
                }}
                onAccountTypeClick={() => navigate('/accounts/solidextra')}
              />
            </NativeDraggableWidget>
          </Box>
        )}

        {/* Combispaar Accounts Card */}
        {visibleWidgets.includes('combispaar-stats') && (
          <Box sx={{ flex: '0 0 calc(50% - 8px)' }}>
            <NativeDraggableWidget
              widgetId="combispaar-stats"
              isEditMode={isEditMode}
              onDragStart={handleNativeDragStart}
              onDragEnd={handleNativeDragEnd}
            >
              <StatsWidget
                title={`You have ${combispaarData?.count || 5} ${t('combiSpaar')}`}
                value={combispaarData && combispaarData.total_balance !== undefined ? formatCurrency(combispaarData.total_balance) : "€ --.---,--"}
                subtitle={
                  <Typography 
                    variant="h3" 
                    color="#004996" 
                    fontWeight="bold"
                    sx={{
                      cursor: 'pointer',
                      '&:hover': {
                        textDecoration: 'underline',
                        opacity: 0.8
                      }
                }}
                onClick={() => navigate('/accounts/combispaar/dashboard')}
              >
                {`Total ${t('combiSpaar')} Balances`}
                  </Typography>
                }
                actions={
                  <Box display="flex" gap={1}>
                    <Button
                      variant="contained"
                      endIcon={<ArrowForward />}
                      onClick={() => navigate('/accounts/saveonline')}
                      sx={{
                        background: '#FF6B35',
                        color: 'white',
                        textTransform: 'none',
                        borderRadius: '8px',
                        padding: '12px 24px',
                        flex: 1,
                        fontWeight: 500,
                        '&:hover': { background: '#e55a2b' }
                      }}
                    >
                      {t('payments.title')}
                    </Button>
                    <Button
                      variant="outlined"
                      endIcon={<Add />}
                      onClick={() => navigate('/accounts/combispaar/dashboard')}
                      sx={{
                        background: 'transparent',
                        color: '#004996',
                        border: '1px solid #004996',
                        textTransform: 'none',
                        borderRadius: '8px',
                        padding: '12px 24px',
                        flex: 1,
                        fontWeight: 500,
                        '&:hover': { 
                          background: 'rgba(0, 73, 150, 0.1)',
                          border: '1px solid #004996'
                        }
                      }}
                    >
                      {t('accounts.open-account')}
                    </Button>
                  </Box>
                }
              />
            </NativeDraggableWidget>
          </Box>
        )}

        {/* Quick Actions Section */}
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
          Quick Actions
        </Typography>
        

        {/* Financial Overview Section */}
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
          Financial Overview
        </Typography>
        
        {/* Financial Overview Card */}
        {visibleWidgets.includes('chart-widget') && (
          <Box sx={{ flex: '0 0 calc(50% - 8px)' }}>
            <NativeDraggableWidget
              widgetId="chart-widget"
              isEditMode={isEditMode}
              onDragStart={handleNativeDragStart}
              onDragEnd={handleNativeDragEnd}
            >
              <ChartWidget
                title={t('accounts')}
                filterLabel="Filter"
                filterValue="last year"
                chartData={chartData.map(item => ({
                  label: item.label,
                  value: formatCurrency(item.value),
                  color: item.color
                }))}
              />
            </NativeDraggableWidget>
          </Box>
        )}
        
        {/* Render additional widgets that were added from catalog */}
        {visibleWidgets
          .filter(widgetId => !['welcome-card', 'accounts-card', 'solidextra-card', 'combispaar-stats', 'chart-widget'].includes(widgetId))
          .map((widgetId, index) => {
            const actualIndex = visibleWidgets.indexOf(widgetId);
            return (
              <React.Fragment key={widgetId}>
                {renderAdditionalWidget(widgetId, actualIndex)}
              </React.Fragment>
            );
          })}
        
              {provided.placeholder}
            </Box>
          )}
        </Droppable>
      </Box>

      {/* Support Button */}
      <SupportButton
        role="button"
        aria-label="Contact customer support"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            // Add support action here
            console.log('Support clicked');
          }
        }}
      >
        <Headset aria-hidden="true" />
      </SupportButton>

      <EditModeFAB
        isEditMode={isEditMode}
        onToggleEditMode={handleToggleEditMode}
      />

              <WidgetCatalog
                isOpen={isEditMode}
                onClose={() => setIsEditMode(false)}
                usedWidgets={visibleWidgets}
                isDragActive={isDragActive}
                onNativeDrop={handleNativeDrop}
                onNativeDragOver={handleNativeDragOver}
              />

      <WidgetDragPreview 
        widgetId={draggedWidget || ''} 
        isDragging={!!draggedWidget && isDragActive} 
      />
    </DragDropContext>
  );
};

export default Home;
