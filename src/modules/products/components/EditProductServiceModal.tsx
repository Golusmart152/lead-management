
import React, { useState, useEffect } from 'react';
import {
    Modal,
    Box,
    Typography,
    TextField,
    Button,
    FormControl,
    InputLabel,
    Select,
    MenuItem
} from '@mui/material';
import type { ProductOrService, ProductServiceType } from '../services/product-service';

interface EditProductServiceModalProps {
    open: boolean;
    onClose: () => void;
    product: ProductOrService;
    onUpdate: (product: ProductOrService) => void;
}

const style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
    borderRadius: 2,
};

const EditProductServiceModal: React.FC<EditProductServiceModalProps> = ({ open, onClose, product, onUpdate }) => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [type, setType] = useState<ProductServiceType>('Product');

    useEffect(() => {
        if (product) {
            setName(product.name);
            setDescription(product.description);
            setType(product.type);
        }
    }, [product]);

    const handleSubmit = () => {
        onUpdate({ ...product, name, description, type });
    };

    return (
        <Modal open={open} onClose={onClose}>
            <Box sx={style}>
                <Typography variant="h6" component="h2">Edit Product/Service</Typography>
                <TextField
                    margin="normal"
                    required
                    fullWidth
                    label="Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
                <TextField
                    margin="normal"
                    required
                    fullWidth
                    label="Description"
                    multiline
                    rows={4}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />
                <FormControl fullWidth margin="normal">
                    <InputLabel id="type-select-label">Type</InputLabel>
                    <Select
                        labelId="type-select-label"
                        value={type}
                        label="Type"
                        onChange={(e) => setType(e.target.value as ProductServiceType)}
                    >
                        <MenuItem value="Product">Product</MenuItem>
                        <MenuItem value="Service">Service</MenuItem>
                    </Select>
                </FormControl>
                <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    sx={{ mt: 3, mb: 2 }}
                    onClick={handleSubmit}
                >
                    Update Product/Service
                </Button>
            </Box>
        </Modal>
    );
};

export default EditProductServiceModal;
