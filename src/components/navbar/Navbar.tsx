import React from "react";
import styled from "@emotion/styled";
import { withTheme } from "@emotion/react";
import { useTranslation } from "react-i18next";

import {
  Grid,
  AppBar as MuiAppBar,
  IconButton as MuiIconButton,
  Toolbar,
  Typography,
} from "@mui/material";

import { Menu as MenuIcon } from "@mui/icons-material";

import NavbarNotificationsDropdown from "./NavbarNotificationsDropdown";
import NavbarMessagesDropdown from "./NavbarMessagesDropdown";
import NavbarLanguagesDropdown from "./NavbarLanguagesDropdown";
import NavbarUserDropdown from "./NavbarUserDropdown";
import DhbMini from "../../assets/DhbMini";

const AppBar = styled(MuiAppBar)`
  background: ${(props) => props.theme.header.background};
  color: ${(props) => props.theme.header.color};
`;

const IconButton = styled(MuiIconButton)`
  svg {
    width: 22px;
    height: 22px;
  }
`;

const BrandIcon = styled(DhbMini)`
  margin-right: ${(props) => props.theme.spacing(2)};
  color: ${(props) => props.theme.sidebar.header.brand.color};
  fill: ${(props) => props.theme.sidebar.header.brand.color};
  width: 32px;
  height: 32px;
`;

type NavbarProps = {
  onDrawerToggle: React.MouseEventHandler<HTMLElement>;
};

const Navbar: React.FC<NavbarProps> = ({ onDrawerToggle }) => {
  const { t } = useTranslation();
  return (
    <React.Fragment>
      <AppBar position="sticky" elevation={0}>
        <Toolbar sx={{ backgroundColor: "#004996", color: "#FFFFFF" }}>
          <Grid container alignItems="center" justifyContent="space-between">
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
                  <BrandIcon />
                </Grid>
              </Grid>
            </Grid>

            {/* CENTER: Menu items */}
            <Grid item>
              <Grid container spacing={3} justifyContent="center">
                <Grid item>
                  <Typography>{t("Home")}</Typography>
                </Grid>
                <Grid item>
                  <Typography>{t("Accounts")}</Typography>
                </Grid>
                <Grid item>
                  <Typography>{t("Settings")}</Typography>
                </Grid>
                <Grid item>
                  <Typography>{t("Contacts")}</Typography>
                </Grid>
              </Grid>
            </Grid>

            {/* RIGHT: Icons / Profile */}
            <Grid item>
              <Grid container alignItems="center" spacing={1}>
                <Grid item>
                  <NavbarMessagesDropdown />
                </Grid>
                <Grid item>
                  <NavbarNotificationsDropdown />
                </Grid>
                <Grid item>
                  <NavbarLanguagesDropdown />
                </Grid>
                <Grid item>
                  <NavbarUserDropdown />
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
