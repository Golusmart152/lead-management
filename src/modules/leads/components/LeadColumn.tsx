
import React from 'react';
import { Paper, Typography, Box } from '@mui/material';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import LeadCard from './LeadCard';
import type { Lead } from '../../../services/db-service';

interface LeadColumnProps {
    status: string;
    leads: Lead[];
}

const LeadColumn: React.FC<LeadColumnProps> = ({ status, leads }) => {
    const { setNodeRef, isOver } = useDroppable({ id: status });

    return (
        <Box sx={{ flex: '1 1 300px', display: 'flex', flexDirection: 'column', maxHeight: 'calc(100vh - 160px)' }}>
            <Typography 
                variant="h6" 
                sx={{ 
                    p: 2, 
                    fontWeight: 700,
                    textTransform: 'capitalize',
                    borderBottom: '1px solid',
                    borderColor: 'divider'
                }}
            >
                {status}
            </Typography>
            <Paper
                ref={setNodeRef}
                sx={{
                    p: 1,
                    flexGrow: 1,
                    overflowY: 'auto',
                    backgroundColor: isOver ? 'action.hover' : 'background.default',
                    transition: 'background-color 0.2s ease-in-out',
                }}
            >
                <SortableContext items={leads.map(l => l.id)} strategy={verticalListSortingStrategy}>
                    {leads.map((lead) => (
                        <LeadCard key={lead.id} lead={lead} />
                    ))}
                </SortableContext>
            </Paper>
        </Box>
    );
};

export default LeadColumn;
