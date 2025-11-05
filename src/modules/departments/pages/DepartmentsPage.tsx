
import React, { useState, useEffect } from 'react';
import { 
    Box, 
    Typography, 
    Button, 
    List, 
    ListItem, 
    ListItemText,
    Paper
} from '@mui/material';
import { getDepartments, addDepartment } from '../services/department-service';
import type { Department } from '../../employees/types';
import AddNewItemModal from '../../../components/AddNewItemModal';

const DepartmentsPage: React.FC = () => {
    const [departments, setDepartments] = useState<Department[]>([]);
    const [isModalOpen, setModalOpen] = useState(false);

    const fetchDepartments = async () => {
        const departments = await getDepartments();
        setDepartments(departments);
    };

    useEffect(() => {
        fetchDepartments();
    }, []);

    const handleAddDepartment = async (name: string) => {
        await addDepartment({ name });
        fetchDepartments();
        setModalOpen(false);
    };

    return (
        <Box sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h4" gutterBottom>Manage Departments</Typography>
                <Button onClick={() => setModalOpen(true)} variant="contained">Add Department</Button>
            </Box>
            <Paper elevation={3} sx={{ p: 2 }}>
                <List>
                    {departments.map((department) => (
                        <ListItem key={department.id} disablePadding>
                            <ListItemText primary={department.name} />
                        </ListItem>
                    ))}
                </List>
            </Paper>
            <AddNewItemModal
                open={isModalOpen}
                onClose={() => setModalOpen(false)}
                onSave={handleAddDepartment}
                itemName="Department"
            />
        </Box>
    );
};

export default DepartmentsPage;
