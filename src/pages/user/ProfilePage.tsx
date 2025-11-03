
import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import { Typography, Paper, Box, Avatar } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';

const ProfilePage: React.FC = () => {
  const { user } = useAuth();

  return (
    <Paper sx={{ p: 4 }}>
      <Typography variant="h5" gutterBottom>My Profile</Typography>
      {user && (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Avatar sx={{ width: 64, height: 64, mr: 2 }}>
            <PersonIcon fontSize="large" />
          </Avatar>
          <div>
            <Typography variant="h6">{user.email}</Typography>
            <Typography color="textSecondary">Role: {user.role}</Typography>
          </div>
        </Box>
      )}
    </Paper>
  );
};

export default ProfilePage;
