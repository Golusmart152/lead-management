
import React, { useEffect } from 'react';
import { useForm, Controller, type SubmitHandler } from 'react-hook-form';
import { type Product } from '../types';
import { Input } from '../../../components/ui/input';
import { Textarea } from '../../../components/ui/textarea';
import { Button } from '../../../components/ui/button';

interface ProductFormProps {
    open: boolean;
    onClose: () => void;
    onSubmit: (product: Omit<Product, 'id'> | Product) => void;
    product?: Product | null;
}

const ProductForm: React.FC<ProductFormProps> = ({ open, onClose, onSubmit, product }) => {
    const { control, handleSubmit, reset, formState: { errors } } = useForm<Omit<Product, 'id'> | Product>({
        defaultValues: product || {
            name: '',
            description: '',
            price: 0,
            category: '',
            stock: 0,
            imageUrl: '',
        }
    });

    useEffect(() => {
        if (open) {
            reset(product || {
                name: '',
                description: '',
                price: 0,
                category: '',
                stock: 0,
                imageUrl: '',
            } as Omit<Product, 'id'>);
        }
    }, [product, open, reset]);

    const handleFormSubmit: SubmitHandler<Omit<Product, 'id'> | Product> = (data) => {
        onSubmit(data);
        onClose();
    };

    if (!open) return null;

    return (
        <div className="min-h-screen flex items-center justify-center py-14 px-4 relative z-10">
            <div className="card-bg-neo w-full max-w-md p-8 md:p-10 shadow-2xl border border-[#24263d] space-y-7">
                <h2 className="text-3xl font-bold text-white text-center pb-2 tracking-tight">
                    {product ? 'Edit Product' : 'Add New Product'}
                </h2>
                <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
                    <div>
                        <label htmlFor="name" className="text-sm font-medium text-[#a0a0b2] block mb-1">Product Name</label>
                        <Controller
                            name="name"
                            control={control}
                            rules={{ required: 'Name is required' }}
                            render={({ field }) => (
                                <Input
                                    {...field}
                                    id="name"
                                    placeholder="Enter product name"
                                    className={errors.name ? 'border-red-500' : ''}
                                />
                            )}
                        />
                        {errors.name && (
                            <p className="text-sm text-red-600">{errors.name.message}</p>
                        )}
                    </div>

                    <div>
                        <label htmlFor="category" className="text-sm font-medium text-[#a0a0b2] block mb-1">Category</label>
                        <Controller
                            name="category"
                            control={control}
                            rules={{ required: 'Category is required' }}
                            render={({ field }) => (
                                <Input
                                    {...field}
                                    id="category"
                                    placeholder="Product category"
                                    className={errors.category ? 'border-red-500' : ''}
                                />
                            )}
                        />
                        {errors.category && (
                            <p className="text-sm text-red-600">{errors.category.message}</p>
                        )}
                    </div>

                    <div>
                        <label htmlFor="price" className="text-sm font-medium text-[#a0a0b2] block mb-1">Price</label>
                        <Controller
                            name="price"
                            control={control}
                            rules={{
                                required: 'Price is required',
                                min: { value: 0, message: 'Price cannot be negative' }
                            }}
                            render={({ field }) => (
                                <Input
                                    {...field}
                                    id="price"
                                    type="number"
                                    step="0.01"
                                    placeholder="0.00"
                                    className={errors.price ? 'border-red-500' : ''}
                                    onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                                />
                            )}
                        />
                        {errors.price && (
                            <p className="text-sm text-red-600">{errors.price.message}</p>
                        )}
                    </div>

                    <div>
                        <label htmlFor="description" className="text-sm font-medium text-[#a0a0b2] block mb-1">Description</label>
                        <Controller
                            name="description"
                            control={control}
                            rules={{ required: 'Description is required' }}
                            render={({ field }) => (
                                <Textarea
                                    {...field}
                                    id="description"
                                    placeholder="Product description"
                                    rows={4}
                                    className={errors.description ? 'border-red-500' : ''}
                                />
                            )}
                        />
                        {errors.description && (
                            <p className="text-sm text-red-600">{errors.description.message}</p>
                        )}
                    </div>

                    <div className="flex justify-end items-center space-x-3 pt-1">
                        <Button variant="link" type="button" onClick={onClose}>Cancel</Button>
                        <Button type="submit" disabled={false}>
                            {product ? 'Save Changes' : 'Add Product'}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ProductForm;
