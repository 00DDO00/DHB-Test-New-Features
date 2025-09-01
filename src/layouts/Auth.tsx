import React from "react";
import { Outlet } from "react-router-dom";
import styled from "@emotion/styled";

import { CssBaseline } from "@mui/material";

import Settings from "../components/Settings";
import GlobalStyle from "../components/GlobalStyle";

const Root = styled.div`
  max-width: 520px;
  margin: 0 auto;
  justify-content: center;
  align-items: center;
  display: flex;
  min-height: 100%;
  flex-direction: column;
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

const MainContent = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

interface AuthType {
  children?: React.ReactNode;
}

const Auth: React.FC<AuthType> = ({ children }) => {
  return (
    <Root>
      <CssBaseline />
      <GlobalStyle />
      

      <MainContent id="main-content" role="main">
        {children}
        <Outlet />
      </MainContent>
      <Settings />
    </Root>
  );
};

export default Auth;
