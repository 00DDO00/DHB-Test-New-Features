import React from 'react';
import { Box, Typography, Card } from '@mui/material';
import { SavingsGoal } from './types';

interface SavingsGoalsSectionProps {
  showSavingsGoals: boolean;
  savedGoals: SavingsGoal[];
}

const SavingsGoalsSection: React.FC<SavingsGoalsSectionProps> = ({ 
  showSavingsGoals, 
  savedGoals 
}) => {
  return (
    <>
      {showSavingsGoals && savedGoals.length > 0 && (
        <Card sx={{ mb: 3, p: 3, boxShadow: '0 2px 8px rgba(0,0,0,0.1)', borderRadius: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#333' }}>
              Savings Goals
            </Typography>
            <Box sx={{ display: 'flex', gap: 3 }}>
              {savedGoals.map((goal) => (
                <Box key={goal.id} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
                  <Box sx={{ position: 'relative', width: 60, height: 60 }}>
                    <Box
                      sx={{
                        width: '100%',
                        height: '100%',
                        borderRadius: '50%',
                        border: '4px solid #E0E0E0',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        position: 'relative'
                      }}
                    >
                      <Box
                        sx={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          width: '100%',
                          height: '100%',
                          borderRadius: '50%',
                          border: '4px solid transparent',
                          borderTop: '4px solid #4CAF50',
                          transform: `rotate(${-90 + (goal.percentage * 3.6)}deg)`,
                          clipPath: goal.percentage >= 50 ? 'none' : 'polygon(50% 0%, 50% 50%, 100% 50%, 100% 100%, 0% 100%, 0% 0%)'
                        }}
                      />
                      {goal.percentage >= 50 && (
                        <Box
                          sx={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                            borderRadius: '50%',
                            border: '4px solid #4CAF50',
                            borderRight: '4px solid transparent',
                            borderBottom: '4px solid transparent',
                            transform: 'rotate(-90deg)'
                          }}
                        />
                      )}
                      <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#4CAF50' }}>
                        {goal.percentage}%
                      </Typography>
                    </Box>
                  </Box>
                  <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#333' }}>
                    {goal.name}
                  </Typography>
                  <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                    € {goal.currentAmount.toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} / {goal.targetAmount.toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Box>
        </Card>
      )}
    </>
  );
};

export default SavingsGoalsSection;
