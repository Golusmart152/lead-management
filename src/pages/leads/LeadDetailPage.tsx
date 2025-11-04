import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
    Box, 
    Typography, 
    Paper, 
    Button, 
    Chip
} from '@mui/material';
import { ArrowBack as ArrowBackIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import FollowUpComponent from '../../components/leads/FollowUp';
import type { FollowUp } from '../../models/follow-up';
import { addFollowUp, getFollowUps, updateFollowUp, deleteFollowUp } from '../../services/follow-up-service';
import type { Lead } from '../../services/db-service';

const LeadDetailPage: React.FC = () => {
    const { leadId } = useParams<{ leadId: string }>();
    const navigate = useNavigate();
    const [lead, setLead] = useState<Lead | null>(null);
    const [followUps, setFollowUps] = useState<FollowUp[]>([]);

    useEffect(() => {
        // Fetch lead details and follow-ups
        if (leadId) {
            // Mock lead data
            setLead({
                id: leadId,
                name: 'John Doe',
                email: 'john.doe@example.com',
                phone: '123-456-7890',
                company: 'Acme Inc.',
                status: 'New',
                source: 'Website',
                createdDate: '2023-10-27',
            });

            getFollowUps(leadId).then(setFollowUps);
        }
    }, [leadId]);

    const handleAddFollowUp = async (leadId: string, notes: string, date: Date) => {
        const newFollowUp = await addFollowUp(leadId, notes, date);
        setFollowUps([...followUps, newFollowUp]);
    };

    const handleUpdateFollowUp = async (followUp: FollowUp) => {
        await updateFollowUp(followUp);
        setFollowUps(followUps.map(f => f.id === followUp.id ? followUp : f));
    };

    const handleDeleteFollowUp = async (followUpId: string) => {
        await deleteFollowUp(followUpId);
        setFollowUps(followUps.filter(f => f.id !== followUpId));
    };

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
                <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Box>
                        <Typography variant="h4" gutterBottom>
                            {lead.name}
                        </Typography>
                        <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 2 }}>
                            {lead.company}
                        </Typography>
                    </Box>
                    <Chip label={lead.status} color={getStatusChipColor(lead.status)} sx={{ fontSize: '1rem', fontWeight: 'bold' }} />
                </Box>

                <Box display="flex" justifyContent="space-between" mt={2}>
                    <Box>
                        <Typography variant="body2" color="text.secondary">Email</Typography>
                        <Typography variant="body1">{lead.email}</Typography>
                    </Box>
                    <Box>
                        <Typography variant="body2" color="text.secondary">Phone</Typography>
                        <Typography variant="body1">{lead.phone}</Typography>
                    </Box>
                    <Box>
                        <Typography variant="body2" color="text.secondary">Source</Typography>
                        <Typography variant="body1">{lead.source}</Typography>
                    </Box>
                </Box>
                
                <Box sx={{ mt: 4 }}>
                    <FollowUpComponent 
                        leadId={lead.id} 
                        followUps={followUps} 
                        onAddFollowUp={handleAddFollowUp} 
                        onUpdateFollowUp={handleUpdateFollowUp}
                        onDeleteFollowUp={handleDeleteFollowUp}
                    />
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
