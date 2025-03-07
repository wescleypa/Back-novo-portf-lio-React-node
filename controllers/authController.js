const authService = require('../services/authService');

async function login(req, res) {
  try {
    const { email, password } = req.body;
    const authState = await authService.login(email, password);
    res.json(authState);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

module.exports = { login };