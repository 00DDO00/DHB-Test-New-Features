import React from "react";
import { IconButton } from "@mui/material";
import styled from "@emotion/styled";

const SkipLinkButton = styled(IconButton)`
  position: fixed;
  top: -40px;
  left: 6px;
  background: #000 !important;
  color: #fff !important;
  padding: 8px 16px;
  border-radius: 4px;
  z-index: 9999;
  font-weight: 500;
  font-size: 14px;
  font-family: 'Inter', sans-serif;
  white-space: nowrap;
  transition: top 0.2s ease;
  min-width: auto;
  height: auto;

  &:focus,
  &.Mui-focusVisible {
    top: 6px !important;
    outline: 3px solid #ff9500;
    outline-offset: 2px;
    background: #000 !important;
  }

  &:hover {
    background: #333 !important;
  }

  /* Disable ripple effect for cleaner focus */
  .MuiTouchRipple-root {
    display: none;
  }
`;

const SkipLink: React.FC = () => {
  const handleSkipToMain = () => {
    const mainContent = document.getElementById('main-content');
    if (mainContent) {
      mainContent.focus();
      mainContent.scrollIntoView();
    }
  };

  return (
    <SkipLinkButton
      onClick={handleSkipToMain}
      aria-label="Skip to main content"
      size="small"
      disableRipple
    >
      Skip to main content
    </SkipLinkButton>
  );
};

export default SkipLink;
