import React, { useEffect, useState } from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { Container, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TablePagination } from '@mui/material';

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
    } else {
      fetchData();
    }
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch('https://tp9wi0tesi.execute-api.us-east-1.amazonaws.com/getrecord');
      const result = await response.json();
      setData(result);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user_id');
    localStorage.removeItem('user_name');
    localStorage.removeItem('exp');
    window.location.href = "/login";
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

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
        <Container sx={{ mt: 4 }}>
          <Typography variant="h4" component="div" sx={{ mb: 4 }}>
            Books Record
          </Typography>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell align="center">Title</TableCell>
                  <TableCell align="center">Image</TableCell>
                  <TableCell align="center">Author</TableCell>
                  <TableCell align="center">Country</TableCell>
                  <TableCell align="center">Language</TableCell>
                  <TableCell align="center">Link</TableCell>
                  <TableCell align="center">Year</TableCell>
                  <TableCell align="center">Pages</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, index) => (
                  <TableRow key={index}>
                    <TableCell align="center">{row.title}</TableCell>
                    <TableCell align="center">
                      <img style={{ borderRadius: "10px", width: "100px", height: "100px" }} src={row.imageLink} alt="" />
                    </TableCell>
                    <TableCell align="center">{row.author}</TableCell>
                    <TableCell align="center">{row.country}</TableCell>
                    <TableCell align="center">{row.language}</TableCell>
                    <TableCell align="center">
                      <a href={row.link} style={{ color: 'blue', textDecoration: 'none' }}>
                        {row.link}
                      </a>
                    </TableCell>
                    <TableCell align="center">{row.year}</TableCell>
                    <TableCell align="center">{row.pages}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            component="div"
            count={data.length}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            rowsPerPageOptions={[5, 10, 25]}
          />
        </Container>
      </Container>
    </>
  );
};

export default Dashboard;
