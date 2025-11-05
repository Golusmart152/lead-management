
import React, { useState } from 'react';
import { Box, TextField, Button } from '@mui/material';
import { useLeads } from '../hooks/useLeads';

const AddLeadForm: React.FC = () => {
    const [name, setName] = useState('');
    const [company, setCompany] = useState('');
    const [email, setEmail] = useState('');
    const { addLead } = useLeads();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        addLead({ name, company, email, status: 'new' });
        setName('');
        setCompany('');
        setEmail('');
    };

    return (
        <Box component="form" onSubmit={handleSubmit} sx={{ mb: 2 }}>
            <TextField
                label="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                sx={{ mr: 1 }}
            />
            <TextField
                label="Company"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                required
                sx={{ mr: 1 }}
            />
            <TextField
                label="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                sx={{ mr: 1 }}
            />
            <Button type="submit" variant="contained">
                Add Lead
            </Button>
        </Box>
    );
};

export default AddLeadForm;
