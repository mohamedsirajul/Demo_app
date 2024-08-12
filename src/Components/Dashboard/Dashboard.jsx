import React, { useEffect } from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { Container } from '@mui/material';

const Dashboard = () => {

  useEffect(() => {
    const token = localStorage.getItem('token');
    const expTimestamp = localStorage.getItem('exp'); // Assuming the expiration timestamp is stored as 'exp'
    const currentTime = Math.floor(Date.now() / 1000); // Current time in seconds

    if (expTimestamp && currentTime > parseInt(expTimestamp, 10)) {
      // Token is expired
      localStorage.removeItem('token');
      localStorage.removeItem('user_id');
      localStorage.removeItem('user_name');
      localStorage.removeItem('exp');
    window.location.href = "/login"
    }
  }, []);

  const handleLogout = () => {
    // Remove token from local storage
    localStorage.removeItem('token');
    localStorage.removeItem('user_id');
    localStorage.removeItem('user_name');
    localStorage.removeItem('exp');

    // Redirect to the login page
    window.location.href = "/login"
  };

  // Retrieve user information from local storage
  const userid = localStorage.getItem('user_id') || 'Unknown';
  const username = localStorage.getItem('user_name') || 'Guest';

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Welcome, {username} (ID: {userid})
          </Typography>
          <Button color="inherit" onClick={handleLogout}>
            Logout
          </Button>
        </Toolbar>
      </AppBar>
      <Container>
        {/* Your dashboard content here */}
        <Container sx={{ mt: 4 }}>
          <Typography variant="h4" component="div">
            Dashboard Content
          </Typography>
          {/* Add more dashboard components or content here */}
        </Container>
      </Container>
    </>
  );
};

export default Dashboard;
