
import React from 'react';
import { Modal, Box, Typography, Select, MenuItem, Button, FormControl, InputLabel } from '@mui/material';

interface EditUserModalProps {
  open: boolean;
  onClose: () => void;
  user: {
    id: string;
    email: string;
    role: string;
  } | null;
  onSave: (userId: string, newRole: string) => void;
}

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  borderRadius: 2,
  boxShadow: 24,
  p: 4,
};

const EditUserModal: React.FC<EditUserModalProps> = ({ open, onClose, user, onSave }) => {
  const [role, setRole] = React.useState(user?.role || '');

  React.useEffect(() => {
    if (user) {
      setRole(user.role);
    }
  }, [user]);

  const handleSave = () => {
    if (user) {
      onSave(user.id, role);
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={style}>
        <Typography variant="h6" component="h2">Edit User Role</Typography>
        {user && (
          <Box mt={2}>
            <Typography variant="subtitle1">User: {user.email}</Typography>
            <FormControl fullWidth margin="normal">
              <InputLabel id="role-select-label">Role</InputLabel>
              <Select
                labelId="role-select-label"
                value={role}
                label="Role"
                onChange={(e) => setRole(e.target.value)}
              >
                <MenuItem value="Super Admin">Super Admin</MenuItem>
                <MenuItem value="Admin">Admin</MenuItem>
                <MenuItem value="User">User</MenuItem>
              </Select>
            </FormControl>
            <Box mt={2} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button onClick={onClose}>Cancel</Button>
              <Button onClick={handleSave} variant="contained" sx={{ ml: 1 }}>Save</Button>
            </Box>
          </Box>
        )}
      </Box>
    </Modal>
  );
};

export default EditUserModal;
