
import React, { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import {
    Box,
    Button,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Grid,
    IconButton,
    Typography,
    FormHelperText,
    Divider,
    Paper,
} from '@mui/material';
import { Add as AddIcon, Close as CloseIcon } from '@mui/icons-material';
import { motion } from 'framer-motion';
import type { Employee, Role, Department } from '../../../types';
import { getRoles, addRole } from '../../roles/services/role-service';
import { getDepartments, addDepartment } from '../../departments/services/department-service';

interface EmployeeFormProps {
    open: boolean;
    onClose: () => void;
    onSubmit: (employee: Omit<Employee, 'id' | 'uuid' | 'visibleId'> | Employee) => void;
    employee?: Employee | null;
}

const EmployeeForm: React.FC<EmployeeFormProps> = ({ open, onClose, onSubmit, employee }) => {
    const { control, handleSubmit, reset, formState: { errors } } = useForm<Omit<Employee, 'id' | 'uuid' | 'visibleId'> | Employee>({
        defaultValues: {
            name: '',
            email: '',
            phone: '',
            role: {} as Role,
            department: {} as Department,
        }
    });
    const [roles, setRoles] = useState<Role[]>([]);
    const [departments, setDepartments] = useState<Department[]>([]);
    const [newRole, setNewRole] = useState('');
    const [newDepartment, setNewDepartment] = useState('');

    const fetchRolesAndDepartments = async () => {
        const [rolesData, departmentsData] = await Promise.all([getRoles(), getDepartments()]);
        setRoles(rolesData);
        setDepartments(departmentsData);
    };

    useEffect(() => {
        fetchRolesAndDepartments();
    }, []);

    useEffect(() => {
        if (open) {
            reset(employee || {
                name: '',
                email: '',
                phone: '',
                role: {} as Role,
                department: {} as Department,
            });
        }
    }, [employee, open, reset]);

    const handleAddNewRole = async () => {
        if (newRole.trim()) {
            await addRole({ name: newRole, id: '' });
            setNewRole('');
            fetchRolesAndDepartments();
        }
    };

    const handleAddNewDepartment = async () => {
        if (newDepartment.trim()) {
            await addDepartment({ name: newDepartment, id: '' });
            setNewDepartment('');
            fetchRolesAndDepartments();
        }
    };

    const MotionGrid = motion(Grid);

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 4 } }}>
            <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', bgcolor: 'primary.main', color: 'common.white', p: 2 }}>
                <Typography variant="h6">{employee ? 'Edit Employee' : 'Add New Employee'}</Typography>
                <IconButton onClick={onClose} sx={{ color: 'common.white' }}>
                    <CloseIcon />
                </IconButton>
            </DialogTitle>
            <form onSubmit={handleSubmit(onSubmit)}>
                <DialogContent sx={{ p: 4, bgcolor: 'background.default' }}>
                    <Grid container spacing={3}>
                        <MotionGrid item xs={12} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                            <Controller
                                name="name"
                                control={control}
                                rules={{ required: 'Name is required' }}
                                render={({ field }) => <TextField {...field} label="Full Name" fullWidth variant="outlined" error={!!errors.name} helperText={errors.name?.message} />}
                            />
                        </MotionGrid>
                        <MotionGrid item xs={12} sm={6} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                            <Controller
                                name="email"
                                control={control}
                                rules={{ required: 'Email is required', pattern: { value: /\S+@\S+\.\S+/, message: 'Invalid email address' } }}
                                render={({ field }) => <TextField {...field} label="Email Address" fullWidth variant="outlined" error={!!errors.email} helperText={errors.email?.message} />}
                            />
                        </MotionGrid>
                        <MotionGrid item xs={12} sm={6} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                            <Controller
                                name="phone"
                                control={control}
                                rules={{ required: 'Phone number is required' }}
                                render={({ field }) => <TextField {...field} label="Phone Number" fullWidth variant="outlined" error={!!errors.phone} helperText={errors.phone?.message} />}
                            />
                        </MotionGrid>
                        <MotionGrid item xs={12} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
                            <FormControl fullWidth variant="outlined" error={!!errors.role}>
                                <InputLabel>Role</InputLabel>
                                <Controller
                                    name="role"
                                    control={control}
                                    rules={{ required: 'Role is required' }}
                                    render={({ field }) => (
                                        <Select {...field} label="Role">
                                            {roles.map((role) => (
                                                <MenuItem key={role.id} value={role.id}>{role.name}</MenuItem>
                                            ))}
                                            <Divider />
                                            <Paper elevation={0} sx={{ m: 1, p: 1, bgcolor: 'grey.100'}}>
                                                <Box sx={{ p: 2, display: 'flex', gap: 1, alignItems: 'center' }}>
                                                    <TextField
                                                        label="New Role"
                                                        value={newRole}
                                                        onChange={(e) => setNewRole(e.target.value)}
                                                        fullWidth
                                                        variant="standard"
                                                    />
                                                    <IconButton onClick={handleAddNewRole}><AddIcon /></IconButton>
                                                </Box>
                                            </Paper>
                                        </Select>
                                    )}
                                />
                                {errors.role && <FormHelperText>{errors.role.message}</FormHelperText>}
                            </FormControl>
                        </MotionGrid>
                        <MotionGrid item xs={12} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
                            <FormControl fullWidth variant="outlined" error={!!errors.department}>
                                <InputLabel>Department</InputLabel>
                                <Controller
                                    name="department"
                                    control={control}
                                    rules={{ required: 'Department is required' }}
                                    render={({ field }) => (
                                        <Select {...field} label="Department">
                                            {departments.map((dep) => (
                                                <MenuItem key={dep.id} value={dep.id}>{dep.name}</MenuItem>
                                            ))}
                                            <Divider />
                                            <Paper elevation={0} sx={{ m: 1, p: 1, bgcolor: 'grey.100'}}>
                                                <Box sx={{ p: 2, display: 'flex', gap: 1, alignItems: 'center' }}>
                                                    <TextField
                                                        label="New Department"
                                                        value={newDepartment}
                                                        onChange={(e) => setNewDepartment(e.target.value)}
                                                        fullWidth
                                                        variant="standard"
                                                    />
                                                    <IconButton onClick={handleAddNewDepartment}><AddIcon /></IconButton>
                                                </Box>
                                            </Paper>
                                        </Select>
                                    )}
                                />
                                {errors.department && <FormHelperText>{errors.department.message}</FormHelperText>}
                            </FormControl>
                        </MotionGrid>
                    </Grid>
                </DialogContent>
                <DialogActions sx={{ p: 2, bgcolor: 'background.default' }}>
                    <Button onClick={onClose} color="secondary">Cancel</Button>
                    <Button type="submit" variant="contained" color="primary">{employee ? 'Save Changes' : 'Add Employee'}</Button>
                </DialogActions>
            </form>
        </Dialog>
    );
};

export default EmployeeForm;
