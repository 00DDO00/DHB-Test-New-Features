import React, { useState, useEffect } from 'react';
import { Box, Card, CardContent, Typography, Button } from '@mui/material';
import { StatsWidget, ChartWidget, Widget } from '../../../components/widgets';

interface WidgetDragPreviewProps {
  widgetId: string;
  isDragging: boolean;
}

const WidgetDragPreview: React.FC<WidgetDragPreviewProps> = ({ widgetId, isDragging }) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    document.addEventListener('mousemove', handleMouseMove);
    return () => document.removeEventListener('mousemove', handleMouseMove);
  }, [isDragging]);

  // Cleanup effect to ensure drag state is reset
  useEffect(() => {
    if (!isDragging) {
      // Reset mouse position when not dragging
      setMousePosition({ x: 0, y: 0 });
    }
  }, [isDragging]);

  if (!isDragging) return null;

  const renderPreview = () => {
    switch (widgetId) {
      case 'stats':
        return (
          <Card sx={{ width: 300, height: 200 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Additional Stats
              </Typography>
              <Typography variant="h4" color="primary" sx={{ fontWeight: 'bold' }}>
                € 1,234.56
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Sample Statistics
              </Typography>
              <Button variant="outlined" size="small">
                View Details
              </Button>
            </CardContent>
          </Card>
        );
      case 'line-chart':
        return (
          <Card sx={{ width: 300, height: 200 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Line Chart
              </Typography>
              <Box sx={{ height: 100, display: 'flex', alignItems: 'end', gap: 1, mb: 2 }}>
                {[40, 60, 45, 70, 55, 80].map((height, index) => (
                  <Box
                    key={index}
                    sx={{
                      width: 20,
                      height: height,
                      backgroundColor: '#004996',
                      borderRadius: '2px 2px 0 0'
                    }}
                  />
                ))}
              </Box>
              <Typography variant="body2" color="text.secondary">
                Last 6 months
              </Typography>
            </CardContent>
          </Card>
        );
      case 'bar-chart':
        return (
          <Card sx={{ width: 300, height: 200 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Bar Chart
              </Typography>
              <Box sx={{ height: 100, display: 'flex', alignItems: 'end', gap: 1, mb: 2 }}>
                {[
                  { height: 80, color: '#FF6B35' },
                  { height: 50, color: '#004996' },
                  { height: 30, color: '#28a745' }
                ].map((bar, index) => (
                  <Box
                    key={index}
                    sx={{
                      width: 30,
                      height: bar.height,
                      backgroundColor: bar.color,
                      borderRadius: '2px 2px 0 0'
                    }}
                  />
                ))}
              </Box>
              <Typography variant="body2" color="text.secondary">
                All categories
              </Typography>
            </CardContent>
          </Card>
        );
      case 'doughnut-chart':
        return (
          <Card sx={{ width: 300, height: 200 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Doughnut Chart
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                <Box
                  sx={{
                    width: 60,
                    height: 60,
                    borderRadius: '50%',
                    background: 'conic-gradient(#004996 0deg 216deg, #FF6B35 216deg 324deg, #28a745 324deg 360deg)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <Box
                    sx={{
                      width: 30,
                      height: 30,
                      borderRadius: '50%',
                      backgroundColor: 'white'
                    }}
                  />
                </Box>
                <Box>
                  <Typography variant="body2">Stocks: 60%</Typography>
                  <Typography variant="body2">Bonds: 30%</Typography>
                  <Typography variant="body2">Cash: 10%</Typography>
                </Box>
              </Box>
              <Typography variant="body2" color="text.secondary">
                Current allocation
              </Typography>
            </CardContent>
          </Card>
        );
      case 'table':
        return (
          <Card sx={{ width: 300, height: 200 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Data Table
              </Typography>
              <Box sx={{ mb: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2">Item 1</Typography>
                  <Typography variant="body2">€ 100</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2">Item 2</Typography>
                  <Typography variant="body2">€ 200</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2">Item 3</Typography>
                  <Typography variant="body2">€ 300</Typography>
                </Box>
              </Box>
              <Typography variant="body2" color="text.secondary">
                Sample table data
              </Typography>
            </CardContent>
          </Card>
        );
      default:
        return (
          <Card sx={{ width: 300, height: 200 }}>
            <CardContent>
              <Typography variant="h6">
                {widgetId}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Widget preview
              </Typography>
            </CardContent>
          </Card>
        );
    }
  };

  return (
    <Box
      sx={{
        position: 'fixed',
        top: mousePosition.y - 100, // Offset to center on cursor
        left: mousePosition.x - 150, // Offset to center on cursor
        pointerEvents: 'none',
        zIndex: 9999,
        opacity: 0.9,
        transform: 'rotate(5deg)',
        transition: 'none' // Disable transitions for smooth following
      }}
    >
      {renderPreview()}
    </Box>
  );
};

export default WidgetDragPreview;
