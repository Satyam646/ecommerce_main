const express = require('express');
const router = express.Router();
const { Bot } = require('../Controllers/Bot'); // ✅ adjust path if needed

router.post('/chat', Bot);

module.exports = router;