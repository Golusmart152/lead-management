
import React, { useState, useEffect } from 'react';
import { 
    Box, 
    Typography, 
    Button, 
    List, 
    ListItem, 
    ListItemText, 
    TextField,
    Paper
} from '@mui/material';
import { getRoles, addRole } from '../services/role-service';
import type { Role } from '../../../types';

const RolesPage: React.FC = () => {
    const [roles, setRoles] = useState<Role[]>([]);
    const [newRoleName, setNewRoleName] = useState('');

    useEffect(() => {
        const fetchRoles = async () => {
            const roles = await getRoles();
            setRoles(roles);
        };
        fetchRoles();
    }, []);

    const handleAddRole = async () => {
        if (newRoleName.trim() !== '') {
            const newRole = await addRole({ name: newRoleName });
            setRoles([...roles, newRole]);
            setNewRoleName('');
        }
    };

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" gutterBottom>Manage Roles</Typography>
            <Paper elevation={3} sx={{ p: 2, mb: 2 }}>
                <Box sx={{ display: 'flex', gap: 2}}>
                    <TextField
                        label="New Role Name"
                        value={newRoleName}
                        onChange={(e) => setNewRoleName(e.target.value)}
                        variant="outlined"
                        size="small"
                    />
                    <Button onClick={handleAddRole} variant="contained">Add Role</Button>
                </Box>
            </Paper>
            <List>
                {roles.map((role) => (
                    <ListItem key={role.id} disablePadding>
                        <ListItemText primary={role.name} />
                    </ListItem>
                ))}
            </List>
        </Box>
    );
};

export default RolesPage;
