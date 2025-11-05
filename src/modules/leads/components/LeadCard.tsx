
import React from 'react';
import { Card, CardContent, Typography, Box, Avatar } from '@mui/material';
import type { Lead } from '../../../services/db-service';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface LeadCardProps {
    lead: Lead;
}

const LeadCard: React.FC<LeadCardProps> = ({ lead }) => {
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: lead.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        marginBottom: '8px',
    };

    return (
        <Card
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            sx={{
                boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                borderRadius: '8px',
                transition: 'box-shadow 0.3s ease-in-out',
                '&:hover': {
                    boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
                }
            }}
        >
            <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>{lead.name.charAt(0)}</Avatar>
                    <Box>
                        <Typography variant="h6" sx={{ fontWeight: 600 }}>{lead.name}</Typography>
                        <Typography variant="body2" color="text.secondary">{lead.company}</Typography>
                    </Box>
                </Box>
                <Typography variant="body2" color="text.secondary">{lead.email}</Typography>
            </CardContent>
        </Card>
    );
};

export default LeadCard;
