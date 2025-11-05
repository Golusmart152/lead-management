
import React, { useState, useEffect } from 'react';
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
    FormHelperText,
} from '@mui/material';
import type { Lead, LeadStatus } from '../types';
import { getEmployees } from '../../employees/services/employee-service';
import type { Employee } from '../../employees/types';

interface LeadFormProps {
    open: boolean;
    onClose: () => void;
    onSubmit: (lead: Omit<Lead, 'id' | 'uuid' | 'visibleId'> | Lead) => void;
    lead: Omit<Lead, 'id' | 'uuid' | 'visibleId'> | Lead | null;
}

const LeadForm: React.FC<LeadFormProps> = ({ open, onClose, onSubmit, lead }) => {
    const { control, handleSubmit, formState: { errors }, reset } = useForm<Omit<Lead, 'id' | 'uuid' | 'visibleId'> | Lead>({
        defaultValues: lead || {
            name: '',
            email: '',
            phone: '',
            status: 'new',
            assignedTo: '',
            company: '',
            notes: ''
        }
    });
    const [employees, setEmployees] = useState<Employee[]>([]);

    useEffect(() => {
        async function fetchInitialData() {
            const employeesData = await getEmployees();
            setEmployees(employeesData);
        }
        fetchInitialData();
    }, []);

    useEffect(() => {
        if (open) {
            reset(lead || {
                name: '',
                email: '',
                phone: '',
                status: 'new',
                assignedTo: '',
                company: '',
                notes: ''
            });
        }
    }, [lead, open, reset]);

    const leadStatusOptions: LeadStatus[] = ['new', 'contacted', 'qualified', 'unqualified', 'proposal', 'negotiation', 'won', 'lost'];

    const handleFormSubmit: SubmitHandler<Omit<Lead, 'id' | 'uuid' | 'visibleId'> | Lead> = (data) => {
        onSubmit(data);
        onClose();
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
            <DialogTitle>{lead ? 'Edit Lead' : 'Add Lead'}</DialogTitle>
            <form onSubmit={handleSubmit(handleFormSubmit)}>
                <DialogContent>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
                        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2 }}>
                            <Controller
                                name="name"
                                control={control}
                                rules={{ required: 'Name is required' }}
                                render={({ field }) => <TextField {...field} label="Name" fullWidth error={!!errors.name} helperText={(errors as any).name?.message} />}
                            />
                            <Controller
                                name="email"
                                control={control}
                                rules={{ required: 'Email is required', pattern: { value: /^\S+@\S+\.\S+$/, message: 'Invalid email' } }}
                                render={({ field }) => <TextField {...field} label="Email" fullWidth error={!!errors.email} helperText={(errors as any).email?.message} />}
                            />
                        </Box>
                        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2 }}>
                            <Controller
                                name="phone"
                                control={control}
                                render={({ field }) => <TextField {...field} label="Phone" fullWidth />}
                            />
                            <FormControl fullWidth error={!!errors.status}>
                                <InputLabel>Status</InputLabel>
                                <Controller
                                    name="status"
                                    control={control}
                                    rules={{ required: 'Status is required' }}
                                    render={({ field }) => (
                                        <Select {...field} label="Status">
                                            {leadStatusOptions.map(option => (
                                                <MenuItem key={option} value={option}>{option}</MenuItem>
                                            ))}
                                        </Select>
                                    )}
                                />
                                {errors.status && <FormHelperText>{(errors as any).status.message}</FormHelperText>}
                            </FormControl>
                        </Box>
                        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2 }}>
                            <FormControl fullWidth>
                                <InputLabel>Assigned To</InputLabel>
                                <Controller
                                    name="assignedTo"
                                    control={control}
                                    render={({ field }) => (
                                        <Select {...field} label="Assigned To">
                                            <MenuItem value=""><em>None</em></MenuItem>
                                            {employees.map(employee => (
                                                <MenuItem key={employee.id} value={employee.id}>{employee.name}</MenuItem>
                                            ))}
                                        </Select>
                                    )}
                                />
                            </FormControl>
                            <Controller
                                name="company"
                                control={control}
                                render={({ field }) => <TextField {...field} label="Company" fullWidth />}
                            />
                        </Box>
                        <Controller
                            name="notes"
                            control={control}
                            render={({ field }) => <TextField {...field} label="Notes" fullWidth multiline rows={4} />}
                        />
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={onClose}>Cancel</Button>
                    <Button type="submit" variant="contained">{lead ? 'Save' : 'Add'}</Button>
                </DialogActions>
            </form>
        </Dialog>
    );
};

export default LeadForm;
