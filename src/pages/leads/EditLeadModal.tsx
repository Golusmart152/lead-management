import React, { useState, useEffect } from 'react';
import { Modal, Box, Typography, TextField, Button, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import type { SelectChangeEvent } from '@mui/material';
import type { Lead } from '../../services/db-service';

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: { xs: '90%', sm: 500 },
  bgcolor: 'background.paper',
  borderRadius: '12px',
  boxShadow: 24,
  p: 4,
};

interface EditLeadModalProps {
  open: boolean;
  onClose: () => void;
  lead: Lead | null;
  onUpdate: (lead: Lead) => void;
}

const EditLeadModal: React.FC<EditLeadModalProps> = ({ open, onClose, lead, onUpdate }) => {
  const [editedLead, setEditedLead] = useState<Lead | null>(lead);

  useEffect(() => {
    setEditedLead(lead);
  }, [lead]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (editedLead) {
      setEditedLead({ ...editedLead, [name as string]: value });
    }
  };

  const handleSelectChange = (e: SelectChangeEvent) => {
      const { name, value } = e.target;
      if (editedLead) {
        setEditedLead({ ...editedLead, [name]: value });
      }
  };

  const handleUpdate = () => {
    if (editedLead) {
      onUpdate(editedLead);
      onClose();
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={modalStyle}>
        <Typography variant="h5" component="h2" sx={{ mb: 3 }}>
          Edit Lead
        </Typography>
        {editedLead && (
          <>
            <TextField margin="normal" required fullWidth label="Name" name="name" autoFocus value={editedLead.name} onChange={handleInputChange} />
            <TextField margin="normal" required fullWidth label="Email" name="email" value={editedLead.email} onChange={handleInputChange} />
            <TextField margin="normal" fullWidth label="Phone" name="phone" value={editedLead.phone || ''} onChange={handleInputChange} />
            <TextField margin="normal" fullWidth label="Company" name="company" value={editedLead.company || ''} onChange={handleInputChange} />
            <FormControl fullWidth margin="normal">
              <InputLabel>Status</InputLabel>
              <Select name="status" value={editedLead.status || 'New'} label="Status" onChange={handleSelectChange}>
                <MenuItem value="New">New</MenuItem>
                <MenuItem value="Contacted">Contacted</MenuItem>
                <MenuItem value="Qualified">Qualified</MenuItem>
                <MenuItem value="Lost">Lost</MenuItem>
              </Select>
            </FormControl>
            <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2, py: 1.5 }} onClick={handleUpdate}>
              Update Lead
            </Button>
          </>
        )}
      </Box>
    </Modal>
  );
};

export default EditLeadModal;
