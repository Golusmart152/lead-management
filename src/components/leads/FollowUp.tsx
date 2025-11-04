import React, { useState, useEffect } from 'react';
import {
  Typography,
  Button,
  TextField,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Modal,
  Box,
} from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';
import type { FollowUp } from '../../models/follow-up';
import { getFollowUps, addFollowUp, updateFollowUp, deleteFollowUp } from '../../services/follow-up-service';

interface FollowUpProps {
  leadId: string;
}

const FollowUpComponent: React.FC<FollowUpProps> = ({ leadId }) => {
  const [followUps, setFollowUps] = useState<FollowUp[]>([]);
  const [notes, setNotes] = useState('');
  const [date, setDate] = useState(new Date());
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingFollowUp, setEditingFollowUp] = useState<FollowUp | null>(null);

  useEffect(() => {
    if (leadId) {
      getFollowUps(leadId).then(setFollowUps);
    }
  }, [leadId]);

  const handleAddFollowUp = async () => {
    const newFollowUp = await addFollowUp(leadId, notes, date);
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
    <div>
      <Typography variant="h6">Follow-ups</Typography>
      <List>
        {followUps.map((followUp) => (
          <ListItem
            key={followUp.id}
            secondaryAction={
              <>
                <IconButton edge="end" aria-label="edit" onClick={() => handleOpenEditModal(followUp)}>
                  <Edit />
                </IconButton>
                <IconButton edge="end" aria-label="delete" onClick={() => handleDeleteFollowUp(followUp.id)}>
                  <Delete />
                </IconButton>
              </>
            }
          >
            <ListItemText
              primary={followUp.notes}
              secondary={new Date(followUp.date).toLocaleString()}
            />
          </ListItem>
        ))}
      </List>
      <TextField
        label="Add a follow-up note"
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        fullWidth
      />
      <TextField
        type="datetime-local"
        value={date.toISOString().slice(0, 16)}
        onChange={(e) => setDate(new Date(e.target.value))}
        fullWidth
      />
      <Button onClick={handleAddFollowUp} variant="contained" color="primary">
        Add Follow-up
      </Button>
      <Modal open={isEditModalOpen} onClose={handleCloseEditModal}>
        <Box sx={{ 
            position: 'absolute', 
            top: '50%', 
            left: '50%', 
            transform: 'translate(-50%, -50%)', 
            width: 400, 
            bgcolor: 'background.paper', 
            border: '2px solid #000', 
            boxShadow: 24, 
            p: 4 
        }}>
          <Typography variant="h6">Edit Follow-up</Typography>
          {editingFollowUp && (
            <>
              <TextField
                label="Notes"
                value={editingFollowUp.notes}
                onChange={(e) => setEditingFollowUp({ ...editingFollowUp, notes: e.target.value })}
                fullWidth
              />
              <TextField
                type="datetime-local"
                value={new Date(editingFollowUp.date).toISOString().slice(0, 16)}
                onChange={(e) => setEditingFollowUp({ ...editingFollowUp, date: new Date(e.target.value) })}
                fullWidth
              />
              <Button onClick={handleUpdateFollowUp} variant="contained" color="primary">
                Save
              </Button>
            </>
          )}
        </Box>
      </Modal>
    </div>
  );
};

export default FollowUpComponent;
