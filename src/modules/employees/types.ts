export interface Department {
    id: string;
    name: string;
}

export interface Role {
    id: string;
    name: string;
}

export interface Employee {
    id: string;
    uuid: string;
    visibleId: string;
    name: string;
    email: string;
    phone: string;
    department: Department;
    role: Role;
}
