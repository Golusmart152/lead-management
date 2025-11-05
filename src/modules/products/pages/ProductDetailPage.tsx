
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
    Box, 
    Typography, 
    CircularProgress, 
    Card, 
    CardContent, 
    Grid, 
    Button,
    Paper
} from '@mui/material';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import { getProduct } from '../services/product-service';
import type { Product } from '../types';

const ProductDetailPage: React.FC = () => {
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProduct = async () => {
            if (id) {
                try {
                    const fetchedProduct = await getProduct(id);
                    setProduct(fetchedProduct);
                } catch (error) {
                    console.error("Error fetching product:", error);
                }
            }
            setLoading(false);
        };

        fetchProduct();
    }, [id]);

    if (loading) {
        return <CircularProgress />;
    }

    if (!product) {
        return <Typography>Product not found</Typography>;
    }

    return (
        <Box sx={{ p: 3 }}>
            <Button 
                startIcon={<ArrowBackIcon />} 
                onClick={() => navigate('/products')} 
                sx={{ mb: 2 }}
            >
                Back to Products
            </Button>
            <Paper elevation={3} sx={{ p: 4, borderRadius: '12px' }}>
                <Grid container spacing={4}>
                    <Grid item xs={12}>
                        <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                            {product.name}
                        </Typography>
                        <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 2 }}>
                            ID: {product.visibleId}
                        </Typography>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Card sx={{ height: '100%' }}>
                            <CardContent>
                                <Typography variant="h6" gutterBottom>Details</Typography>
                                <Typography variant="body1"><strong>UUID:</strong> {product.uuid}</Typography>
                                <Typography variant="body1"><strong>Price:</strong> ${product.price.toFixed(2)}</Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Card sx={{ height: '100%' }}>
                            <CardContent>
                                <Typography variant="h6" gutterBottom>Description</Typography>
                                <Typography variant="body1">{product.description}</Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            </Paper>
        </Box>
    );
};

export default ProductDetailPage;
