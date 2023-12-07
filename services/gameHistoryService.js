// services/gameHistoryService.js
import axios from 'axios';

export const fetchAllGameHistory = async () => {
  try {
    const response = await axios.get('/api/gameHistory');
    return response.data;
  } catch (error) {
    console.error('Error fetching all game history:', error.message);
    throw new Error('Internal Server Error');
  }
};
