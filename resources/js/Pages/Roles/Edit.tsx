import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import InputError from '@/components/ui/input-error';
import { Label } from '@/components/ui/label';
import Layout from '@/components/ui/layout';
import { BreadcrumbItem } from '@/types';
import { RolesPermissions } from '@/types/role_permission';
import { Link, useForm } from '@inertiajs/react';
import { Loader2 } from 'lucide-react';
import React from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Kelola Pengguna', href: '#' },
    { title: 'Roles', href: '/roles' },
    { title: 'Edit Role', href: '/roles/edit' },
];

const Edit = ({
    permissions,
    role,
}: {
    permissions: string[];
    role: RolesPermissions;
}) => {
    const permissionList = role.permissions.map((perm) => perm.name);
    const { data, setData, put, errors, processing } = useForm({
        name: role.name,
        permissions: permissionList,
    });

    function submit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        put(`/roles/${role.id}`);
    }

    return (
        <Layout breadcrumbs={breadcrumbs}>
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="rounded border p-6 shadow-xl">
                    <div className="mb-5 flex items-center justify-between gap-3">
                        <div>Edit Role</div>
                    </div>
                    <Card>
                        <CardContent>
                            <form onSubmit={submit}>
                                <div className="mb-4">
                                    <Label htmlFor="name">Nama Role</Label>
                                    <Input
                                        id="name"
                                        type="text"
                                        value={data.name}
                                        onChange={(e) =>
                                            setData('name', e.target.value)
                                        }
                                        aria-invalid={!!errors.name}
                                    />
                                    <InputError message={errors.name} />
                                </div>
                                <div>
                                    <Label>Pilih Permissions</Label>
                                    <div className="my-4">
                                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
                                            {permissions.map((permission) => (
                                                <div
                                                    key={permission}
                                                    className="flex items-center gap-3"
                                                >
                                                    <Checkbox
                                                        id={permission}
                                                        checked={data.permissions.includes(
                                                            permission,
                                                        )}
                                                        onCheckedChange={(
                                                            checked,
                                                        ) => {
                                                            if (checked) {
                                                                setData(
                                                                    'permissions',
                                                                    [
                                                                        ...data.permissions,
                                                                        permission,
                                                                    ],
                                                                );
                                                            } else {
                                                                setData(
                                                                    'permissions',
                                                                    data.permissions.filter(
                                                                        (p) =>
                                                                            p !==
                                                                            permission,
                                                                    ),
                                                                );
                                                            }
                                                        }}
                                                    />
                                                    <Label htmlFor={permission}>
                                                        {permission}
                                                    </Label>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="mt-4 flex justify-end gap-3">
                                        <Link href={'/roles'}>
                                            <Button>Kembali</Button>
                                        </Link>
                                        <Button
                                            type="submit"
                                            disabled={processing}
                                        >
                                            {processing && (
                                                <Loader2 className="animate-spin" />
                                            )}
                                            <span>Update Role</span>
                                        </Button>
                                    </div>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </Layout>
    );
};

export default Edit;
