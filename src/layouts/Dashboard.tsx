import React, { useEffect, useState } from "react";
import styled from "@emotion/styled";
import { Outlet, useLocation } from "react-router-dom";

import { Box, CssBaseline, Paper as MuiPaper } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { spacing } from "@mui/system";

import GlobalStyle from "../components/GlobalStyle";
import Navbar from "../components/navbar/Navbar";
import Footer from "../components/Footer";

const Root = styled.div`
  display: flex;
  min-height: 100vh;
`;

const AppContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  max-width: 100%;
`;

const Paper = styled(MuiPaper)(spacing);

const MainContent = styled(Paper)`
  flex: 1;
  background: ${(props) => props.theme.palette.background.default};

  @media all and (-ms-high-contrast: none), (-ms-high-contrast: active) {
    flex: none;
  }

  .MuiPaper-root .MuiPaper-root {
    box-shadow: none;
  }
`;

const SkipLink = styled.a`
  position: fixed;
  top: -40px;
  left: 6px;
  background: #000;
  color: #fff;
  padding: 8px 16px;
  text-decoration: none;
  border-radius: 4px;
  z-index: 9999;
  font-weight: 500;
  font-size: 14px;
  transition: all 0.2s ease;
  white-space: nowrap;
  opacity: 0;
  transform: translateY(-10px);

  &:focus,
  &:focus-visible,
  &:active {
    top: 6px;
    opacity: 1;
    transform: translateY(0);
    outline: 3px solid #ff9500;
    outline-offset: 2px;
  }

  &:hover {
    background: #333;
  }
`;

interface DashboardType {
  children?: React.ReactNode;
}

const Dashboard: React.FC<DashboardType> = ({ children }) => {
  const router = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  // Close mobile menu when navigation occurs
  useEffect(() => {
    setMobileOpen(false);
  }, [router.pathname]);

  const theme = useTheme();
  const isLgUp = useMediaQuery(theme.breakpoints.up("lg"));

  return (
    <Root>
      <CssBaseline />
      <GlobalStyle />
      

      <AppContent>
        <Navbar onDrawerToggle={handleDrawerToggle} />
        <MainContent p={isLgUp ? 12 : 5} id="main-content" component="main" role="main">
          {children}
          <Outlet />
        </MainContent>
        <Footer />
      </AppContent>
    </Root>
  );
};

export default Dashboard;
