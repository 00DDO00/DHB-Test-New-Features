import React from "react";
import styled from "@emotion/styled";
import { 
  Drawer, 
  Box, 
  Typography, 
  Card, 
  CardContent, 
  IconButton,
  Divider,
  Chip
} from "@mui/material";
import { 
  BarChart as BarChartIcon,
  PieChart as PieChartIcon,
  ShowChart as LineChartIcon,
  TableChart as TableIcon,
  Assessment as StatsIcon,
  Close as CloseIcon,
  Add,
  Settings as SettingsIcon
} from "@mui/icons-material";
import { Draggable, Droppable } from "react-beautiful-dnd";

const StyledDrawer = styled(Drawer)`
  .MuiDrawer-paper {
    width: 320px;
    background: ${({ theme }) => theme.palette.background.paper};
    border-left: 1px solid ${({ theme }) => theme.palette.divider};
  }
`;

const CatalogHeader = styled(Box)`
  padding: 24px;
  border-bottom: 1px solid ${({ theme }) => theme.palette.divider};
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const WidgetItem = styled(Card)<{ isUsed: boolean }>`
  margin: 8px 16px;
  cursor: ${({ isUsed }) => isUsed ? 'not-allowed' : 'grab'};
  opacity: ${({ isUsed }) => isUsed ? 0.5 : 1};
  transition: all 0.2s ease;
  user-select: none;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  
  &:hover {
    transform: ${({ isUsed }) => isUsed ? 'none' : 'translateY(-2px)'};
    box-shadow: ${({ isUsed, theme }) => 
      isUsed ? 'none' : theme.shadows[4]
    };
  }
  
  &:active {
    cursor: ${({ isUsed }) => isUsed ? 'not-allowed' : 'grabbing'};
  }
  
  /* Prevent text selection on all child elements */
  * {
    user-select: none;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
  }
`;

const WidgetContent = styled(CardContent)`
  display: flex;
  align-items: center;
  padding: 16px !important;
  
  .widget-icon {
    margin-right: 12px;
    color: ${({ theme }) => theme.palette.primary.main};
  }
  
  .widget-info {
    flex: 1;
  }
`;

const UsedChip = styled(Chip)`
  margin-left: 8px;
`;

interface WidgetType {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  component: string;
}

interface WidgetCatalogProps {
  isOpen: boolean;
  onClose: () => void;
  usedWidgets: string[];
  onWidgetRemove?: (widgetId: string) => void;
  isDragActive?: boolean;
}

const availableWidgets: WidgetType[] = [
  {
    id: 'welcome-card',
    name: 'Welcome Card',
    description: 'Primary account summary with balance',
    icon: <StatsIcon />,
    component: 'WelcomeCard'
  },
  {
    id: 'accounts-card',
    name: 'Accounts Card',
    description: 'Secondary account information',
    icon: <StatsIcon />,
    component: 'AccountsCard'
  },
  {
    id: 'account-opening',
    name: 'Account Opening',
    description: 'Quick account opening widget',
    icon: <Add />,
    component: 'AccountOpening'
  },
  {
    id: 'combispaar-stats',
    name: 'Combispaar Stats',
    description: 'Combispaar account statistics',
    icon: <StatsIcon />,
    component: 'CombispaarStats'
  },
  {
    id: 'settings-widget',
    name: 'Settings Widget',
    description: 'Quick settings and actions',
    icon: <SettingsIcon />,
    component: 'SettingsWidget'
  },
  {
    id: 'chart-widget',
    name: 'Chart Widget',
    description: 'Financial overview chart',
    icon: <BarChartIcon />,
    component: 'ChartWidget'
  },
  {
    id: 'stats',
    name: 'Stats Cards',
    description: 'Display key metrics and statistics',
    icon: <StatsIcon />,
    component: 'Stats'
  },
  {
    id: 'line-chart',
    name: 'Line Chart',
    description: 'Show trends over time',
    icon: <LineChartIcon />,
    component: 'LineChart'
  },
  {
    id: 'bar-chart',
    name: 'Bar Chart',
    description: 'Compare data across categories',
    icon: <BarChartIcon />,
    component: 'BarChart'
  },
  {
    id: 'doughnut-chart',
    name: 'Doughnut Chart',
    description: 'Display proportional data',
    icon: <PieChartIcon />,
    component: 'DoughnutChart'
  },
  {
    id: 'table',
    name: 'Data Table',
    description: 'Show detailed data in table format',
    icon: <TableIcon />,
    component: 'Table'
  }
];

const WidgetCatalog: React.FC<WidgetCatalogProps> = ({ isOpen, onClose, usedWidgets, onWidgetRemove, isDragActive = false }) => {
  return (
    <StyledDrawer
        anchor="right"
        open={isOpen}
        onClose={onClose}
        variant="persistent"
      >
      <CatalogHeader>
        <Typography variant="h6" component="h2">
          Widget Catalog
        </Typography>
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </CatalogHeader>
      
      <Box sx={{ flex: 1, overflow: 'auto' }}>
        <Box sx={{ p: 2 }}>
          <Typography variant="subtitle2" color="textSecondary" gutterBottom>
            Drag widgets to your dashboard. Drag existing widgets here to remove them.
          </Typography>
        </Box>
        
        <Divider />
        
        <Droppable droppableId="catalog" direction="vertical">
          {(provided, snapshot) => (
            <Box 
              ref={provided.innerRef} 
              {...provided.droppableProps}
              sx={{
                flex: 1,
                overflow: 'auto',
                backgroundColor: snapshot.isDraggingOver ? 'rgba(255, 0, 0, 0.1)' : 'transparent',
                border: snapshot.isDraggingOver ? '2px dashed #d32f2f' : '2px dashed transparent',
                borderRadius: 1,
                minHeight: '200px',
                position: 'relative',
                transition: 'all 0.2s ease'
              }}
            >
              {snapshot.isDraggingOver && (
                <Box
                  sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    color: '#d32f2f',
                    fontWeight: 'bold',
                    fontSize: '14px',
                    textAlign: 'center',
                    zIndex: 10,
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    padding: '8px 16px',
                    borderRadius: '4px',
                    border: '1px solid #d32f2f'
                  }}
                >
                  Drop here to remove
                </Box>
              )}
              {availableWidgets.map((widget, index) => {
                const isUsed = usedWidgets.includes(widget.id);
                
                return (
                  <Draggable
                    key={widget.id}
                    draggableId={widget.id}
                    index={index}
                    isDragDisabled={isUsed}
                  >
                    {(provided, snapshot) => {
                      return (
                        <WidgetItem
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          isUsed={isUsed}
                          style={{
                            ...provided.draggableProps.style,
                            ...(snapshot.isDragging && {
                              opacity: 0.3 // Make original item semi-transparent
                            })
                          }}
                        >
                        <WidgetContent>
                          <div className="widget-icon">
                            {widget.icon}
                          </div>
                          <div className="widget-info">
                            <Typography variant="subtitle1" component="div">
                              {widget.name}
                            </Typography>
                            <Typography variant="body2" color="textSecondary">
                              {widget.description}
                            </Typography>
                          </div>
                          {isUsed && (
                            <UsedChip 
                              label="Used" 
                              size="small" 
                              color="default" 
                              variant="outlined"
                            />
                          )}
                        </WidgetContent>
                      </WidgetItem>
                      );
                    }}
                  </Draggable>
                );
              })}
              {provided.placeholder}
            </Box>
          )}
        </Droppable>
      </Box>
    </StyledDrawer>
  );
};

export default WidgetCatalog;
