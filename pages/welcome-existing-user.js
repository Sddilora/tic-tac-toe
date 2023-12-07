// pages/welcome-existing-user.js
import React, { useState, useEffect } from 'react';
import { parseCookies, destroyCookie } from 'nookies';
import { useRouter } from 'next/router';
import Link from 'next/link';
import styles from '../styles/WelcomeExistingUser.module.css';

// This is the welcome page for existing users
const WelcomeExistingUser = ({ username }) => {
  // Use state to store the loading state
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Check if the user is an existing user
  useEffect(() => {
    // Validate session on the server side
    const { username: storedUsername } = parseCookies();
    if (!storedUsername) {
      // If session is not valid, redirect to the index page
      router.replace('/');
    } else {
      setLoading(false);
    }
  }, [router]);

  // Handle the logout event
  const handleLogout = () => {
    // Clear the username cookie and redirect to the index page
    destroyCookie(null, 'username');
    router.replace('/');
  };

  if (loading) {
    // Show loading state or redirecting message
    return <p>Loading...</p>;
  }

  if (!username) {
    // If username is not available, render nothing
    return null;
  }

  // Render the welcome page for existing users
  return (
    <div className={styles.container}>
      <button className={styles.button} onClick={handleLogout}>
        Logout
      </button>
      <h1 className={styles.title}>Welcome {username}!</h1>
      <Link legacyBehavior href="/create-game">
        <a className={styles.link}>Create a Game</a>
      </Link>
      <Link legacyBehavior href="/game-list">
        <a className={styles.link}>Game List</a>
      </Link>
      {/* Add your existing user content here */}
    </div>
  );
};

// This function gets called at build time
WelcomeExistingUser.getInitialProps = (ctx) => {
  const { username } = parseCookies(ctx);

  return { username };
};

export default WelcomeExistingUser;
