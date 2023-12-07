// pages/api/gameHistory.js
import fs from 'fs/promises';
import path from 'path';

// This function saves the game history to the JSON file
export default async function handler(req, res) {
  console.log('Request method:', req.method);
  try {
    const filePath = path.join(process.cwd(), 'pages', 'data', 'users.json');
    const rawData = await fs.readFile(filePath, 'utf-8');
    const users = JSON.parse(rawData);
    res.status(200).json(users.users);
  } catch (error) {
    console.error('Error fetching all game history:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
