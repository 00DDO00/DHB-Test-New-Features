import React, { useState, useRef } from "react";
import styled from "@emotion/styled";
import { Box } from "@mui/material";
import { DragIndicator as DragIcon } from "@mui/icons-material";
import { Draggable } from "react-beautiful-dnd";

// Use the working grab logic from NativeDraggableWidget
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
  
  ${({ isDragging }) => isDragging && `
    transform: rotate(2deg) scale(1.05);
    box-shadow: 0 8px 16px rgba(0,0,0,0.2);
    z-index: 1000;
  `}
  
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
  cursor: grab;
  
  &:active {
    cursor: grabbing;
  }
`;

const EditModeIndicator = styled(Box)`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
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

interface HybridDraggableWidgetProps {
  widgetId: string;
  index: number;
  isEditMode: boolean;
  children: React.ReactNode;
}

const HybridDraggableWidget: React.FC<HybridDraggableWidgetProps> = ({
  widgetId,
  index,
  isEditMode,
  children
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!isEditMode) return;
    console.log('Mouse down on widget:', widgetId);
    console.log('isEditMode:', isEditMode);
  };

  if (!isEditMode) {
    return <>{children}</>;
  }

  return (
    <Draggable draggableId={widgetId} index={index} isDragDisabled={!isEditMode}>
      {(provided, snapshot) => {
        // Update dragging state based on react-beautiful-dnd
        if (snapshot.isDragging !== isDragging) {
          setIsDragging(snapshot.isDragging);
        }

        return (
          <DraggableCard
            ref={(node) => {
              provided.innerRef(node);
              cardRef.current = node;
            }}
            {...provided.draggableProps}
            isEditMode={isEditMode}
            isDragging={isDragging}
            onMouseDown={handleMouseDown}
            style={{
              ...provided.draggableProps.style,
              ...(snapshot.isDragging && {
                opacity: 0.3
              })
            }}
          >
            <EditModeIndicator />
            <DragHandle
              {...provided.dragHandleProps}
              onMouseDown={handleMouseDown}
            >
              <DragIcon />
            </DragHandle>
            <RemoveHint className={isDragging ? 'visible' : ''}>
              Drag to catalog to remove
            </RemoveHint>
            <Box sx={{ position: 'relative', zIndex: 2 }}>
              {children}
            </Box>
          </DraggableCard>
        );
      }}
    </Draggable>
  );
};

export default HybridDraggableWidget;
