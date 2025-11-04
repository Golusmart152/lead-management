
import React, { useState, useEffect } from 'react';
import {
    Box,
    Button,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    OutlinedInput,
    Chip,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Grid,
} from '@mui/material';
import type { Employee } from '../types';
import { getRoles } from '../../roles/services/role-service';
import { getDepartments } from '../../departments/services/department-service';
import type { Role } from '../../../types';
import type { Department } from '../../../types';

interface EmployeeFormProps {
    open: boolean;
    onClose: () => void;
    onSubmit: (employee: Omit<Employee, 'id' | 'uuid' | 'visibleId'> | Employee) => void;
    employee?: Employee | null;
}

const EmployeeForm: React.FC<EmployeeFormProps> = ({ open, onClose, onSubmit, employee }) => {
    const [formData, setFormData] = useState<Omit<Employee, 'id' | 'uuid' | 'visibleId'> | Employee>({
        name: '',
        email: '',
        phone: '',
        roles: [],
        departments: [],
        productOrService: '',
    });
    const [roles, setRoles] = useState<Role[]>([]);
    const [departments, setDepartments] = useState<Department[]>([]);

    useEffect(() => {
        if (employee) {
            setFormData(employee);
        } else {
            setFormData({
                name: '',
                email: '',
                phone: '',
                roles: [],
                departments: [],
                productOrService: '',
            });
        }
    }, [employee, open]);

    useEffect(() => {
        const fetchRolesAndDepartments = async () => {
            const rolesData = await getRoles();
            const departmentsData = await getDepartments();
            setRoles(rolesData);
            setDepartments(departmentsData);
        };
        fetchRolesAndDepartments();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleMultiSelectChange = (event: any) => {
        const { name, value } = event.target;
        setFormData({ ...formData, [name]: typeof value === 'string' ? value.split(',') : value });
    };

    const handleSubmit = () => {
        onSubmit(formData);
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>{employee ? 'Edit Employee' : 'Add New Employee'}</DialogTitle>
            <DialogContent>
                <Grid container spacing={2} sx={{ mt: 1 }}>
                    <Grid item xs={12}>
                        <TextField
                            name="name"
                            label="Name"
                            value={formData.name}
                            onChange={handleChange}
                            fullWidth
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            name="email"
                            label="Email"
                            value={formData.email}
                            onChange={handleChange}
                            fullWidth
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            name="phone"
                            label="Phone"
                            value={formData.phone}
                            onChange={handleChange}
                            fullWidth
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <FormControl fullWidth>
                            <InputLabel>Roles</InputLabel>
                            <Select
                                name="roles"
                                multiple
                                value={formData.roles}
                                onChange={handleMultiSelectChange}
                                input={<OutlinedInput label="Roles" />}
                                renderValue={(selected) => (
                                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                        {selected.map((value: any) => (
                                            <Chip key={value} label={value} />
                                        ))}
                                    </Box>
                                )}
                            >
                                {roles.map((role) => (
                                    <MenuItem key={role.id} value={role.name}>
                                        {role.name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12}>
                        <FormControl fullWidth>
                            <InputLabel>Departments</InputLabel>
                            <Select
                                name="departments"
                                multiple
                                value={formData.departments}
                                onChange={handleMultiSelectChange}
                                input={<OutlinedInput label="Departments" />}
                                renderValue={(selected) => (
                                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                        {selected.map((value: any) => (
                                            <Chip key={value} label={value} />
                                        ))}
                                    </Box>
                                )}
                            >
                                {departments.map((department) => (
                                    <MenuItem key={department.id} value={department.name}>
                                        {department.name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            name="productOrService"
                            label="Product/Service"
                            value={formData.productOrService}
                            onChange={handleChange}
                            fullWidth
                        />
                    </Grid>
                </Grid>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
                <Button onClick={handleSubmit} variant="contained">{employee ? 'Save Changes' : 'Add Employee'}</Button>
            </DialogActions>
        </Dialog>
    );
};

export default EmployeeForm;
