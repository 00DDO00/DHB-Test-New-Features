import React from "react";
import styled from "@emotion/styled";
import { withTheme } from "@emotion/react";
import { useTranslation } from "react-i18next";
import { useLocation, Link } from "react-router-dom";

import {
  Grid,
  AppBar as MuiAppBar,
  IconButton as MuiIconButton,
  Toolbar,
  Typography,
  Badge,
  Box,
} from "@mui/material";

import { 
  Menu as MenuIcon, 
  Search as SearchIcon,
  Mail as MailIcon,
  Person as PersonIcon,
  KeyboardArrowDown as ArrowDownIcon
} from "@mui/icons-material";

import NavbarNotificationsDropdown from "./NavbarNotificationsDropdown";
import NavbarMessagesDropdown from "./NavbarMessagesDropdown";
import NavbarLanguagesDropdown from "./NavbarLanguagesDropdown";
import NavbarUserDropdown from "./NavbarUserDropdown";
import MessagesPopup from "../MessagesPopup";
import { apiService } from "../../services/api";

// Import the logo image
import dhbLogo from "../../assets/dhb-white.png";

const AppBar = styled(MuiAppBar)`
  background: #004996;
  color: #FFFFFF;
  box-shadow: none;
`;

const IconButton = styled(MuiIconButton)`
  svg {
    width: 22px;
    height: 22px;
  }
`;

const LogoImage = styled.img`
  width: 82px;
  height: 62px;
  margin-right: ${(props) => props.theme.spacing(2)};
`;

const NavLink = styled(Link)<{ active?: boolean }>`
  color: #FFFFFF;
  text-decoration: none;
  padding: 8px 16px;
  border-radius: 4px;
  transition: all 0.2s ease;
  position: relative;
  background: ${props => props.active ? 'rgba(252, 159, 21, 0.1)' : 'transparent'};
  
  &:hover {
    background: ${props => props.active ? 'rgba(252, 159, 21, 0.15)' : 'rgba(255, 255, 255, 0.1)'};
  }
`;

const NavText = styled(Typography)<{ active?: boolean }>`
  font-family: Inter, sans-serif;
  font-weight: ${props => props.active ? 700 : 400};
  font-style: ${props => props.active ? 'Bold' : 'Regular'};
  font-size: 18px;
  line-height: 28px;
  letter-spacing: -0.26px;
  text-align: center;
  color: ${props => props.active ? '#FC9F15' : '#FFFFFF'};
  margin: 0;
  padding: 0;
`;

const UserSection = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 4px;
  transition: background 0.2s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }
`;

type NavbarProps = {
  onDrawerToggle: React.MouseEventHandler<HTMLElement>;
};

const Navbar: React.FC<NavbarProps> = ({ onDrawerToggle }) => {
  const { t } = useTranslation();
  const location = useLocation();
  const [messagesOpen, setMessagesOpen] = React.useState(false);
  const [totalMessageCount, setTotalMessageCount] = React.useState(9);
  const [messagesSeen, setMessagesSeen] = React.useState(false);
  const [lastSeenCount, setLastSeenCount] = React.useState(9);
  
  // Load saved state from localStorage on component mount
  React.useEffect(() => {
    try {
      const savedState = localStorage.getItem('dhb-notification-state');
      if (savedState) {
        const parsed = JSON.parse(savedState);
        setTotalMessageCount(parsed.totalMessageCount || 9);
        setMessagesSeen(parsed.messagesSeen || false);
        setLastSeenCount(parsed.lastSeenCount || 9);
      }
    } catch (error) {
      console.error('Failed to load notification state from localStorage:', error);
    }
  }, []);
  
  // Save state to localStorage whenever it changes
  const saveStateToStorage = React.useCallback(() => {
    try {
      const stateToSave = {
        totalMessageCount,
        messagesSeen,
        lastSeenCount,
        timestamp: new Date().toISOString()
      };
      localStorage.setItem('dhb-notification-state', JSON.stringify(stateToSave));
    } catch (error) {
      console.error('Failed to save notification state to localStorage:', error);
    }
  }, [totalMessageCount, messagesSeen, lastSeenCount]);
  
  // Save state whenever relevant values change
  React.useEffect(() => {
    saveStateToStorage();
  }, [saveStateToStorage]);
  
  // Calculate unread count (new messages since last seen)
  const unreadCount = totalMessageCount - lastSeenCount;
  
  // Function to update notification count
  const updateNotificationCount = React.useCallback(async () => {
    try {
      const response = await apiService.getMessages();
      setTotalMessageCount(response.new_count);
    } catch (error) {
      console.error('Failed to update notification count:', error);
    }
  }, []);
  
  // Function to handle messages popup refresh
  const handleMessagesRefresh = () => {
    updateNotificationCount();
  };
  
  // Function to handle envelope click
  const handleEnvelopeClick = () => {
    setMessagesOpen(true);
    setMessagesSeen(true); // Mark messages as seen
    setLastSeenCount(totalMessageCount); // Store the current count when seen
  };
  
  // Update notification count on component mount and when messages popup opens
  React.useEffect(() => {
    updateNotificationCount();
  }, [updateNotificationCount]);
  
  // Update notification count when messages popup opens
  React.useEffect(() => {
    if (messagesOpen) {
      updateNotificationCount();
    }
  }, [messagesOpen, updateNotificationCount]);
  
  // Reset seen status when new messages arrive (count increases)
  React.useEffect(() => {
    if (totalMessageCount > lastSeenCount) { // If we have more messages than when last seen
      setMessagesSeen(false); // Mark as unseen again
    }
  }, [totalMessageCount, lastSeenCount]);
  
  // Expose functions globally for console testing
  React.useEffect(() => {
    (window as any).refreshNotificationCount = updateNotificationCount;
    (window as any).clearNotificationState = () => {
      localStorage.removeItem('dhb-notification-state');
      setTotalMessageCount(9);
      setMessagesSeen(false);
      setLastSeenCount(9);
    };
    (window as any).getNotificationState = () => {
      const saved = localStorage.getItem('dhb-notification-state');
      return saved ? JSON.parse(saved) : null;
    };
    
    return () => {
      delete (window as any).refreshNotificationCount;
      delete (window as any).clearNotificationState;
      delete (window as any).getNotificationState;
    };
  }, [updateNotificationCount]);
  
  // Add polling to automatically update count every 5 seconds
  React.useEffect(() => {
    const interval = setInterval(() => {
      updateNotificationCount();
    }, 5000); // Check every 5 seconds
    
    return () => clearInterval(interval);
  }, [updateNotificationCount]);
  
  const isActive = (path: string) => {
    if (path === '/private') {
      return location.pathname === '/private' || location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <React.Fragment>
      <MessagesPopup 
        open={messagesOpen} 
        onClose={() => setMessagesOpen(false)}
        onRefresh={handleMessagesRefresh}
      />
      <AppBar position="sticky" elevation={0}>
        <Toolbar sx={{ backgroundColor: "#004996", color: "#FFFFFF", minHeight: "102px", height: "102px", py: "20px", px: "108px" }} disableGutters>
          <Grid container alignItems="center" justifyContent="space-between" wrap="nowrap">
            {/* LEFT: Toggler + Brand */}
            <Grid item>
              <Grid container alignItems="center" spacing={1}>
                <Grid item sx={{ display: { xs: "block", md: "none" } }}>
                  <IconButton
                    color="inherit"
                    aria-label="Open drawer"
                    onClick={onDrawerToggle}
                    size="large"
                  >
                    <MenuIcon />
                  </IconButton>
                </Grid>
                <Grid item>
                  <LogoImage 
                    src={dhbLogo}
                    alt="DHB BANK"
                    onError={(e) => {
                      // Fallback to text if image fails to load
                      e.currentTarget.style.display = 'none';
                      const nextSibling = e.currentTarget.nextSibling as HTMLElement;
                      if (nextSibling) {
                        nextSibling.style.display = 'block';
                      }
                    }}
                  />
                  <Typography 
                    variant="h6" 
                    sx={{ 
                      fontWeight: 600, 
                      color: "#FFFFFF",
                      display: 'none' // Hidden by default, shown as fallback
                    }}
                  >
                    DHB BANK
                  </Typography>
                </Grid>
              </Grid>
            </Grid>

            {/* CENTER: Menu items */}
            <Grid item>
              <Box 
                sx={{ 
                  width: '397px',
                  height: '28px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '1px'
                }}
              >
                <NavLink to="/private" active={isActive('/private')}>
                  <NavText active={isActive('/private')}>Home</NavText>
                </NavLink>
                <NavLink to="/dashboard/analytics" active={isActive('/dashboard')}>
                  <NavText active={isActive('/dashboard')}>Accounts</NavText>
                </NavLink>
                <NavLink to="/pages/settings" active={isActive('/pages/settings')}>
                  <NavText active={isActive('/pages/settings')}>Settings</NavText>
                </NavLink>
                <NavLink to="/pages/profile" active={isActive('/pages/profile')}>
                  <NavText active={isActive('/pages/profile')}>Contact</NavText>
                </NavLink>
              </Box>
            </Grid>

            {/* RIGHT: Icons / Profile */}
            <Grid item>
              <Grid container alignItems="center" spacing={1}>
                <Grid item>
                  <IconButton color="inherit" size="large">
                    <SearchIcon />
                  </IconButton>
                </Grid>
                                 <Grid item>
                   <IconButton 
                     color="inherit" 
                     size="large"
                     onClick={handleEnvelopeClick}
                   >
                                           <Badge 
                        badgeContent={messagesSeen ? null : unreadCount} 
                        color="error"
                      >
                       <MailIcon />
                     </Badge>
                   </IconButton>
                 </Grid>

                <Grid item>
                  <UserSection>
                    <PersonIcon />
                    <Typography variant="body2" sx={{ color: "#FFFFFF" }}>
                      Lucy Lavender
                    </Typography>
                    <ArrowDownIcon />
                  </UserSection>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Toolbar>
      </AppBar>
    </React.Fragment>
  );
};

export default withTheme(Navbar);
