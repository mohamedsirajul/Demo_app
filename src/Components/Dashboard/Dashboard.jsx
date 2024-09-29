import React, { useEffect, useState } from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { Container, Grid } from '@mui/material';

const Dashboard = () => {
  const [data, setData] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const expTimestamp = localStorage.getItem('exp');
    const currentTime = Math.floor(Date.now() / 1000);

    if (expTimestamp && currentTime > parseInt(expTimestamp, 10)) {
      localStorage.removeItem('token');
      localStorage.removeItem('user_id');
      localStorage.removeItem('user_name');
      localStorage.removeItem('exp');
      window.location.href = "/login";
    }
  }, []);



  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user_id');
    localStorage.removeItem('user_name');
    localStorage.removeItem('exp');
    window.location.href = "/login";
  };


  const userid = localStorage.getItem('user_id') || 'Unknown';
  const username = localStorage.getItem('user_name') || 'Guest';

  const redirectToGraph2D = () => {
    window.location.href = "/graph2d";
  };

  const redirectToGraph3D = () => {
    window.location.href = "/graph3d";
  };

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
        <Grid container spacing={2} sx={{ marginTop: 2 }}>
          <Grid item>
            <Button variant="contained" color="primary" onClick={redirectToGraph2D}>
              View 2D Graph
            </Button>
          </Grid>
          <Grid item>
            <Button variant="contained" color="secondary" onClick={redirectToGraph3D}>
              View 3D Graph
            </Button>
          </Grid>
        </Grid>
      </Container>
    </>
  );
};

export default Dashboard;
