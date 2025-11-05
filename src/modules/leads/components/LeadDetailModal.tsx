
import React from 'react';
import {
    Modal,
    Box,
    Typography,
    Chip,
    IconButton
} from '@mui/material';
import { Close } from '@mui/icons-material';
import type { Lead } from '../../../services/db-service';

interface LeadDetailModalProps {
    open: boolean;
    onClose: () => void;
    lead: Lead | null;
}

const modalStyle = {
    position: 'absolute' as const,
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: { xs: '90%', sm: 500 },
    bgcolor: 'background.paper',
    borderRadius: '12px',
    boxShadow: 24,
    p: 4,
};

const getStatusChipColor = (status: string) => {
    switch (status) {
        case 'New': return 'primary';
        case 'Contacted': return 'info';
        case 'Qualified': return 'success';
        case 'Lost': return 'error';
        default: return 'default';
    }
};

const LeadDetailModal: React.FC<LeadDetailModalProps> = ({ open, onClose, lead }) => {
    if (!lead) {
        return null;
    }

    return (
        <Modal open={open} onClose={onClose}>
            <Box sx={modalStyle}>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography variant="h5" component="h2">{lead.name}</Typography>
                    <IconButton onClick={onClose}>
                        <Close />
                    </IconButton>
                </Box>
                <Typography sx={{ mt: 2 }}>{lead.email}</Typography>
                <Typography sx={{ mt: 2 }}>{lead.phone}</Typography>
                <Typography sx={{ mt: 2 }}>{lead.company}</Typography>
                <Box sx={{ mt: 3 }}>
                    <Chip label={lead.status} color={getStatusChipColor(lead.status)} />
                </Box>
            </Box>
        </Modal>
    );
};

export default LeadDetailModal;
