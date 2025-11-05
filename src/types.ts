export type Role = 'admin' | 'manager' | 'user';

export interface UserProfile {
    uid: string;
    email: string;
    displayName?: string;
    phoneNumber?: string;
    role: Role;
}

export interface Department {
    id: string;
    name: string;
}
