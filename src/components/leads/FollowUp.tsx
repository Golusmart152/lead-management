import React, { useState, useEffect } from 'react';
import {
  Edit,
  Delete,
  Plus
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '../../components/ui/dialog';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Textarea } from '../../components/ui/textarea';
import type { FollowUp } from '../../models/follow-up';
import { getFollowUps, addFollowUp, updateFollowUp, deleteFollowUp } from '../../services/follow-up-service';

interface FollowUpProps {
  leadId: string;
}

const FollowUpComponent: React.FC<FollowUpProps> = ({ leadId }) => {
  const [followUps, setFollowUps] = useState<FollowUp[]>([]);
  const [notes, setNotes] = useState('');
  const [date, setDate] = useState(new Date().toISOString().slice(0, 16));
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingFollowUp, setEditingFollowUp] = useState<FollowUp | null>(null);

  useEffect(() => {
    if (leadId) {
      getFollowUps(leadId).then(setFollowUps);
    }
  }, [leadId]);

  const handleAddFollowUp = async () => {
    const newFollowUp = await addFollowUp(leadId, notes, new Date(date));
    setFollowUps([...followUps, newFollowUp]);
    setNotes('');
  };

  const handleUpdateFollowUp = async () => {
    if (editingFollowUp) {
      await updateFollowUp(editingFollowUp);
      setFollowUps(followUps.map(f => f.id === editingFollowUp.id ? editingFollowUp : f));
      handleCloseEditModal();
    }
  };

  const handleDeleteFollowUp = async (followUpId: string) => {
    await deleteFollowUp(followUpId);
    setFollowUps(followUps.filter(f => f.id !== followUpId));
  };

  const handleOpenEditModal = (followUp: FollowUp) => {
    setEditingFollowUp(followUp);
    setIsEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setEditingFollowUp(null);
    setIsEditModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">Follow-ups</h3>
      
      <div className="space-y-3">
        {followUps.map((followUp) => (
          <div
            key={followUp.id}
            className="flex items-center justify-between p-4 border rounded-lg"
          >
            <div className="flex-1">
              <p className="font-medium">{followUp.notes}</p>
              <p className="text-sm text-muted-foreground">
                {new Date(followUp.date).toLocaleString()}
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => handleOpenEditModal(followUp)}
              >
                <Edit className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => handleDeleteFollowUp(followUp.id)}
              >
                <Delete className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">
            Add a follow-up note
          </label>
          <Textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Enter follow-up notes..."
            className="w-full"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-2">
            Date & Time
          </label>
          <Input
            type="datetime-local"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full"
          />
        </div>
        
        <Button onClick={handleAddFollowUp} className="w-full">
          <Plus className="h-4 w-4 mr-2" />
          Add Follow-up
        </Button>
      </div>

      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Follow-up</DialogTitle>
            <DialogDescription>
              Update the follow-up notes and date for this lead.
            </DialogDescription>
          </DialogHeader>
          {editingFollowUp && (
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Notes
                </label>
                <Textarea
                  value={editingFollowUp.notes}
                  onChange={(e) => setEditingFollowUp({ ...editingFollowUp, notes: e.target.value })}
                  placeholder="Enter notes..."
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Date & Time
                </label>
                <Input
                  type="datetime-local"
                  value={new Date(editingFollowUp.date).toISOString().slice(0, 16)}
                  onChange={(e) => setEditingFollowUp({ ...editingFollowUp, date: new Date(e.target.value) })}
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={handleCloseEditModal}>
              Cancel
            </Button>
            <Button onClick={handleUpdateFollowUp}>
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default FollowUpComponent;
