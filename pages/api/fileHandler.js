// pages/api/fileHandler.js
import fs from 'fs';
import path from 'path';

const usersFilePath = path.join(process.cwd(), 'pages', 'data', 'users.json');

// This function reads the users data from the JSON file
export const readUsersData = () => {
  try {
    const existingData = fs.readFileSync(usersFilePath, 'utf-8');
    return existingData ? JSON.parse(existingData) : { users: [] };
  } catch (error) {
    console.error('Error reading users data:', error);
    return { users: [] };
  }
};

// This function writes the users data to the JSON file
export const writeUsersData = (usersData) => {
  try {
    fs.writeFileSync(usersFilePath, JSON.stringify(usersData, null, 2));
    return true;
  } catch (error) {
    console.error('Error writing users data:', error);
    return false;
  }
};
