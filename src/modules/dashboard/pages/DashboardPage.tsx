
import React from 'react';
import {
    Container,
    Box,
    Paper,
    Typography,
    Card,
    CardContent,
    Icon
} from '@mui/material';
import { 
    BarChart, 
    Bar, 
    XAxis, 
    YAxis, 
    CartesianGrid, 
    Tooltip, 
    Legend, 
    ResponsiveContainer,
    LineChart,
    Line 
} from 'recharts';
import { 
    People, 
    AttachMoney, 
    ShowChart, 
    Leaderboard 
} from '@mui/icons-material';

const salesData = [
    { name: 'Jan', sales: 4000 },
    { name: 'Feb', sales: 3000 },
    { name: 'Mar', sales: 5000 },
    { name: 'Apr', sales: 4500 },
    { name: 'May', sales: 6000 },
    { name: 'Jun', sales: 5500 },
];

const leadsData = [
    { name: 'Week 1', leads: 20 },
    { name: 'Week 2', leads: 35 },
    { name: 'Week 3', leads: 25 },
    { name: 'Week 4', leads: 40 },
];

interface StatCardProps {
    title: string;
    value: string;
    icon: React.ElementType;
    color: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, color }) => (
    <Card sx={{ 
        background: `linear-gradient(45deg, ${color} 30%, ${color} 90%)`,
        color: 'white',
        boxShadow: '0 3px 5px 2px rgba(0,0,0,0.1)',
        borderRadius: '12px',
        height: '100%'
    }}>
        <CardContent sx={{ textAlign: 'center' }}>
            <Icon component={icon} sx={{ fontSize: 40, mb: 1 }} />
            <Typography variant="h6" component="div">
                {title}
            </Typography>
            <Typography variant="h4">
                {value}
            </Typography>
        </CardContent>
    </Card>
);

const DashboardPage: React.FC = () => {
    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr 1fr' }, gap: 3 }}>
                <StatCard title="Total Customers" value="1,234" icon={People} color="#673ab7" />
                <StatCard title="Monthly Revenue" value="$12,345" icon={AttachMoney} color="#4caf50" />
                <StatCard title="Conversion Rate" value="15%" icon={ShowChart} color="#ff9800" />
                <StatCard title="New Leads" value="123" icon={Leaderboard} color="#f44336" />
            </Box>
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '2fr 1fr' }, gap: 3, mt: 3 }}>
                <Paper sx={{
                    p: 2,
                    display: 'flex',
                    flexDirection: 'column',
                    height: 300,
                    borderRadius: '12px',
                    boxShadow: '0 3px 5px 2px rgba(0,0,0,0.1)'
                }}>
                    <Typography variant="h6" gutterBottom>Sales Overview</Typography>
                    <ResponsiveContainer>
                        <BarChart data={salesData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="sales" fill="#8884d8" />
                        </BarChart>
                    </ResponsiveContainer>
                </Paper>
                <Paper sx={{
                    p: 2,
                    display: 'flex',
                    flexDirection: 'column',
                    height: 300,
                    borderRadius: '12px',
                    boxShadow: '0 3px 5px 2px rgba(0,0,0,0.1)'
                }}>
                    <Typography variant="h6" gutterBottom>Recent Leads</Typography>
                    <ResponsiveContainer>
                        <LineChart data={leadsData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Line type="monotone" dataKey="leads" stroke="#82ca9d" />
                        </LineChart>
                    </ResponsiveContainer>
                </Paper>
            </Box>
        </Container>
    );
};

export default DashboardPage;
