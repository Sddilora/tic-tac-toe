// pages/api/registerMatch.js
import { parseCookies } from 'nookies';
import fs from 'fs';
import path from 'path';

// This API endpoint is used to register a new user
export default async function handler(req, res) {
  const { username } = parseCookies({ req });
  console.log('Received request:', req.body);
  // Check if the request method is POST
  if (req.method !== 'POST') {
    return res.status(405).end(); // Method Not Allowed
  }

  let { winner, result, opponent} = req.body;
  
  // Set the winner to the username if the user won the game
  if (winner === 'X') {
    winner = username;
  } else if (winner === 'O') {
    winner = 'AI';
  } else {
    winner = 'No one';
  }

  console.log('Storing match result in register:', { winner, result});

  // Check if the request body has the required fields
  if ( !winner || !result) {
    return res.status(400).json({ error: 'Bad Request' });
  }

  const userFilePath = path.join(process.cwd(), 'pages', 'data', 'users.json');

  // Read existing users from the JSON file
  try {
    const existingData = fs.readFileSync(userFilePath, 'utf-8');
    if (existingData) {
      const usersData = JSON.parse(existingData);

      // Find the user in the data
      const currentUser = usersData.users.find((user) => user.name === username);

      // Add the match result to the user's data
      if (currentUser) {
        const matchResult = {
          opponent: 'AI',
          winner,
          result,
          date: new Date().toISOString(),
        };

        currentUser.previousGames.push(matchResult);

        // Write updated users data back to the JSON file
        fs.writeFileSync(userFilePath, JSON.stringify(usersData, null, 2));

        return res.status(200).json({ success: true });
      }
    }
  } catch (error) {
    console.error('Error updating match result:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }

  return res.status(404).json({ error: 'User not found' });
}
