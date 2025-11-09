import IndexPagination from '@/components/index-menu-pagination';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Layout from '@/components/ui/layout';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
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
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { ArrowDownCircle } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Kelola Laporan', href: '/laporan' },
    { title: 'Pengeluaran', href: '/laporan/pengeluaran' },
];

interface LinksType {
    url: string;
    label: string;
    active: boolean;
}

interface PengeluaranType {
    id_pengeluaran: number;
    tanggal: string;
    kategori: string;
    deskripsi: string;
    jumlah_barang: number;
    satuan?: string;
    harga_satuan: number;
    total_pengeluaran: number;
}

interface PengeluaranDataType {
    data: PengeluaranType[];
    links: LinksType[];
    from: number;
    to: number;
    total: number;
}

const Index = ({ pengeluaran, totalPengeluaran }: {
    pengeluaran: PengeluaranDataType;
    totalPengeluaran: number;
}) => {
    const { flash } = usePage<{ flash: { message?: string } }>().props;
    const [selectedMonth, setSelectedMonth] = useState('semua');
    const [selectedKategori, setSelectedKategori] = useState('semua');

    useEffect(() => {
        if (flash.message) toast.success(flash.message);
    }, [flash.message]);

    function deletePengeluaran(id: number) {
        if (confirm('Anda yakin menghapus data pengeluaran ini?')) {
            router.delete(`/laporan/pengeluaran/${id}`);
        }
    }

    const formatRupiah = (amount: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(amount);
    };

    return (
        <Layout breadcrumbs={breadcrumbs}>
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="rounded border bg-white p-6 shadow-md">
                    {/* Header */}
                    <div className="mb-5 flex items-center justify-between">
                        <h1 className="text-2xl font-bold text-gray-800">Laporan Pengeluaran</h1>
                        <Button asChild>
                            <Link href="/laporan/pengeluaran/create">Tambah Pengeluaran</Link>
                        </Button>
                    </div>

                    {/* Card Total Pengeluaran */}
                    <div className="mb-6 grid grid-cols-1 sm:grid-cols-2">
                        <div className="rounded-xl border border-red-200 bg-gradient-to-r from-red-50 via-orange-50 to-transparent p-6 shadow-sm transition hover:shadow-md">
                            <div className="flex items-center gap-3">
                                <div className="rounded-full bg-red-100 p-3">
                                    <ArrowDownCircle className="h-6 w-6 text-red-500" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-600">Total Pengeluaran</p>
                                    <p className="text-3xl font-bold text-red-600">
                                        {formatRupiah(totalPengeluaran)}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Filter Section */}
                    <Card className="mb-5">
                        <CardContent className="pt-4">
                            <div className="flex flex-wrap items-end gap-3">
                                {/* Filter Bulan */}
                                <div className="w-[200px]">
                                    <label className="mb-1 block text-sm font-medium text-gray-700">
                                        Bulan
                                    </label>
                                    <Select
                                        value={selectedMonth}
                                        onValueChange={(value) => {
                                            setSelectedMonth(value);
                                            router.get('/laporan/pengeluaran',
                                                { bulan: value, kategori: selectedKategori },
                                                { preserveState: true, replace: true }
                                            );
                                        }}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Pilih Bulan" />
                                        </SelectTrigger>
                                        <SelectContent className="max-h-[200px]">
                                            {['semua','januari','februari','maret','april','mei','juni','juli','agustus','september','oktober','november','desember']
                                                .map((bulan) => (
                                                    <SelectItem key={bulan} value={bulan}>
                                                        {bulan.charAt(0).toUpperCase() + bulan.slice(1)}
                                                    </SelectItem>
                                                ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* Filter Kategori */}
                                <div className="w-[200px]">
                                    <label className="mb-1 block text-sm font-medium text-gray-700">
                                        Kategori
                                    </label>
                                    <Select
                                        value={selectedKategori}
                                        onValueChange={(value) => {
                                            setSelectedKategori(value);
                                            router.get('/laporan/pengeluaran',
                                                { bulan: selectedMonth, kategori: value },
                                                { preserveState: true, replace: true }
                                            );
                                        }}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Pilih Kategori" />
                                        </SelectTrigger>
                                        <SelectContent className="max-h-[200px]">
                                            {['semua','Bahan Baku','Perlengkapan','Perawatan','Listrik & Air','Gaji Karyawan','Lainnya']
                                                .map((kat) => (
                                                    <SelectItem key={kat} value={kat}>
                                                        {kat === 'semua' ? 'Semua' : kat}
                                                    </SelectItem>
                                                ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Table */}
                    <Card>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>No</TableHead>
                                        <TableHead>Tanggal</TableHead>
                                        <TableHead>Kategori</TableHead>
                                        <TableHead>Deskripsi</TableHead>
                                        <TableHead className="text-right">Jumlah</TableHead>
                                        <TableHead className="text-right">Harga Satuan</TableHead>
                                        <TableHead className="text-right">Total</TableHead>
                                        <TableHead>Action</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {pengeluaran.data?.length > 0 ? (
                                        pengeluaran.data.map((item, index) => (
                                            <TableRow key={item.id_pengeluaran}>
                                                <TableCell>{pengeluaran.from + index}</TableCell>
                                                <TableCell className="whitespace-nowrap">
                                                    {new Date(item.tanggal).toLocaleDateString('id-ID')}
                                                </TableCell>
                                                <TableCell>
                                                    <Badge variant="outline">{item.kategori}</Badge>
                                                </TableCell>
                                                <TableCell>{item.deskripsi}</TableCell>

                                                {/* 🔹 kode tambahan yang kamu kasih */}
                                                <TableCell className="text-right">
                                                    {item.jumlah_barang 
                                                        ? `${item.jumlah_barang} ${item.satuan}` 
                                                        : '-'}
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    {item.harga_satuan 
                                                        ? formatRupiah(item.harga_satuan)
                                                        : '-'}
                                                </TableCell>

                                                <TableCell className="text-right font-semibold text-gray-800">
                                                    {formatRupiah(item.total_pengeluaran)}
                                                </TableCell>
                                                <TableCell className="space-x-1">
                                                    <Button asChild size="sm" variant="outline">
                                                        <Link href={`/laporan/pengeluaran/${item.id_pengeluaran}/edit`}>
                                                            Edit
                                                        </Link>
                                                    </Button>
                                                    <Button
                                                        onClick={() => deletePengeluaran(item.id_pengeluaran)}
                                                        size="sm"
                                                        variant="destructive">
                                                        Delete
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={8} className="h-24 text-center text-muted-foreground">
                                                Tidak ada data pengeluaran.
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>

                    {/* Pagination */}
                    <IndexPagination menu={pengeluaran} />
                </div>
            </div>
        </Layout>
    );
};

export default Index;