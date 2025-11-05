
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
import type { Lead } from '../types';
import { getLead, updateLead, deleteLead } from '../services/lead-service';
import LeadForm from '../components/LeadForm';

const LeadDetailPage: React.FC = () => {
    const { leadId } = useParams<{ leadId: string }>();
    const navigate = useNavigate();
    const [lead, setLead] = useState<Lead | null>(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    useEffect(() => {
        if (leadId) {
            getLead(leadId).then(setLead);
        }
    }, [leadId]);

    const handleUpdateLead = async (updatedLead: Lead) => {
        if (leadId) {
            await updateLead(leadId, updatedLead);
            const refreshedLead = await getLead(leadId);
            setLead(refreshedLead);
        }
    };

    const handleDelete = async () => {
        if (leadId) {
            await deleteLead(leadId);
            navigate('/leads');
        }
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
                            {lead.email}
                        </Typography>
                    </Box>
                    <Chip label={lead.status} color={getStatusChipColor(lead.status)} sx={{ fontSize: '1rem', fontWeight: 'bold' }} />
                </Box>

                <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                    <Button variant="outlined" startIcon={<EditIcon />} onClick={() => setIsEditModalOpen(true)}>Edit</Button>
                    <Button variant="contained" color="error" startIcon={<DeleteIcon />} onClick={handleDelete}>Delete</Button>
                </Box>
            </Paper>
            
            {lead && (
                <LeadForm 
                    open={isEditModalOpen} 
                    onClose={() => setIsEditModalOpen(false)} 
                    lead={lead} 
                    onSubmit={handleUpdateLead} 
                />
            )}
        </Box>
    );
};

export default LeadDetailPage;
