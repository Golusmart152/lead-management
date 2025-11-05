
import React, { useEffect, useState } from 'react';
import { useForm, Controller, type SubmitHandler } from 'react-hook-form';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    Box,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    CircularProgress,
    FormHelperText,
} from '@mui/material';
import type { Employee } from '../types';
import type { Role } from '../../roles/types';
import type { Department } from '../../departments/types';
import { getRoles } from '../../roles/services/role-service';
import { getDepartments } from '../../departments/services/department-service';

interface EmployeeFormProps {
    open: boolean;
    onClose: () => void;
    onSubmit: (formData: Omit<Employee, 'id' | 'uuid' | 'visibleId'> | Employee) => void;
    employee: Employee | null;
}

// Use a dedicated type for form data to handle relationships with IDs
type EmployeeFormData = {
    name: string;
    email: string;
    phone: string;
    roleId: string;
    departmentId: string;
};

const EmployeeForm: React.FC<EmployeeFormProps> = ({ open, onClose, onSubmit, employee }) => {
    const { control, handleSubmit, reset, formState: { errors } } = useForm<EmployeeFormData>({
        defaultValues: {
            name: '',
            email: '',
            phone: '',
            roleId: '',
            departmentId: '',
        }
    });

    const [roles, setRoles] = useState<Role[]>([]);
    const [departments, setDepartments] = useState<Department[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchMetadata = async () => {
            setLoading(true);
            try {
                const [rolesResult, departmentsResult] = await Promise.allSettled([
                    getRoles(),
                    getDepartments(),
                ]);

                const rolesData = rolesResult.status === 'fulfilled' ? rolesResult.value : [];
                const departmentsData = departmentsResult.status === 'fulfilled' ? departmentsResult.value : [];
                
                setRoles(rolesData);
                setDepartments(departmentsData);

                if (employee) {
                    reset({
                        name: employee.name,
                        email: employee.email,
                        phone: employee.phone || '',
                        roleId: employee.role.id,
                        departmentId: employee.department.id,
                    });
                } else {
                    reset({
                        name: '',
                        email: '',
                        phone: '',
                        roleId: rolesData[0]?.id || '',
                        departmentId: departmentsData[0]?.id || '',
                    });
                }
            } catch (error) {
                console.error("Failed to fetch metadata", error);
            } finally {
                setLoading(false);
            }
        };
        if (open) {
            fetchMetadata();
        }
    }, [employee, open, reset]);

    const handleFormSubmit: SubmitHandler<EmployeeFormData> = (data) => {
        const selectedRole = roles.find(r => r.id === data.roleId);
        const selectedDepartment = departments.find(d => d.id === data.departmentId);

        if (!selectedRole || !selectedDepartment) {
            console.error("Selected role or department not found");
            return;
        }

        const submissionData = {
            ...(employee || {}),
            name: data.name,
            email: data.email,
            phone: data.phone,
            role: selectedRole,
            department: selectedDepartment,
        };

        onSubmit(submissionData as Employee);
        onClose();
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>{employee ? 'Edit Employee' : 'Add Employee'}</DialogTitle>
            <form onSubmit={handleSubmit(handleFormSubmit)}>
                <DialogContent>
                    {loading ? (
                        <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                            <CircularProgress />
                        </Box>
                    ) : (
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
                            <Controller
                                name="name"
                                control={control}
                                rules={{ required: 'Name is required' }}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        label="Name"
                                        fullWidth
                                        error={!!errors.name}
                                        helperText={errors.name?.message}
                                    />
                                )}
                            />
                            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2 }}>
                                <Controller
                                    name="email"
                                    control={control}
                                    rules={{ required: 'Email is required', pattern: { value: /^\S+@\S+$/, message: 'Invalid email address' } }}
                                    render={({ field }) => (
                                        <TextField
                                            {...field}
                                            label="Email"
                                            fullWidth
                                            error={!!errors.email}
                                            helperText={errors.email?.message}
                                        />
                                    )}
                                />
                                <Controller
                                    name="phone"
                                    control={control}
                                    render={({ field }) => (
                                        <TextField
                                            {...field}
                                            label="Phone"
                                            fullWidth
                                            error={!!errors.phone}
                                            helperText={errors.phone?.message}
                                        />
                                    )}
                                />
                            </Box>
                            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2 }}>
                                <FormControl fullWidth error={!!errors.roleId}>
                                    <InputLabel>Role</InputLabel>
                                    <Controller
                                        name="roleId"
                                        control={control}
                                        rules={{ required: 'Role is required' }}
                                        render={({ field }) => (
                                            <Select {...field} label="Role">
                                                {roles.map((role) => (
                                                    <MenuItem key={role.id} value={role.id}>{role.name}</MenuItem>
                                                ))}
                                            </Select>
                                        )}
                                    />
                                    {errors.roleId && <FormHelperText>{errors.roleId.message}</FormHelperText>}
                                </FormControl>
                                <FormControl fullWidth error={!!errors.departmentId}>
                                    <InputLabel>Department</InputLabel>
                                    <Controller
                                        name="departmentId"
                                        control={control}
                                        rules={{ required: 'Department is required' }}
                                        render={({ field }) => (
                                            <Select {...field} label="Department">
                                                {departments.map((dept) => (
                                                    <MenuItem key={dept.id} value={dept.id}>{dept.name}</MenuItem>
                                                ))}
                                            </Select>
                                        )}
                                    />
                                    {errors.departmentId && <FormHelperText>{errors.departmentId.message}</FormHelperText>}
                                </FormControl>
                            </Box>
                        </Box>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={onClose}>Cancel</Button>
                    <Button type="submit" variant="contained">{employee ? 'Save' : 'Add'}</Button>
                </DialogActions>
            </form>
        </Dialog>
    );
};

export default EmployeeForm;
