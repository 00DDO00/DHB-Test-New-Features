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
  onMenuClick 
}) => {
  const widgetId = `widget-${title?.toLowerCase().replace(/\s+/g, '-') || 'untitled'}`;
  
  return (
    <StyledCard 
      role="region" 
      aria-labelledby={title ? `${widgetId}-title` : undefined}
      aria-label={title ? undefined : "Widget"}
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
            <Box mt={3} role="group" aria-label="Widget actions">
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
  primaryAction: {
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
      actions={
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
}

export const StatsWidget: React.FC<StatsWidgetProps> = ({
  title,
  value,
  subtitle,
  actions
}) => {
  return (
    <Widget
      title={title}
      onMenuClick={() => console.log('Menu clicked')}
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
      title={t('settings')}
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
  }>;
}

export const ChartWidget: React.FC<ChartWidgetProps> = ({
  title,
  filterLabel,
  filterValue,
  chartData
}) => {
  const PieChartContainer = styled(Box)`
    position: relative;
    width: 120px;
    height: 120px;
    margin: 0 auto;
    
    .pie-segment {
      position: absolute;
      width: 100%;
      height: 100%;
      border-radius: 50%;
      clip: rect(0, 60px, 120px, 0);
    }
    
    .segment-1 {
      background: #e9ecef;
      transform: rotate(0deg);
    }
    
    .segment-2 {
      background: #6c757d;
      transform: rotate(120deg);
    }
    
    .segment-3 {
      background: #adb5bd;
      transform: rotate(240deg);
    }
    
    .center-icon {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      color: #6c757d;
    }
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
          <div className="pie-segment segment-1"></div>
          <div className="pie-segment segment-2"></div>
          <div className="pie-segment segment-3"></div>
          <AccountBalance className="center-icon" />
        </PieChartContainer>
        
        <Box flex={1}>
          {chartData.map((item, index) => (
            <Box key={index} display="flex" justifyContent="space-between" alignItems="center" mb={1}>
              <Box display="flex" alignItems="center" gap={1}>
                <Box width={12} height={12} bgcolor={item.color} borderRadius="50%" />
                <Typography variant="body2">{item.label}</Typography>
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