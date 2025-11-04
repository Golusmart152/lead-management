import React, { useState } from 'react';
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

interface FollowUpProps {
  leadId: string;
  followUps: FollowUp[];
  onAddFollowUp: (leadId: string, notes: string, date: Date) => void;
  onUpdateFollowUp: (followUp: FollowUp) => void;
  onDeleteFollowUp: (followUpId: string) => void;
}

const FollowUpComponent: React.FC<FollowUpProps> = ({ leadId, followUps, onAddFollowUp, onUpdateFollowUp, onDeleteFollowUp }) => {
  const [notes, setNotes] = useState('');
  const [date, setDate] = useState(new Date());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingFollowUp, setEditingFollowUp] = useState<FollowUp | null>(null);

  const handleAddFollowUp = () => {
    onAddFollowUp(leadId, notes, date);
    setNotes('');
  };

  const handleOpenModal = (followUp: FollowUp) => {
    setEditingFollowUp(followUp);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setEditingFollowUp(null);
    setIsModalOpen(false);
  };

  const handleUpdateFollowUp = () => {
    if (editingFollowUp) {
      onUpdateFollowUp(editingFollowUp);
      handleCloseModal();
    }
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
                <IconButton edge="end" aria-label="edit" onClick={() => handleOpenModal(followUp)}>
                  <Edit />
                </IconButton>
                <IconButton edge="end" aria-label="delete" onClick={() => onDeleteFollowUp(followUp.id)}>
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
      <Modal open={isModalOpen} onClose={handleCloseModal}>
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
