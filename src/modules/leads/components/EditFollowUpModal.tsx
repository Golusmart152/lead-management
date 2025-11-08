import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../../../components/ui/dialog';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Label } from '../../../components/ui/label';
import { Textarea } from '../../../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../components/ui/select';
import { Card, CardContent } from '../../../components/ui/card';
import type { FollowUp } from '../../../services/db-service';
import { useNotification } from '../../notifications/useNotification';

interface EditFollowUpModalProps {
  open: boolean;
  onClose: () => void;
  followUp: FollowUp | null;
  onUpdate: (followUp: FollowUp) => void;
}

const EditFollowUpModal: React.FC<EditFollowUpModalProps> = ({ open, onClose, followUp, onUpdate }) => {
  const [editedFollowUp, setEditedFollowUp] = useState<FollowUp | null>(followUp);
  const [loading, setLoading] = useState(false);
  const { showNotification } = useNotification();

  useEffect(() => {
    setEditedFollowUp(followUp);
  }, [followUp]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (editedFollowUp) {
      setEditedFollowUp({ ...editedFollowUp, [name]: value });
    }
  };

  const handleSelectChange = (name: string, value: string) => {
    if (editedFollowUp) {
      setEditedFollowUp({ ...editedFollowUp, [name]: value });
    }
  };

  const handleSave = async () => {
    if (!editedFollowUp) return;
    
    setLoading(true);
    try {
      await onUpdate(editedFollowUp);
      showNotification('Follow-up updated successfully!', 'success');
      onClose();
    } catch (error) {
      showNotification('Error updating follow-up', 'error');
    } finally {
      setLoading(false);
    }
  };

  if (!editedFollowUp) return null;

  return (
    <Dialog open={open} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Edit Follow-up</DialogTitle>
          <DialogDescription>
            Update the follow-up details for scheduled task.
          </DialogDescription>
        </DialogHeader>
        
        <Card>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  name="notes"
                  placeholder="Enter follow-up notes..."
                  value={editedFollowUp.notes || ''}
                  onChange={handleInputChange}
                  className="resize-none"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="date">Date</Label>
                  <Input
                    id="date"
                    name="date"
                    type="date"
                    value={editedFollowUp.date || ''}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="time">Time</Label>
                  <Input
                    id="time"
                    name="time"
                    type="time"
                    value={editedFollowUp.time || ''}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={editedFollowUp.status || 'Pending'}
                  onValueChange={(value) => handleSelectChange('status', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Pending">Pending</SelectItem>
                    <SelectItem value="Completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={loading}>
            {loading ? (
              <>
                <div className="w-4 h-4 animate-spin rounded-full border-2 border-current border-t-transparent mr-2" />
                Saving...
              </>
            ) : (
              'Save Changes'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditFollowUpModal;