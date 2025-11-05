import type { LeadStatus } from './LeadStatus';

export interface Lead {
    id: string;
    uuid: string;
    visibleId: string;
    name: string;
    email: string;
    phone?: string;
    company?: string;
    notes?: string;
    status: LeadStatus;
    assignedTo?: string;
}
