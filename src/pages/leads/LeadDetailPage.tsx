
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
    Box, 
    Typography, 
    Paper, 
    Grid, 
    Button, 
    Chip, 
    List, 
    ListItem, 
    ListItemText, 
    Divider 
} from '@mui/material';
import { ArrowBack as ArrowBackIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';

// Mock data - in a real app, you'd fetch this based on the leadId
const leadDetails = {
    id: 1,
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '123-456-7890',
    company: 'Acme Inc.',
    status: 'New',
    source: 'Website',
    createdDate: '2023-10-27',
    notes: [
        { id: 1, text: 'Initial contact made, sent follow-up email.', date: '2023-10-28' },
        { id: 2, text: 'Scheduled a demo for next week.', date: '2023-10-29' },
    ]
};

const LeadDetailPage: React.FC = () => {
    const { leadId: _leadId } = useParams<{ leadId: string }>();
    const navigate = useNavigate();

    // You would typically fetch the lead's data here based on leadId
    // For this example, we'll use the mock data.
    const lead = leadDetails;

    if (!lead) {
        return <Typography>Lead not found</Typography>;
    }

    const getStatusChipColor = (status: string) => {
        switch (status) {
            case 'New': return 'primary';
            case 'Contacted': return 'info';
            case 'Qualified': return 'success';
            case 'Lost': return 'error';
            default: return 'default';
        }
    };

    return (
        <Box>
            <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/leads')} sx={{ mb: 3 }}>
                Back to Leads
            </Button>
            <Paper sx={{ p: { xs: 2, md: 4 } }}>
                <Grid container spacing={4}>
                    <Grid xs={12} md={8}>
                        <Typography variant="h4" gutterBottom>
                            {lead.name}
                        </Typography>
                        <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 2 }}>
                            {lead.company}
                        </Typography>
                    </Grid>
                    <Grid xs={12} md={4} sx={{ display: 'flex', alignItems: 'center', justifyContent: { xs: 'flex-start', md: 'flex-end' } }}>
                        <Chip label={lead.status} color={getStatusChipColor(lead.status)} sx={{ fontSize: '1rem', fontWeight: 'bold' }} />
                    </Grid>
                </Grid>

                <Grid container spacing={3} mt={2}>
                    <Grid xs={12} sm={6} md={4}>
                        <Typography variant="body2" color="text.secondary">Email</Typography>
                        <Typography variant="body1">{lead.email}</Typography>
                    </Grid>
                    <Grid xs={12} sm={6} md={4}>
                        <Typography variant="body2" color="text.secondary">Phone</Typography>
                        <Typography variant="body1">{lead.phone}</Typography>
                    </Grid>
                    <Grid xs={12} sm={6} md={4}>
                        <Typography variant="body2" color="text.secondary">Source</Typography>
                        <Typography variant="body1">{lead.source}</Typography>
                    </Grid>
                </Grid>
                
                <Box sx={{ mt: 4 }}>
                    <Typography variant="h6" gutterBottom>Notes</Typography>
                    <List>
                        {lead.notes.map((note, index) => (
                            <React.Fragment key={note.id}>
                                <ListItem alignItems="flex-start">
                                    <ListItemText
                                        primary={note.text}
                                        secondary={`On ${note.date}`}
                                    />
                                </ListItem>
                                {index < lead.notes.length - 1 && <Divider variant="inset" component="li" />}
                            </React.Fragment>
                        ))}
                    </List>
                </Box>

                <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                    <Button variant="outlined" startIcon={<EditIcon />}>Edit</Button>
                    <Button variant="contained" color="error" startIcon={<DeleteIcon />}>Delete</Button>
                </Box>
            </Paper>
        </Box>
    );
};

export default LeadDetailPage;
