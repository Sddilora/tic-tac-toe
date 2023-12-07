// pages/welcome-new-user.js
import React from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import styles from '../styles/WelcomeNewUser.module.css';

// This is the welcome page for new users
const WelcomeNewUser = ({ name, handleNameChange, handleSaveName }) => {
  // Get the router object
  const router = useRouter();

  // Handle the save event
  const handleSave = async () => {
    try {
      // Make a POST request to the register API endpoint
      await axios.post('/api/register', { name });

      // Redirect to a different page after saving the name
      router.replace('/welcome-existing-user');
    } catch (error) {
      console.error('Error registering user:', error);
    }
  };

  // Handle the key press event
  const handleKeyPress = (event) => {
    // Check if the pressed key is "Enter"
    if (event.key === 'Enter') {
      handleSave();
    }
  };

  // Render the welcome page for new users
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Welcome, new user 😎 </h1>
      <label className={styles.label}>
        Enter your name:
        <input type="text" value={name} onChange={handleNameChange} className={styles.input} onKeyPress={handleKeyPress} placeholder='Enter your name'/>
      </label>
      <button onClick={handleSave} className={styles.button}>
        Save
      </button>
      {/* Your new user content goes here */}
    </div>
  );
};

export default WelcomeNewUser;
