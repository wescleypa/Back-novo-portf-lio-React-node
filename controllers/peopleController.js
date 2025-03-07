const peopleService = require('../services/peopleService');

async function searchPeople(req, res) {
  try {
    const { maxResults, string } = req.body;
    const results = await peopleService.searchPeople(maxResults, string);
    res.json(results);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function getProfile(req, res) {
  try {
    const { href, name } = req.body;
    const results = await peopleService.getProfile(href, name);
    res.json(results);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

module.exports = { searchPeople, getProfile };