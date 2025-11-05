
import React from 'react';
import { DndContext, type DragEndEvent } from '@dnd-kit/core';
import { Box, CircularProgress } from '@mui/material';
import LeadColumn from './LeadColumn';
import type { Lead, LeadStatus } from '../../../services/db-service';
import { useLeads } from '../hooks/useLeads';

const LeadKanbanBoard: React.FC = () => {
    const { leads, loading, updateLead } = useLeads();

    const handleDragEnd = async (event: DragEndEvent) => {
        const { active, over } = event;

        if (!over) {
            return;
        }

        const activeId = active.id as string;
        const newStatus = over.id as LeadStatus;

        const activeLead = leads.find((l) => l.id === activeId);

        if (activeLead && activeLead.status !== newStatus) {
            const updatedLead: Lead = {
                ...activeLead,
                status: newStatus,
            };
            await updateLead(activeId, updatedLead);
        }
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '500px' }}>
                <CircularProgress />
            </Box>
        );
    }

    const leadStatusOptions: LeadStatus[] = ['new', 'contacted', 'qualified', 'unqualified', 'proposal', 'negotiation', 'won', 'lost'];

    return (
        <DndContext onDragEnd={handleDragEnd}>
            <Box sx={{ display: 'flex', overflowX: 'auto', p: 2, gap: 2, alignItems: 'flex-start' }}>
                {leadStatusOptions.map(status => (
                    <LeadColumn
                        key={status}
                        status={status}
                        leads={leads.filter(lead => lead.status === status)}
                    />
                ))}
            </Box>
        </DndContext>
    );
};

export default LeadKanbanBoard;
