import type { Role } from '../../roles/types';
import type { Department } from '../../departments/types';

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
