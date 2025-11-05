
import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    Grid,
} from '@mui/material';
import type { Customer } from '../types';

interface CustomerFormProps {
    open: boolean;
    onClose: () => void;
    onSubmit: (data: Omit<Customer, 'id' | 'uuid' | 'visibleId'> | Customer) => void;
    customer: Omit<Customer, 'id' | 'uuid' | 'visibleId'> | Customer | null;
}

const CustomerForm: React.FC<CustomerFormProps> = ({ open, onClose, onSubmit, customer }) => {
    const { control, handleSubmit, formState: { errors } } = useForm<Omit<Customer, 'id' | 'uuid' | 'visibleId'> | Customer>({ defaultValues: customer || {} });

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>{customer ? 'Edit Customer' : 'Add Customer'}</DialogTitle>
            <DialogContent>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <Grid container spacing={2} sx={{ mt: 1 }}>
                        <Grid item xs={12}>
                            <Controller
                                name="name"
                                control={control}
                                defaultValue=""
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
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Controller
                                name="email"
                                control={control}
                                defaultValue=""
                                rules={{ required: 'Email is required', pattern: { value: /\S+@\S+\.\S+/, message: 'Invalid email' } }}
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
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Controller
                                name="phone"
                                control={control}
                                defaultValue=""
                                render={({ field }) => <TextField {...field} label="Phone" fullWidth />}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Controller
                                name="address"
                                control={control}
                                defaultValue=""
                                render={({ field }) => <TextField {...field} label="Address" fullWidth />}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Controller
                                name="company"
                                control={control}
                                defaultValue=""
                                render={({ field }) => <TextField {...field} label="Company" fullWidth />}
                            />
                        </Grid>
                    </Grid>
                </form>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
                <Button onClick={handleSubmit(onSubmit)} variant="contained">
                    {customer ? 'Save' : 'Add'}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default CustomerForm;
