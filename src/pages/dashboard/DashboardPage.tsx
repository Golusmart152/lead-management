
import React from 'react';
import { Typography, Grid, Paper, Box } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'Jan', leads: 4000 },
  { name: 'Feb', leads: 3000 },
  { name: 'Mar', leads: 2000 },
  { name: 'Apr', leads: 2780 },
  { name: 'May', leads: 1890 },
  { name: 'Jun', leads: 2390 },
  { name: 'Jul', leads: 3490 },
];

const DashboardPage: React.FC = () => {
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={8} lg={9}>
          <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', height: 240 }}>
            <Typography variant="h6" gutterBottom>
              Leads Overview
            </Typography>
            <ResponsiveContainer>
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="leads" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4} lg={3}>
          <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', height: 240 }}>
            <Typography variant="h6" gutterBottom>
              Key Metrics
            </Typography>
            <Typography component="p" variant="h4">
              $24,000
            </Typography>
            <Typography color="text.secondary" sx={{ flex: 1 }}>
              on 15 March, 2024
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12}>
          <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
            {/* Recent activity will go here */}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default DashboardPage;
