import React from "react";
import { useTranslation } from "react-i18next";
import {
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  Avatar,
  IconButton,
  Grid,
} from "@mui/material";
import {
  ArrowForward,
  MoreVert,
  AccountBalance,
  CreditCard,
  AccountBalanceWallet,
  Star,
  LocalOffer,
  Add,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import styled from "@emotion/styled";

// Base Widget Component
interface WidgetProps {
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
  actions?: React.ReactNode;
  onMenuClick?: () => void;
  onClick?: () => void;
}

const StyledCard = styled(Card)`
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: box-shadow 0.3s ease;
  height: 250px;
  max-width: 525px;
  margin: 0 auto;
  
  &:hover {
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
  }
`;

export const Widget: React.FC<WidgetProps> = ({ 
  title, 
  subtitle, 
  children, 
  actions, 
  onMenuClick,
  onClick
}) => {
  const widgetId = `widget-${title?.toLowerCase().replace(/\s+/g, '-') || 'untitled'}`;
  
  return (
    <StyledCard 
      role="region" 
      aria-labelledby={title ? `${widgetId}-title` : undefined}
      aria-label={title ? undefined : "Widget"}
      onClick={onClick}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={onClick ? (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick();
        }
      } : undefined}
      sx={{ cursor: onClick ? 'pointer' : 'default' }}
    >
      <CardContent sx={{ height: '100%', display: 'flex', flexDirection: 'column', p: 3 }}>
        {(title || onMenuClick) && (
          <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={3}>
            <Box flex={1}>
              {title && (
                <Typography 
                  variant="h5" 
                  fontWeight="bold" 
                  color="text.primary"
                  id={`${widgetId}-title`}
                >
                  {title}
                </Typography>
              )}
              {subtitle && (
                <Typography 
                  variant="body2" 
                  color="text.secondary" 
                  sx={{ mt: 0.5 }}
                  aria-describedby={title ? `${widgetId}-title` : undefined}
                >
                  {subtitle}
                </Typography>
              )}
            </Box>
            {onMenuClick && (
              <IconButton 
                size="medium" 
                onClick={onMenuClick}
                aria-label={`More options for ${title || 'widget'}`}
              >
                <MoreVert />
              </IconButton>
            )}
          </Box>
        )}
        
        <Box flex={1} display="flex" flexDirection="column" justifyContent="space-between">
          <Box flex={1}>
            {children}
          </Box>
          
          {actions && (
            <Box mt={3} role="group" aria-label="Widget actions" onClick={(e) => e.stopPropagation()}>
              {actions}
            </Box>
          )}
        </Box>
      </CardContent>
    </StyledCard>
  );
};

// Account Widget Component
interface AccountWidgetProps {
  accountName: string;
  accountType: string;
  balance: string;
  iban: string;
  interestRate: string;
  primaryAction?: {
    label: string;
    onClick: () => void;
    color: 'primary' | 'secondary' | 'orange';
  };
  onAccountTypeClick?: () => void;
}

const ActionButton = styled(Button)<{ customColor?: string }>`
  background: ${props => props.customColor === 'orange' ? '#FF6B35' : 'transparent'};
  color: ${props => props.customColor === 'orange' ? 'white' : '#004996'};
  text-transform: none;
  border-radius: 8px;
  padding: 12px 24px;
  width: 100%;
  font-weight: 500;
  border: ${props => props.customColor === 'orange' ? 'none' : '1px solid #004996'};
  
  &:hover {
    background: ${props => props.customColor === 'orange' ? '#e55a2b' : 'rgba(0, 73, 150, 0.1)'};
  }
`;

export const AccountWidget: React.FC<AccountWidgetProps> = ({
  accountName,
  accountType,
  balance,
  iban,
  interestRate,
  primaryAction,
  onAccountTypeClick
}) => {
  return (
    <Widget
      title={accountName}
      onMenuClick={() => console.log('Menu clicked')}
      onClick={onAccountTypeClick}
      actions={
        primaryAction ? (
          <ActionButton
            variant="contained"
            endIcon={<ArrowForward />}
            onClick={primaryAction.onClick}
            color={primaryAction.color === 'orange' ? 'primary' : primaryAction.color}
            customColor={primaryAction.color}
            fullWidth
            aria-label={`${primaryAction.label} for ${accountType} account with balance ${balance}`}
            role="button"
          >
            {primaryAction.label}
          </ActionButton>
        ) : null
      }
    >
        {/* Account Details Section */}
      <Box 
        sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
        role="region"
        aria-label={`${accountType} account details`}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography 
            variant="h3" 
            color="#004996" 
            fontWeight="bold"
            sx={{
              cursor: onAccountTypeClick ? 'pointer' : 'default',
              '&:hover': onAccountTypeClick ? {
                textDecoration: 'underline',
                opacity: 0.8
              } : {}
            }}
            onClick={onAccountTypeClick}
            role={onAccountTypeClick ? "button" : undefined}
            aria-label={onAccountTypeClick ? `View details for ${accountType} account` : undefined}
            tabIndex={onAccountTypeClick ? 0 : undefined}
            onKeyDown={onAccountTypeClick ? (e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onAccountTypeClick();
              }
            } : undefined}
          >
            {accountType}
          </Typography>
          <Typography 
            variant="h3" 
            fontWeight="bold" 
            color="text.primary"
            aria-label={`Account balance: ${balance}`}
          >
            {balance}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
          <Typography variant="body2" color="text.secondary" id={`iban-label-${iban}`}>
            IBAN Number
          </Typography>
          <Typography 
            variant="body2" 
            color="text.secondary" 
            fontWeight="medium"
            aria-labelledby={`iban-label-${iban}`}
            aria-label={`IBAN: ${iban}`}
          >
            {iban}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="body2" color="text.secondary" id={`interest-label-${iban}`}>
            Cumulative Interest Amount
          </Typography>
          <Typography 
            variant="body2" 
            color="text.secondary" 
            fontWeight="medium"
            aria-labelledby={`interest-label-${iban}`}
            aria-label={`Interest rate: ${interestRate}`}
          >
            {interestRate}
          </Typography>
        </Box>
      </Box>
    </Widget>
  );
};

// Stats Widget Component
interface StatsWidgetProps {
  title: string;
  value: string;
  subtitle: React.ReactNode;
  actions?: React.ReactNode;
  onClick?: () => void;
}

export const StatsWidget: React.FC<StatsWidgetProps> = ({
  title,
  value,
  subtitle,
  actions,
  onClick
}) => {
  return (
    <Widget
      title={title}
      onMenuClick={() => console.log('Menu clicked')}
      onClick={onClick}
      actions={actions}
    >
         {/* Combispaar section */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Typography variant="h3" color="#004996" fontWeight="bold">
          {subtitle}
        </Typography>
        <Typography variant="h3" fontWeight="bold" color="text.primary">
          {value}
        </Typography>
      </Box>
    </Widget>
  );
};

// Settings Widget Component
interface SettingsItem {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
}

interface SettingsWidgetProps {
  items: SettingsItem[];
  showAllSettings?: boolean;
}

export const SettingsWidget: React.FC<SettingsWidgetProps> = ({
  items,
  showAllSettings = true
}) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  
  const handleSettingsClick = (settingType: string) => {
    switch (settingType) {
      case 'counter-account':
        navigate('/settings/change-counter-account');
        break;
      case 'online-identification':
        navigate('/settings/online-identification');
        break;
      case 'documents':
        navigate('/settings/documents');
        break;
      case 'login-confirmation':
        navigate('/settings'); // General settings page
        break;
      case 'personal-info':
        navigate('/settings/personal-details');
        break;
      case 'all-settings':
        navigate('/settings');
        break;
      default:
        console.log(`Navigation for ${settingType} not implemented yet`);
    }
  };

  return (
    <Widget
      title={t('settings') as string}
      onMenuClick={() => console.log('Menu clicked')}
    >
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {/* Settings Grid - 3 rows, 2 columns */}
        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
          {/* Row 1 */}
          <Box 
            sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 2, 
              p: 2, 
              bgcolor: 'white', 
              borderRadius: 1, 
              border: '1px solid #e0e0e0',
              cursor: 'pointer',
              '&:hover': { bgcolor: '#f5f5f5' }
            }}
            onClick={() => handleSettingsClick('counter-account')}
            role="button"
            tabIndex={0}
            aria-label={`Navigate to ${t('settings.nav.change_counter_account')} settings`}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleSettingsClick('counter-account');
              }
            }}
          >
            <Box sx={{ 
              width: 32, 
              height: 32, 
              borderRadius: '50%', 
              bgcolor: '#e3f2fd', 
              border: '2px solid #1976d2',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Box sx={{ fontSize: 16, color: '#1976d2' }}>🔄</Box>
            </Box>
            <Typography variant="body2" sx={{ fontWeight: 500, color: 'text.primary' }}>
              {t('settings.nav.change_counter_account')}
            </Typography>
          </Box>

                    <Box 
            sx={{ 
              display: 'flex',
              alignItems: 'center', 
              gap: 2, 
              p: 2, 
              bgcolor: 'white', 
              borderRadius: 1, 
              border: '1px solid #e0e0e0',
              cursor: 'pointer',
              '&:hover': { bgcolor: '#f5f5f5' }
            }}
            onClick={() => handleSettingsClick('online-identification')}
          >
            <Box sx={{ 
              width: 32, 
              height: 32, 
              borderRadius: '50%', 
              bgcolor: '#e3f2fd', 
              border: '2px solid #1976d2',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Box sx={{ fontSize: 16, color: '#1976d2' }}>📱</Box>
            </Box>
            <Typography variant="body2" sx={{ fontWeight: 500, color: 'text.primary' }}>
              {t('update-id')}
            </Typography>
          </Box>

          {/* Row 2 */}
          <Box 
            sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 2, 
              p: 2, 
              bgcolor: 'white', 
              borderRadius: 1, 
              border: '1px solid #e0e0e0',
              cursor: 'pointer',
              '&:hover': { bgcolor: '#f5f5f5' }
            }}
            onClick={() => handleSettingsClick('documents')}
          >
            <Box sx={{ 
              width: 32, 
              height: 32, 
              borderRadius: '50%', 
              bgcolor: '#e3f2fd', 
              border: '2px solid #1976d2',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Box sx={{ fontSize: 16, color: '#1976d2' }}>📄</Box>
            </Box>
            <Typography variant="body2" sx={{ fontWeight: 500, color: 'text.primary' }}>
              {t('settings.nav.documents')}
            </Typography>
          </Box>

          <Box 
            sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 2, 
              p: 2, 
              bgcolor: 'white', 
              borderRadius: 1, 
              border: '1px solid #e0e0e0',
              cursor: 'pointer',
              '&:hover': { bgcolor: '#f5f5f5' }
            }}
            onClick={() => handleSettingsClick('login-confirmation')}
          >
            <Box sx={{ 
              width: 32, 
              height: 32, 
              borderRadius: '50%', 
              bgcolor: '#e3f2fd', 
              border: '2px solid #1976d2',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Box sx={{ fontSize: 16, color: '#1976d2' }}>🔒</Box>
            </Box>
            <Typography variant="body2" sx={{ fontWeight: 500, color: 'text.primary' }}>
              {t('login_and_confirmation')}
            </Typography>
          </Box>

          {/* Row 3 */}
          <Box 
            sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 2, 
              p: 2, 
              bgcolor: 'white', 
              borderRadius: 1, 
              border: '1px solid #e0e0e0',
              cursor: 'pointer',
              '&:hover': { bgcolor: '#f5f5f5' }
            }}
            onClick={() => handleSettingsClick('personal-info')}
          >
            <Box sx={{ 
              width: 32, 
              height: 32, 
              borderRadius: '50%', 
              bgcolor: '#e3f2fd', 
              border: '2px solid #1976d2',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Box sx={{ fontSize: 16, color: '#1976d2' }}>✏️</Box>
            </Box>
            <Typography variant="body2" sx={{ fontWeight: 500, color: 'text.primary' }}>
              {t('personal-details')}
            </Typography>
          </Box>

          {/* All settings link */}
          <Box 
            sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              gap: 1,
              p: 2,
              cursor: 'pointer',
              '&:hover': { textDecoration: 'underline' }
            }}
            onClick={() => handleSettingsClick('all-settings')}
          >
            <Typography variant="body2" sx={{ color: '#1976d2', fontWeight: 500 }}>
              {t('all_settings')}
            </Typography>
            <Box sx={{ color: '#1976d2', fontSize: 16 }}>→</Box>
          </Box>
        </Box>
      </Box>
    </Widget>
  );
};

// Chart Widget Component
interface ChartWidgetProps {
  title: string;
  filterLabel: string;
  filterValue: string;
  chartData: Array<{
    label: string;
    value: string;
    color: string;
    onClick?: () => void;
  }>;
}

export const ChartWidget: React.FC<ChartWidgetProps> = ({
  title,
  filterLabel,
  filterValue,
  chartData
}) => {
  // Calculate total value and percentages
  const totalValue = chartData.reduce((sum, item) => {
    const numericValue = parseFloat(item.value.replace(/[€,.\s]/g, '').replace(',', '.')) || 0;
    return sum + numericValue;
  }, 0);

  const calculatePercentage = (value: string) => {
    const numericValue = parseFloat(value.replace(/[€,.\s]/g, '').replace(',', '.')) || 0;
    return totalValue > 0 ? (numericValue / totalValue) * 100 : 0;
  };

  const calculateRotation = (index: number) => {
    let rotation = 0;
    for (let i = 0; i < index; i++) {
      rotation += calculatePercentage(chartData[i].value);
    }
    return rotation;
  };

  const PieChartContainer = styled(Box)`
    position: relative;
    width: 120px;
    height: 120px;
    margin: 0 auto;
  `;

  return (
    <Widget title={title}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="body2" color="text.secondary">
          {filterLabel}
        </Typography>
        <Typography variant="body2">
          {filterValue}
        </Typography>
      </Box>
      
      <Box display="flex" alignItems="center" gap={3}>
        <PieChartContainer>
          <svg width="120" height="120" viewBox="0 0 120 120">
            <circle
              cx="60"
              cy="60"
              r="50"
              fill="none"
              stroke="#e9ecef"
              strokeWidth="20"
            />
            {chartData.map((item, index) => {
              const percentage = calculatePercentage(item.value);
              if (percentage === 0) return null;
              
              const circumference = 2 * Math.PI * 50;
              const strokeDasharray = `${(percentage / 100) * circumference} ${circumference}`;
              const strokeDashoffset = -calculateRotation(index) * circumference / 100;
              
              return (
                <circle
                  key={index}
                  cx="60"
                  cy="60"
                  r="50"
                  fill="none"
                  stroke={item.color}
                  strokeWidth="20"
                  strokeDasharray={strokeDasharray}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  transform="rotate(-90 60 60)"
                />
              );
            })}
          </svg>
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <AccountBalance sx={{ color: '#6c757d', fontSize: '24px' }} />
          </Box>
        </PieChartContainer>
        
        <Box flex={1}>
          {chartData.map((item, index) => (
            <Box 
              key={index} 
              display="flex" 
              justifyContent="space-between" 
              alignItems="center" 
              mb={1}
              sx={{
                cursor: item.onClick ? 'pointer' : 'default',
                '&:hover': item.onClick ? {
                  backgroundColor: 'rgba(0, 73, 150, 0.05)',
                  borderRadius: '4px',
                  padding: '4px 8px',
                  margin: '-4px -8px'
                } : {}
              }}
              onClick={item.onClick}
            >
              <Box display="flex" alignItems="center" gap={1}>
                <Box width={12} height={12} bgcolor={item.color} borderRadius="50%" />
                <Typography 
                  variant="body2"
                  sx={{
                    color: item.onClick ? '#004996' : 'text.primary',
                    fontWeight: item.onClick ? 600 : 400,
                    '&:hover': item.onClick ? {
                      textDecoration: 'underline'
                    } : {}
                  }}
                >
                  {item.label}
                </Typography>
              </Box>
              <Typography variant="body2" fontWeight="bold">
                {item.value}
              </Typography>
            </Box>
          ))}
        </Box>
      </Box>
    </Widget>
  );
};

// Advertisement Widget Component
interface AdvertisementItem {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  bonus?: string;
  onClick: () => void;
}

interface AdvertisementWidgetProps {
  title?: string;
  subtitle?: string;
  items: AdvertisementItem[];
}

const AdvertisementCard = styled(Box)`
  background: linear-gradient(135deg, #004996 0%, #1976d2 100%);
  border-radius: 8px;
  padding: 16px;
  color: white;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  min-height: 100px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(0, 73, 150, 0.3);
  }
  
  &::before {
    content: '';
    position: absolute;
    top: -50%;
    right: -50%;
    width: 100%;
    height: 100%;
    background: radial-gradient(circle, rgba(255, 255, 255, 0.1) 0%, transparent 70%);
    pointer-events: none;
  }
`;

const BonusBadge = styled(Box)`
  background: linear-gradient(45deg, #FF6B35, #FF8A65);
  color: white;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  margin-top: 8px;
`;

export const AdvertisementWidget: React.FC<AdvertisementWidgetProps> = ({
  title = "DHB Services",
  subtitle = "Discover our exclusive offers",
  items
}) => {
  const navigate = useNavigate();

  const handleServiceClick = (item: AdvertisementItem) => {
    // Navigate to appropriate service page
    switch (item.id) {
      case 'credit-card':
        navigate('/services/credit-cards');
        break;
      case 'new-account':
        navigate('/accounts/open');
        break;
      case 'investment':
        navigate('/services/investments');
        break;
      case 'insurance':
        navigate('/services/insurance');
        break;
      default:
        console.log(`Navigation for ${item.id} not implemented yet`);
    }
  };

  return (
    <Widget
      title={title}
      subtitle={subtitle}
      onMenuClick={() => console.log('Advertisement menu clicked')}
    >
      <Box 
        sx={{ 
          display: 'flex', 
          flexDirection: 'column', 
          gap: 2,
          maxHeight: '220px',
          overflowY: 'auto',
          paddingRight: '4px',
          '&::-webkit-scrollbar': {
            width: '6px',
          },
          '&::-webkit-scrollbar-track': {
            background: 'rgba(0, 0, 0, 0.1)',
            borderRadius: '3px',
          },
          '&::-webkit-scrollbar-thumb': {
            background: 'rgba(0, 73, 150, 0.3)',
            borderRadius: '3px',
            '&:hover': {
              background: 'rgba(0, 73, 150, 0.5)',
            },
          },
          '&::-webkit-scrollbar-thumb:hover': {
            background: 'rgba(0, 73, 150, 0.5)',
          },
          // Firefox scrollbar styling
          scrollbarWidth: 'thin',
          scrollbarColor: 'rgba(0, 73, 150, 0.3) rgba(0, 0, 0, 0.1)',
        }}
      >
        {items.map((item, index) => (
          <AdvertisementCard
            key={item.id}
            onClick={() => handleServiceClick(item)}
            role="button"
            tabIndex={0}
            aria-label={`${item.title} - ${item.description}`}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleServiceClick(item);
              }
            }}
          >
            {/* Main content area */}
            <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 3, flex: 1 }}>
              <Box sx={{ 
                width: 48, 
                height: 48, 
                borderRadius: '50%', 
                bgcolor: 'rgba(255, 255, 255, 0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                {item.icon}
              </Box>
              <Box sx={{ flex: 1 }}>
                <Typography 
                  variant="h6" 
                  sx={{ 
                    fontWeight: 600, 
                    color: 'white',
                    mb: 0.5,
                    fontSize: '1rem'
                  }}
                >
                  {item.title}
                </Typography>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    color: 'rgba(255, 255, 255, 0.9)',
                    fontSize: '0.875rem',
                    lineHeight: 1.4
                  }}
                >
                  {item.description}
                </Typography>
              </Box>
              <ArrowForward sx={{ 
                color: 'rgba(255, 255, 255, 0.8)', 
                fontSize: 20,
                flexShrink: 0
              }} />
            </Box>
            
            {/* Bonus badge at bottom */}
            {item.bonus && (
              <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-start' }}>
                <BonusBadge>
                  <Star sx={{ fontSize: 14 }} />
                  {item.bonus}
                </BonusBadge>
              </Box>
            )}
          </AdvertisementCard>
        ))}
      </Box>
    </Widget>
  );
};

// Open Account Widget Component
interface OpenAccountWidgetProps {
  title?: string;
  subtitle?: string;
}

const OpenAccountButton = styled(Button)`
  background: linear-gradient(45deg, #FC9F15, #FFB74D);
  color: white;
  text-transform: none;
  border-radius: 8px;
  padding: 12px 24px;
  width: 100%;
  font-weight: 500;
  font-size: 1rem;
  box-shadow: 0 2px 8px rgba(252, 159, 21, 0.3);
  transition: all 0.3s ease;
  
  &:hover {
    background: linear-gradient(45deg, #e58a0d, #FFA726);
    box-shadow: 0 4px 12px rgba(252, 159, 21, 0.4);
    transform: translateY(-1px);
  }
`;

export const OpenAccountWidget: React.FC<OpenAccountWidgetProps> = ({
  title = "Open New Account",
  subtitle = "Start your banking journey with DHB"
}) => {
  const navigate = useNavigate();

  const handleOpenAccount = () => {
    navigate('/accounts/open');
  };

  return (
    <Widget
      title={title}
      subtitle={subtitle}
      onMenuClick={() => console.log('Open Account menu clicked')}
    >
      <Box sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        justifyContent: 'center',
        height: '100%',
        gap: 3
      }}>
        {/* Icon */}
        <Box sx={{ 
          width: 80, 
          height: 80, 
          borderRadius: '50%', 
          bgcolor: 'rgba(252, 159, 21, 0.1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          border: '2px solid rgba(252, 159, 21, 0.2)'
        }}>
          <Add sx={{ color: '#FC9F15', fontSize: 40 }} />
        </Box>
        
        {/* Description */}
        <Typography 
          variant="body1" 
          sx={{ 
            color: 'text.secondary',
            textAlign: 'center',
            lineHeight: 1.5,
            maxWidth: '200px'
          }}
        >
          Open a new savings account, term deposit, or investment account with DHB Bank.
        </Typography>
        
        {/* Action Button */}
        <OpenAccountButton
          variant="contained"
          endIcon={<ArrowForward />}
          onClick={handleOpenAccount}
          aria-label="Open new account with DHB Bank"
        >
          Open Account
        </OpenAccountButton>
      </Box>
    </Widget>
  );
};

// Support Button Component
export const SupportButton = styled(Box)`
  position: fixed;
  bottom: 24px;
  right: 24px;
  width: 56px;
  height: 56px;
  background: #28a745;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(40, 167, 69, 0.3);
  transition: all 0.3s ease;
  
  &:hover {
    transform: scale(1.1);
    box-shadow: 0 6px 16px rgba(40, 167, 69, 0.4);
  }
`;