import React, { useState } from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Link from "@mui/material/Link";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const defaultTheme = createTheme();

export default function SignUp() {
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [errors, setErrors] = useState({ name: "", email: "", password: "" });
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
    if (name === "name") {
      setErrors({ ...errors, name: validateName(value) });
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const { name, email, password } = formData;
  
    const nameError = validateName(name);
    const emailError = validateEmail(email);
    const passwordError = validatePassword(password);
  
    if (nameError || emailError || passwordError) {
      setErrors({ name: nameError, email: emailError, password: passwordError });
      return;
    }
  
    setLoading(true);
  
    try {
      const response = await fetch('https://tp9wi0tesi.execute-api.us-east-1.amazonaws.com/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
      });
  
      const data = await response.json();
      console.log('Response:', response);
      console.log('Response data:', data);
  
      if (response.ok) {
        toast.success('Signup successful!');
      } else if (response.status === 409) {
        toast.error(data); // Show the error message from the response
      } else {
        toast.error('Signup failed. Please try again.');
      }
    } catch (error) {
      toast.error('An error occurred. Please try again.');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };
  
  

  const validateName = (name) => {
    if (!name) return "Name is required.";
    if (name.length < 2) return "Name must be at least 2 characters.";
    return "";
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
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign Up
          </Typography>
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              name="name"
              label="Name"
              type="text"
              id="name"
              value={formData.name}
              onChange={handleChange}
              error={!!errors.name}
              helperText={errors.name}
              disabled={loading}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
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
              type="text"
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
              {loading ? <CircularProgress size={24} /> : "Sign Up"}
            </Button>
          </Box>
          <Grid container>
              <Grid item>
                <Link href="login" variant="body2">
                  {"Already have an account? Sign In"}
                </Link>
              </Grid>
            </Grid>
        </Box>
        
        <ToastContainer position="bottom-right" reverseOrder={false} />
      </Container>
    </ThemeProvider>
  );
}
