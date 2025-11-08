
import React, { useState, useEffect } from 'react';
import { addFollowUp, updateLead } from '../../../services/db-service';
import type { Lead, LeadStatus, FollowUp } from '../../../services/db-service';
import { useNotification } from '../../notifications/useNotification';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '../../../components/ui/dialog';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Label } from '../../../components/ui/label';
import { Textarea } from '../../../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../components/ui/select';

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
        <Dialog open={open} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Add Follow-up</DialogTitle>
                    <DialogDescription>
                        Schedule a follow-up for {lead?.name || 'this lead'}
                    </DialogDescription>
                </DialogHeader>
                
                <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="followUpDate">Follow-up Date</Label>
                            <Input
                                id="followUpDate"
                                type="date"
                                value={followUpDate}
                                onChange={(e) => setFollowUpDate(e.target.value)}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="followUpTime">Follow-up Time</Label>
                            <Input
                                id="followUpTime"
                                type="time"
                                value={followUpTime}
                                onChange={(e) => setFollowUpTime(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="notes">Notes</Label>
                        <Textarea
                            id="notes"
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            placeholder="Add notes about this follow-up..."
                            rows={4}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="status">Lead Status</Label>
                        <Select value={status} onValueChange={(value) => setStatus(value as LeadStatus)}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                            <SelectContent>
                                {leadStatuses.map(s => (
                                    <SelectItem key={s} value={s}>{s}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={onClose}>Cancel</Button>
                    <Button onClick={handleSave}>Save Follow-up</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default FollowUpModal;
