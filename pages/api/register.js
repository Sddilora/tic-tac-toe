// pages/api/register.js
import { setCookie } from 'nookies';
import { readUsersData, writeUsersData } from './fileHandler';

// This API endpoint is used to register a new user
export default (req, res) => {
  // Check if the request method is POST
  if (req.method === 'POST') {
    const { name } = req.body;

    // Read existing users from the JSON file
    const usersData = readUsersData();

    // Check if the username already exists
    const existingUser = usersData.users.find(user => user.name === name);
    if (existingUser) {
      // If the username already exists, treat the user as an existing user
      setCookie({ res }, 'username', name, {
        maxAge: 30 * 24 * 60 * 60, // 30 days
        path: '/',
      });
      res.status(200).json({ success: true, existingUser: true });
    } else {
      // Save the new user information
      usersData.users.push({
        name,
        registerDate: new Date().toISOString(),
        previousGames: [],
      });

      // Write updated users data back to the JSON file
      if (writeUsersData(usersData)) {
        // Set the username in cookies for the session
        setCookie({ res }, 'username', name, {
          maxAge: 30 * 24 * 60 * 60, // 30 days
          path: '/',
        });

        res.status(200).json({ success: true, existingUser: false });
      } else {
        res.status(500).json({ error: 'Internal Server Error' });
      }
    }
  } else {
    res.status(405).json({ error: 'Method Not Allowed' });
  }
};
