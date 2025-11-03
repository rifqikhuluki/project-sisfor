import IndexPagination from '@/components/index-pagination';
import { Button } from '@/components/ui/button';
import { Card, CardAction, CardContent } from '@/components/ui/card';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import InputError from '@/components/ui/input-error';
import { Label } from '@/components/ui/label';
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
import { Permission, PermissionsPage } from '@/types/role_permission';
import { router, useForm, usePage } from '@inertiajs/react';
import { Loader2 } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Kelola Pengguna', href: '#' },
    { title: 'Permission', href: '/permission' },
];

const Index = ({ permissions }: { permissions: PermissionsPage }) => {
    const [openAddPermissionDialog, setOpenAddPermissionDialog] =
        useState(false);

    const [openEditPermissionDialog, setOpenEditPermissionDialog] =
        useState(false);

    const { flash } = usePage<{ flash: { message?: string } }>().props;

    useEffect(() => {
        if (flash.message) {
            setOpenAddPermissionDialog(false);
            setOpenEditPermissionDialog(false);
            toast.success(flash.message);
        }
    }, [flash.message]);

    const { data, setData, post, put, processing, errors, reset } = useForm({
        id: 0,
        name: '',
    });

    function submit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        post('/permission', {
            onSuccess: () => {
                reset('name');
            },
        });
    }

    function edit(permission: Permission) {
        setData('name', permission.name);
        setData('id', permission.id);
        setOpenEditPermissionDialog(true);
    }

    function update(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        put(`/permission/${data.id}`);
    }

    function deletePermission(id: number) {
        if (confirm('Apakah kamu yakin menghapus role ini?')) {
            router.delete(`/permission/${id}`);
            toast.success('Permission berhasil dihapus');
        }
    }

    return (
        <Layout breadcrumbs={breadcrumbs}>
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="rounded border p-6 shadow-xl">
                    <div className="mb-5 flex items-center justify-between gap-3">
                        <div>Permission</div>
                        <CardAction>
                            <Button
                                variant={'default'}
                                onClick={() => {
                                    setOpenAddPermissionDialog(true);
                                }}
                            >
                                Tambah Permission
                            </Button>
                        </CardAction>
                    </div>
                    <Card>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>ID</TableHead>
                                        <TableHead>Name</TableHead>
                                        <TableHead>Created At</TableHead>
                                        <TableHead>Action</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {permissions.data.map((permission) => (
                                        <TableRow>
                                            <TableCell key={permission.id}>
                                                {permission.id}
                                            </TableCell>
                                            <TableCell>
                                                {permission.name}
                                            </TableCell>
                                            <TableCell>
                                                {permission.created_at}
                                            </TableCell>
                                            <TableCell className="space-x-1">
                                                <Button
                                                    size={'sm'}
                                                    onClick={() =>
                                                        edit(permission)
                                                    }
                                                >
                                                    Edit
                                                </Button>
                                                <Button
                                                    size={'sm'}
                                                    variant={'destructive'}
                                                    onClick={() =>
                                                        deletePermission(
                                                            permission.id,
                                                        )
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
                    <IndexPagination data={permissions} />

                    <Dialog
                        open={openAddPermissionDialog}
                        onOpenChange={setOpenAddPermissionDialog}
                    >
                        <DialogContent className="sm:max-w-[425px]">
                            <DialogHeader>
                                <DialogTitle>Tambah Permission</DialogTitle>
                            </DialogHeader>
                            <form onSubmit={submit}>
                                <div className="grid gap-4">
                                    <div className="grid gap-3">
                                        <Label htmlFor="name">
                                            Permission Name
                                        </Label>
                                        <Input
                                            id="name"
                                            type="text"
                                            value={data.name}
                                            onChange={(e) =>
                                                setData('name', e.target.value)
                                            }
                                            aria-invalid={!!errors.name}
                                        />{' '}
                                        <InputError message={errors.name} />
                                    </div>
                                </div>
                                <DialogFooter className="mt-3">
                                    <DialogClose asChild>
                                        <Button variant="outline">
                                            Cancel
                                        </Button>
                                    </DialogClose>
                                    <Button type="submit" disabled={processing}>
                                        {processing && (
                                            <Loader2 className="animate-spin" />
                                        )}
                                        <span>Tambah Permission</span>
                                    </Button>
                                </DialogFooter>
                            </form>
                        </DialogContent>
                    </Dialog>

                    <Dialog
                        open={openEditPermissionDialog}
                        onOpenChange={setOpenEditPermissionDialog}
                    >
                        <DialogContent className="sm:max-w-[425px]">
                            <DialogHeader>
                                <DialogTitle>Edit Permission</DialogTitle>
                            </DialogHeader>
                            <form onSubmit={update}>
                                <div className="grid gap-4">
                                    <div className="grid gap-3">
                                        <Label htmlFor="name">
                                            Permission Name
                                        </Label>
                                        <Input
                                            id="name"
                                            type="text"
                                            value={data.name}
                                            onChange={(e) =>
                                                setData('name', e.target.value)
                                            }
                                            aria-invalid={!!errors.name}
                                        />{' '}
                                        <InputError message={errors.name} />
                                    </div>
                                </div>
                                <DialogFooter className="mt-3">
                                    <DialogClose asChild>
                                        <Button variant="outline">
                                            Cancel
                                        </Button>
                                    </DialogClose>
                                    <Button type="submit" disabled={processing}>
                                        {processing && (
                                            <Loader2 className="animate-spin" />
                                        )}
                                        <span>Update Permission</span>
                                    </Button>
                                </DialogFooter>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>
        </Layout>
    );
};

export default Index;
