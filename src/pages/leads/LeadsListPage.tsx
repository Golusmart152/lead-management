
import React from 'react';
import { Typography, Box, List, ListItem, ListItemText } from '@mui/material';
import { Link } from 'react-router-dom';

const leads = [
  { id: '1', name: 'John Doe', email: 'john.doe@example.com' },
  { id: '2', name: 'Jane Smith', email: 'jane.smith@example.com' },
];

const LeadsListPage: React.FC = () => {
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Leads
      </Typography>
      <List>
        {leads.map(lead => (
          <ListItem key={lead.id} button component={Link} to={`/leads/${lead.id}`}>
            <ListItemText primary={lead.name} secondary={lead.email} />
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default LeadsListPage;
