import React from "react";
import styled from "@emotion/styled";
import { Card, CardContent, Box } from "@mui/material";
import { DragIndicator as DragIcon } from "@mui/icons-material";
import { Draggable } from "react-beautiful-dnd";

const DraggableCard = styled(Box)<{ isEditMode: boolean; isDragging: boolean }>`
  position: relative;
  transition: all 0.2s ease;
  
  ${({ isDragging }) => isDragging && `
    transform: rotate(2deg);
    box-shadow: 0 8px 16px rgba(0,0,0,0.2);
    z-index: 1000;
  `}
`;

const DragHandle = styled(Box)`
  position: absolute;
  top: 8px;
  left: 8px;
  cursor: grab;
  color: ${({ theme }) => theme.palette.primary.main};
  z-index: 10;
  
  &:active {
    cursor: grabbing;
  }
`;

const EditModeIndicator = styled(Box)`
  position: absolute;
  top: -2px;
  left: -2px;
  right: -2px;
  bottom: -2px;
  background: transparent;
  border: 2px dashed ${({ theme }) => theme.palette.primary.main};
  border-radius: 8px;
  pointer-events: none;
  z-index: 1;
`;

const RemoveHint = styled(Box)`
  position: absolute;
  top: 8px;
  right: 8px;
  background: rgba(255, 0, 0, 0.1);
  color: #d32f2f;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
  z-index: 10;
  pointer-events: none;
  opacity: 0;
  transition: opacity 0.2s ease;
  
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
    <Draggable draggableId={widgetId} index={index} isDragDisabled={!isEditMode}>
      {(provided, snapshot) => (
        <DraggableCard
          ref={provided.innerRef}
          {...provided.draggableProps}
          isEditMode={isEditMode}
          isDragging={snapshot.isDragging}
          style={{
            ...provided.draggableProps.style,
            transform: provided.draggableProps.style?.transform,
          }}
        >
          {isEditMode && (
            <>
              <EditModeIndicator />
              <DragHandle {...provided.dragHandleProps}>
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
      )}
    </Draggable>
  );
};

export default DraggableWidget;
