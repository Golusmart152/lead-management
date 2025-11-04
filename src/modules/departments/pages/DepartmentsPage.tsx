
import React, { useState, useEffect } from 'react';
import { 
    Box, 
    Typography, 
    Button, 
    List, 
    ListItem, 
    ListItemText, 
    TextField,
    Paper
} from '@mui/material';
import { getDepartments, addDepartment } from '../services/department-service';
import type { Department } from '../../../types';

const DepartmentsPage: React.FC = () => {
    const [departments, setDepartments] = useState<Department[]>([]);
    const [newDepartmentName, setNewDepartmentName] = useState('');

    useEffect(() => {
        const fetchDepartments = async () => {
            const departments = await getDepartments();
            setDepartments(departments);
        };
        fetchDepartments();
    }, []);

    const handleAddDepartment = async () => {
        if (newDepartmentName.trim() !== '') {
            const newDepartment = await addDepartment({ name: newDepartmentName });
            setDepartments([...departments, newDepartment]);
            setNewDepartmentName('');
        }
    };

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" gutterBottom>Manage Departments</Typography>
            <Paper elevation={3} sx={{ p: 2, mb: 2 }}>
                <Box sx={{ display: 'flex', gap: 2}}>
                    <TextField
                        label="New Department Name"
                        value={newDepartmentName}
                        onChange={(e) => setNewDepartmentName(e.target.value)}
                        variant="outlined"
                        size="small"
                    />
                    <Button onClick={handleAddDepartment} variant="contained">Add Department</Button>
                </Box>
            </Paper>
            <List>
                {departments.map((department) => (
                    <ListItem key={department.id} disablePadding>
                        <ListItemText primary={department.name} />
                    </ListItem>
                ))}
            </List>
        </Box>
    );
};

export default DepartmentsPage;
