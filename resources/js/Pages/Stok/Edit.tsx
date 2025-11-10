import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Layout from '@/components/ui/layout';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { BreadcrumbItem } from '@/types';
import { router } from '@inertiajs/react';
import { useState } from 'react';
import { toast } from 'sonner';

interface StokType {
    id: number;
    nama_bahan: string;
    satuan: string;
    sisa_awal: number;
    sisa_sekarang: number;
    jumlah_keluar: number;
    tanggal_masuk?: string;
    keterangan?: string;
}

interface EditProps {
    stok: StokType;
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Kelola Stok', href: '/stok' },
    { title: 'Edit Stok', href: '/stok' },
];

export default function Edit({ stok }: EditProps) {
    const [formData, setFormData] = useState({
        nama_bahan: stok.nama_bahan || '',
        satuan: stok.satuan || '',
        sisa_awal: stok.sisa_awal || 0,
        sisa_sekarang: stok.sisa_sekarang || 0,
        jumlah_keluar: stok.jumlah_keluar || 0,
        tanggal_masuk: stok.tanggal_masuk || '',
        keterangan: stok.keterangan || '',
    });

    function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    }

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        router.put(`/stok/${stok.id}`, formData, {
            onSuccess: () => toast.success('Stok berhasil diperbarui!'),
        });
    }

    return (
        <Layout breadcrumbs={breadcrumbs}>
            <div className="flex flex-col gap-4 p-4">
                <Card>
                    <CardContent className="p-6">
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <Label>Nama Bahan</Label>
                                <Input
                                    name="nama_bahan"
                                    value={formData.nama_bahan}
                                    onChange={handleChange}
                                />
                            </div>
                            <div>
                                <Label>Satuan</Label>
                                <Input
                                    name="satuan"
                                    value={formData.satuan}
                                    onChange={handleChange}
                                />
                            </div>
                            <div>
                                <Label>Sisa Awal</Label>
                                <Input
                                    type="number"
                                    name="sisa_awal"
                                    value={formData.sisa_awal}
                                    onChange={handleChange}
                                />
                            </div>
                            <div>
                                <Label>Sisa Sekarang</Label>
                                <Input
                                    type="number"
                                    name="sisa_sekarang"
                                    value={formData.sisa_sekarang}
                                    onChange={handleChange}
                                />
                            </div>
                            <div>
                                <Label>Jumlah Keluar</Label>
                                <Input
                                    type="number"
                                    name="jumlah_keluar"
                                    value={formData.jumlah_keluar}
                                    onChange={handleChange}
                                />
                            </div>
                            <div>
                                <Label>Tanggal Masuk</Label>
                                <Input
                                    type="date"
                                    name="tanggal_masuk"
                                    value={formData.tanggal_masuk}
                                    onChange={handleChange}
                                />
                            </div>
                            <div>
                                <Label>Keterangan</Label>
                                <Input
                                    name="keterangan"
                                    value={formData.keterangan}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="flex justify-end gap-2">
                                <Button type="submit">Simpan Perubahan</Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </Layout>
    );
}
