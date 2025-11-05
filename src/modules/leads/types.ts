
export interface Lead {
    id: string;
    visibleId: string;
    company: string;
    contactPerson: string;
    phone: string;
    email: string;
    status: 'new' | 'contacted' | 'qualified' | 'lost';
    source: string;
}
