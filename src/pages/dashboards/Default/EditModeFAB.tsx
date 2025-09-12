import React from "react";
import styled from "@emotion/styled";
import { Fab, Tooltip, Zoom } from "@mui/material";
import { Edit as EditIcon, Check as CheckIcon, Close as CloseIcon } from "@mui/icons-material";
import { useTheme } from "@mui/material/styles";

const StyledFab = styled(Fab)<{ isEditMode: boolean }>`
  position: fixed;
  bottom: 24px;
  right: 24px;
  z-index: 1000;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  
  ${({ isEditMode, theme }) => isEditMode && `
    background-color: ${theme.palette.success.main};
    color: ${theme.palette.success.contrastText};
    
    &:hover {
      background-color: ${theme.palette.success.dark};
    }
  `}
`;

interface EditModeFABProps {
  isEditMode: boolean;
  onToggleEditMode: () => void;
}

const EditModeFAB: React.FC<EditModeFABProps> = ({ isEditMode, onToggleEditMode }) => {
  const theme = useTheme();

  return (
    <Zoom in={true} timeout={300}>
      <Tooltip 
        title={isEditMode ? "Save Layout" : "Edit Dashboard"} 
        placement="left"
        arrow
      >
        <StyledFab
          isEditMode={isEditMode}
          color={isEditMode ? "success" : "primary"}
          onClick={onToggleEditMode}
          size="large"
        >
          {isEditMode ? <CheckIcon /> : <EditIcon />}
        </StyledFab>
      </Tooltip>
    </Zoom>
  );
};

export default EditModeFAB;
