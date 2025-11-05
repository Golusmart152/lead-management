
import React, { useState } from 'react';
import {
    Box,
    TextField,
    Button,
    FormControl,
    InputLabel,
    Select,
    MenuItem
} from '@mui/material';
import { addFollowUp } from '../../../services/db-service';
import type { FollowUp } from '../../../services/db-service';

interface FollowUpFormProps {
    leadId: string;
    onFollowUpAdded: (followUp: FollowUp) => void;
}

const FollowUpForm: React.FC<FollowUpFormProps> = ({ leadId, onFollowUpAdded }) => {
    const [notes, setNotes] = useState('');
    const [dueDate, setDueDate] = useState('');
    const [status, setStatus] = useState<'Pending' | 'Completed'>('Pending');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!leadId) return;
        try {
            const newFollowUp = await addFollowUp(leadId, {
                notes,
                dueDate,
                status,
            });
            onFollowUpAdded(newFollowUp);
            setNotes('');
            setDueDate('');
            setStatus('Pending');
        } catch (error) {
            console.error("Error adding follow-up:", error);
        }
    };

    return (
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
            <TextField
                label="Notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                fullWidth
                required
                multiline
                rows={3}
                margin="normal"
            />
            <TextField
                label="Due Date"
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                fullWidth
                required
                InputLabelProps={{
                    shrink: true,
                }}
                margin="normal"
            />
            <FormControl fullWidth margin="normal">
                <InputLabel>Status</InputLabel>
                <Select
                    value={status}
                    label="Status"
                    onChange={(e) => setStatus(e.target.value as 'Pending' | 'Completed')}
                >
                    <MenuItem value="Pending">Pending</MenuItem>
                    <MenuItem value="Completed">Completed</MenuItem>
                </Select>
            </FormControl>
            <Button type="submit" variant="contained" sx={{ mt: 2 }}>
                Add Follow-Up
            </Button>
        </Box>
    );
};

export default FollowUpForm;
