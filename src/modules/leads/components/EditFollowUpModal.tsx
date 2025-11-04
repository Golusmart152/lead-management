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
import type { FollowUp } from '../../../services/db-service';
import { useNotification } from '../../../modules/notifications/NotificationProvider';

interface EditFollowUpModalProps {
    open: boolean;
    onClose: () => void;
    followUp: FollowUp | null;
    onUpdate: (followUp: FollowUp) => void;
}

const EditFollowUpModal: React.FC<EditFollowUpModalProps> = ({ open, onClose, followUp, onUpdate }) => {
    const [editedFollowUp, setEditedFollowUp] = useState<FollowUp | null>(followUp);
    const { showNotification } = useNotification();

    useEffect(() => {
        setEditedFollowUp(followUp);
    }, [followUp]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        if (editedFollowUp) {
            setEditedFollowUp({ ...editedFollowUp, [name]: value });
        }
    };

    const handleSelectChange = (e: SelectChangeEvent) => {
        const { name, value } = e.target;
        if (editedFollowUp) {
            setEditedFollowUp({ ...editedFollowUp, [name]: value as 'Pending' | 'Completed' });
        }
    };

    const handleSave = () => {
        if (editedFollowUp) {
            onUpdate(editedFollowUp);
            showNotification('Follow-up updated successfully!', 'success');
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
                <Typography variant="h6" component="h2">Edit Follow-up</Typography>
                {editedFollowUp && (
                    <>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            label="Notes"
                            name="notes"
                            value={editedFollowUp.notes}
                            onChange={handleInputChange}
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            label="Date"
                            name="date"
                            type="date"
                            value={editedFollowUp.date}
                            onChange={handleInputChange}
                            InputLabelProps={{
                                shrink: true,
                            }}
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            label="Time"
                            name="time"
                            type="time"
                            value={editedFollowUp.time}
                            onChange={handleInputChange}
                            InputLabelProps={{
                                shrink: true,
                            }}
                        />
                        <FormControl fullWidth margin="normal">
                            <InputLabel>Status</InputLabel>
                            <Select
                                name="status"
                                value={editedFollowUp.status}
                                label="Status"
                                onChange={handleSelectChange}
                            >
                                <MenuItem value="Pending">Pending</MenuItem>
                                <MenuItem value="Completed">Completed</MenuItem>
                            </Select>
                        </FormControl>
                        <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                            <Button onClick={onClose}>Close</Button>
                            <Button onClick={handleSave} variant="contained">Save</Button>
                        </Box>
                    </>
                )}
            </Box>
        </Modal>
    );
};

export default EditFollowUpModal;