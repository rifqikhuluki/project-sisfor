import { Pagination } from './pagination';

export interface User {
    id: number;
    name: string;
    email: string;
    roles: string[];
    created_at: string;
}

export type UserPage = Pagination<User>;

export interface UserRolesPage extends User {
    roles: User[];
}
