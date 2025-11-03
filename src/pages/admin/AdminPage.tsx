
import React from 'react';
import { Typography, Box, Grid } from '@mui/material';
import UserManagementPage from './UserManagementPage';

const AdminPage: React.FC = () => {
  return (
    <Box>
      <Typography variant="h4" gutterBottom>Admin Dashboard</Typography>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <UserManagementPage />
        </Grid>
      </Grid>
    </Box>
  );
};

export default AdminPage;
