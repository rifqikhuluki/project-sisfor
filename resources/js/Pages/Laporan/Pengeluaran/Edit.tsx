import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import Layout from '@/components/ui/layout';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { BreadcrumbItem } from '@/types';
import { useForm } from '@inertiajs/react';
import { FormEventHandler, useState } from 'react';
import { toast } from 'sonner';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Kelola Laporan', href: '/laporan' },
    { title: 'Pengeluaran', href: '/laporan/pengeluaran' },
    { title: 'Edit', href: '#' },
];

interface PengeluaranData {
    id_pengeluaran: number;
    tanggal: string;
    kategori: string;
    deskripsi: string;
    jumlah_barang: number | null;
    satuan: string | null;
    harga_satuan: number | null;
    total_pengeluaran: number;
}

const kategoriList = [
    'Bahan Baku',
    'Perlengkapan',
    'Perawatan',
    'Listrik & Air',
    'Gaji Karyawan',
    'Lainnya'
];

const satuanList = [
    'Kg',
    'Gram',
    'Liter',
    'Pcs',
    'Box',
    'Pack',
    'Unit',
    'Orang',
    'Bulan',
    'Hari'
];

const Edit = ({ pengeluaranData }: { pengeluaranData: PengeluaranData }) => {
    
    // Logika Initial State (Menggantikan useEffect)
    const initialUseSatuan = !!(pengeluaranData.jumlah_barang && pengeluaranData.satuan && pengeluaranData.harga_satuan);
    const isInitialCustom = !kategoriList.includes(pengeluaranData.kategori);

    const [useSatuan, setUseSatuan] = useState(initialUseSatuan);
    const [showCustomKategori, setShowCustomKategori] = useState(isInitialCustom);
    const [customKategori, setCustomKategori] = useState(isInitialCustom ? pengeluaranData.kategori : '');

    // Inisialisasi useForm
    const { data, setData, put, processing, errors, transform } = useForm({
        tanggal: pengeluaranData.tanggal,
        kategori: pengeluaranData.kategori,
        deskripsi: pengeluaranData.deskripsi,
        jumlah_barang: pengeluaranData.jumlah_barang?.toString() || '',
        satuan: pengeluaranData.satuan || '',
        harga_satuan: pengeluaranData.harga_satuan?.toString() || '',
        total_pengeluaran: pengeluaranData.total_pengeluaran.toString(),
    });

    // Implementasi Transform untuk manipulasi data sebelum dikirim
    transform((formData) => {
        const finalKategori = showCustomKategori ? customKategori : formData.kategori;
        
        const finalTotal = useSatuan 
            ? (parseFloat(formData.jumlah_barang as string) || 0) * (parseFloat(formData.harga_satuan as string) || 0)
            : parseFloat(formData.total_pengeluaran as string) || 0;

        return {
            ...formData,
            kategori: finalKategori,
            total_pengeluaran: finalTotal.toString(),
            
            jumlah_barang: useSatuan ? formData.jumlah_barang : null,
            satuan: useSatuan ? formData.satuan : null,
            harga_satuan: useSatuan ? formData.harga_satuan : null,
        };
    });

    // Handler Submit
    const handleSubmit: FormEventHandler = (e) => {
        e.preventDefault();

        const finalKategori = showCustomKategori ? customKategori : data.kategori;
        if (!finalKategori.trim()) {
            toast.error('Kategori harus diisi.');
            return;
        }

        // put() akan otomatis menjalankan transform() sebelum pengiriman
        put(`/laporan/pengeluaran/${pengeluaranData.id_pengeluaran}`, {
            onSuccess: () => {
                toast.success('Data pengeluaran berhasil diupdate');
            },
            onError: (err) => {
                 console.error('Server Errors:', err);
                toast.error('Gagal mengupdate data pengeluaran');
            }
        });
    };

    // Hitung total otomatis
    const calculateTotal = () => {
        if (!useSatuan) return parseFloat(data.total_pengeluaran) || 0;
        const jumlah = parseFloat(data.jumlah_barang) || 0;
        const harga = parseFloat(data.harga_satuan) || 0;
        return jumlah * harga;
    };

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
                    <div className="mb-6">
                        <h1 className="text-2xl font-bold text-gray-800">Edit Pengeluaran</h1>
                        <p className="text-sm text-gray-600">Perbarui data pengeluaran</p>
                    </div>

                    <Card>
                        <CardContent className="pt-6">
                            <form onSubmit={handleSubmit} className="space-y-5">
                                {/* Tanggal  */}
                                <div className="max-w-xs">
                                    <label className="mb-2 block text-sm font-medium text-gray-700">
                                        Tanggal <span className="text-red-500">*</span>
                                    </label>
                                    <Input
                                        type="date"
                                        value={data.tanggal}
                                        onChange={(e) => setData('tanggal', e.target.value)}
                                        className={errors.tanggal ? 'border-red-500' : ''}
                                        required
                                    />
                                    {errors.tanggal && (
                                        <p className="mt-1 text-sm text-red-500">{errors.tanggal}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="mb-2 block text-sm font-medium text-gray-700">
                                        Kategori <span className="text-red-500">*</span>
                                    </label>
                                    
                                    {!showCustomKategori ? (
                                        <div className="space-y-2">
                                            <Select
                                                value={data.kategori}
                                                onValueChange={(value) => {
                                                    if (value === 'custom') {
                                                        setShowCustomKategori(true);
                                                        setData('kategori', ''); // Kosongkan kategori data agar input custom muncul
                                                    } else {
                                                        setData('kategori', value);
                                                    }
                                                }}
                                            >
                                                <SelectTrigger className={errors.kategori ? 'border-red-500' : ''}>
                                                    <SelectValue placeholder="Pilih atau ketik kategori" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {kategoriList.map((kat) => (
                                                        <SelectItem key={kat} value={kat}>
                                                            {kat}
                                                        </SelectItem>
                                                    ))}
                                                    <SelectItem value="custom" className="text-blue-600 font-medium">
                                                        + Kategori Lainnya (Ketik Manual)
                                                    </SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    ) : (
                                        <div className="space-y-2">
                                            <Input
                                                type="text"
                                                placeholder="Ketik kategori baru..."
                                                value={customKategori}
                                                onChange={(e) => setCustomKategori(e.target.value)}
                                                className={errors.kategori ? 'border-red-500' : 'border-blue-500'}
                                                required
                                            />
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => {
                                                    setShowCustomKategori(false);
                                                    // Kembalikan ke kategori awal jika ada, atau default list
                                                    setData('kategori', kategoriList.includes(pengeluaranData.kategori) ? pengeluaranData.kategori : kategoriList[0]);
                                                    setCustomKategori('');
                                                }}
                                                className="text-xs text-gray-600"
                                            >
                                                ← Kembali ke pilihan kategori
                                            </Button>
                                        </div>
                                    )}
                                    
                                    {errors.kategori && (
                                        <p className="mt-1 text-sm text-red-500">{errors.kategori}</p>
                                    )}
                                </div>

                                {/* Deskripsi */}
                                <div>
                                    <label className="mb-2 block text-sm font-medium text-gray-700">
                                        Deskripsi <span className="text-red-500">*</span>
                                    </label>
                                    <Input
                                        type="text"
                                        placeholder="Contoh: Pembelian Biji Kopi"
                                        value={data.deskripsi}
                                        onChange={(e) => setData('deskripsi', e.target.value)}
                                        className={errors.deskripsi ? 'border-red-500' : ''}
                                        required
                                    />
                                    {errors.deskripsi && (
                                        <p className="mt-1 text-sm text-red-500">{errors.deskripsi}</p>
                                    )}
                                </div>

                                {/* Toggle Gunakan Satuan */}
                                <div className="flex items-center justify-between rounded-lg border border-gray-200 bg-gray-50 p-4">
                                    <div className="space-y-0.5">
                                        <Label className="text-sm font-medium">
                                            Gunakan Perhitungan Satuan
                                        </Label>
                                        <p className="text-xs text-gray-500">
                                            Aktifkan jika ingin menghitung berdasarkan jumlah × harga satuan
                                        </p>
                                    </div>
                                    <Switch
                                        checked={useSatuan}
                                        onCheckedChange={setUseSatuan}
                                    />
                                </div>

                                {/* Conditional Input: Pakai Satuan atau Langsung */}
                                {useSatuan ? (
                                    <div className="grid grid-cols-3 gap-4">
                                        {/* Jumlah */}
                                        <div>
                                            <label className="mb-2 block text-sm font-medium text-gray-700">
                                                Jumlah <span className="text-red-500">*</span>
                                            </label>
                                            <Input
                                                type="number"
                                                placeholder="0"
                                                value={data.jumlah_barang}
                                                onChange={(e) => setData('jumlah_barang', e.target.value)}
                                                className={errors.jumlah_barang ? 'border-red-500' : ''}
                                                min="0"
                                                step="0.01"
                                                required
                                            />
                                            {errors.jumlah_barang && (
                                                <p className="mt-1 text-sm text-red-500">{errors.jumlah_barang}</p>
                                            )}
                                        </div>

                                        {/* Satuan */}
                                        <div>
                                            <label className="mb-2 block text-sm font-medium text-gray-700">
                                                Satuan <span className="text-red-500">*</span>
                                            </label>
                                            <Select
                                                value={data.satuan || ''}
                                                onValueChange={(value) => setData('satuan', value)}
                                            >
                                                <SelectTrigger className={errors.satuan ? 'border-red-500' : ''}>
                                                    <SelectValue placeholder="Pilih" />
                                                </SelectTrigger>
                                                <SelectContent className="max-h-[200px]">
                                                    {satuanList.map((satuan) => (
                                                        <SelectItem key={satuan} value={satuan}>
                                                            {satuan}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            {errors.satuan && (
                                                <p className="mt-1 text-sm text-red-500">{errors.satuan}</p>
                                            )}
                                        </div>

                                        {/* Harga Satuan */}
                                        <div>
                                            <label className="mb-2 block text-sm font-medium text-gray-700">
                                                Harga/Satuan <span className="text-red-500">*</span>
                                            </label>
                                            <Input
                                                type="number"
                                                placeholder="0"
                                                value={data.harga_satuan}
                                                onChange={(e) => setData('harga_satuan', e.target.value)}
                                                className={errors.harga_satuan ? 'border-red-500' : ''}
                                                min="0"
                                                required
                                            />
                                            {errors.harga_satuan && (
                                                <p className="mt-1 text-sm text-red-500">{errors.harga_satuan}</p>
                                            )}
                                        </div>
                                    </div>
                                ) : (
                                    <div>
                                        <label className="mb-2 block text-sm font-medium text-gray-700">
                                            Total Pengeluaran <span className="text-red-500">*</span>
                                        </label>
                                        <Input
                                            type="number"
                                            placeholder="Masukkan total pengeluaran"
                                            value={data.total_pengeluaran}
                                            onChange={(e) => setData('total_pengeluaran', e.target.value)}
                                            className={errors.total_pengeluaran ? 'border-red-500' : ''}
                                            min="0"
                                            required
                                        />
                                        {errors.total_pengeluaran && (
                                            <p className="mt-1 text-sm text-red-500">{errors.total_pengeluaran}</p>
                                        )}
                                    </div>
                                )}

                                {/* Total Pengeluaran Display */}
                                <div className="rounded-lg border border-green-200 bg-green-50 p-4">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <span className="text-sm font-medium text-gray-700">
                                                Total Pengeluaran
                                            </span>
                                            {useSatuan && data.jumlah_barang && data.satuan && data.harga_satuan && (
                                                <p className="text-xs text-gray-500">
                                                    {data.jumlah_barang} {data.satuan} × {formatRupiah(parseFloat(data.harga_satuan) || 0)}
                                                </p>
                                            )}
                                        </div>
                                        <span className="text-2xl font-bold text-green-600">
                                            {formatRupiah(calculateTotal())}
                                        </span>
                                    </div>
                                </div>

                                {/* Buttons */}
                                <div className="flex justify-end gap-3 pt-4">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => window.history.back()}
                                        disabled={processing}
                                    >
                                        Batal
                                    </Button>
                                    <Button
                                        type="submit"
                                        disabled={processing}
                                        className="min-w-[120px]"
                                    >
                                        {processing ? 'Menyimpan...' : 'Update'}
                                    </Button>
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