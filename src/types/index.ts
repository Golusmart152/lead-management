
export type AuthUser = {
    uid: string;
    email: string | null;
    displayName: string | null;
    role: string;
    roles: Role[];
};

export type AuthContextType = {
    user: AuthUser | null;
    loading: boolean;
    login: (email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
};

export type Role = {
    id: string;
    name: string;
};
