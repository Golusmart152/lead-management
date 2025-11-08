import React, { useEffect } from 'react';
import { useForm, Controller, type SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '../../../components/ui/dialog';
import { Button } from '../../../components/ui/button';
import { Card, CardContent } from '../../../components/ui/card';
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
                                    render={({ field }) => (
                                        <input
                                            {...field}
                                            id="name"
                                            placeholder="Enter name"
                                            className={`w-full bg-[#161b26] border border-[#21243b] rounded-lg p-3 focus:ring-[#3b82f6] focus:border-[#3b82f6] outline-none text-white text-sm transition placeholder:text-[#767692] ${!!errors.name ? "border-red-500" : ""}`}
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
                                    render={({ field }) => (
                                        <input
                                            {...field}
                                            id="email"
                                            type="email"
                                            placeholder="Enter email"
                                            className={`w-full bg-[#161b26] border border-[#21243b] rounded-lg p-3 focus:ring-[#3b82f6] focus:border-[#3b82f6] outline-none text-white text-sm transition placeholder:text-[#767692] ${!!errors.email ? "border-red-500" : ""}`}
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
                                            <input
                                                {...field}
                                                id="phone"
                                                placeholder="Enter phone"
                                                className="w-full bg-[#161b26] border border-[#21243b] rounded-lg p-3 focus:ring-[#3b82f6] focus:border-[#3b82f6] outline-none text-white text-sm transition placeholder:text-[#767692]"
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
                                            <input
                                                {...field}
                                                id="company"
                                                placeholder="Enter company"
                                                className="w-full bg-[#161b26] border border-[#21243b] rounded-lg p-3 focus:ring-[#3b82f6] focus:border-[#3b82f6] outline-none text-white text-sm transition placeholder:text-[#767692]"
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
                                        <textarea
                                            {...field}
                                            id="address"
                                            placeholder="Enter address"
                                            className="w-full bg-[#161b26] border border-[#21243b] rounded-lg p-3 focus:ring-[#3b82f6] focus:border-[#3b82f6] outline-none text-white text-sm transition placeholder:text-[#767692] resize-none"
                                            rows={3}
                                        />
                                    )}
                                />
                            </div>
                        <div className="flex justify-end items-center space-x-3 pt-1">
                            <Button type="button" className="btn-link text-sm py-2.5 px-3" onClick={onClose}>
                                Cancel
                            </Button>
                            <Button type="submit" className="btn-accent py-2.5 px-6 text-sm shadow-lg">
                                {customer ? 'Save' : 'Add'}
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </DialogContent>
        </Dialog>
    );
};

export default CustomerForm;
