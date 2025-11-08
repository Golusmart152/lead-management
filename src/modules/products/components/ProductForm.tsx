
import React, { useEffect } from 'react';
import { useForm, Controller, type SubmitHandler } from 'react-hook-form';
import { type Product } from '../types';

interface ProductFormProps {
    open: boolean;
    onClose: () => void;
    onSubmit: (product: Omit<Product, 'id'> | Product) => void;
    product?: Product | null;
}

const ProductForm: React.FC<ProductFormProps> = ({ open, onClose, onSubmit, product }) => {
  if (!open) return null;
    const { control, handleSubmit, reset, formState: { errors } } = useForm<Omit<Product, 'id'> | Product>({
        defaultValues: {
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
                                <input
                                    {...field}
                                    id="name"
                                    placeholder="Enter product name"
                                    className={`w-full bg-[#161b26] border border-[#21243b] rounded-lg p-3 focus:ring-[#3b82f6] focus:border-[#3b82f6] outline-none text-white text-sm transition placeholder:text-[#767692] ${errors.name ? 'border-red-500' : ''}`}
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
                                <input
                                    {...field}
                                    id="category"
                                    placeholder="Product category"
                                    className={`w-full bg-[#161b26] border border-[#21243b] rounded-lg p-3 focus:ring-[#3b82f6] focus:border-[#3b82f6] outline-none text-white text-sm transition placeholder:text-[#767692] ${errors.category ? 'border-red-500' : ''}`}
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
                                <input
                                    {...field}
                                    id="price"
                                    type="number"
                                    step="0.01"
                                    placeholder="0.00"
                                    className={`w-full bg-[#161b26] border border-[#21243b] rounded-lg p-3 focus:ring-[#3b82f6] focus:border-[#3b82f6] outline-none text-white text-sm transition placeholder:text-[#767692] ${errors.price ? 'border-red-500' : ''}`}
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
                                <textarea
                                    {...field}
                                    id="description"
                                    placeholder="Product description"
                                    rows={4}
                                    className={`w-full bg-[#161b26] border border-[#21243b] rounded-lg p-3 focus:ring-[#3b82f6] focus:border-[#3b82f6] outline-none text-white text-sm transition placeholder:text-[#767692] resize-none ${errors.description ? 'border-red-500' : ''}`}
                                />
                            )}
                        />
                        {errors.description && (
                            <p className="text-sm text-red-600">{errors.description.message}</p>
                        )}
                    </div>

                    <div className="flex justify-end items-center space-x-3 pt-1">
                        <button type="button" className="btn-link text-sm py-2.5 px-3" onClick={onClose}>
                            Cancel
                        </button>
                        <button type="submit" className="btn-accent py-2.5 px-6 text-sm shadow-lg" disabled={false}>
                            {product ? 'Save Changes' : 'Add Product'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ProductForm;
