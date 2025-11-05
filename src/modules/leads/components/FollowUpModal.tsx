
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
import { addFollowUp, updateLead } from '../../../services/db-service';
import type { Lead, LeadStatus, FollowUp } from '../../../services/db-service';
import { useNotification } from '../../notifications/useNotification';

interface FollowUpModalProps {
    open: boolean;
    onClose: () => void;
    lead: Lead | null;
    onFollowUpAdded: () => void;
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

const FollowUpModal: React.FC<FollowUpModalProps> = ({ open, onClose, lead, onFollowUpAdded }) => {
    const [notes, setNotes] = useState('');
    const [followUpDate, setFollowUpDate] = useState('');
    const [followUpTime, setFollowUpTime] = useState('');
    const [status, setStatus] = useState<LeadStatus | ''>(lead?.status || '');
    const { showNotification } = useNotification();

    useEffect(() => {
        if (open) {
            const now = new Date();
            const currentDate = now.toISOString().split('T')[0];
            const currentTime = now.toTimeString().split(' ')[0].substring(0, 5);
            setFollowUpDate(currentDate);
            setFollowUpTime(currentTime);
            setStatus(lead?.status || 'contacted');
            setNotes('');
        }
    }, [open, lead]);

    const handleStatusChange = (e: SelectChangeEvent) => {
        const newStatus = e.target.value as LeadStatus;
        setStatus(newStatus);
    }

    const handleSave = async () => {
        if (!lead || !status || !followUpDate || !followUpTime) {
            return;
        }

        const followUpDateTime = new Date(`${followUpDate}T${followUpTime}`);
        const newFollowUp: Omit<FollowUp, 'id'> = {
            leadId: lead.id,
            notes,
            dueDate: followUpDateTime.toISOString(),
            status: 'Completed',
            date: followUpDate,
            time: followUpTime,
            type: 'Follow-Up Scheduled'
        };

        await addFollowUp(lead.id, newFollowUp);

        if (status !== lead.status) {
            await updateLead(lead.id, { ...lead, status });
        }

        onFollowUpAdded();
        showNotification('Follow-up added and lead status updated successfully!', 'success');
        onClose();
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
                <Typography variant="h6" component="h2">Add Follow-up</Typography>
                {lead && (
                    <>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            label="Follow-up Date"
                            name="date"
                            type="date"
                            value={followUpDate}
                            onChange={(e) => setFollowUpDate(e.target.value)}
                            InputLabelProps={{
                                shrink: true,
                            }}
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            label="Follow-up Time"
                            name="time"
                            type="time"
                            value={followUpTime}
                            onChange={(e) => setFollowUpTime(e.target.value)}
                            InputLabelProps={{
                                shrink: true,
                            }}
                        />
                        <TextField
                            margin="normal"
                            fullWidth
                            label="Notes"
                            name="notes"
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            multiline
                            rows={4}
                        />
                        <FormControl fullWidth margin="normal">
                            <InputLabel>Status</InputLabel>
                            <Select
                                name="status"
                                value={status}
                                label="Status"
                                onChange={handleStatusChange}
                            >
                                {leadStatuses.map(s => (
                                    <MenuItem key={s} value={s}>{s}</MenuItem>
                                ))}
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

export default FollowUpModal;
