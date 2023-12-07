// pages/game-list.js
import { useEffect, useState } from 'react';
import { fetchAllGameHistory } from '../services/gameHistoryService';
import styles from '../styles/GameList.module.css';
// Import the useRouter hook from 'next/router'
import { useRouter } from 'next/router';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';

// This page displays all the game history for all users
const GameList = () => {
  // Use state to store the game history
  const [allGameHistory, setAllGameHistory] = useState([]);
  const router = useRouter(); // Get the router object

  // Fetch all game history when the component is mounted
  useEffect(() => {
    fetchAllGameHistory()
      .then(setAllGameHistory)
      .catch(error => console.error('Error fetching all game history:', error.message));
  }, []);

    // Function to handle the button click and navigate back
    const handleReturnClick = () => {
        router.back(); // Go back to the previous page
      };

  // Return the JSX element
  return (
    <div className={styles.container}>
        <button className={styles.returnButton} onClick={handleReturnClick}>
        <FontAwesomeIcon icon={faArrowLeft} className={styles.arrowIcon} />
      </button>
      <h1 className={styles.title}>All Game History</h1>
      {allGameHistory.map((userHistory, index) => (
        <div key={index} className={styles.userHistory}>
          <h2 className={styles.userHistoryTitle}>Game History for {userHistory.name}</h2>
          <table className={styles.gameTable}>
            <thead>
              <tr>
                <th className={styles.tableHeader}>Opponent</th>
                <th className={styles.tableHeader}>Winner</th>
                <th className={styles.tableHeader}>Result</th>
                <th className={styles.tableHeader}>Date</th>
              </tr>
            </thead>
            <tbody>
              {userHistory.previousGames.map((game, gameIndex) => (
                <tr key={gameIndex}>
                  <td className={styles.tableCell}>{game.opponent}</td>
                  <td className={styles.tableCell}>{game.winner}</td>
                  <td className={styles.tableCell}>{game.result}</td>
                  <td className={styles.tableCell}>{new Date(game.date).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
};

export default GameList;
