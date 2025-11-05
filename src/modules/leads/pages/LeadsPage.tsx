
import React from 'react';
import { Box, Typography } from '@mui/material';
import LeadKanbanBoard from '../components/LeadKanbanBoard';
import AddLeadForm from '../components/AddLeadForm';

const LeadsPage: React.FC = () => {
    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" gutterBottom>
                Leads Management
            </Typography>
            <AddLeadForm />
            <LeadKanbanBoard />
        </Box>
    );
};

export default LeadsPage;
