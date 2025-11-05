export interface Role {
    id: string;
    name: string;
}

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

export interface AuthUser {
    uid: string;
    email: string;
    displayName?: string;
    photoURL?: string;
    roles: string[];
}

export interface AuthContextType {
    user: AuthUser | null;
    loading: boolean;
    login: (email: string, pass: string) => Promise<void>;
    logout: () => Promise<void>;
    // signUp: (email: string, pass: string) => Promise<any>;
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
}
