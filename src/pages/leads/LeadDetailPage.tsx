
import React from 'react';
import { Typography, Box, Paper } from '@mui/material';
import { useParams } from 'react-router-dom';

const leads = [
  { id: '1', name: 'John Doe', email: 'john.doe@example.com', phone: '123-456-7890' },
  { id: '2', name: 'Jane Smith', email: 'jane.smith@example.com', phone: '098-765-4321' },
];

const LeadDetailPage: React.FC = () => {
  const { leadId } = useParams<{ leadId: string }>();
  const lead = leads.find(l => l.id === leadId);

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Lead Details
      </Typography>
      {lead ? (
        <Paper sx={{ p: 2 }}>
          <Typography variant="h6">{lead.name}</Typography>
          <Typography>Email: {lead.email}</Typography>
          <Typography>Phone: {lead.phone}</Typography>
        </Paper>
      ) : (
        <Typography>Lead not found</Typography>
      )}
    </Box>
  );
};

export default LeadDetailPage;
