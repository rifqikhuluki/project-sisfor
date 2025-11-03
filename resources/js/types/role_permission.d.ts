import { Pagination } from './pagination';

interface Permission {
    id: number;
    name: string;
    created_at: string;
}

interface Role {
    id: number;
    name: string;
    created_at: string;
    permissions: string[];
}

export interface RolesPermissions {
    id: number;
    name: string;
    permissions: Permission[];
    created_at: string;
}

export type PermissionsPage = Pagination<Permission>;

export type RolesPage = Pagination<Role>;
