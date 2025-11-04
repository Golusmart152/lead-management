
import React, { useState } from 'react';
import {
    Modal,
    Box,
    Typography,
    TextField,
    Button
} from '@mui/material';

interface AddNewItemModalProps {
    open: boolean;
    onClose: () => void;
    onSave: (name: string) => void;
    itemName: string;
}

const AddNewItemModal: React.FC<AddNewItemModalProps> = ({ open, onClose, onSave, itemName }) => {
    const [name, setName] = useState('');

    const handleSave = () => {
        onSave(name);
        setName('');
    };

    return (
        <Modal open={open} onClose={onClose}>
            <Box sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: 400,
                bgcolor: 'background.paper',
                borderRadius: '12px',
                boxShadow: 24,
                p: 4,
            }}>
                <Typography variant="h6" component="h2">Add New {itemName}</Typography>
                <TextField
                    margin="normal"
                    required
                    fullWidth
                    label={`${itemName} Name`}
                    name="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
                <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                    <Button onClick={onClose}>Close</Button>
                    <Button onClick={handleSave} variant="contained">Create</Button>
                </Box>
            </Box>
        </Modal>
    );
};

export default AddNewItemModal;
