// pages/create-game.js
import React, { useState } from 'react';
import { useRouter } from 'next/router';
import styles from '../styles/CreateGame.module.css';

/**
 * 
 * Create a game with the selected options
 */
const CreateGame = () => {
  // Use state to store the selected options
  const [backgroundColor, setBackgroundColor] = useState('#808000') // Default to dark green
  const [boardSize, setBoardSize] = useState(3); // Default board size
  const router = useRouter();

  // Handle the change event for the background color input
  const handleBackgroundColorChange = (event) => {
    setBackgroundColor(event.target.value);
  };

  // Handle the change event for the board size select
  const handleBoardSizeChange = (event) => {
    setBoardSize(parseInt(event.target.value, 10));
  };

  // Handle the click event for the create game button
  const handleCreateGame = () => {
    // Implement the logic to create a game with the selected options
    // For now, let's just log the chosen options
    console.log('Background Color:', backgroundColor);
    console.log('Board Size:', boardSize);

    // Redirect to the game page or another appropriate destination
    router.push({
      pathname: '/game',
      query: { backgroundColor, boardSize },
    });
  };

  // Return the JSX element
  return (
    <div className={styles.container}>
      <h1 style= {{fontSize: '3rem' ,marginBottom: '20px',color: backgroundColor}}>Create a Game</h1>
      <label className={styles.label}>
        <h2>Choose Background Color:</h2>
        <input
          type="color"
          value={backgroundColor}
          onChange={handleBackgroundColorChange}
          className={styles.inputColor}
        />
      </label>
      <br />
      <label className={styles.label}>
      <h2>Choose Board Size:</h2>
        <select value={boardSize} onChange={handleBoardSizeChange} className={styles.select}>
          <option value={3}>3x3</option>
          <option value={4}>4x4</option>
          <option value={5}>5x5</option>
        </select>
      </label>
      <br />
      <button style= {{backgroundColor: backgroundColor}} onClick={handleCreateGame} className={styles.button}>
        Create Game
      </button>
    </div>
  );
};

export default CreateGame;
