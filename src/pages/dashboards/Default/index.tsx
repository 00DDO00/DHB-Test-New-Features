import React, { useState, useEffect } from "react";
import styled from "@emotion/styled";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import { DragDropContext, DropResult } from "react-beautiful-dnd";

import {
  Grid,
  Divider as MuiDivider,
  Typography as MuiTypography,
  Box,
} from "@mui/material";
import { spacing } from "@mui/system";
import { green, red } from "@mui/material/colors";

import Actions from "./Actions";
import DashboardGrid from "./DashboardGrid";
import WidgetCatalog from "./WidgetCatalog";
import EditModeFAB from "./EditModeFAB";

const Divider = styled(MuiDivider)(spacing);

const Typography = styled(MuiTypography)(spacing);

const DashboardContainer = styled(Box)<{ isEditMode: boolean }>`
  transition: all 0.3s ease;
  margin-right: ${({ isEditMode }) => isEditMode ? '320px' : '0'};
`;

interface WidgetConfig {
  id: string;
  type: string;
  props?: any;
}

const defaultWidgets: WidgetConfig[] = [
  {
    id: 'stats-1',
    type: 'stats',
    props: {
      title: "Sales Today",
      amount: "2.532",
      chip: "Today",
      percentagetext: "+26%",
      percentagecolor: green[500]
    }
  },
  {
    id: 'stats-2',
    type: 'stats',
    props: {
      title: "Visitors",
      amount: "170.212",
      chip: "Annual",
      percentagetext: "-14%",
      percentagecolor: red[500]
    }
  },
  {
    id: 'stats-3',
    type: 'stats',
    props: {
      title: "Total Earnings",
      amount: "$ 24.300",
      chip: "Monthly",
      percentagetext: "+18%",
      percentagecolor: green[500]
    }
  },
  {
    id: 'stats-4',
    type: 'stats',
    props: {
      title: "Pending Orders",
      amount: "45",
      chip: "Yearly",
      percentagetext: "-9%",
      percentagecolor: red[500],
      illustration: "/static/img/illustrations/waiting.png"
    }
  },
  {
    id: 'line-chart-1',
    type: 'line-chart'
  },
  {
    id: 'doughnut-chart-1',
    type: 'doughnut-chart'
  },
  {
    id: 'bar-chart-1',
    type: 'bar-chart'
  },
  {
    id: 'table-1',
    type: 'table'
  }
];

function Default() {
  const { t } = useTranslation();
  const [isEditMode, setIsEditMode] = useState(false);
  const [widgets, setWidgets] = useState<WidgetConfig[]>(defaultWidgets);

  // Load saved layout from localStorage
  useEffect(() => {
    const savedLayout = localStorage.getItem('dashboard-layout');
    if (savedLayout) {
      try {
        const parsedLayout = JSON.parse(savedLayout);
        setWidgets(parsedLayout);
      } catch (error) {
        console.error('Failed to parse saved layout:', error);
      }
    }
  }, []);

  // Save layout to localStorage
  const saveLayout = (newWidgets: WidgetConfig[]) => {
    localStorage.setItem('dashboard-layout', JSON.stringify(newWidgets));
  };

  const handleToggleEditMode = () => {
    if (isEditMode) {
      // Save layout when exiting edit mode
      saveLayout(widgets);
    }
    setIsEditMode(!isEditMode);
  };

  const handleWidgetReorder = (result: DropResult) => {
    if (!result.destination) return;

    // Handle dropping from catalog to dashboard
    if (result.source.droppableId === 'catalog' && result.destination.droppableId === 'dashboard') {
      const widgetType = result.draggableId;
      const newWidget: WidgetConfig = {
        id: `${widgetType}-${Date.now()}`,
        type: widgetType
      };
      
      const newWidgets = Array.from(widgets);
      newWidgets.splice(result.destination.index, 0, newWidget);
      setWidgets(newWidgets);
      return;
    }

    // Handle reordering within dashboard
    if (result.source.droppableId === 'dashboard' && result.destination.droppableId === 'dashboard') {
      const newWidgets = Array.from(widgets);
      const [reorderedWidget] = newWidgets.splice(result.source.index, 1);
      newWidgets.splice(result.destination.index, 0, reorderedWidget);
      setWidgets(newWidgets);
    }
  };

  const handleWidgetRemove = (widgetId: string) => {
    setWidgets(widgets.filter(widget => widget.id !== widgetId));
  };

  const handleWidgetAdd = (widgetType: string) => {
    const newWidget: WidgetConfig = {
      id: `${widgetType}-${Date.now()}`,
      type: widgetType
    };
    setWidgets([...widgets, newWidget]);
  };

  const usedWidgetTypes = widgets.map(widget => widget.type);

  return (
    <React.Fragment>
      <Helmet title="Default Dashboard" />
      
      <DashboardContainer isEditMode={isEditMode}>
        <Grid justifyContent="space-between" container spacing={6}>
          <Grid item>
            <Typography variant="h3" gutterBottom>
              Default Dashboard
            </Typography>
            <Typography variant="subtitle1">
              {t("Welcome back")}, Lucy! {t("We've missed you")}.{" "}
              <span role="img" aria-label="Waving Hand Sign">
                👋
              </span>
            </Typography>
          </Grid>

          <Grid item>
            <Actions />
          </Grid>
        </Grid>

        <Divider my={6} />

        <DashboardGrid
          widgets={widgets}
          isEditMode={isEditMode}
          onWidgetReorder={handleWidgetReorder}
          onWidgetRemove={handleWidgetRemove}
        />
      </DashboardContainer>

      <EditModeFAB
        isEditMode={isEditMode}
        onToggleEditMode={handleToggleEditMode}
      />

      <WidgetCatalog
        isOpen={isEditMode}
        onClose={() => setIsEditMode(false)}
        usedWidgets={usedWidgetTypes}
      />
    </React.Fragment>
  );
}

export default Default;
