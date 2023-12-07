// pages/game.js
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { parseCookies } from 'nookies';
import axios from 'axios';
import GameRestartPopup from './components/Popup';

// Import the CSS file
import styles from '../styles/Game.module.css';

/**
 * Represents the Tic-Tac-Toe game component.
 * @returns {JSX.Element} The rendered Tic-Tac-Toe game component.
 */
const Game = () => {
  const router = useRouter();
  const { backgroundColor, boardSize: boardSizeQuery } = router.query;

  // Ensure boardSize is a valid number, fallback to a default value if it's not provided or not a number
  const boardSize = parseInt(boardSizeQuery, 10) || 3;

  // Use the boardSize to create the initial state
  const [board, setBoard] = useState(Array(boardSize * boardSize).fill(""));
  const [user, setUser] = useState('X');
  const [winner, setWinner] = useState(null);
  const [showRestartPopup, setShowRestartPopup] = useState(false);

  // Adjust the board size based on the chosen size
  useEffect(() => {
    setBoard(Array(boardSize * boardSize).fill(""));
  }, [boardSize]);

  // Check if the user is logged in
  useEffect(() => {
    const { username } = parseCookies();
    if (!username) {
      // If the user is not logged in, redirect to the index page
      router.replace('/');
    }
  }, [router]);

  // Handle the click event on the squares
  const handleClick = async (index) => {
    // Check if the square is empty and there's no winner yet
    if (!board[index] && !winner) {
      const newBoard = board.slice();
      newBoard[index] = user;
      setBoard(newBoard);

      // Check if there's a winner or a draw after the user's move
      const winnerResult = calculateWinner(newBoard);
      if (winnerResult) {
        setWinner(winnerResult);
        storeMatchResult(user, winnerResult);
      } else if (!newBoard.includes("")) {
        setWinner('Draw');
        storeMatchResult('Draw', 'Draw');
      } else {
        console.log('Before AI Move');
        try {
          // Set the user to 'O' to disable user interaction during AI's turn
          setUser('O');
          // Make the AI move
          const newBoard2 = await makeAIMove(newBoard);
          // Update the board state with the new board
          setBoard(newBoard2);
          // Check if there's a winner or a draw after the AI's move
          const winnerResult = calculateWinner(newBoard2);
          // If there's a winner or a draw, store the match result
          if (winnerResult) {
            setWinner(winnerResult);
            storeMatchResult('O', winnerResult);
          } else if (!newBoard2.includes("")) {
            setWinner('Draw');
            storeMatchResult('Draw', 'Draw');
          } else {
          }
          setUser('X');
        } catch (error) {
          console.error('Error making AI move:', error);
          setUser('X');
        }
      }
    }
  };

  /**
   * Calculates the winner based on the squares.
   * @param {string[]} squares - The squares of the board.
   * @returns {string} The winner.
   * @returns {null} If there's no winner.
   * @returns {string} If there's a draw.
   * @returns {string} If there's a winner.
   */
  const calculateWinner = (squares) => {
    const lines = [];
    // Calculate the lines based on the board size
    for (let i = 0; i < boardSize; i++) {
      // Calculate the horizontal and vertical lines
      lines.push(Array.from({ length: boardSize }, (_, j) => i * boardSize + j));
      lines.push(Array.from({ length: boardSize }, (_, j) => j * boardSize + i));
    }
    // Calculate the diagonal lines
    lines.push(Array.from({ length: boardSize }, (_, i) => i * (boardSize + 1)));
    lines.push(Array.from({ length: boardSize }, (_, i) => (i + 1) * (boardSize - 1)));

    // Check if there's a winner based on the lines
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      if (boardSize == 3) {
        const [a, b, c] = line;
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
          return squares[a];
        }
      } else if (boardSize == 4) {
        const [a, b, c, d] = line;
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c] && squares[a] === squares[d]) {
          return squares[a];
        }
      } else if (boardSize == 5) {
        const [a, b, c, d, e] = line;
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c] && squares[a] === squares[d] && squares[a] === squares[e]) {
          return squares[a];
        }
      } else {

      }
    }

    return null;
  };

  /**
   * Stores the match result in the database.
   * @param {string} winner - The winner.
   * @param {string} result - The result.
   * @returns {Promise<void>} A promise that resolves when the match result is stored.
   * @returns {Promise<void>} A promise that rejects when the match result fails to be stored.
   */
  const storeMatchResult = async (winner, result) => {
    // Get the opponent based on the winner
    const opponent = winner === 'X' ? 'AI' : 'X';

    console.log('Storing match result:', { winner, result, opponent });

    // Send a POST request to the API route to store the match result
    try {
      const response = await fetch('/api/registerMatch', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ winner, result, opponent }),
      });

      if (response.ok) {
        console.log('Match result stored successfully');
      } else {
        console.error('Failed to store match result:', response.status);
      }
    } catch (error) {
      console.error('Error storing match result:', error);
    }
  };

  // Render the square
  // Adjust the styles as needed
  const renderSquare = (i, squareColor) => (
    <button
      key={i}
      className={`${styles.square} ${board[i] === 'X' ? styles.X : ''} ${board[i] === 'O' ? styles.O : ''}`}
      style={{
        backgroundColor: squareColor,
        transition: 'none',  // Remove or adjust the transition
        // adjust the color of the text based on the background color
        color: squareColor === '#000000' ? '#FFFFFF' : '#000000',
        // adjust the border color based on the background color, if it is white, use black, otherwise use white
        border: `3px solid ${squareColor === '#FFFFFF' ? '#000000' : '#FFFFFF'}`,
      }}
      onClick={() => handleClick(i)}
      disabled={user === 'O'} // Disable user interaction during AI's turn
    >
      {board[i]}
    </button>
  );

  // Get the status of the game
  const getStatus = () => {
    const { username } = parseCookies();

    if (winner) {
      // Update the label based on the winner
      return winner === 'X' ? `The winner is ${username} 🥳 ` : winner === 'O' ? 'The winner is AI 🫡' : 'Draw';
    } else {
      return `Next player: ${user}`;
    }
  };

  useEffect(() => {
    // Check if it's a draw and automatically start a new game
    if (winner === 'Draw') {
      startNewGame();
      setShowRestartPopup(true);
      // Automatically close the popup after 3 seconds (adjust as needed)
      setTimeout(() => {
        setShowRestartPopup(false);
      }, 2000);
    }
  }, [winner]);

  // Reset the game
  const resetGame = () => {
    // If there's a winner, show the options directly
    setBoard(Array(boardSize * boardSize).fill(""));
    setUser('X');
    setWinner(null);
  };

  // Start a new game
  const startNewGame = () => {
    // Set the board to empty
    setBoard(Array(boardSize * boardSize).fill(""));
    setUser('X');
    setWinner(null);
    // setWinnerOptions(false); // Close the options after starting a new game
  };

  // Turn back to the create game page
  const turnBacktoCreateGame = () => {
    router.push('/create-game');
  };

  // View the game history
  const viewGameHistory = async () => {
    try {
      // Fetch the game history from the API route
      const response = await fetch('/api/gameHistory');
      if (response.ok) {
        const gameHistory = await response.json();

        // Log the game history for now
        console.log('Game History:', gameHistory);

        // Redirect to the GameList page
        router.push('/game-list');
      } else {
        console.error('Failed to fetch game history:', response.status);
      }
    } catch (error) {
      console.error('Error fetching game history:', error);
    }
  };

  // Make the AI move
  const makeAIMove = async (currentBoard) => {
    console.log('makeAIMove function called in game.js');
    try {
      // Send a POST request to the API route to make the AI move
      const response = await axios.post('/api/openaiAssistant', { newBoard: currentBoard });
      // Parse the new board from the response and return it
      const newBoard2 = JSON.parse(response.data.newBoard);
      return newBoard2;
    } catch (error) {
      console.error('Error making AI move:', error);
      throw error; // Rethrow the error to handle it further if needed
    }
  };

  // Adjust the max width of the board based on the board size
  let maxWidth = "400px";
  if (boardSize === 4) {
    maxWidth = "500px";
  }
  if (boardSize === 5) {
    maxWidth = "600px";
  }


  // Render the game
  return (
    <div className={styles.gameContainer}>
      <h1 style={{ fontSize: '3rem', marginBottom: '20px', color: backgroundColor }} >Tic-Tac-Toe Game</h1>
      <div className={styles.status}>{getStatus()}</div>
      <div
        className={styles.board}
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${boardSize}, 1fr)`, // Adjust the number of columns
          maxWidth: maxWidth,
          margin: '25px auto',
          fontSize: '3rem',
          fontFamily: 'sans-serif',
        }}
      >
        {Array.from({ length: boardSize }).map((_, row) => (
          <div className={styles.boardRow} key={row}>
            {Array.from({ length: boardSize }).map((_, col) =>
              renderSquare(row * boardSize + col, backgroundColor)
            )}
          </div>
        ))}
      </div>
      {winner && (
        <div className={styles.gameOverContainer}>
          <p>Game Over!</p>
          <button style={{ backgroundColor: backgroundColor }} onClick={turnBacktoCreateGame}>Create New Game</button>
          <button style={{ backgroundColor: backgroundColor }} onClick={resetGame}>Restart Game</button>
          <button style={{ backgroundColor: backgroundColor }} onClick={viewGameHistory}>View Game History</button>
        </div>
      )}
      {showRestartPopup && <GameRestartPopup onClose={() => setShowRestartPopup(false)} />}
    </div>
  );
};

export default Game;
