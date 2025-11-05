
import React, { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import {
    Button,
    TextField,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Grid,
    MenuItem,
    Select,
    FormControl,
    InputLabel,
    IconButton,
    Typography,
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import { motion } from 'framer-motion';
import type { Product } from '../types';

interface ProductFormProps {
    open: boolean;
    onClose: () => void;
    onSubmit: (product: Omit<Product, 'id' | 'uuid' | 'visibleId'> | Product) => void;
    product?: Product | null;
}

const ProductForm: React.FC<ProductFormProps> = ({ open, onClose, onSubmit, product }) => {
    const { control, handleSubmit, watch, reset, formState: { errors } } = useForm<Omit<Product, 'id' | 'uuid' | 'visibleId'> | Product>({
        defaultValues: {
            name: '',
            description: '',
            price: 0,
            category: '',
            type: 'Product',
        }
    });

    const productType = watch('type');

    useEffect(() => {
        if (open) {
            reset(product || {
                name: '',
                description: '',
                price: 0,
                category: '',
                type: 'Product',
            });
        }
    }, [product, open, reset]);

    const MotionGrid = motion(Grid);

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 4 } }}>
            <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', bgcolor: 'primary.main', color: 'common.white', p: 2 }}>
                <Typography variant="h6">{product ? 'Edit Product' : 'Add New Product'}</Typography>
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
                                render={({ field }) => <TextField {...field} label="Product Name" fullWidth variant="outlined" error={!!errors.name} helperText={errors.name?.message} />}
                            />
                        </MotionGrid>
                        <MotionGrid item xs={12} sm={6} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                            <Controller
                                name="type"
                                control={control}
                                render={({ field }) => (
                                    <FormControl fullWidth variant="outlined">
                                        <InputLabel>Type</InputLabel>
                                        <Select {...field} label="Type">
                                            <MenuItem value="Product">Product</MenuItem>
                                            <MenuItem value="Service">Service</MenuItem>
                                        </Select>
                                    </FormControl>
                                )}
                            />
                        </MotionGrid>
                        <MotionGrid item xs={12} sm={6} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                            <Controller
                                name="category"
                                control={control}
                                rules={{ required: 'Category is required' }}
                                render={({ field }) => <TextField {...field} label="Category" fullWidth variant="outlined" error={!!errors.category} helperText={errors.category?.message} />}
                            />
                        </MotionGrid>
                        <MotionGrid item xs={12} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
                            <Controller
                                name="description"
                                control={control}
                                rules={{ required: 'Description is required' }}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        label="Description"
                                        fullWidth
                                        multiline
                                        rows={4}
                                        variant="outlined"
                                        error={!!errors.description}
                                        helperText={errors.description?.message}
                                    />
                                )}
                            />
                        </MotionGrid>
                        {productType === 'Product' && (
                            <MotionGrid item xs={12} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
                                <Controller
                                    name="price"
                                    control={control}
                                    rules={{ required: 'Price is required', min: { value: 0, message: 'Price cannot be negative' } }}
                                    render={({ field }) => (
                                        <TextField {...field} label="Price" type="number" fullWidth variant="outlined" error={!!errors.price} helperText={errors.price?.message} />
                                    )}
                                />
                            </MotionGrid>
                        )}
                    </Grid>
                </DialogContent>
                <DialogActions sx={{ p: 2, bgcolor: 'background.default' }}>
                    <Button onClick={onClose} color="secondary">Cancel</Button>
                    <Button type="submit" variant="contained" color="primary">{product ? 'Save Changes' : 'Add Product'}</Button>
                </DialogActions>
            </form>
        </Dialog>
    );
};

export default ProductForm;
