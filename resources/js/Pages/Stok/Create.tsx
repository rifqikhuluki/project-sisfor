import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Layout from '@/components/ui/layout';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { BreadcrumbItem } from '@/types';
import { useForm } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Kelola Stok', href: '/stok' },
    { title: 'Tambah Stok', href: '/stok/create' },
];

const Create = () => {
    const { data, setData, post, processing, errors } = useForm({
        nama_bahan: '',
        satuan: '',
        sisa_awal: 0,
        sisa_sekarang: 0,
        jumlah_keluar: 0,
        tanggal_masuk: '',
        keterangan: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/stok');
    };

    return (
        <Layout breadcrumbs={breadcrumbs}>
            <Card className="mx-auto max-w-2xl">
                <CardContent className="p-6">
                    <h2 className="mb-4 text-xl font-semibold">Tambah Stok</h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <Label>Nama Bahan</Label>
                            <Input value={data.nama_bahan} onChange={(e) => setData('nama_bahan', e.target.value)} />
                        </div>
                        <div>
                            <Label>Satuan</Label>
                            <Input value={data.satuan} onChange={(e) => setData('satuan', e.target.value)} />
                        </div>
                        <div>
                            <Label>Sisa Awal</Label>
                            <Input
                                type="number"
                                value={data.sisa_awal}
                                onChange={(e) => setData('sisa_awal', Number(e.target.value))}
                            />
                        </div>
                        <div>
                            <Label>Tanggal Masuk</Label>
                            <Input
                                type="date"
                                value={data.tanggal_masuk}
                                onChange={(e) => setData('tanggal_masuk', e.target.value)}
                            />
                        </div>
                        <div>
                            <Label>Keterangan</Label>
                            <Input
                                value={data.keterangan}
                                onChange={(e) => setData('keterangan', e.target.value)}
                            />
                        </div>
                        <div className="flex justify-end gap-2">
                            <Button type="submit" disabled={processing}>
                                Simpan
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </Layout>
    );
};

export default Create;
