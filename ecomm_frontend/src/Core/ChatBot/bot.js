import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import {
  Box, IconButton, TextField, Paper, Typography, Slide, Button
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
      { sender: 'bot', text: 'Hello! How can I help you today?' }
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
        setMessages(prev => [...prev, { sender: 'bot', text: "No matching products found." }]);
      } else {
        setMessages(prev => [...prev, { sender: 'bot', text: products }]); // text is array of product objects
      }

    } catch (err) {
      console.error(err);
      setIsTyping(false);
      setMessages(prev => [...prev, { sender: 'bot', text: "Oops! Something went wrong." }]);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSend();
  };

  const clearChat = () => setMessages([]);

  return (
    <>
      {/* Floating Chat Button */}
      <Typography  sx={{
          borderRadius:"3px",
          position: 'fixed',
          bottom: 33,
          right: 60 ,
          backgroundColor: 'primary.main',
          color: 'white',
          padding:"0px 5px 0px 5px  ",
          '&:hover': { backgroundColor: 'primary.dark' },
        }}>AI Chat Support </Typography>
      <IconButton
        onClick={() => setOpen(true)}
        sx={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          backgroundColor: 'primary.main',
          color: 'white',
          '&:hover': { backgroundColor: 'primary.dark' },
        }}
      >
       <ChatIcon />
      </IconButton>

      {/* Chatbot Panel */}
      <Slide direction="up" in={open} mountOnEnter unmountOnExit>
        <Paper elevation={6}
          sx={{
            position: 'fixed',
            bottom: 90,
            right: 24,
            width: 360,
            height: 520,
            display: 'flex',
            flexDirection: 'column',
            borderRadius: 3,
            overflow: 'hidden',
          }}
        >
          {/* Header */}
          <Box sx={{ p: 2, bgcolor: 'primary.main', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6">AI Chat Support</Typography>
            <Box>
              <Button size="small" color="inherit" onClick={clearChat}>Clear</Button>
              <IconButton onClick={() => setOpen(false)} sx={{ color: 'white' }}>
                <CloseIcon />
              </IconButton>
            </Box>
          </Box>

          {/* Messages */}
          <Box sx={{ flex: 1, p: 2, overflowY: 'auto', bgcolor: '#f9f9f9' }}>
            {messages.map((msg, idx) => (
              <Box
                key={idx}
                sx={{
                  mb: 1,
                  display: 'flex',
                  justifyContent: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                }}
              >
                <Box
                  sx={{
                    px: 2,
                    py: 1,
                    borderRadius: 2,
                    bgcolor: msg.sender === 'user' ? 'primary.light' : 'grey.200',
                    maxWidth: '80%',
                    boxShadow: 1,
                  }}
                >
                  {Array?.isArray(msg?.text) ? (
                    msg.text.map((product, idx) => (
                      <Box key={idx} sx={{ mb: 2 }}>
                        {/* <img src={product.image} alt={product.name} style={{ width: '100%', borderRadius: 8 }} /> */}
                        <Typography variant="subtitle1" fontWeight={600}>{product.name}</Typography>
                        <Typography variant="body2" color="text.secondary">${product.price}</Typography>
                        <a href={product.link} target="_blank" rel="noopener noreferrer">🔗 View Product</a>
                      </Box>
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
                <Box sx={{ px: 2, py: 1, bgcolor: 'grey.300', borderRadius: 2, fontStyle: 'italic' }}>Typing...</Box>
              </Box>
            )}
            <div ref={chatRef} />
          </Box>

          {/* Input */}
          <Box sx={{ display: 'flex', borderTop: '1px solid #ccc', p: 1 }}>
            <TextField
              fullWidth
              size="small"
              placeholder="Type a message..."
              variant="outlined"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
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
