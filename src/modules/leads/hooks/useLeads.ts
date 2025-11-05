
import { useState, useEffect, useCallback } from 'react';
import {
    getLeads as fetchLeadsFromDb,
    createLead as addLeadToDb,
    updateLead as updateLeadInDb,
    deleteLead as deleteLeadFromDb,
} from '../../../services/db-service';
import type { Lead } from '../../../services/db-service';
import { useNotification } from '../../notifications/useNotification';

export const useLeads = () => {
    const [leads, setLeads] = useState<Lead[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const { showNotification } = useNotification();

    const refreshLeads = useCallback(async () => {
        try {
            setLoading(true);
            const leadsFromDb = await fetchLeadsFromDb();
            setLeads(leadsFromDb);
        } catch (error) {
            showNotification('Failed to fetch leads', 'error');
        } finally {
            setLoading(false);
        }
    }, [showNotification]);

    useEffect(() => {
        refreshLeads();
    }, [refreshLeads]);

    const addLead = async (lead: Omit<Lead, 'id'>) => {
        try {
            const newLead = await addLeadToDb(lead);
            setLeads((prevLeads) => [...prevLeads, newLead]);
            showNotification('Lead added successfully', 'success');
        } catch (error) {
            showNotification('Failed to add lead', 'error');
        }
    };

    const updateLead = async (id: string, lead: Partial<Omit<Lead, 'id'>>) => {
        try {
            const updatedLead = await updateLeadInDb(id, lead);
            if(updatedLead) {
                setLeads((prevLeads) =>
                    prevLeads.map((l) => (l.id === id ? updatedLead : l))
                );
                showNotification('Lead updated successfully', 'success');
            } else {
                showNotification('Failed to update lead', 'error');
            }
        } catch (error) {
            showNotification('Failed to update lead', 'error');
        }
    };

    const deleteLead = async (id: string) => {
        try {
            await deleteLeadFromDb(id);
            setLeads((prevLeads) => prevLeads.filter((l) => l.id !== id));
            showNotification('Lead deleted successfully', 'success');
        } catch (error) {
            showNotification('Failed to delete lead', 'error');
        }
    };

    return { leads, loading, addLead, updateLead, deleteLead, refreshLeads };
};
