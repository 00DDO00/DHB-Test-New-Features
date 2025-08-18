import React from "react";
import styled from "@emotion/styled";

import { Badge, Grid, Avatar, Typography } from "@mui/material";

import useAuth from "../../hooks/useAuth";

const Footer = styled.div`
  background-color: ${(props) => props.theme.sidebar.footer.background};
  padding: ${(props) => props.theme.spacing(2.75)} ${(props) => props.theme.spacing(4)} ${(props) => props.theme.spacing(4)};
  border-top: 1px solid ${(props) => props.theme.sidebar.footer.onlineStatus.border};
`;

const FooterBadge = styled(Badge)`
  .MuiBadge-badge {
    background-color: ${(props) => props.theme.sidebar.footer.onlineStatus.background};
    color: ${(props) => props.theme.sidebar.footer.onlineStatus.color};
    font-weight: ${(props) => props.theme.typography.fontWeightMedium};
    font-size: 11px;
    height: 20px;
    min-width: 20px;
    padding: 0 6px;
  }
`;

const FooterText = styled(Typography)`
  color: ${(props) => props.theme.sidebar.footer.color};
`;

const FooterSubText = styled(Typography)`
  color: ${(props) => props.theme.sidebar.footer.color};
  font-size: 11px;
  font-weight: ${(props) => props.theme.typography.fontWeightLight};
`;

const SidebarFooter: React.FC = ({ ...rest }) => {
  const { user } = useAuth();

  return (
    <Footer {...rest}>
      <Grid container spacing={2}>
        <Grid item>
          <FooterBadge
            overlap="circular"
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "right",
            }}
            variant="dot"
          >
            {!!user && <Avatar alt={user.displayName} src={user.avatar} />}
            {/* Demo data */}
            {!user && (
              <Avatar
                alt="Lucy Lavender"
                src="/static/img/avatars/avatar-1.jpg"
              />
            )}
          </FooterBadge>
        </Grid>
        <Grid item>
          {!!user && (
            <FooterText variant="body2">{user.displayName}</FooterText>
          )}
          {/* Demo data */}
          {!user && <FooterText variant="body2">Lucy Lavender</FooterText>}
          <FooterSubText variant="caption">UX Designer</FooterSubText>
        </Grid>
      </Grid>
    </Footer>
  );
};

export default SidebarFooter;
