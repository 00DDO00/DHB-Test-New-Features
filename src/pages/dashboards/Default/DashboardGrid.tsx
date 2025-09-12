import React from "react";
import styled from "@emotion/styled";
import { Grid, Box, Typography } from "@mui/material";
import { Droppable, DropResult } from "react-beautiful-dnd";
import DraggableWidget from "./DraggableWidget";
import Stats from "./Stats";
import BarChart from "./BarChart";
import LineChart from "./LineChart";
import DoughnutChart from "./DoughnutChart";
import Table from "./Table";

const DropZone = styled(Box)<{ isEditMode: boolean }>`
  min-height: 200px;
  border-radius: 8px;
  transition: all 0.2s ease;
  
  ${({ isEditMode, theme }) => isEditMode && `
    border: 2px dashed ${theme.palette.divider};
    background-color: ${theme.palette.action.hover};
    min-height: 100px;
  `}
`;

const EmptyState = styled(Box)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 200px;
  color: ${({ theme }) => theme.palette.text.secondary};
  border: 2px dashed ${({ theme }) => theme.palette.divider};
  border-radius: 8px;
  margin: 16px;
`;

interface WidgetConfig {
  id: string;
  type: string;
  props?: any;
}

interface DashboardGridProps {
  widgets: WidgetConfig[];
  isEditMode: boolean;
  onWidgetReorder: (result: DropResult) => void;
  onWidgetRemove: (widgetId: string) => void;
}

const getWidgetComponent = (type: string, props: any = {}) => {
  switch (type) {
    case 'stats':
      return <Stats {...props} />;
    case 'line-chart':
      return <LineChart />;
    case 'bar-chart':
      return <BarChart />;
    case 'doughnut-chart':
      return <DoughnutChart />;
    case 'table':
      return <Table />;
    default:
      return null;
  }
};

const getWidgetSize = (type: string) => {
  switch (type) {
    case 'stats':
      return { xs: 12, sm: 12, md: 6, lg: 3, xl: true };
    case 'line-chart':
      return { xs: 12, lg: 8 };
    case 'doughnut-chart':
      return { xs: 12, lg: 4 };
    case 'bar-chart':
      return { xs: 12, lg: 4 };
    case 'table':
      return { xs: 12, lg: 8 };
    default:
      return { xs: 12 };
  }
};

const DashboardGrid: React.FC<DashboardGridProps> = ({
  widgets,
  isEditMode,
  onWidgetReorder,
  onWidgetRemove
}) => {
  const renderWidget = (widget: WidgetConfig, index: number) => {
    const component = getWidgetComponent(widget.type, widget.props);
    const size = getWidgetSize(widget.type);
    
    if (!component) return null;
    
    return (
      <Grid item key={widget.id} {...size}>
        <DraggableWidget
          widgetId={widget.id}
          index={index}
          isEditMode={isEditMode}
          onRemove={onWidgetRemove}
        >
          {component}
        </DraggableWidget>
      </Grid>
    );
  };

  return (
    <Droppable droppableId="dashboard" direction="vertical">
      {(provided, snapshot) => (
        <DropZone
          ref={provided.innerRef}
          {...provided.droppableProps}
          isEditMode={isEditMode}
        >
          {widgets.length === 0 && isEditMode ? (
            <EmptyState>
              <Typography variant="h6" gutterBottom>
                No widgets added
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Drag widgets from the catalog to get started
              </Typography>
            </EmptyState>
          ) : (
            <Grid container spacing={6}>
              {widgets.map((widget, index) => renderWidget(widget, index))}
              {provided.placeholder}
            </Grid>
          )}
        </DropZone>
      )}
    </Droppable>
  );
};

export default DashboardGrid;
