
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
    Box,
    Typography,
    Paper,
    Button,
    Grid,
    Chip,
    Avatar,
    Card,
    CardContent,
    CircularProgress,
    Divider
} from '@mui/material';
import { getEmployee } from '../services/employee-service';
import type { Employee } from '../types';
import { ArrowBack, EmailOutlined, PhoneOutlined, BusinessCenterOutlined, GroupOutlined } from '@mui/icons-material';
import { styled } from '@mui/material/styles';

const DetailItem = styled(Box)(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    marginBottom: theme.spacing(2),
    '& svg': {
        marginRight: theme.spacing(1.5),
        color: theme.palette.text.secondary,
    },
}));

const EmployeeDetailPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [employee, setEmployee] = useState<Employee | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (id) {
            fetchEmployee(id);
        }
    }, [id]);

    const fetchEmployee = async (employeeId: string) => {
        setLoading(true);
        const employeeData = await getEmployee(employeeId);
        setEmployee(employeeData);
        setLoading(false);
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
                <CircularProgress />
            </Box>
        );
    }

    if (!employee) {
        return (
            <Box sx={{ textAlign: 'center', mt: 4 }}>
                <Typography variant="h5">Employee not found.</Typography>
                <Button component={Link} to="/employees" sx={{ mt: 2 }} variant="outlined">
                    Go Back
                </Button>
            </Box>
        );
    }

    const getInitials = (name: string) => {
        return name.split(' ').map(n => n[0]).join('');
    }

    return (
        <Box sx={{ p: { xs: 2, md: 4 } }}>
            <Button component={Link} to="/employees" sx={{ mb: 3 }} startIcon={<ArrowBack />}>
                Back to Employee List
            </Button>
            <Card elevation={3}>
                <CardContent sx={{ p: { xs: 2, md: 4} }}>
                    <Grid container spacing={4}>
                        <Grid item xs={12} md={4} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <Avatar sx={{ width: 120, height: 120, mb: 2, bgcolor: 'primary.main', fontSize: '3rem' }}>
                                {getInitials(employee.name)}
                            </Avatar>
                            <Typography variant="h4" component="h1" gutterBottom align="center">{employee.name}</Typography>
                            <Typography variant="subtitle1" color="text.secondary" align="center">{employee.visibleId}</Typography>
                        </Grid>
                        <Grid item xs={12} md={8}>
                            <Typography variant="h6" gutterBottom sx={{ borderBottom: '2px solid', borderColor: 'primary.main', pb: 1, mb: 3 }}>
                                Contact Information
                            </Typography>
                            <DetailItem>
                                <EmailOutlined />
                                <Typography>{employee.email}</Typography>
                            </DetailItem>
                            <DetailItem>
                                <PhoneOutlined />
                                <Typography>{employee.phone}</Typography>
                            </DetailItem>

                            <Divider sx={{ my: 4 }} />

                            <Typography variant="h6" gutterBottom sx={{ borderBottom: '2px solid', borderColor: 'primary.main', pb: 1, mb: 3 }}>
                                Work Details
                            </Typography>

                            <DetailItem>
                                <BusinessCenterOutlined />
                                <Typography><strong>Product/Service:</strong> {employee.productOrService}</Typography>
                            </DetailItem>

                            <Box sx={{ mb: 3 }}>
                                <DetailItem>
                                    <GroupOutlined />
                                    <Typography><strong>Roles:</strong></Typography>
                                </DetailItem>
                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, pl: 4 }}>
                                    {employee.roles.map((role, index) => (
                                        <Chip key={index} label={role} color="primary" variant="outlined" />
                                    ))}
                                </Box>
                            </Box>

                            <Box>
                                <DetailItem>
                                    <GroupOutlined />
                                    <Typography><strong>Departments:</strong></Typography>
                                </DetailItem>
                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, pl: 4 }}>
                                    {employee.departments.map((department, index) => (
                                        <Chip key={index} label={department} color="secondary" variant="outlined" />
                                    ))}
                                </Box>
                            </Box>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>
        </Box>
    );
};

export default EmployeeDetailPage;
