import React, { useState, useRef } from "react";
import styled from "@emotion/styled";
import { Box } from "@mui/material";
import { DragIndicator as DragIcon } from "@mui/icons-material";

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
  
  /* Remove flex constraints - will be applied by parent Box */
  /* flex: 0 0 calc(50% - 8px); */
  
  ${({ isDragging }) => isDragging && `
    transform: rotate(2deg) scale(1.05);
    box-shadow: 0 8px 16px rgba(0,0,0,0.2);
    z-index: 1000;
    opacity: 0.8;
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

interface NativeDraggableWidgetProps {
  widgetId: string;
  isEditMode: boolean;
  onDragStart: (widgetId: string, event: React.DragEvent) => void;
  onDragEnd: (widgetId: string, event: React.DragEvent) => void;
  children: React.ReactNode;
}

const NativeDraggableWidget: React.FC<NativeDraggableWidgetProps> = ({
  widgetId,
  isEditMode,
  onDragStart,
  onDragEnd,
  children
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const handleDragStart = (e: React.DragEvent) => {
    if (!isEditMode) {
      e.preventDefault();
      return;
    }

    console.log('Native drag start:', widgetId);
    setIsDragging(true);
    
    // Set drag data
    e.dataTransfer.setData('text/plain', widgetId);
    e.dataTransfer.effectAllowed = 'move';
    
    // Create a custom drag image that follows the cursor
    if (cardRef.current) {
      const dragImage = cardRef.current.cloneNode(true) as HTMLElement;
      dragImage.style.transform = 'rotate(5deg) scale(0.9)';
      dragImage.style.opacity = '0.8';
      dragImage.style.border = '2px solid #004996';
      dragImage.style.borderRadius = '8px';
      dragImage.style.position = 'fixed';
      dragImage.style.pointerEvents = 'none';
      dragImage.style.zIndex = '9999';
      dragImage.style.width = cardRef.current.offsetWidth + 'px';
      dragImage.style.height = cardRef.current.offsetHeight + 'px';
      
      document.body.appendChild(dragImage);
      e.dataTransfer.setDragImage(dragImage, 50, 50);
      
      // Clean up the drag image after a short delay
      setTimeout(() => {
        if (document.body.contains(dragImage)) {
          document.body.removeChild(dragImage);
        }
      }, 0);
    }
    
    onDragStart(widgetId, e);
  };

  const handleDragEnd = (e: React.DragEvent) => {
    console.log('Native drag end:', widgetId);
    setIsDragging(false);
    onDragEnd(widgetId, e);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!isEditMode) return;
    console.log('Mouse down on widget:', widgetId);
    console.log('isEditMode:', isEditMode);
    console.log('draggable attribute:', cardRef.current?.getAttribute('draggable'));
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isEditMode) return;
    console.log('Mouse move on widget:', widgetId);
  };

  if (!isEditMode) {
    return <>{children}</>;
  }

  return (
    <DraggableCard
      ref={cardRef}
      isEditMode={isEditMode}
      isDragging={isDragging}
      draggable={isEditMode}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
    >
      <EditModeIndicator />
      <DragHandle>
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
};

export default NativeDraggableWidget;
