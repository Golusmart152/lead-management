
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
    Box,
    Typography,
    Button,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    IconButton,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Grid
} from '@mui/material';
import { Add, Edit, Delete, Visibility } from '@mui/icons-material';
import { getEmployees, addEmployee, updateEmployee, deleteEmployee } from '../services/employee-service';
import { getRoles } from '../../roles/services/role-service';
import { getDepartments } from '../../departments/services/department-service';
import type { Employee } from '../types';
import type { Role } from '../../../types';
import type { Department } from '../../../types';
import EmployeeForm from '../components/EmployeeForm';

const EmployeeListPage: React.FC = () => {
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [filteredEmployees, setFilteredEmployees] = useState<Employee[]>([]);
    const [roles, setRoles] = useState<Role[]>([]);
    const [departments, setDepartments] = useState<Department[]>([]);
    const [selectedRole, setSelectedRole] = useState('');
    const [selectedDepartment, setSelectedDepartment] = useState('');
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        const [employeesData, rolesData, departmentsData] = await Promise.all([
            getEmployees(),
            getRoles(),
            getDepartments(),
        ]);
        setEmployees(employeesData);
        setFilteredEmployees(employeesData);
        setRoles(rolesData);
        setDepartments(departmentsData);
    };


    useEffect(() => {
        let filtered = employees;
        if (selectedRole) {
            filtered = filtered.filter(employee => employee.roles.includes(selectedRole));
        }
        if (selectedDepartment) {
            filtered = filtered.filter(employee => employee.departments.includes(selectedDepartment));
        }
        setFilteredEmployees(filtered);
    }, [employees, selectedRole, selectedDepartment]);


    const handleOpenForm = (employee: Employee | null = null) => {
        setEditingEmployee(employee);
        setIsFormOpen(true);
    };

    const handleCloseForm = () => {
        setIsFormOpen(false);
        setEditingEmployee(null);
    };

    const handleSubmit = async (employeeData: Omit<Employee, 'id' | 'uuid' | 'visibleId'> | Employee) => {
        if (editingEmployee) {
            await updateEmployee(editingEmployee.id, employeeData as Employee);
        } else {
            await addEmployee(employeeData as Omit<Employee, 'id' | 'uuid' | 'visibleId'>);
        }
        fetchData();
        handleCloseForm();
    };

    const handleDeleteEmployee = async (id: string) => {
        await deleteEmployee(id);
        fetchData();
    };

    return (
        <Box sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h4">Employees</Typography>
                <Button variant="contained" startIcon={<Add />} onClick={() => handleOpenForm()}>
                    Add New Employee
                </Button>
            </Box>
            <Box sx={{ mb: 3 }}>
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                        <FormControl fullWidth>
                            <InputLabel>Filter by Role</InputLabel>
                            <Select
                                value={selectedRole}
                                label="Filter by Role"
                                onChange={(e) => setSelectedRole(e.target.value as string)}
                            >
                                <MenuItem value=""><em>All Roles</em></MenuItem>
                                {roles.map(role => (
                                    <MenuItem key={role.id} value={role.name}>{role.name}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <FormControl fullWidth>
                            <InputLabel>Filter by Department</InputLabel>
                            <Select
                                value={selectedDepartment}
                                label="Filter by Department"
                                onChange={(e) => setSelectedDepartment(e.target.value as string)}
                            >
                                <MenuItem value=""><em>All Departments</em></MenuItem>
                                {departments.map(department => (
                                    <MenuItem key={department.id} value={department.name}>{department.name}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                </Grid>
            </Box>

            <EmployeeForm
                open={isFormOpen}
                onClose={handleCloseForm}
                onSubmit={handleSubmit}
                employee={editingEmployee}
            />

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>Name</TableCell>
                            <TableCell>Email</TableCell>
                            <TableCell>Phone</TableCell>
                            <TableCell>Role</TableCell>
                            <TableCell>Department</TableCell>
                            <TableCell>Product/Service</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredEmployees.map((employee) => (
                            <TableRow key={employee.id}>
                                <TableCell>
                                    <Link to={`/employees/${employee.id}`}>{employee.visibleId}</Link>
                                </TableCell>
                                <TableCell>{employee.name}</TableCell>
                                <TableCell>{employee.email}</TableCell>
                                <TableCell>{employee.phone}</TableCell>
                                <TableCell>{employee.roles.join(', ')}</TableCell>
                                <TableCell>{employee.departments.join(', ')}</TableCell>
                                <TableCell>{employee.productOrService}</TableCell>
                                <TableCell>
                                    <IconButton component={Link} to={`/employees/${employee.id}`}>
                                        <Visibility />
                                    </IconButton>
                                    <IconButton onClick={() => handleOpenForm(employee)}>
                                        <Edit />
                                    </IconButton>
                                    <IconButton onClick={() => handleDeleteEmployee(employee.id)}>
                                        <Delete />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
};

export default EmployeeListPage;
