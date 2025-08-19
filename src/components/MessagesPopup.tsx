import React from 'react';
import {
  Box,
  Typography,
  IconButton,
  Card,
  CardContent,
  Button,
} from '@mui/material';
import { Close as CloseIcon, ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import { apiService, Message } from '../services/api';

interface MessagesPopupProps {
  open: boolean;
  onClose: () => void;
  onRefresh?: () => void;
}

interface MessageDetailProps {
  message: Message;
  onBack: () => void;
  onClose: () => void;
}

const MessagesPopup: React.FC<MessagesPopupProps> = ({ open, onClose, onRefresh }) => {
  const [selectedMessage, setSelectedMessage] = React.useState<Message | null>(null);
  const [messages, setMessages] = React.useState<Message[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [newCount, setNewCount] = React.useState(9);
  
  // Fetch messages from API
  React.useEffect(() => {
    if (open) {
      setLoading(true);
      apiService.getMessages()
        .then((response) => {
          setMessages(response.data);
          setNewCount(response.new_count);
        })
        .catch((error) => {
          console.error('Failed to fetch messages:', error);
          // Fallback to empty array if API fails
          setMessages([]);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [open]);

  // Function to refresh messages
  const refreshMessages = React.useCallback(() => {
    if (open) {
      setLoading(true);
      apiService.getMessages()
        .then((response) => {
          setMessages(response.data);
          setNewCount(response.new_count);
          onRefresh?.(); // Notify parent component
        })
        .catch((error) => {
          console.error('Failed to refresh messages:', error);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [open, onRefresh]);

  if (!open) return null;

  const handleMessageClick = (message: Message) => {
    console.log('Message clicked:', message.id);
    setSelectedMessage(message);
  };

  const handleBack = () => {
    setSelectedMessage(null);
  };

  // Message Detail Component
  const MessageDetail: React.FC<MessageDetailProps> = ({ message, onBack, onClose }) => {
    return (
      <Box
        sx={{
          position: 'fixed',
          top: 0,
          right: 0,
          width: '35%',
          height: '100vh',
          backgroundColor: '#F3F3F3',
          zIndex: 1300,
          display: 'flex',
          flexDirection: 'column',
          borderRadius: '16px 0 0 0',
          boxShadow: 24,
          overflow: 'hidden',
        }}
      >
        {/* Header */}
        <Box
          sx={{
            backgroundColor: '#F3F3F3',
            pt: 10,
            pb: 1,
            px: 6,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            position: 'relative',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <IconButton
              onClick={onBack}
              sx={{
                color: '#666666',
                p: 0,
                '&:hover': {
                  backgroundColor: 'transparent',
                },
              }}
            >
              <ArrowBackIcon />
            </IconButton>
            <Typography
              variant="body2"
              sx={{
                color: '#666666',
                fontSize: '14px',
                fontWeight: 400,
              }}
            >
              Back
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Button
              variant="contained"
              size="small"
              sx={{
                backgroundColor: '#FF9800',
                color: 'white',
                fontSize: '12px',
                px: 2,
                py: 0.5,
                borderRadius: '4px',
                textTransform: 'none',
                '&:hover': {
                  backgroundColor: '#F57C00',
                },
              }}
            >
              {message.type}
            </Button>
            <IconButton
              onClick={onClose}
              sx={{
                color: '#666666',
                '&:hover': {
                  backgroundColor: 'rgba(0, 0, 0, 0.04)',
                },
              }}
            >
              <CloseIcon />
            </IconButton>
          </Box>
        </Box>

        {/* Message Content */}
        <Box
          sx={{
            flex: 1,
            overflow: 'auto',
            px: 6,
            py: 2,
            backgroundColor: '#F3F3F3',
          }}
        >
          <Typography
            variant="h6"
            sx={{
              fontWeight: 700,
              color: '#000000',
              fontSize: '18px',
              mb: 1,
            }}
          >
            {message.content.split('.')[0]}.
          </Typography>
          
          <Typography
            variant="body2"
            sx={{
              color: '#666666',
              fontSize: '14px',
              fontWeight: 400,
              mb: 3,
            }}
          >
            {message.date} - {message.time}
          </Typography>

          <Card
            sx={{
              backgroundColor: 'white',
              borderRadius: '8px',
              border: '1px solid #E0E0E0',
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
            }}
          >
            <CardContent sx={{ px: 3, py: 2 }}>
              <Typography
                variant="body1"
                sx={{
                  color: '#000000',
                  fontSize: '14px',
                  lineHeight: 1.6,
                  fontWeight: 400,
                  whiteSpace: 'pre-line',
                }}
              >
                {message.content}
              </Typography>
            </CardContent>
          </Card>
        </Box>
      </Box>
    );
  };

  // Show message detail if a message is selected
  if (selectedMessage !== null) {
    return (
      <MessageDetail
        message={selectedMessage!}
        onBack={handleBack}
        onClose={onClose}
      />
    );
  }

  // Show messages list
  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        right: 0,
        width: '35%',
        height: '100vh',
        backgroundColor: '#F3F3F3',
        zIndex: 1300,
        display: 'flex',
        flexDirection: 'column',
        borderRadius: '16px 0 0 0',
        boxShadow: 24,
        overflow: 'hidden',
      }}
    >
      {/* Header */}
      <Box
        sx={{
          backgroundColor: '#F3F3F3',
          pt: 10,
          pb: 1,
          px: 6,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          position: 'relative',
        }}
      >
        <Typography
          variant="h5"
          sx={{
            fontWeight: 700,
            color: '#000000',
            fontSize: '16px',
          }}
        >
          Messages
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Typography
            variant="body1"
            sx={{
              color: '#000000',
              fontSize: '14px',
              fontWeight: 400,
            }}
          >
            New: {newCount}
          </Typography>
          <IconButton
            onClick={onClose}
            sx={{
              color: '#666666',
              '&:hover': {
                backgroundColor: 'rgba(0, 0, 0, 0.04)',
              },
            }}
          >
            <CloseIcon />
          </IconButton>
        </Box>
      </Box>

      {/* Messages List */}
      <Box
        sx={{
          flex: 1,
          overflow: 'auto',
          px: 6,
          py: 2,
          backgroundColor: '#F3F3F3',
        }}
      >
        {loading ? (
          <Typography
            variant="body1"
            sx={{
              color: '#666666',
              fontSize: '14px',
              textAlign: 'center',
              mt: 4,
            }}
          >
            Loading messages...
          </Typography>
        ) : messages.length === 0 ? (
          <Typography
            variant="body1"
            sx={{
              color: '#666666',
              fontSize: '14px',
              textAlign: 'center',
              mt: 4,
            }}
          >
            No messages available
          </Typography>
        ) : (
          messages.map((message, index) => (
          <Card
            key={message.id}
            onClick={() => handleMessageClick(message)}
            sx={{
              mb: 1.5,
              backgroundColor: 'white',
              borderRadius: '6px',
              border: '1px solid #E0E0E0',
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
              cursor: 'pointer',
              '&:hover': {
                boxShadow: '0 2px 6px rgba(0, 0, 0, 0.15)',
              },
            }}
          >
            <CardContent sx={{ px: 3, py: 2 }}>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  mb: 2.5,
                }}
              >
                <Typography
                  variant="body2"
                  sx={{
                    color: '#1976D2',
                    fontSize: '12px',
                    fontWeight: 400,
                  }}
                >
                  {message.date} - {message.time}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: '#1976D2',
                    fontSize: '12px',
                    fontWeight: 400,
                  }}
                >
                  {message.type}
                </Typography>
              </Box>
              <Typography
                variant="body1"
                sx={{
                  color: '#000000',
                  fontSize: '12px',
                  lineHeight: 1.4,
                  fontWeight: 400,
                }}
              >
                {message.content.split('.')[0]}...
              </Typography>
            </CardContent>
          </Card>
        ))
        )}
      </Box>
    </Box>
  );
};

export default MessagesPopup;
