// pages/index.js
import { parseCookies, setCookie } from 'nookies';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import WelcomeExistingUser from './welcome-existing-user';
import WelcomeNewUser from './welcome-new-user';

// This is the home page
const IndexPage = ({ username }) => {
  // Use state to store the name
  const [name, setName] = useState(username || '');
  const router = useRouter();

  // Check if the user is an existing user
  useEffect(() => {
    if (username) {
      // Existing user, redirect to existing user page
      router.replace('/welcome-existing-user');
    }
  }, [username, router]);

  // Handle the change event for the name input
  const handleNameChange = (event) => {
    setName(event.target.value);
  };

  // Handle the set cookie event
  const handleSaveName = () => {
    // Save the username in cookies
    setCookie(null, 'username', name, {
      maxAge: 30 * 24 * 60 * 60, // 30 days
      path: '/',
    });

    // Redirect to a different page after saving the name
    router.replace('/welcome-new-user');
  };

  // Render the welcome pages if session is established
  if (username) {
    return <WelcomeExistingUser username={username} />;
  }

  // Render the welcome page if session is not established
  return (
    <WelcomeNewUser
      name={name}
      handleNameChange={handleNameChange}
      handleSaveName={handleSaveName}
    />
  );
};

// This function gets called at build time
IndexPage.getInitialProps = (ctx) => {
  const { username } = parseCookies(ctx);

  return { username };
};

export default IndexPage;
