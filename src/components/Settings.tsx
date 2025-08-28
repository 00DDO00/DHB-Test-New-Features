import React, { useState } from "react";
import styled from "@emotion/styled";
import { css } from "@emotion/react";
import { Link } from "react-router-dom";

import { green, grey, indigo } from "@mui/material/colors";
import { Palette as PaletteIcon } from "@mui/icons-material";
import {
  Alert,
  Box,
  Button,
  Drawer,
  Fab as MuiFab,
  Grid,
  ListItemButton,
  Typography,
} from "@mui/material";

import useTheme from "../hooks/useTheme";

type DemoButtonType = {
  active?: boolean;
};

const DemoButton = styled.div<DemoButtonType>`
  cursor: pointer;
  background: ${(props) => props.theme.palette.background.paper};
  height: 80px;
  border-radius: 0.3rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.825rem;
  position: relative;
  border: 1px solid
    ${(props) =>
      !props.active
        ? props.theme.palette.action.selected
        : props.theme.palette.action.active};
`;

type DemoButtonInnerType = {
  selectedTheme: string;
};

const DemoButtonInner = styled.div<DemoButtonInnerType>`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  box-shadow: 0 0 0 1px ${(props) => props.theme.palette.action.selected};
  position: relative;

  background: linear-gradient(-45deg, #004996 50%, ${grey[100]} 0);
`;

const DemoTitle = styled(Typography)`
  text-align: center;
`;

const Fab = styled(MuiFab)`
  position: fixed;
  right: ${(props) => props.theme.spacing(8)};
  bottom: ${(props) => props.theme.spacing(8)};
  z-index: 1;
`;

const Wrapper = styled.div`
  width: 258px;
  overflow-x: hidden;
`;

const Heading = styled(ListItemButton)`
  font-size: ${(props) => props.theme.typography.h5.fontSize};
  font-weight: ${(props) => props.theme.typography.fontWeightMedium};
  font-family: ${(props) => props.theme.typography.fontFamily};
  min-height: 56px;

  ${(props) => props.theme.breakpoints.up("sm")} {
    min-height: 64px;
  }
`;

type DemoTypes = {
  title: string;
  themeVariant: string;
};

function Demo({ title, themeVariant }: DemoTypes) {
  const { theme, setTheme } = useTheme();

  return (
    <Grid item xs={6}>
      <DemoButton
        active={themeVariant === theme}
        onClick={() => setTheme(themeVariant)}
      >
        <DemoButtonInner selectedTheme={themeVariant} />
      </DemoButton>
      <DemoTitle variant="subtitle2" gutterBottom>
        {title}
      </DemoTitle>
    </Grid>
  );
}

function Demos() {
  return (
    <Wrapper>
      <Heading>DHB Dashboard</Heading>

      <Box px={4} my={3}>
        <Alert icon={false} severity="info">
          <strong>DHB Dashboard</strong> Welcome to the DHB Banking Dashboard.
        </Alert>
      </Box>

      <Box px={4} my={3}>
        <Grid container spacing={3}>
          <Demo title="Default" themeVariant="DEFAULT" />
        </Grid>
      </Box>


    </Wrapper>
  );
}

function Settings() {
  const [state, setState] = useState({
    isOpen: false,
  });

  const toggleDrawer = (open: boolean) => () => {
    setState({ ...state, isOpen: open });
  };

  return (
    <React.Fragment>
      <Fab color="primary" aria-label="Edit" onClick={toggleDrawer(true)}>
        <PaletteIcon />
      </Fab>
      <Drawer anchor="right" open={state.isOpen} onClose={toggleDrawer(false)}>
        <Demos />
      </Drawer>
    </React.Fragment>
  );
}

export default Settings;
