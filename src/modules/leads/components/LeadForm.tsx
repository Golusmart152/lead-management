
import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    Grid,
    FormControl,
    InputLabel,
    Select,
    MenuItem
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
    const { control, handleSubmit, formState: { errors } } = useForm<Omit<Lead, 'id' | 'uuid' | 'visibleId'> | Lead>({ 
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

    const leadStatusOptions: LeadStatus[] = ['new', 'contacted', 'qualified', 'unqualified', 'proposal', 'negotiation', 'won', 'lost'];

    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
            <DialogTitle>{lead ? 'Edit Lead' : 'Add Lead'}</DialogTitle>
            <DialogContent>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <Grid container spacing={3} sx={{ mt: 1 }}>
                        <Grid item xs={12} sm={6}>
                            <Controller
                                name="name"
                                control={control}
                                rules={{ required: 'Name is required' }}
                                render={({ field }) => <TextField {...field} label="Name" fullWidth error={!!errors.name} helperText={errors.name?.message} />}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Controller
                                name="email"
                                control={control}
                                rules={{ required: 'Email is required', pattern: { value: /^\S+@\S+\.\S+$/, message: 'Invalid email' } }}
                                render={({ field }) => <TextField {...field} label="Email" fullWidth error={!!errors.email} helperText={errors.email?.message} />}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Controller
                                name="phone"
                                control={control}
                                render={({ field }) => <TextField {...field} label="Phone" fullWidth />}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
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
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={6}>
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
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Controller
                                name="company"
                                control={control}
                                render={({ field }) => <TextField {...field} label="Company" fullWidth />}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Controller
                                name="notes"
                                control={control}
                                render={({ field }) => <TextField {...field} label="Notes" fullWidth multiline rows={4} />}
                            />
                        </Grid>
                    </Grid>
                </form>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
                <Button onClick={handleSubmit(onSubmit)} variant="contained">{lead ? 'Save' : 'Add'}</Button>
            </DialogActions>
        </Dialog>
    );
};

export default LeadForm;
