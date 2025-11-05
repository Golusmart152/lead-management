
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { 
    Box, 
    Button, 
    Typography, 
    CircularProgress, 
    TextField, 
    InputAdornment,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle
} from '@mui/material';
import { Add as AddIcon, Search as SearchIcon } from '@mui/icons-material';
import { getEmployees, addEmployee, updateEmployee, deleteEmployee } from '../services/employee-service';
import type { Employee } from '../types';
import EmployeeForm from '../components/EmployeeForm';
import EmployeesTable from '../components/EmployeesTable';
import { useNotification } from '../../notifications/useNotification';

const EmployeesPage: React.FC = () => {
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [loading, setLoading] = useState(true);
    const [isFormOpen, setFormOpen] = useState(false);
    const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [employeeToDelete, setEmployeeToDelete] = useState<Employee | null>(null);
    const { showNotification } = useNotification();

    const fetchEmployees = useCallback(async () => {
        setLoading(true);
        try {
            const fetchedEmployees = await getEmployees();
            setEmployees(fetchedEmployees);
        } catch (error) {
            console.error("Error fetching employees:", error);
            showNotification('Error fetching employees', 'error');
        }
        setLoading(false);
    }, [showNotification]);

    useEffect(() => {
        fetchEmployees();
    }, [fetchEmployees]);

    const handleAddEmployee = () => {
        setEditingEmployee(null);
        setFormOpen(true);
    };

    const handleEditEmployee = (employee: Employee) => {
        setEditingEmployee(employee);
        setFormOpen(true);
    };

    const handleDeleteConfirmation = (employee: Employee) => {
        setEmployeeToDelete(employee);
    };

    const handleDeleteEmployee = async () => {
        if (!employeeToDelete) return;

        try {
            await deleteEmployee(employeeToDelete.id);
            fetchEmployees();
            showNotification('Employee deleted successfully', 'success');
        } catch (error) {
            console.error("Error deleting employee:", error);
            showNotification('Error deleting employee', 'error');
        }
        setEmployeeToDelete(null);
    };

    const handleFormSubmit = async (data: Omit<Employee, 'id' | 'uuid' | 'visibleId'> | Employee) => {
        try {
            if (editingEmployee) {
                await updateEmployee(editingEmployee.id, data as Employee);
                showNotification('Employee updated successfully', 'success');
            } else {
                await addEmployee(data as Omit<Employee, 'id' | 'uuid' | 'visibleId'>);
                showNotification('Employee added successfully', 'success');
            }
            fetchEmployees();
        } catch (error) {
            console.error("Error saving employee:", error);
            showNotification('Error saving employee', 'error');
        }
        setFormOpen(false);
    };

    const filteredEmployees = useMemo(() => 
        employees.filter(employee => 
            employee.name.toLowerCase().includes(searchTerm.toLowerCase())
        ), 
        [employees, searchTerm]
    );

    return (
        <Box sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h4" gutterBottom>Employees</Typography>
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={handleAddEmployee}
                >
                    Add Employee
                </Button>
            </Box>
            <Box sx={{ mb: 2 }}>
                <TextField
                    fullWidth
                    variant="outlined"
                    placeholder="Search employees..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon />
                            </InputAdornment>
                        ),
                    }}
                />
            </Box>
            {loading ? <CircularProgress /> : (
                <EmployeesTable 
                    employees={filteredEmployees} 
                    onEdit={handleEditEmployee} 
                    onDelete={handleDeleteConfirmation} 
                />
            )}
            <EmployeeForm
                open={isFormOpen}
                onClose={() => setFormOpen(false)}
                onSubmit={handleFormSubmit}
                employee={editingEmployee}
            />
            <Dialog
                open={!!employeeToDelete}
                onClose={() => setEmployeeToDelete(null)}
            >
                <DialogTitle>Delete Employee</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to delete {employeeToDelete?.name}? This action cannot be undone.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setEmployeeToDelete(null)}>Cancel</Button>
                    <Button onClick={handleDeleteEmployee} color="error">Delete</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default EmployeesPage;
