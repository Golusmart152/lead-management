
import React, { useState } from 'react';
import { addFollowUp } from '../../../services/db-service';
import type { FollowUp } from '../../../services/db-service';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Label } from '../../../components/ui/label';
import { Textarea } from '../../../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../components/ui/select';

interface FollowUpFormProps {
    leadId: string;
    onFollowUpAdded: (followUp: FollowUp) => void;
}

const FollowUpForm: React.FC<FollowUpFormProps> = ({ leadId, onFollowUpAdded }) => {
    const [notes, setNotes] = useState('');
    const [dueDate, setDueDate] = useState('');
    const [status, setStatus] = useState<'Pending' | 'Completed'>('Pending');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!leadId) return;
        
        setLoading(true);
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
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                    id="notes"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Add follow-up notes..."
                    rows={3}
                    required
                />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="dueDate">Due Date</Label>
                    <Input
                        id="dueDate"
                        type="date"
                        value={dueDate}
                        onChange={(e) => setDueDate(e.target.value)}
                        required
                    />
                </div>
                
                <div className="space-y-2">
                    <Label htmlFor="status">Status</Label>
                    <Select value={status} onValueChange={(value) => setStatus(value as 'Pending' | 'Completed')}>
                        <SelectTrigger>
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="Pending">Pending</SelectItem>
                            <SelectItem value="Completed">Completed</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>
            
            <Button type="submit" disabled={loading}>
                {loading ? 'Adding...' : 'Add Follow-Up'}
            </Button>
        </form>
    );
};

export default FollowUpForm;
