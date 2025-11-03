
import React from 'react';
import { Typography, Box } from '@mui/material';

const ProfilePage: React.FC = () => {
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Profile
      </Typography>
      <Typography variant="body1">
        This is the profile page.
      </Typography>
    </Box>
  );
};

export default ProfilePage;
