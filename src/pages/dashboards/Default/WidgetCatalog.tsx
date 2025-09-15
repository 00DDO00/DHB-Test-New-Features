import React from "react";
import styled from "@emotion/styled";
import { 
  Box, 
  Typography, 
  Card, 
  CardContent, 
  IconButton,
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

const DeckContainer = styled(Box)`
  position: fixed;
  bottom: 24px;
  right: 24px;
  z-index: 1000;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
`;

const DeckStack = styled(Box)`
  position: relative;
  width: 200px;
  max-height: 400px;
  perspective: 1000px;
  overflow-y: auto;
  overflow-x: hidden;
  
  /* Custom scrollbar styling */
  &::-webkit-scrollbar {
    width: 6px;
  }
  
  &::-webkit-scrollbar-track {
    background: rgba(0, 0, 0, 0.1);
    border-radius: 3px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: rgba(0, 73, 150, 0.5);
    border-radius: 3px;
  }
  
  &::-webkit-scrollbar-thumb:hover {
    background: rgba(0, 73, 150, 0.7);
  }
`;

const CardStack = styled(Box)`
  position: relative;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 4px;
  transform-style: preserve-3d;
  padding: 8px;
`;

const WidgetCard = styled(Card)<{ 
  isUsed: boolean; 
  index: number; 
  isHovered: boolean;
  totalCards: number;
}>`
  position: relative;
  width: 200px;
  height: 120px;
  cursor: ${({ isUsed }) => isUsed ? 'not-allowed' : 'grab'};
  opacity: ${({ isUsed }) => isUsed ? 0.5 : 1};
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  user-select: none;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  transform: ${({ index, isHovered }) => {
    if (isHovered) {
      return `translateY(-8px) translateZ(20px) rotateY(2deg) scale(1.05)`;
    }
    return `translateY(0) translateZ(${index * 2}px) rotateY(${index * 0.5}deg)`;
  }};
  z-index: ${({ index, isHovered }) => isHovered ? 100 : 10 - index};
  box-shadow: ${({ index, isHovered, theme }) => {
    const baseShadow = theme.shadows[2];
    const hoverShadow = theme.shadows[8];
    return isHovered ? hoverShadow : baseShadow;
  }};
  
  &:hover {
    transform: ${({ isUsed }) => 
      isUsed ? 'none' : `translateY(-8px) translateZ(20px) rotateY(2deg) scale(1.05)`
    };
    box-shadow: ${({ isUsed, theme }) => 
      isUsed ? 'none' : theme.shadows[8]
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

const StyledCardContent = styled(CardContent)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 16px !important;
  height: 100%;
  text-align: center;
  
  .widget-icon {
    margin-bottom: 8px;
    color: ${({ theme }) => theme.palette.primary.main};
    font-size: 24px;
  }
  
  .widget-title {
    font-size: 12px;
    font-weight: 600;
    line-height: 1.2;
    margin-bottom: 4px;
  }
  
  .widget-description {
    font-size: 10px;
    opacity: 0.7;
    line-height: 1.2;
  }
`;

const UsedChip = styled(Chip)`
  position: absolute;
  top: 8px;
  right: 8px;
  font-size: 10px;
  height: 20px;
`;

const DeckLabel = styled(Typography)`
  color: ${({ theme }) => theme.palette.text.secondary};
  font-size: 12px;
  font-weight: 500;
  text-align: center;
  margin-top: 8px;
`;

const DropZone = styled(Box)`
  position: absolute;
  top: -20px;
  left: -20px;
  right: -20px;
  bottom: -20px;
  border: 2px dashed transparent;
  border-radius: 12px;
  transition: all 0.2s ease;
  
  &.isDraggingOver {
    border-color: #d32f2f;
    background: rgba(255, 0, 0, 0.05);
  }
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
  onNativeDrop?: (event: React.DragEvent) => void;
  onNativeDragOver?: (event: React.DragEvent) => void;
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

const WidgetCatalog: React.FC<WidgetCatalogProps> = ({ 
  isOpen, 
  onClose, 
  usedWidgets, 
  onWidgetRemove, 
  isDragActive = false,
  onNativeDrop,
  onNativeDragOver
}) => {
  const [hoveredCard, setHoveredCard] = React.useState<number | null>(null);

  // Debug logging
  React.useEffect(() => {
    if (isOpen) {
      console.log('Widget Catalog opened:', {
        usedWidgets,
        availableWidgets: availableWidgets.map(w => w.id),
        availableCount: availableWidgets.filter(w => !usedWidgets.includes(w.id)).length
      });
    }
  }, [isOpen, usedWidgets]);

  if (!isOpen) return null;

  return (
    <DeckContainer
      onDrop={onNativeDrop}
      onDragOver={onNativeDragOver}
    >
      <DeckStack>
        <Droppable droppableId="catalog" direction="vertical">
          {(provided, snapshot) => (
            <CardStack 
              ref={provided.innerRef} 
              {...provided.droppableProps}
            >
              <DropZone className={snapshot.isDraggingOver ? 'isDraggingOver' : ''}>
                {snapshot.isDraggingOver && (
                  <Box
                    sx={{
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%, -50%)',
                      color: '#d32f2f',
                      fontWeight: 'bold',
                      fontSize: '12px',
                      textAlign: 'center',
                      zIndex: 100,
                      backgroundColor: 'rgba(255, 255, 255, 0.95)',
                      padding: '6px 12px',
                      borderRadius: '4px',
                      border: '1px solid #d32f2f',
                      boxShadow: '0 4px 8px rgba(0,0,0,0.2)'
                    }}
                  >
                    Drop to remove
                  </Box>
                )}
              </DropZone>
              
              {availableWidgets.map((widget, index) => {
                const isUsed = usedWidgets.includes(widget.id);
                const isHovered = hoveredCard === index;
                
                // Debug logging
                if (widget.id === 'welcome-card') {
                  console.log('Welcome card in catalog:', { 
                    widgetId: widget.id, 
                    isUsed, 
                    usedWidgets, 
                    index 
                  });
                }
                
                return (
                  <Draggable
                    key={widget.id}
                    draggableId={widget.id}
                    index={index}
                    isDragDisabled={isUsed}
                  >
                    {(provided, snapshot) => {
                      return (
                        <WidgetCard
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          isUsed={isUsed}
                          index={index}
                          isHovered={isHovered}
                          totalCards={availableWidgets.length}
                          onMouseEnter={() => setHoveredCard(index)}
                          onMouseLeave={() => setHoveredCard(null)}
                          style={{
                            ...provided.draggableProps.style,
                            ...(snapshot.isDragging && {
                              opacity: 0.3
                            })
                          }}
                        >
                          <StyledCardContent>
                            <div className="widget-icon">
                              {widget.icon}
                            </div>
                            <Typography className="widget-title">
                              {widget.name}
                            </Typography>
                            <Typography className="widget-description">
                              {widget.description}
                            </Typography>
                          </StyledCardContent>
                          {isUsed && (
                            <UsedChip 
                              label="Used" 
                              size="small" 
                              color="default" 
                              variant="outlined"
                            />
                          )}
                        </WidgetCard>
                      );
                    }}
                  </Draggable>
                );
              })}
              {provided.placeholder}
            </CardStack>
          )}
        </Droppable>
      </DeckStack>
      
      <DeckLabel>
        Widget Deck ({availableWidgets.filter(w => !usedWidgets.includes(w.id)).length} available)
      </DeckLabel>
    </DeckContainer>
  );
};

export default WidgetCatalog;
