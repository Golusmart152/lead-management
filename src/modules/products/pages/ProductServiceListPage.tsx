
import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Button,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    IconButton
} from '@mui/material';
import { Add, Edit, Delete, Visibility as VisibilityIcon } from '@mui/icons-material';
import { getProductsOrServices, addProductOrService, updateProductOrService, deleteProductOrService } from '../services/product-service';
import type { ProductOrService } from '../services/product-service';
import AddProductServiceModal from '../components/AddProductServiceModal';
import EditProductServiceModal from '../components/EditProductServiceModal';
import { useNavigate } from 'react-router-dom';

const ProductServiceListPage: React.FC = () => {
    const [products, setProducts] = useState<ProductOrService[]>([]);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<ProductOrService | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        const products = await getProductsOrServices();
        setProducts(products);
    };

    const handleOpenAddModal = () => {
        setIsAddModalOpen(true);
    };

    const handleCloseAddModal = () => {
        setIsAddModalOpen(false);
    };

    const handleAddProduct = async (product: Omit<ProductOrService, 'id' | 'uuid' | 'visibleId'>) => {
        await addProductOrService(product);
        fetchProducts();
        handleCloseAddModal();
    };

    const handleEditProduct = (product: ProductOrService) => {
        setEditingProduct(product);
        setIsEditModalOpen(true);
    };

    const handleUpdateProduct = async (product: ProductOrService) => {
        if (product && product.id) {
            const { id, ...updates } = product;
            await updateProductOrService(id, updates);
            fetchProducts();
            setIsEditModalOpen(false);
            setEditingProduct(null);
        }
    };

    const handleDeleteProduct = async (id: string) => {
        await deleteProductOrService(id);
        fetchProducts();
    };

    const handleViewProduct = (id: string) => {
        navigate(`/products/${id}`);
    };

    return (
        <Box sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h4">Products and Services</Typography>
                <Button variant="contained" startIcon={<Add />} onClick={handleOpenAddModal}>
                    Add New
                </Button>
            </Box>
            <AddProductServiceModal open={isAddModalOpen} onClose={handleCloseAddModal} onAddProduct={handleAddProduct} />
            {editingProduct && (
                <EditProductServiceModal
                    open={isEditModalOpen}
                    onClose={() => {
                        setIsEditModalOpen(false);
                        setEditingProduct(null);
                    }}
                    product={editingProduct}
                    onUpdate={handleUpdateProduct}
                />
            )}
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>Name</TableCell>
                            <TableCell>Description</TableCell>
                            <TableCell>Type</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {products.map((product) => (
                            <TableRow key={product.id}>
                                <TableCell>{product.visibleId}</TableCell>
                                <TableCell>{product.name}</TableCell>
                                <TableCell>{product.description}</TableCell>
                                <TableCell>{product.type}</TableCell>
                                <TableCell>
                                    <IconButton onClick={() => handleViewProduct(product.id)}>
                                        <VisibilityIcon />
                                    </IconButton>
                                    <IconButton onClick={() => handleEditProduct(product)}>
                                        <Edit />
                                    </IconButton>
                                    <IconButton onClick={() => handleDeleteProduct(product.id)}>
                                        <Delete />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
};

export default ProductServiceListPage;
