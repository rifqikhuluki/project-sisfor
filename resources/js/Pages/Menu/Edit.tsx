import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import InputError from '@/components/ui/input-error';
import Layout from '@/components/ui/layout';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { BreadcrumbItem } from '@/types';
import { Link, router, useForm, usePage } from '@inertiajs/react';
import { Loader2 } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Kelola Menu', href: '/menu' },
    { title: 'Edit Menu', href: '/menu/edit' },
];

interface MenuDataType {
    id_menu: number;
    nama_menu: string;
    kategori: string;
    harga: number;
    is_active: boolean | number;
    image: string;
}

const Edit = ({ menuData }: { menuData: MenuDataType }) => {
    const { data, setData, post, processing } = useForm<{
        nama_menu: string;
        kategori: string;
        harga: number;
        is_active: boolean;
        image: File | null;
    }>({
        nama_menu: menuData.nama_menu,
        kategori: menuData.kategori,
        harga: menuData.harga,
        is_active:
            typeof menuData.is_active === 'boolean'
                ? menuData.is_active
                : Number(menuData.is_active) === 1,
        image: null,
    });

    const { errors } = usePage().props;

    function handleFormSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        router.post(`/menu/${menuData.id_menu}`, {
            _method: 'put',
            ...data,
        });
    }
    return (
        <Layout breadcrumbs={breadcrumbs}>
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="rounded border p-6 shadow-xl">
                    <div className="mb-5 flex items-center justify-between">
                        <div> Edit Menu </div>
                    </div>
                    <Card>
                        <CardContent>
                            <form onSubmit={handleFormSubmit}>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="col-span-2">
                                        {/*Nama Menu*/}
                                        <div className="mt-4">
                                            <label htmlFor="nama_menu">
                                                Nama Menu
                                            </label>
                                            <Input
                                                type="text"
                                                id="nama_menu"
                                                placeholder="Masukkan nama menu"
                                                value={data.nama_menu}
                                                onChange={(e) =>
                                                    setData(
                                                        'nama_menu',
                                                        e.target.value,
                                                    )
                                                }
                                                aria-invalid={
                                                    !!errors.nama_menu
                                                }
                                            />
                                            <InputError
                                                message={errors.nama_menu}
                                            />
                                        </div>
                                        {/*Kategori Menu*/}
                                        <div className="mt-4">
                                            <label htmlFor="kategori">
                                                Kategori
                                            </label>
                                            <Select
                                                value={
                                                    data.kategori == 'Coffe'
                                                        ? 'Coffe'
                                                        : 'Non-Coffe'
                                                }
                                                onValueChange={(e) =>
                                                    setData('kategori', e)
                                                }
                                            >
                                                <SelectTrigger
                                                    id="kategori"
                                                    className="w-full"
                                                    aria-invalid={
                                                        !!errors.kategori
                                                    }
                                                >
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="Coffe">
                                                        Coffe
                                                    </SelectItem>
                                                    <SelectItem value="Non-Coffe">
                                                        Non-Coffe
                                                    </SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <InputError
                                                message={errors.nama_menu}
                                            />
                                        </div>
                                        {/*Harga Menu*/}
                                        <div className="mt-4">
                                            <label htmlFor="harga">
                                                Harga Menu
                                            </label>
                                            <Input
                                                type="number"
                                                placeholder="Masukkan harga menu"
                                                id="harga"
                                                value={data.harga}
                                                onChange={(e) =>
                                                    setData(
                                                        'harga',
                                                        Number(e.target.value),
                                                    )
                                                }
                                                aria-invalid={!!errors.harga}
                                            />
                                            <InputError
                                                message={errors.nama_menu}
                                            />
                                        </div>
                                        {/*Is Active*/}
                                        <div className="mt-4">
                                            <label
                                                htmlFor="is_active"
                                                className="mb-2 block font-medium"
                                            >
                                                Is Active
                                            </label>

                                            <div className="flex items-center gap-6">
                                                <label className="flex items-center gap-2">
                                                    <input
                                                        type="radio"
                                                        name="is_active"
                                                        value="1"
                                                        checked={
                                                            data.is_active ===
                                                            true
                                                        }
                                                        onChange={() =>
                                                            setData(
                                                                'is_active',
                                                                true,
                                                            )
                                                        }
                                                        className="accent-primary"
                                                    />
                                                    Aktif
                                                </label>

                                                <label className="flex items-center gap-2">
                                                    <input
                                                        type="radio"
                                                        name="is_active"
                                                        value="0"
                                                        checked={
                                                            data.is_active ===
                                                            false
                                                        }
                                                        onChange={() =>
                                                            setData(
                                                                'is_active',
                                                                false,
                                                            )
                                                        }
                                                        className="accent-primary"
                                                    />
                                                    Non Aktif
                                                </label>
                                                <InputError
                                                    message={errors.is_active}
                                                />
                                            </div>
                                        </div>
                                        {/*Gambar Menu*/}
                                        <div className="mt-4">
                                            <label htmlFor="image">Image</label>
                                            <Input
                                                type="file"
                                                id="image"
                                                onChange={(e) => {
                                                    const file =
                                                        e.target.files?.[0];
                                                    if (file) {
                                                        setData('image', file);
                                                    }
                                                }}
                                                placeholder="Masukkan gambar menu"
                                            />
                                            <InputError
                                                message={errors.is_active}
                                            />
                                            {/* {data.image && (
                                                <img
                                                    src={URL.createObjectURL(
                                                        data.image,
                                                    )}
                                                    alt="Preview"
                                                    className="rounde mt-2 h-32 w-32 rounded object-cover"
                                                />
                                            )} */}
                                            {menuData.image && (
                                                <img
                                                    src={`/storage/${menuData.image}`}
                                                    alt="Preview"
                                                    className="rounde mt-2 h-32 w-32 rounded object-cover"
                                                />
                                            )}
                                        </div>

                                        <div className="mt-4 flex justify-end gap-3">
                                            <Button asChild>
                                                <Link href="/menu">
                                                    Kembali
                                                </Link>
                                            </Button>
                                            <Button
                                                type="submit"
                                                disabled={processing}
                                            >
                                                {processing && (
                                                    <Loader2 className="animate-spin" />
                                                )}
                                                <span>Update Menu</span>
                                            </Button>
                                        </div>
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
