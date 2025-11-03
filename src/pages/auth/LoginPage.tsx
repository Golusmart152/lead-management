
import React from 'react';
import { Box, Button, TextField, Typography, Paper } from '@mui/material';
import { useAuth } from '../../hooks/useAuth';

const LoginPage: React.FC = () => {
  const { login } = useAuth();

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <Paper sx={{ p: 4, width: '100%', maxWidth: 400 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Login
        </Typography>
        <TextField margin="normal" required fullWidth label="Email Address" name="email" autoComplete="email" autoFocus />
        <TextField margin="normal" required fullWidth name="password" label="Password" type="password" autoComplete="current-password" />
        <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }} onClick={login}>
          Sign In
        </Button>
      </Paper>
    </Box>
  );
};

export default LoginPage;
