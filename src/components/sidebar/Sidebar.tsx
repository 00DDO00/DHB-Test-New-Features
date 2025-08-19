import React from "react";
import styled from "@emotion/styled";
import { NavLink } from "react-router-dom";

import { green } from "@mui/material/colors";

import { Box, Chip, ListItemButton, IconButton } from "@mui/material";
import { ChevronLeft } from "@mui/icons-material";

import { ReactComponent as Logo } from "../../vendor/logo.svg";
import { SidebarItemsType } from "../../types/sidebar";
import Footer from "./SidebarFooter";
import SidebarNav from "./SidebarNav";

const Brand = styled(ListItemButton)<{
  component?: React.ReactNode;
  to?: string;
}>`
  font-size: ${(props) => props.theme.typography.h5.fontSize};
  font-weight: ${(props) => props.theme.typography.fontWeightMedium};
  color: ${(props) => props.theme.sidebar.header.color};
  background-color: ${(props) => props.theme.sidebar.header.background};
  font-family: ${(props) => props.theme.typography.fontFamily};
  min-height: 56px;
  padding-left: ${(props) => props.theme.spacing(6)};
  padding-right: ${(props) => props.theme.spacing(6)};
  justify-content: center;
  cursor: pointer;
  flex-grow: 0;
  position: relative;

  ${(props) => props.theme.breakpoints.up("sm")} {
    min-height: 64px;
  }

  &:hover {
    background-color: ${(props) => props.theme.sidebar.header.background};
  }
`;

const BrandIcon = styled(Logo)`
  margin-right: ${(props) => props.theme.spacing(2)};
  color: ${(props) => props.theme.sidebar.header.brand.color};
  fill: ${(props) => props.theme.sidebar.header.brand.color};
  width: 32px;
  height: 32px;
`;

const BrandChip = styled(Chip)`
  background-color: ${green[700]};
  border-radius: 5px;
  color: ${(props) => props.theme.palette.common.white};
  font-size: 55%;
  height: 18px;
  margin-left: 2px;
  margin-top: -16px;
  padding: 3px 0;

  span {
    padding-left: ${(props) => props.theme.spacing(1.375)};
    padding-right: ${(props) => props.theme.spacing(1.375)};
  }
`;

const CollapseButton = styled(IconButton)`
  position: absolute;
  top: 16px;
  right: -12px;
  background: #004996;
  color: white;
  width: 24px;
  height: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  z-index: 1200;
  
  &:hover {
    background: #003d7a;
  }
  
  svg {
    width: 16px;
    height: 16px;
  }
`;

export type SidebarProps = {
  PaperProps: {
    style: {
      width: number;
    };
  };
  variant?: "permanent" | "persistent" | "temporary";
  open?: boolean;
  onClose?: () => void;
  onToggle?: () => void;
  items: {
    title: string;
    pages: SidebarItemsType[];
  }[];
  showFooter?: boolean;
};

const Sidebar: React.FC<SidebarProps> = ({
  items,
  showFooter = true,
  onToggle,
  ...rest
}) => {
  return (
    <Box>
      <Brand component={NavLink as any} to="/">
        <BrandIcon />{" "}
        <Box ml={1}>
          Mira <BrandChip label="PRO" />
        </Box>
        {onToggle && (
          <CollapseButton
            onClick={onToggle}
            aria-label="collapse sidebar"
          >
            <ChevronLeft />
          </CollapseButton>
        )}
      </Brand>
      <SidebarNav items={items} />
      {!!showFooter && <Footer />}
    </Box>
  );
};

export default Sidebar;
