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
  Card,
  Divider,
  Backdrop,
} from "@mui/material";

import { 
  Menu as MenuIcon, 
  Search as SearchIcon,
  Mail as MailIcon,
  Person as PersonIcon,
  KeyboardArrowDown as ArrowDownIcon,
  Edit as EditIcon,
  Logout as LogoutIcon
} from "@mui/icons-material";

import NavbarNotificationsDropdown from "./NavbarNotificationsDropdown";
import NavbarMessagesDropdown from "./NavbarMessagesDropdown";
import NavbarLanguagesDropdown from "./NavbarLanguagesDropdown";
import NavbarUserDropdown from "./NavbarUserDropdown";
import MessagesPopup from "../MessagesPopup";
import { apiService, UserProfile } from "../../services/api";

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

const UserPopup = styled(Card)`
  position: fixed;
  top: 75px;
  right: 108px;
  min-width: 320px;
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  z-index: 9999;
  background: white;
`;

const PopupHeader = styled.div`
  padding: 16px 20px 12px 20px;
`;

const PopupContent = styled.div`
  padding: 16px 20px;
`;

const PopupFooter = styled.div`
  padding: 12px 20px 16px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const DetailRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const DetailLabel = styled(Typography)`
  font-size: 14px;
  color: #666;
  font-weight: 400;
`;

const DetailValue = styled(Typography)`
  font-size: 14px;
  color: #333;
  font-weight: 500;
  text-align: right;
`;

const ActionLink = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  color: #004996;
  font-size: 14px;
  font-weight: 500;
  transition: color 0.2s ease;
  
  &:hover {
    color: #003366;
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
  const [userPopupOpen, setUserPopupOpen] = React.useState(false);
  const [userProfile, setUserProfile] = React.useState<UserProfile | null>(null);
  

  
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

  // Fetch user profile data on component mount
  React.useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const profile = await apiService.getUserProfile();
        setUserProfile(profile);
      } catch (error) {
        console.error('Failed to fetch user profile:', error);
      }
    };

    fetchUserProfile();
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
      
      {/* Backdrop for user popup */}
      <Backdrop
        open={userPopupOpen}
        onClick={() => setUserPopupOpen(false)}
        sx={{
          zIndex: 9998,
          backgroundColor: 'rgba(0, 0, 0, 0.3)',
          backdropFilter: 'blur(4px)',
          top: '102px', // Start below the navbar
          height: 'calc(100vh - 102px)', // Exclude navbar height
        }}
      />
      
             {/* User Account Details Popup */}
       {userPopupOpen && userProfile && (
         <UserPopup>
           <PopupHeader>
             <Typography variant="h6" sx={{ fontWeight: 600, color: '#333', mb: 1 }}>
               {userProfile.holder_name}
             </Typography>
             <Typography variant="body2" sx={{ color: '#666' }}>
               {userProfile.email}
             </Typography>
           </PopupHeader>
           
           <Divider />
           
           <PopupContent>
             <DetailRow>
               <DetailLabel>Institution Name</DetailLabel>
               <DetailValue>{userProfile.institution_name}</DetailValue>
             </DetailRow>
             <DetailRow>
               <DetailLabel>BIC</DetailLabel>
               <DetailValue>{userProfile.bic}</DetailValue>
             </DetailRow>
             <DetailRow>
               <DetailLabel>Customer Number</DetailLabel>
               <DetailValue>{userProfile.customer_number}</DetailValue>
             </DetailRow>
             <DetailRow>
               <DetailLabel>Support Reg. Number</DetailLabel>
               <DetailValue>{userProfile.support_reg_number}</DetailValue>
             </DetailRow>
             <DetailRow>
               <DetailLabel>Last login on</DetailLabel>
               <DetailValue>{userProfile.last_login}</DetailValue>
             </DetailRow>
           </PopupContent>
           
           <Divider />
           
           <PopupFooter>
             <ActionLink>
               <EditIcon sx={{ fontSize: 16 }} />
               Edit profile
             </ActionLink>
             <ActionLink>
               <LogoutIcon sx={{ fontSize: 16 }} />
               Logout
             </ActionLink>
           </PopupFooter>
         </UserPopup>
       )}
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
                <NavLink to="/accounts" active={isActive('/accounts')}>
                  <NavText active={isActive('/accounts')}>Accounts</NavText>
                </NavLink>
                <NavLink to="/settings" active={isActive('/settings')}>
                  <NavText active={isActive('/settings')}>Settings</NavText>
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

                <Grid item sx={{ position: 'relative' }}>
                  <UserSection 
                    className="user-section"
                    onClick={() => setUserPopupOpen(!userPopupOpen)}
                  >
                    <PersonIcon />
                                         <Typography variant="body2" sx={{ color: "#FFFFFF" }}>
                       {userProfile?.holder_name || "Lucy Lavender"}
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
