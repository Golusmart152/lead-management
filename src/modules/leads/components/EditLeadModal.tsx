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
import { addFollowUp } from '../../../services/db-service';
import type { Lead, LeadStatus } from '../../../services/db-service';
import { useNotification } from '../../../modules/notifications/NotificationProvider';

interface EditLeadModalProps {
    open: boolean;
    onClose: () => void;
    lead: Lead | null;
    onUpdate: (lead: Lead) => void;
}

const leadStatuses: LeadStatus[] = [
    'New',
    'Contacted',
    'Follow-Up Scheduled',
    'Interested',
    'Not Interested',
    'Callback Requested',
    'In Progress / Under Discussion',
    'Converted / Closed-Won',
    'Lost / Closed-Lost',
    'Disqualified',
];

const EditLeadModal: React.FC<EditLeadModalProps> = ({ open, onClose, lead, onUpdate }) => {
    const [editedLead, setEditedLead] = useState<Lead | null>(lead);
    const [isEditing, setIsEditing] = useState(false);
    const [showFollowUpFields, setShowFollowUpFields] = useState(false);
    const [followUpDate, setFollowUpDate] = useState('');
    const [followUpTime, setFollowUpTime] = useState('');
    const { showNotification } = useNotification();

    useEffect(() => {
        setEditedLead(lead);
        setIsEditing(false);
        if (open) {
            const now = new Date();
            const currentDate = now.toISOString().split('T')[0];
            const currentTime = now.toTimeString().split(' ')[0].substring(0, 5);
            setFollowUpDate(currentDate);
            setFollowUpTime(currentTime);
        }
        if (lead?.status === 'Follow-Up Scheduled' || lead?.status === 'Callback Requested') {
            setShowFollowUpFields(true);
        } else {
            setShowFollowUpFields(false);
        }
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
            if (newStatus === 'Follow-Up Scheduled' || newStatus === 'Callback Requested') {
                setShowFollowUpFields(true);
            } else {
                setShowFollowUpFields(false);
            }
        }
    };

    const handleSave = async () => {
        if (editedLead) {
            onUpdate(editedLead);
            if ((editedLead.status === 'Follow-Up Scheduled' || editedLead.status === 'Callback Requested') && followUpDate && followUpTime) {
                const scheduledDateTime = new Date(`${followUpDate}T${followUpTime}`);
                await addFollowUp(editedLead.id, {
                    notes: `Follow-up for ${editedLead.name}`,
                    dueDate: scheduledDateTime.toISOString(),
                    status: 'Pending',
                    date: followUpDate,
                    time: followUpTime,
                    type: editedLead.status,
                });
            }
            showNotification('Lead updated successfully!', 'success');
            onClose();
        }
    };

    const handleEditToggle = () => {
        setIsEditing(!isEditing);
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
                            disabled={!isEditing}
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            label="Email"
                            name="email"
                            value={editedLead.email}
                            onChange={handleInputChange}
                            disabled={!isEditing}
                        />
                        <TextField
                            margin="normal"
                            fullWidth
                            label="Phone"
                            name="phone"
                            value={editedLead.phone}
                            onChange={handleInputChange}
                            disabled={!isEditing}
                        />
                        <TextField
                            margin="normal"
                            fullWidth
                            label="Company"
                            name="company"
                            value={editedLead.company}
                            onChange={handleInputChange}
                            disabled={!isEditing}
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
                        {showFollowUpFields && (
                            <>
                                <TextField
                                    margin="normal"
                                    required
                                    fullWidth
                                    label="Follow-up Date"
                                    name="followUpDate"
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
                                    name="followUpTime"
                                    type="time"
                                    value={followUpTime}
                                    onChange={(e) => setFollowUpTime(e.target.value)}
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                />
                            </>
                        )}
                        <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                            <Button onClick={onClose}>Close</Button>
                            <Button onClick={handleEditToggle} variant="outlined">{isEditing ? 'Cancel' : 'Edit'}</Button>
                            <Button onClick={handleSave} variant="contained">Save</Button>
                        </Box>
                    </>
                )}
            </Box>
        </Modal>
    );
};

export default EditLeadModal;
