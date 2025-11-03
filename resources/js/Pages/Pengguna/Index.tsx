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
import { UserPage } from '@/types/users';
import { Link, router, usePage } from '@inertiajs/react';
import { useEffect } from 'react';
import { toast } from 'sonner';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Kelola Pengguna', href: '#' },
    { title: 'Pengguna', href: '/user' },
];

const Index = ({ users }: { users: UserPage }) => {
    const { flash } = usePage<{ flash: { message?: string } }>().props;

    useEffect(() => {
        if (flash.message) {
            toast.success(flash.message);
        }
    }, [flash.message]);

    function deleteUser(id: number) {
        if (confirm('Apakah kamu yakin menghapus akun ini?')) {
            router.delete(`/user/${id}`);
            toast.success('Role berhasil dihapus');
        }
    }

    return (
        <Layout breadcrumbs={breadcrumbs}>
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="rounded border p-6 shadow-xl">
                    <div className="mb-5 flex items-center justify-between gap-3">
                        <div>Pengguna</div>
                        <CardAction>
                            <Link href={'user/create'}>
                                <Button variant={'default'}>
                                    Tambah Pengguna
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
                                        <TableHead>Email</TableHead>
                                        <TableHead>Roles</TableHead>
                                        <TableHead>Created At</TableHead>
                                        <TableHead>Action</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {users.data.map((user) => (
                                        <TableRow>
                                            <TableCell key={user.id}>
                                                {user.id}
                                            </TableCell>
                                            <TableCell>{user.name}</TableCell>
                                            <TableCell>{user.email}</TableCell>
                                            <TableCell className="flex flex-wrap gap-2">
                                                {user.roles.map(
                                                    (role, index) => (
                                                        <Badge
                                                            variant={'default'}
                                                            key={index}
                                                        >
                                                            {role}
                                                        </Badge>
                                                    ),
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                {user.created_at}
                                            </TableCell>
                                            <TableCell className="space-x-1">
                                                <Link
                                                    href={`/user/${user.id}/edit`}
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
                                                        deleteUser(user.id)
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
                    <IndexPagination data={users} />
                </div>
            </div>
        </Layout>
    );
};

export default Index;
