
import type { User } from 'firebase/auth';

export interface Role {
    id: string;
    name: string;
}

export interface Department {
    id: string;
    name: string;
}

export interface Product {
    id: string;
    uuid: string;
    visibleId: string;
    name: string;
    description: string;
    price: number;
    category: string;
    type: 'Product' | 'Service';
}

export interface Customer {
    id: string;
    uuid: string;
    visibleId: string;
    name: string;
    email: string;
    phone: string;
    address: string;
    company: string;
}

export interface Employee {
    id: string;
    uuid: string;
    visibleId: string;
    name: string;
    email: string;
    phone: string;
    role: Role;
    department: Department;
    photoURL?: string;
}

export type LeadStatus = 'New' | 'Contacted' | 'Qualified' | 'Lost' | 'Converted';

export interface Lead {
    id: string;
    uuid: string;
    visibleId: string;
    name: string;
    company: string;
    contactPerson: string;
    phone: string;
    email: string;
    status: LeadStatus;
    source: string;
    assignedTo?: Employee;
    notes?: string;
}

export interface FollowUp {
    id: string;
    date: string;
    notes: string;
    status: 'Pending' | 'Completed';
}

export interface Sale {
    id: string;
    customer: Customer;
    product: Product;
    employee: Employee;
    date: string;
    amount: number;
}

export interface Log {
    id: string;
    level: 'info' | 'warn' | 'error';
    message: string;
    timestamp: Date;
    user: string;
}

export interface AuthUser extends User {
    role: Role;
}

export interface AuthContextType {
    user: AuthUser | null;
    loading: boolean;
    signIn: (email: string, password: string) => Promise<void>;
    signOut: () => Promise<void>;
}
