
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { 
    Box, 
    Button, 
    Typography, 
    CircularProgress, 
    Alert, 
    Card, 
    CardContent, 
    CardActions 
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon, ArrowForward as ArrowForwardIcon } from '@mui/icons-material';
import { Link } from 'react-router-dom';
import { getProducts, addProduct, updateProduct, deleteProduct } from '../services/product-service';
import { type Product } from '../types';
import ProductForm from '../components/ProductForm';

const ProductsPage: React.FC = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [isFormOpen, setIsFormOpen] = useState<boolean>(false);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

    const fetchProducts = useCallback(async () => {
        try {
            setLoading(true);
            const data = await getProducts();
            setProducts(data);
        } catch {
            setError('Failed to fetch products. Please try again later.');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    const handleFormOpen = useCallback((product: Product | null = null) => {
        setSelectedProduct(product);
        setIsFormOpen(true);
    }, []);

    const handleFormClose = useCallback(() => {
        setSelectedProduct(null);
        setIsFormOpen(false);
    }, []);

    const handleFormSubmit = useCallback(async (productData: Product | Omit<Product, 'id'>) => {
        try {
            if (selectedProduct) {
                await updateProduct(selectedProduct.id, productData as Product);
            } else {
                await addProduct(productData as Omit<Product, 'id'>);
            }
            fetchProducts();
            handleFormClose();
        } catch {
            setError('Failed to save product.');
        }
    }, [fetchProducts, handleFormClose, selectedProduct]);

    const handleDelete = useCallback(async (id: string) => {
        try {
            await deleteProduct(id);
            fetchProducts();
        } catch {
            setError('Failed to delete product.');
        }
    }, [fetchProducts]);

    const productContent = useMemo(() => {
        if (loading) {
            return (
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
                    <CircularProgress />
                </Box>
            );
        }

        if (error) {
            return <Alert severity="error">{error}</Alert>;
        }

        if (products.length === 0) {
            return (
                <Box sx={{ textAlign: 'center', mt: 4 }}>
                    <Typography variant="h6">No products found.</Typography>
                    <Button variant="contained" startIcon={<AddIcon />} sx={{ mt: 2 }} onClick={() => handleFormOpen()}>
                        Add New Product
                    </Button>
                </Box>
            );
        }

        return (
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr' }, gap: 3 }}>
                {products.map((product) => (
                    <Card key={product.id} sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                        <CardContent sx={{ flexGrow: 1 }}>
                            <Typography variant="h6">{product.name}</Typography>
                            <Typography variant="body2" color="text.secondary">${product.price?.toFixed(2)}</Typography>
                        </CardContent>
                        <CardActions>
                            <Button component={Link} to={`/products/${product.id}`}><ArrowForwardIcon /></Button>
                            <Button onClick={() => handleFormOpen(product)}><EditIcon /></Button>
                            <Button onClick={() => handleDelete(product.id)}><DeleteIcon /></Button>
                        </CardActions>
                    </Card>
                ))}
            </Box>
        );
    }, [loading, error, products, handleDelete, handleFormOpen]);

    return (
        <Box sx={{ p: { xs: 2, md: 4 } }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                <Typography variant="h4" component="h1">
                    Products
                </Typography>
                <Button variant="contained" startIcon={<AddIcon />} onClick={() => handleFormOpen()}>
                    Add Product
                </Button>
            </Box>

            {productContent}

            <ProductForm 
                open={isFormOpen} 
                onClose={handleFormClose} 
                onSubmit={handleFormSubmit} 
                product={selectedProduct} 
            />
        </Box>
    );
};

export default ProductsPage;
