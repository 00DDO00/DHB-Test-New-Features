import React from "react";
import styled from "@emotion/styled";
import { Box } from "@mui/material";
import { DragIndicator as DragIcon } from "@mui/icons-material";
import { Draggable } from "react-beautiful-dnd";

// Use the exact same structure as WidgetCard from catalog
const DraggableCard = styled(Box)<{ isEditMode: boolean; isDragging: boolean }>`
  position: relative;
  cursor: ${({ isEditMode }) => isEditMode ? 'grab' : 'default'};
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  user-select: none;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  outline: none;
  -webkit-tap-highlight-color: transparent;
  -webkit-touch-callout: none;
  -webkit-user-drag: none;
  -khtml-user-select: none;
  
  /* Apply flex constraints to maintain layout */
  flex: 0 0 calc(50% - 8px);
  
  &:active {
    cursor: ${({ isEditMode }) => isEditMode ? 'grabbing' : 'default'};
  }
  
  &:focus {
    outline: none;
    box-shadow: none;
  }
  
  /* Prevent text selection on all child elements */
  * {
    user-select: none;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    outline: none;
    -webkit-tap-highlight-color: transparent;
  }
`;

const DragHandle = styled(Box)`
  position: absolute;
  top: 8px;
  left: 8px;
  color: ${({ theme }) => theme.palette.primary.main};
  z-index: 10;
  pointer-events: none; // Visual indicator only
`;

const EditModeIndicator = styled(Box)`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  border: 2px dashed ${({ theme }) => theme.palette.primary.main};
  border-radius: 8px;
  pointer-events: none;
  z-index: 1;
`;

const RemoveHint = styled(Box)`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: rgba(211, 47, 47, 0.9);
  color: white;
  padding: 8px 16px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: bold;
  opacity: 0;
  transition: opacity 0.2s ease;
  pointer-events: none;
  z-index: 100;
  
  &.visible {
    opacity: 1;
  }
`;

interface DraggableWidgetProps {
  widgetId: string;
  index: number;
  isEditMode: boolean;
  children: React.ReactNode;
}

const DraggableWidget: React.FC<DraggableWidgetProps> = ({
  widgetId,
  index,
  isEditMode,
  children
}) => {
  return (
    <Draggable 
      key={widgetId}
      draggableId={widgetId} 
      index={index} 
      isDragDisabled={!isEditMode}
    >
      {(provided, snapshot) => {
        return (
          <DraggableCard
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            isEditMode={isEditMode}
            isDragging={snapshot.isDragging}
            style={{
              ...provided.draggableProps.style,
              ...(snapshot.isDragging && {
                opacity: 0.3
              })
            }}
          >
            {isEditMode && (
              <>
                <EditModeIndicator />
                <DragHandle>
                  <DragIcon />
                </DragHandle>
                <RemoveHint className={snapshot.isDragging ? 'visible' : ''}>
                  Drag to catalog to remove
                </RemoveHint>
              </>
            )}
            <Box sx={{ position: 'relative', zIndex: 2 }}>
              {children}
            </Box>
          </DraggableCard>
        );
      }}
    </Draggable>
  );
};

export default DraggableWidget;