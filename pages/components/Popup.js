// components/Popup.js
import React from 'react';
import styles from '../../styles/Popup.module.css'; // Adjust the path accordingly

// This component is used to display a popup when the game result is a draw
const GameRestartPopup = ({ onClose }) => {
  return (
    <div className={styles.popupContainer}>
      <div className={styles.popupContent}>
        <p>Game result was a draw. The game is restarting.</p>
        <p>You can win this time, don't let AI win!</p>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default GameRestartPopup;
