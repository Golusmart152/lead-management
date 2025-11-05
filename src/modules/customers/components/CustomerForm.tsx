
import React, { useEffect } from 'react';
import { useForm, Controller, type SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { 
    Dialog, 
    DialogTitle, 
    DialogContent, 
    DialogActions, 
    TextField, 
    Button, 
    Box 
} from '@mui/material';
import type { Customer } from '../types';

interface CustomerFormProps {
    open: boolean;
    onClose: () => void;
    onSubmit: (data: Omit<Customer, 'id' | 'uuid' | 'visibleId'> | Customer) => void;
    customer: Customer | null;
}

interface CustomerFormData {
    name: string;
    email: string;
    phone: string;
    company: string;
    address: string;
}

const schema = yup.object().shape({
    name: yup.string().required('Name is required'),
    email: yup.string().email('Invalid email').required('Email is required'),
    phone: yup.string().notRequired(),
    company: yup.string().notRequired(),
    address: yup.string().notRequired(),
});

const CustomerForm: React.FC<CustomerFormProps> = ({ open, onClose, onSubmit, customer }) => {
    const {
        control,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<CustomerFormData>({
        resolver: yupResolver(schema) as any,
        defaultValues: {
            name: '',
            email: '',
            phone: '',
            company: '',
            address: '',
        },
    });

    useEffect(() => {
        if (open) {
            if (customer) {
                reset(customer);
            } else {
                reset({
                    name: '',
                    email: '',
                    phone: '',
                    company: '',
                    address: '',
                });
            }
        }
    }, [customer, open, reset]);

    const handleFormSubmit: SubmitHandler<CustomerFormData> = (data) => {
        onSubmit(data);
        onClose();
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>{customer ? 'Edit Customer' : 'Add Customer'}</DialogTitle>
            <form onSubmit={handleSubmit(handleFormSubmit)}>
                <DialogContent>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
                        <Controller
                            name="name"
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    label="Name"
                                    fullWidth
                                    required
                                    error={!!errors.name}
                                    helperText={errors.name?.message}
                                />
                            )}
                        />
                        <Controller
                            name="email"
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    label="Email"
                                    fullWidth
                                    required
                                    error={!!errors.email}
                                    helperText={errors.email?.message}
                                />
                            )}
                        />
                        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2 }}>
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
                            <Controller
                                name="company"
                                control={control}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        label="Company"
                                        fullWidth
                                        error={!!errors.company}
                                        helperText={errors.company?.message}
                                    />
                                )}
                            />
                        </Box>
                        <Controller
                            name="address"
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    label="Address"
                                    fullWidth
                                    error={!!errors.address}
                                    helperText={errors.address?.message}
                                />
                            )}
                        />
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={onClose}>Cancel</Button>
                    <Button type="submit" variant="contained">{customer ? 'Save' : 'Add'}</Button>
                </DialogActions>
            </form>
        </Dialog>
    );
};

export default CustomerForm;
