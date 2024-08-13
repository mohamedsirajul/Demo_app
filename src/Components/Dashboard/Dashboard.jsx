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
                  <TableCell>Title</TableCell>
                  <TableCell>Image</TableCell>
                  <TableCell>Author</TableCell>
                  <TableCell>Country</TableCell>
                  <TableCell>Language</TableCell>
                  <TableCell>Link</TableCell>
                  <TableCell>Year</TableCell>
                  <TableCell>Pages</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, index) => (
                  <TableRow key={index}>
                    <TableCell>{row.title}</TableCell>
                    <TableCell><img style={{borderRadius:"10px" , width:"100px", height:"100px"}} src={row.imageLink} alt="" /></TableCell>
                    <TableCell>{row.author}</TableCell>
                    <TableCell>{row.country}</TableCell>
                    <TableCell>{row.language}</TableCell>
                    <TableCell>  <a href={row.link} target="_blank" >{row.link}</a></TableCell>
                    <TableCell>{row.year}</TableCell>
                    <TableCell>{row.pages}</TableCell>

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
