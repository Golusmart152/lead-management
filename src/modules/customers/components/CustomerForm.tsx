import React, { useEffect } from 'react';
import { useForm, Controller, type SubmitHandler } from 'react-hook-form';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '../../../components/ui/dialog';
import { Button } from '../../../components/ui/button';
import { Card, CardContent } from '../../../components/ui/card';
import { Input } from '../../../components/ui/input';
import { Textarea } from '../../../components/ui/textarea';
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
    phone?: string;
    company?: string;
    address?: string;
}

const CustomerForm: React.FC<CustomerFormProps> = ({ open, onClose, onSubmit, customer }) => {
    const {
        control,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<CustomerFormData>({
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
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>{customer ? 'Edit Customer' : 'Add Customer'}</DialogTitle>
                    <DialogDescription>
                        {customer ? 'Update customer information below.' : 'Add a new customer to your database.'}
                    </DialogDescription>
                </DialogHeader>
                <Card>
                    <CardContent>
                        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
                            <div className="space-y-2">
                                <label htmlFor="name" className="text-sm font-medium text-[#a0a0b2] block mb-1">Name</label>
                                <Controller
                                    name="name"
                                    control={control}
                                    rules={{ required: 'Name is required' }}
                                    render={({ field }) => (
                                        <Input
                                            {...field}
                                            id="name"
                                            placeholder="Enter name"
                                            className={errors.name ? "border-red-500" : ""}
                                        />
                                    )}
                                />
                                {errors.name && (
                                    <p className="text-sm text-red-600">{errors.name?.message}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="email" className="text-sm font-medium text-[#a0a0b2] block mb-1">Email</label>
                                <Controller
                                    name="email"
                                    control={control}
                                    rules={{ required: 'Email is required', pattern: { value: /\S+@\S+\.\S+/, message: 'Invalid email' } }}
                                    render={({ field }) => (
                                        <Input
                                            {...field}
                                            id="email"
                                            type="email"
                                            placeholder="Enter email"
                                            className={errors.email ? "border-red-500" : ""}
                                        />
                                    )}
                                />
                                {errors.email && (
                                    <p className="text-sm text-red-600">{errors.email?.message}</p>
                                )}
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label htmlFor="phone" className="text-sm font-medium text-[#a0a0b2] block mb-1">Phone</label>
                                    <Controller
                                        name="phone"
                                        control={control}
                                        render={({ field }) => (
                                            <Input
                                                {...field}
                                                id="phone"
                                                placeholder="Enter phone"
                                            />
                                        )}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label htmlFor="company" className="text-sm font-medium text-[#a0a0b2] block mb-1">Company</label>
                                    <Controller
                                        name="company"
                                        control={control}
                                        render={({ field }) => (
                                            <Input
                                                {...field}
                                                id="company"
                                                placeholder="Enter company"
                                            />
                                        )}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="address" className="text-sm font-medium text-[#a0a0b2] block mb-1">Address</label>
                                <Controller
                                    name="address"
                                    control={control}
                                    render={({ field }) => (
                                        <Textarea
                                            {...field}
                                            id="address"
                                            placeholder="Enter address"
                                            rows={3}
                                        />
                                    )}
                                />
                            </div>
                        <div className="flex justify-end items-center space-x-3 pt-1">
                            <Button variant="link" type="button" onClick={onClose}>Cancel</Button>
                            <Button type="submit">
                                {customer ? 'Save' : 'Add'}
                            </Button>
                        </div>
                        </form>
                    </CardContent>
                </Card>
            </DialogContent>
        </Dialog>
    );
};

export default CustomerForm;
