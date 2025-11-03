import IndexPagination from '@/components/index-pagination';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardAction, CardContent } from '@/components/ui/card';
import Layout from '@/components/ui/layout';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { BreadcrumbItem } from '@/types';
import { RolesPage } from '@/types/role_permission';
import { Link, router, usePage } from '@inertiajs/react';
import { useEffect } from 'react';
import { toast } from 'sonner';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Kelola Pengguna', href: '#' },
    { title: 'Roles', href: '/roles' },
];

const Index = ({ roles }: { roles: RolesPage }) => {
    const { flash } = usePage<{ flash: { message?: string } }>().props;

    useEffect(() => {
        if (flash.message) {
            toast.success(flash.message);
        }
    }, [flash.message]);

    function deleteRole(id: number) {
        if (confirm('Apakah kamu yakin menghapus role ini?')) {
            router.delete(`/roles/${id}`);
            toast.success('Role berhasil dihapus');
        }
    }

    return (
        <Layout breadcrumbs={breadcrumbs}>
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="rounded border p-6 shadow-xl">
                    <div className="mb-5 flex items-center justify-between gap-3">
                        <div>Role</div>
                        <CardAction>
                            <Link href={'roles/create'}>
                                <Button variant={'default'}>
                                    Tambah Permission
                                </Button>
                            </Link>
                        </CardAction>
                    </div>
                    <Card>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>ID</TableHead>
                                        <TableHead>Name</TableHead>
                                        <TableHead>Permissions</TableHead>
                                        <TableHead>Created At</TableHead>
                                        <TableHead>Action</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {roles.data.map((role) => (
                                        <TableRow>
                                            <TableCell key={role.id}>
                                                {role.id}
                                            </TableCell>
                                            <TableCell>{role.name}</TableCell>
                                            <TableCell className="flex flex-wrap gap-2">
                                                {role.permissions.map(
                                                    (perm, index) => (
                                                        <Badge
                                                            variant={'default'}
                                                            key={index}
                                                        >
                                                            {perm}
                                                        </Badge>
                                                    ),
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                {role.created_at}
                                            </TableCell>
                                            <TableCell className="space-x-1">
                                                <Link
                                                    href={`/roles/${role.id}/edit`}
                                                >
                                                    {' '}
                                                    <Button size={'sm'}>
                                                        Edit
                                                    </Button>
                                                </Link>
                                                <Button
                                                    size={'sm'}
                                                    variant={'destructive'}
                                                    onClick={() =>
                                                        deleteRole(role.id)
                                                    }
                                                >
                                                    Delete
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                    <IndexPagination data={roles} />
                </div>
            </div>
        </Layout>
    );
};

export default Index;
