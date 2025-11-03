
import React from 'react';
import { Typography, Box, Grid } from '@mui/material';
import UserManagementPage from './UserManagementPage';
import LicenseTiersPage from './LicenseTiersPage';
import LicensesPage from './LicensesPage';

const AdminPage: React.FC = () => {
  return (
    <Box>
      <Typography variant="h4" gutterBottom>Admin Dashboard</Typography>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <UserManagementPage />
        </Grid>
        <Grid item xs={12} md={6}>
          <LicenseTiersPage />
        </Grid>
        <Grid item xs={12} md={6}>
          <LicensesPage />
        </Grid>
      </Grid>
    </Box>
  );
};

export default AdminPage;
