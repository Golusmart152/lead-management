
import React from 'react';
import { Typography, Box } from '@mui/material';

const AdminPage: React.FC = () => {
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Admin
      </Typography>
      <Typography variant="body1">
        This is the admin page.
      </Typography>
    </Box>
  );
};

export default AdminPage;
