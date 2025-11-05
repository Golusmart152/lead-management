
import React from 'react';
import { 
    Container, 
    Typography, 
    Paper, 
    Button, 
    Select, 
    MenuItem, 
    FormControl, 
    InputLabel, 
    Box, 
} from '@mui/material';
import type { SelectChangeEvent } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const salesData = [
    { name: 'Jan', sales: 4000 },
    { name: 'Feb', sales: 3000 },
    { name: 'Mar', sales: 5000 },
    { name: 'Apr', sales: 4500 },
    { name: 'May', sales: 6000 },
    { name: 'Jun', sales: 5500 },
];

const ReportsPage: React.FC = () => {
    const [reportType, setReportType] = React.useState('sales');

    const handleReportTypeChange = (event: SelectChangeEvent<string>) => {
        setReportType(event.target.value as string);
    };

    const handleExport = () => {
        // Logic to export data
    };

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Typography variant="h4" gutterBottom>
                Reports
            </Typography>
            
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mb: 3, flexWrap: 'wrap' }}>
                <FormControl variant="outlined" sx={{ minWidth: 200 }}>
                    <InputLabel>Report Type</InputLabel>
                    <Select
                        value={reportType}
                        onChange={handleReportTypeChange}
                        label="Report Type"
                    >
                        <MenuItem value="sales">Sales</MenuItem>
                        <MenuItem value="customers">Customers</MenuItem>
                        <MenuItem value="leads">Leads</MenuItem>
                    </Select>
                </FormControl>
                <Button variant="contained" color="primary" onClick={handleExport}>
                    Export as CSV
                </Button>
            </Box>

            <Paper sx={{ p: 2 }}>
                <Typography variant="h6" gutterBottom>
                    {reportType.charAt(0).toUpperCase() + reportType.slice(1)} Report
                </Typography>
                <ResponsiveContainer width="100%" height={400}>
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
        </Container>
    );
};

export default ReportsPage;
