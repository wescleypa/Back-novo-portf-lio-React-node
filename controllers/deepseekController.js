const { Send } = require('../services/deepseekService');

async function IA(req, res) {
  try {
    const { content } = req.body;

    const response = await Send(content);

    res.json(response);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

module.exports = { IA };