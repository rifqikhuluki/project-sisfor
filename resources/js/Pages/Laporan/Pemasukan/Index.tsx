import IndexPagination from '@/components/index-menu-pagination';
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
import { router } from '@inertiajs/react';
import { useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Kelola Laporan', href: '/laporan' },
    { title: 'Pemasukan', href: '/laporan/pemasukan' },
];

interface LinksType {
    url: string;
    label: string;
    active: boolean;
}

interface PemasukanType {
    tanggal: string;
    jumlah_transaksi: number;
    tunai: number;
    non_tunai: number;
    total_penjualan: number;
}

interface PemasukanDataType {
    data: PemasukanType[];
    links: LinksType[];
    from: number;
    to: number;
    total: number;
}

const Index = ({ 
    pemasukan,
    totalPenjualan,
    totalTunai,
    totalNonTunai 
}: { 
    pemasukan: PemasukanDataType;
    totalPenjualan: number;
    totalTunai: number;
    totalNonTunai: number;
}) => {
    const [selectedMonth, setSelectedMonth] = useState('semua');
    const [selectedMetode, setSelectedMetode] = useState('semua');

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
                <div className="rounded border p-6 shadow-xl">
                    {/* Header */}
                    <div className="mb-5">
                        <h1 className="text-2xl font-bold">Laporan Pemasukan</h1>
                    </div>

                    {/* Summary Cards */}
                    <div className="mb-5 grid grid-cols-3 gap-4">
                        <Card className="border-l-4 border-l-green-500 bg-gradient-to-r from-green-50 to-white">
                            <CardContent className="p-6">
                                <p className="text-sm font-medium text-gray-600">Total Penjualan</p>
                                <p className="text-2xl font-bold text-green-600">
                                    {formatRupiah(totalPenjualan)}
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="border-l-4 border-l-blue-500 bg-gradient-to-r from-blue-50 to-white">
                            <CardContent className="p-6">
                                <p className="text-sm font-medium text-gray-600">Transaksi Tunai</p>
                                <p className="text-2xl font-bold text-blue-600">
                                    {formatRupiah(totalTunai)}
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="border-l-4 border-l-purple-500 bg-gradient-to-r from-purple-50 to-white">
                            <CardContent className="p-6">
                                <p className="text-sm font-medium text-gray-600">Transaksi Non-Tunai</p>
                                <p className="text-2xl font-bold text-purple-600">
                                    {formatRupiah(totalNonTunai)}
                                </p>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Filter Section */}
                    <Card className="mb-5">
                        <CardContent className="pt-4">
                            <div className="flex items-end gap-2">
                                <div className="w-[200px]">
                                    <label className="mb-1 block text-sm font-medium">Bulan</label>
                                    <Select value={selectedMonth} onValueChange={(value) => {
                                        setSelectedMonth(value);
                                        router.get('/laporan/pemasukan', 
                                            { bulan: value, metode: selectedMetode },
                                            { preserveState: true, replace: true }
                                        );
                                    }}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Pilih Bulan" />
                                        </SelectTrigger>
                                        <SelectContent className="max-h-[200px]">
                                            <SelectItem value="semua">Semua</SelectItem>
                                            <SelectItem value="januari">Januari</SelectItem>
                                            <SelectItem value="februari">Februari</SelectItem>
                                            <SelectItem value="maret">Maret</SelectItem>
                                            <SelectItem value="april">April</SelectItem>
                                            <SelectItem value="mei">Mei</SelectItem>
                                            <SelectItem value="juni">Juni</SelectItem>
                                            <SelectItem value="juli">Juli</SelectItem>
                                            <SelectItem value="agustus">Agustus</SelectItem>
                                            <SelectItem value="september">September</SelectItem>
                                            <SelectItem value="oktober">Oktober</SelectItem>
                                            <SelectItem value="november">November</SelectItem>
                                            <SelectItem value="desember">Desember</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="w-[200px]">
                                    <label className="mb-1 block text-sm font-medium">Metode Pembayaran</label>
                                    <Select value={selectedMetode} onValueChange={(value) => {
                                        setSelectedMetode(value);
                                        router.get('/laporan/pemasukan',
                                            { bulan: selectedMonth, metode: value },
                                            { preserveState: true, replace: true }
                                        );
                                    }}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Pilih Metode" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="semua">Semua</SelectItem>
                                            <SelectItem value="cash">Cash</SelectItem>
                                            <SelectItem value="qris">QRIS</SelectItem>
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
                                        <TableHead className="text-center">Jumlah Transaksi</TableHead>
                                        <TableHead className="text-right">Tunai</TableHead>
                                        <TableHead className="text-right">Non-Tunai</TableHead>
                                        <TableHead className="text-right">Total Penjualan</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {pemasukan.data?.length > 0 ? (
                                        pemasukan.data.map((item, index) => (
                                            <TableRow key={index}>
                                                <TableCell>{pemasukan.from + index}</TableCell>
                                                <TableCell className="whitespace-nowrap">
                                                    {new Date(item.tanggal).toLocaleDateString('id-ID', {
                                                        day: '2-digit',
                                                        month: '2-digit',
                                                        year: 'numeric'
                                                    })}
                                                </TableCell>
                                                <TableCell className="text-center">
                                                    {item.jumlah_transaksi}
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    {formatRupiah(item.tunai)}
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    {formatRupiah(item.non_tunai)}
                                                </TableCell>
                                                <TableCell className="text-right font-semibold">
                                                    {formatRupiah(item.total_penjualan)}
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                                                Tidak ada data pemasukan.
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>

                    {/* Pagination */}
                    <IndexPagination menu={pemasukan} />
                </div>
            </div>
        </Layout>
    );
};

export default Index;