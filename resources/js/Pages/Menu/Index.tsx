import IndexPagination from '@/components/index-menu-pagination';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
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
import { Link, router, usePage } from '@inertiajs/react';
import debounce from 'lodash/debounce';
import { Search } from 'lucide-react';
import { useEffect, useRef } from 'react';
import { toast } from 'sonner';

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Kelola Menu', href: '/menu' }];

interface LinksType {
    url: string;
    label: string;
    active: boolean;
}

interface MenuType {
    id_menu: number;
    nama_menu: string;
    kategori: string;
    harga: number;
    is_active: boolean;
    image: string;
}

interface MenusType {
    data: MenuType[];
    links: LinksType[];
    from: number;
    to: number;
    total: number;
}

const Index = ({ menu }: { menu: MenusType }) => {
    const { flash } = usePage<{ flash: { message?: string } }>().props;

    useEffect(() => {
        if (flash.message) {
            toast.success(flash.message);
        }
    }, [flash.message]);

    const handleSearch = useRef(
        debounce((query: string) => {
            router.get(
                '/menu',
                { search: query },
                { preserveState: true, replace: true },
            );
        }, 500),
    ).current;

    function onSearchChange(e: React.ChangeEvent<HTMLInputElement>) {
        const query = e.target.value;
        handleSearch(query);
    }

    function deleteMenu(id_menu: number) {
        if (confirm('Anda yakin menghapus menu ini?')) {
            router.delete(`/menu/${id_menu}`);
            toast.success('Menu berhasil dihapus');
        }
    }

    return (
        <Layout breadcrumbs={breadcrumbs}>
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="rounded border p-6 shadow-xl">
                    <div className="mb-5 flex items-center justify-between gap-3">
                        <div className="relative w-full">
                            <Input
                                id={'search'}
                                className="peer ps-9"
                                placeholder="search"
                                type="search"
                                onChange={onSearchChange}
                            />
                            <div className="pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 text-muted-foreground/80 peer-disabled:opacity-50">
                                <Search size={16} aria-hidden="true" />
                            </div>
                        </div>
                        <Button asChild>
                            <Link href="/menu/create"> Tambah Menu</Link>
                        </Button>
                    </div>

                    <Card>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>No</TableHead>
                                        <TableHead>Image</TableHead>
                                        <TableHead>Nama Menu</TableHead>
                                        <TableHead>Kategori</TableHead>
                                        <TableHead>Harga</TableHead>
                                        <TableHead>Is Active</TableHead>
                                        <TableHead>Action</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {menu.data?.map((menu, index) => (
                                        <TableRow>
                                            <TableCell>{index + 1}</TableCell>
                                            <TableCell>
                                                <img
                                                    src={`/storage/${menu.image}`}
                                                    alt={menu.nama_menu}
                                                    className="w-16 rounded"
                                                />
                                            </TableCell>
                                            <TableCell>
                                                {menu.nama_menu}
                                            </TableCell>
                                            <TableCell>
                                                {menu.kategori}
                                            </TableCell>
                                            <TableCell>{menu.harga}</TableCell>
                                            <TableCell>
                                                {menu.is_active ? (
                                                    <Badge className="bg-green-500">
                                                        Active
                                                    </Badge>
                                                ) : (
                                                    <Badge className="bg-red-500">
                                                        Inactive
                                                    </Badge>
                                                )}
                                            </TableCell>

                                            <TableCell className="space-x-1">
                                                <Button asChild size={'sm'}>
                                                    <Link
                                                        href={`/menu/${menu.id_menu}/edit`}
                                                    >
                                                        Edit
                                                    </Link>
                                                </Button>
                                                <Button
                                                    onClick={() =>
                                                        deleteMenu(menu.id_menu)
                                                    }
                                                    size={'sm'}
                                                    variant={'destructive'}
                                                >
                                                    Hapus
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                    <IndexPagination menu={menu} />
                </div>
            </div>
        </Layout>
    );
};

export default Index;
