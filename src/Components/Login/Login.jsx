import React, { useState } from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { ToastContainer, toast } from 'react-toastify';
import Link from "@mui/material/Link";
import 'react-toastify/dist/ReactToastify.css';
import {jwtDecode} from 'jwt-decode';

const defaultTheme = createTheme();

export default function Signin() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });

    if (name === "email") {
      setErrors({ ...errors, email: validateEmail(value) });
    }
    if (name === "password") {
      setErrors({ ...errors, password: validatePassword(value) });
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const { email, password } = formData;

    const emailError = validateEmail(email);
    const passwordError = validatePassword(password);

    if (emailError || passwordError) {
      setErrors({ email: emailError, password: passwordError });
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('https://tp9wi0tesi.execute-api.us-east-1.amazonaws.com/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      // console.log('Response data:', data);

      if (response.ok) {
        const token = data.token;

        localStorage.setItem("token",token)

        // Decode the JWT token
        const decodedData = jwtDecode(token);
        // console.log('Decoded Token Data:', decodedData);

        localStorage.setItem("user_id", decodedData.user_id )
        localStorage.setItem("user_name",decodedData.user_name)
        localStorage.setItem("exp",decodedData.exp)
        toast.success('Sign-in successful!');

        window.location.href = "/dashboard"

      } else {
        if (response.status === 401) {
          toast.error(data.message);
        } else {
          toast.error('Sign-in failed. Please try again.');
        }
      }
    } catch (error) {
      toast.error('An error occurred. Please try again.');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const validateEmail = (email) => {
    if (!email) return "Email is required.";
    if (!isValidEmail(email)) return "Invalid email format.";
    return "";
  };

  const validatePassword = (password) => {
    if (!password) return "Password is required.";
    if (password.length < 6) return "Password must be at least 6 characters.";
    return "";
  };

  const isValidEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign In
          </Typography>
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              value={formData.email}
              onChange={handleChange}
              error={!!errors.email}
              helperText={errors.email}
              disabled={loading}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              value={formData.password}
              onChange={handleChange}
              error={!!errors.password}
              helperText={errors.password}
              disabled={loading}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={loading}
            >
              {loading ? 'Signing In...' : 'Sign In'}
            </Button>
            <Grid container>
              <Grid item>
                <Link href="register" variant="body2">
                  {"Don't have an account? Sign Up"}
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
        <ToastContainer position="bottom-right" reverseOrder={false} />
      </Container>
    </ThemeProvider>
  );
}
