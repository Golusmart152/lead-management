
export type LeadStatus = 'new' | 'contacted' | 'qualified' | 'unqualified' | 'proposal' | 'negotiation' | 'won' | 'lost';

export interface Lead {
    id: string;
    name: string;
    email: string;
    company?: string;
    phone?: string;
    status: LeadStatus;
    createdAt: Date;
    updatedAt: Date;
    [key: string]: string | Date | LeadStatus | undefined;
}
