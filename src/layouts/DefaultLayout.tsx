import React from "react";
import { Outlet } from "react-router-dom";
import styled from "@emotion/styled";
import { useTheme } from "@mui/material/styles";

import { spacing } from "@mui/system";

import { CssBaseline, Paper as MuiPaper, useMediaQuery } from "@mui/material";

import Settings from "../components/Settings";
import GlobalStyle from "../components/GlobalStyle";
import Navbar from "../components/navbar/Navbar";
import Footer from "../components/Footer";

const Root = styled.div`
  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
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

interface DefaultLayoutProps {
  children?: React.ReactNode;
}

const DefaultLayout: React.FC<DefaultLayoutProps> = ({ children }) => {
  const theme = useTheme();
  const isLgUp = useMediaQuery(theme.breakpoints.up("lg"));
  return (
    <Root>
      <CssBaseline />
      <GlobalStyle />
      <AppContent>
        <Navbar onDrawerToggle={() => console.log("navbar")} />
        <MainContent p={isLgUp ? 12 : 5}>
          {children}
          <Outlet />
        </MainContent>
        <Footer />
      </AppContent>
      <Settings />
    </Root>
  );
};

export default DefaultLayout;
