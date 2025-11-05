
import React from 'react';
import { Grid, Paper, Typography, Box } from '@mui/material';
import { 
    LineChart, 
    Line, 
    XAxis, 
    YAxis, 
    CartesianGrid, 
    Tooltip, 
    Legend, 
    ResponsiveContainer, 
    BarChart, 
    Bar 
} from 'recharts';
import { 
    ArrowUpward as ArrowUpwardIcon, 
    ArrowDownward as ArrowDownwardIcon 
} from '@mui/icons-material';

const salesData = [
    { name: 'Jan', sales: 4000 },
    { name: 'Feb', sales: 3000 },
    { name: 'Mar', sales: 5000 },
    { name: 'Apr', sales: 4500 },
    { name: 'May', sales: 6000 },
    { name: 'Jun', sales: 5500 },
];

const customerData = [
    { name: 'New', value: 400 },
    { name: 'Returning', value: 600 },
];

const StatCard: React.FC<{ title: string; value: string; change: number }> = ({ title, value, change }) => (
    <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', height: '100%' }}>
        <Typography variant="h6" color="text.secondary">{title}</Typography>
        <Typography variant="h4">{value}</Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', color: change > 0 ? 'success.main' : 'error.main' }}>
            {change > 0 ? <ArrowUpwardIcon /> : <ArrowDownwardIcon />}
            <Typography>{Math.abs(change)}%</Typography>
        </Box>
    </Paper>
);

const DashboardPage: React.FC = () => {
    return (
        <Box sx={{ flexGrow: 1 }}>
            <Grid container spacing={3}>
                <Grid item xs={12} sm={6} md={3}>
                    <StatCard title="Total Sales" value="$12,345" change={12} />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <StatCard title="New Customers" value="123" change={-5} />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <StatCard title="Open Leads" value="45" change={20} />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <StatCard title="Conversion Rate" value="15%" change={2} />
                </Grid>

                <Grid item xs={12} md={8}>
                    <Paper sx={{ p: 2, height: 400 }}>
                        <Typography variant="h6" gutterBottom>Sales Over Time</Typography>
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={salesData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Line type="monotone" dataKey="sales" stroke="#8884d8" />
                            </LineChart>
                        </ResponsiveContainer>
                    </Paper>
                </Grid>

                <Grid item xs={12} md={4}>
                    <Paper sx={{ p: 2, height: 400 }}>
                        <Typography variant="h6" gutterBottom>Customer Segments</Typography>
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={customerData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="value" fill="#82ca9d" />
                            </BarChart>
                        </ResponsiveContainer>
                    </Paper>
                </Grid>

                <Grid item xs={12}>
                    <Paper sx={{ p: 2 }}>
                        <Typography variant="h6" gutterBottom>Recent Activity</Typography>
                        {/* Placeholder for recent activity list */}
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    );
};

export default DashboardPage;
