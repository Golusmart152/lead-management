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
import type { SelectChangeEvent } from '@mui/material';
import type { Lead, LeadStatus } from '../../../services/db-service';
import { useNotification } from '../../notifications/useNotification';

interface EditLeadModalProps {
    open: boolean;
    onClose: () => void;
    lead: Lead | null;
    onUpdate: (lead: Lead) => void;
    onDelete: (id: string) => void;
}

const leadStatuses: LeadStatus[] = [
    'new',
    'contacted',
    'qualified',
    'unqualified',
    'proposal',
    'negotiation',
    'won',
    'lost',
];

const EditLeadModal: React.FC<EditLeadModalProps> = ({ open, onClose, lead, onUpdate, onDelete }) => {
    const [editedLead, setEditedLead] = useState<Lead | null>(lead);
    const { showNotification } = useNotification();

    useEffect(() => {
        setEditedLead(lead);
    }, [lead, open]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        if (editedLead) {
            setEditedLead({ ...editedLead, [name]: value });
        }
    };

    const handleSelectChange = (e: SelectChangeEvent) => {
        const { name, value } = e.target;
        if (editedLead) {
            const newStatus = value as LeadStatus;
            setEditedLead({ ...editedLead, [name]: newStatus });
        }
    };

    const handleSave = async () => {
        if (editedLead) {
            onUpdate(editedLead);
            showNotification('Lead updated successfully!', 'success');
            onClose();
        }
    };

    const handleDelete = () => {
        if (lead) {
            onDelete(lead.id);
            showNotification('Lead deleted successfully!', 'success');
            onClose();
        }
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
                <Typography variant="h6" component="h2">Edit Lead</Typography>
                {editedLead && (
                    <>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            label="Name"
                            name="name"
                            value={editedLead.name}
                            onChange={handleInputChange}
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            label="Email"
                            name="email"
                            value={editedLead.email}
                            onChange={handleInputChange}
                        />
                        <TextField
                            margin="normal"
                            fullWidth
                            label="Phone"
                            name="phone"
                            value={editedLead.phone || ''}
                            onChange={handleInputChange}
                        />
                        <TextField
                            margin="normal"
                            fullWidth
                            label="Company"
                            name="company"
                            value={editedLead.company || ''}
                            onChange={handleInputChange}
                        />
                        <FormControl fullWidth margin="normal">
                            <InputLabel>Status</InputLabel>
                            <Select
                                name="status"
                                value={editedLead.status}
                                label="Status"
                                onChange={handleSelectChange}
                            >
                                {leadStatuses.map(status => (
                                    <MenuItem key={status} value={status}>{status}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between' }}>
                            <Button onClick={handleDelete} color="error">Delete</Button>
                            <Box>
                                <Button onClick={onClose} sx={{ mr: 1 }}>Close</Button>
                                <Button onClick={handleSave} variant="contained">Save</Button>
                            </Box>
                        </Box>
                    </>
                )}
            </Box>
        </Modal>
    );
};

export default EditLeadModal;
