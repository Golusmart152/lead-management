
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
import type { Lead, LeadStatus } from '../../../services/db-service';
import { useNotification } from '../../../modules/notifications/NotificationProvider';

interface FollowUpModalProps {
    open: boolean;
    onClose: () => void;
    lead: Lead | null;
    onFollowUpAdded: () => void;
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

const FollowUpModal: React.FC<FollowUpModalProps> = ({ open, onClose, lead, onFollowUpAdded }) => {
    const [notes, setNotes] = useState('');
    const [followUpDate, setFollowUpDate] = useState('');
    const [followUpTime, setFollowUpTime] = useState('');
    const [scheduledDate, setScheduledDate] = useState('');
    const [scheduledTime, setScheduledTime] = useState('');
    const [status, setStatus] = useState<LeadStatus | ''>(lead?.status || '');
    const [showScheduledTaskFields, setShowScheduledTaskFields] = useState(false);
    const { showNotification } = useNotification();

    useEffect(() => {
        if (open && lead) {
            const now = new Date();
            const currentDate = now.toISOString().split('T')[0];
            const currentTime = now.toTimeString().split(' ')[0].substring(0, 5);
            
            setFollowUpDate(currentDate);
            setFollowUpTime(currentTime);
            setScheduledDate(currentDate);
            setScheduledTime(currentTime);
            setStatus('Contacted');
            setNotes('');

            const shouldShow = lead.status === 'Follow-Up Scheduled' || lead.status === 'Callback Requested';
            setShowScheduledTaskFields(shouldShow);
        } else {
            setNotes('');
            setFollowUpDate('');
            setFollowUpTime('');
            setScheduledDate('');
            setScheduledTime('');
            setStatus('');
            setShowScheduledTaskFields(false);
        }
    }, [open, lead]);

    const handleStatusChange = (e: SelectChangeEvent) => {
        const newStatus = e.target.value as LeadStatus;
        setStatus(newStatus);
        const shouldShow = newStatus === 'Follow-Up Scheduled' || newStatus === 'Callback Requested';
        setShowScheduledTaskFields(shouldShow);
    }

    const handleSave = async () => {
        if (!lead || !status || !followUpDate || !followUpTime) {
            return;
        }

        const isSchedulingTask = status === 'Follow-Up Scheduled' || status === 'Callback Requested';

        if (isSchedulingTask && (!scheduledDate || !scheduledTime)) {
            showNotification('Scheduled date and time are required to schedule a task.', 'error');
            return;
        }

        const taskStatus = isSchedulingTask ? 'Pending' : 'Completed';
        const followUpDateTime = new Date(`${followUpDate}T${followUpTime}`);
        const scheduledDateTime = new Date(`${scheduledDate}T${scheduledTime}`);
        const dueDate = isSchedulingTask ? scheduledDateTime : followUpDateTime;

        let finalNotes = notes;
        if (isSchedulingTask && !notes) {
            finalNotes = `Follow-up for ${lead.name}`;
        }

        if (finalNotes || isSchedulingTask) {
            await addFollowUp(lead.id, {
                notes: finalNotes,
                dueDate: dueDate.toISOString(),
                status: taskStatus,
                date: followUpDate,
                time: followUpTime,
                type: isSchedulingTask ? status : undefined
            });
        }

        if (status !== lead.status) {
            await updateLead(lead.id, { status });
        }

        onFollowUpAdded();
        showNotification('Follow-up and lead status updated successfully!', 'success');
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
                        {showScheduledTaskFields && (
                            <>
                                <TextField
                                    margin="normal"
                                    required
                                    fullWidth
                                    label="Scheduled Task Date"
                                    name="scheduledDate"
                                    type="date"
                                    value={scheduledDate}
                                    onChange={(e) => setScheduledDate(e.target.value)}
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                />
                                <TextField
                                    margin="normal"
                                    required
                                    fullWidth
                                    label="Scheduled Task Time"
                                    name="scheduledTime"
                                    type="time"
                                    value={scheduledTime}
                                    onChange={(e) => setScheduledTime(e.target.value)}
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                />
                            </>
                        )}
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
