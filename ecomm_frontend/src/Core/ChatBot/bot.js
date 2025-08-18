import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import {
  Box,
  IconButton,
  TextField,
  Paper,
  Typography,
  Slide,
  Button,
  Card,
  CardContent,
  CardActions
} from '@mui/material';
import ChatIcon from '@mui/icons-material/Chat';
import SendIcon from '@mui/icons-material/Send';
import CloseIcon from '@mui/icons-material/Close';
import { API } from "../../config";

const Chatbot = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState(() => {
    const saved = localStorage.getItem('chatMessages');
    return saved ? JSON.parse(saved) : [
      { sender: 'bot', text: '👋 Hello! How can I assist you today?' }
    ];
  });
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatRef = useRef(null);

  useEffect(() => {
    localStorage.setItem('chatMessages', JSON.stringify(messages));
    chatRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { sender: 'user', text: input.trim() };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    try {
      const res = await axios.post(`${API}chat`, {
        message: input.trim(),
      });

      const products = res.data;
      setIsTyping(false);

      if (!products.length) {
        setMessages(prev => [...prev, { sender: 'bot', text: "❌ No matching products found." }]);
      } else {
        setMessages(prev => [...prev, { sender: 'bot', text: products }]);
      }

    } catch (err) {
      console.error(err);
      setIsTyping(false);
      setMessages(prev => [...prev, { sender: 'bot', text: "⚠️ Oops! Something went wrong." }]);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSend();
  };

  const clearChat = () => setMessages([{ sender: 'bot', text: '👋 Hello! How can I assist you today?' }]);

  return (
    <>
      {/* Floating Label */}
      <Typography
        sx={{
          borderRadius: 1,
          position: 'fixed',
          bottom: { xs: 80, sm: 85 },
          right: { xs: 20, sm: 30 },
          backgroundColor: '#4B6BFB',
          color: 'white',
          px: 1.5,
          py: 0.5,
          fontWeight: 500,
          fontSize: { xs: 12, sm: 14 },
          zIndex: 1500,
          boxShadow: 2,
          '&:hover': { backgroundColor: '#3A56CC' },
        }}
      >
        AI Chat Support
      </Typography>

      {/* Floating Chat Button */}
      <IconButton
        onClick={() => setOpen(true)}
        sx={{
          position: 'fixed',
          bottom: { xs: 16, sm: 24 },
          right: { xs: 16, sm: 24 },
          background: 'linear-gradient(135deg, #4B6BFB 0%, #3A56CC 100%)',
          color: 'white',
          zIndex: 1500,
          '&:hover': {
            background: 'linear-gradient(135deg, #3A56CC 0%, #2C43A6 100%)',
          },
          boxShadow: 4,
        }}
      >
        <ChatIcon />
      </IconButton>

      {/* Chatbot Panel */}
      <Slide direction="up" in={open} mountOnEnter unmountOnExit>
        <Paper
          elevation={10}
          sx={{
            position: 'fixed',
            bottom: { xs: 70, sm: 90 },
            right: { xs: 8, sm: 24 },
            width: { xs: '92vw', sm: 380 },
            height: { xs: '70vh', sm: 560 },
            display: 'flex',
            flexDirection: 'column',
            borderRadius: 3,
            overflow: 'hidden',
            backdropFilter: 'blur(12px)',
            backgroundColor: 'rgba(255,255,255,0.9)',
            boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
            zIndex: 1500,
          }}
        >
          {/* Header */}
          <Box sx={{
            p: 2,
            bgcolor: '#4B6BFB',
            color: 'white',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <Typography variant="h6" fontWeight={600}>AI Chat Support</Typography>
            <Box>
              <Button size="small" color="inherit" onClick={clearChat}>Clear</Button>
              <IconButton onClick={() => setOpen(false)} sx={{ color: 'white' }}>
                <CloseIcon />
              </IconButton>
            </Box>
          </Box>

          {/* Messages */}
          <Box sx={{ flex: 1, p: 2, overflowY: 'auto', bgcolor: '#f7f7f7' }}>
            {messages.map((msg, idx) => (
              <Box
                key={idx}
                sx={{
                  mb: 1.5,
                  display: 'flex',
                  justifyContent: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                }}
              >
                <Box
                  sx={{
                    px: 2,
                    py: 1,
                    borderRadius: 2,
                    fontSize: { xs: '0.85rem', sm: '0.95rem' },
                    bgcolor: msg.sender === 'user' ? '#4B6BFB' : 'white',
                    color: msg.sender === 'user' ? 'white' : 'black',
                    maxWidth: '80%',
                    boxShadow: 1,
                  }}
                >
                  {Array.isArray(msg.text) ? (
                    msg.text.map((product, idx) => (
                      <Card key={idx} sx={{ mb: 1, borderRadius: 2, boxShadow: 2 }}>
                        <CardContent>
                          <Typography variant="subtitle1" fontWeight={600}>{product.name}</Typography>
                          <Typography variant="body2" color="text.secondary">₹{product.price}</Typography>
                        </CardContent>
                        <CardActions>
                          <Button
                            size="small"
                            variant="contained"
                            href={product.link}
                            target="_blank"
                            sx={{ textTransform: 'none', fontWeight: 500 }}
                          >
                            View Product
                          </Button>
                        </CardActions>
                      </Card>
                    ))
                  ) : (
                    <Typography
                      variant="body2"
                      sx={{ whiteSpace: 'pre-line' }}
                      dangerouslySetInnerHTML={{
                        __html: msg.text.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank">$1</a>'),
                      }}
                    />
                  )}
                </Box>
              </Box>
            ))}

            {isTyping && (
              <Box sx={{ display: 'flex', justifyContent: 'flex-start', mb: 1 }}>
                <Box sx={{
                  px: 2, py: 1, bgcolor: 'grey.300', borderRadius: 2,
                  display: 'inline-block'
                }}>
                  <span className="typing-indicator">Typing...</span>
                </Box>
              </Box>
            )}
            <div ref={chatRef} />
          </Box>

          {/* Input Field */}
          <Box sx={{ display: 'flex', borderTop: '1px solid #ccc', p: 1, bgcolor: 'white' }}>
            <TextField
              fullWidth
              size="small"
              placeholder="Type your message..."
              variant="outlined"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              sx={{
                borderRadius: 2,
                '& fieldset': { borderRadius: 2 },
              }}
            />
            <IconButton color="primary" onClick={handleSend}>
              <SendIcon />
            </IconButton>
          </Box>
        </Paper>
      </Slide>
    </>
  );
};

export default Chatbot;
