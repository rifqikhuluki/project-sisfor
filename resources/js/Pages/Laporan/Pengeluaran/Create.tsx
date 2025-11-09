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
    { title: 'Tambah', href: '/laporan/pengeluaran/create' },
];

const kategoriList = [
    'Bahan Baku',
    'Perlengkapan',
    'Perawatan',
    'Listrik & Air',
    'Gaji Karyawan',
    'Lainnya',
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
    'Hari',
];

const Create = () => {
    const [useSatuan, setUseSatuan] = useState(true);
    const [customKategori, setCustomKategori] = useState('');
    const [showCustomKategori, setShowCustomKategori] = useState(false);

    const { data, setData, post, processing, errors, transform } = useForm({
        tanggal: '',
        kategori: '',
        deskripsi: '',
        jumlah_barang: '',
        satuan: '',
        harga_satuan: '',
        total_pengeluaran: '',
    });

    /**
     * ✅ PERBAIKAN UTAMA: Menggunakan transform untuk memastikan data.kategori
     * selalu diisi dengan nilai yang benar (dari customKategori jika mode aktif)
     * sebelum Inertia mengirimkannya ke server.
     */
    transform((formData) => {
        const finalKategori = showCustomKategori ? customKategori : formData.kategori;
        
        // Hitung total akhir
        const finalTotal = useSatuan
            ? (parseFloat(formData.jumlah_barang as string) || 0) *
              (parseFloat(formData.harga_satuan as string) || 0)
            : parseFloat(formData.total_pengeluaran as string) || 0;

        return {
            ...formData,
            // OVERWRITE kategori dengan nilai final
            kategori: finalKategori, 
            total_pengeluaran: finalTotal.toString(),

            // Mengatur field yang tidak terpakai menjadi null sesuai logika backend
            jumlah_barang: useSatuan ? formData.jumlah_barang : null,
            satuan: useSatuan ? formData.satuan : null,
            harga_satuan: useSatuan ? formData.harga_satuan : null,
        };
    });

    // Fungsi untuk menghitung total pengeluaran
    const calculateTotal = () => {
        if (!useSatuan) return parseFloat(data.total_pengeluaran) || 0;
        const jumlah = parseFloat(data.jumlah_barang) || 0;
        const harga = parseFloat(data.harga_satuan) || 0;
        return jumlah * harga;
    };

    // Fungsi untuk format Rupiah
    const formatRupiah = (amount: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(amount);
    };

    const handleSubmit: FormEventHandler = (e) => {
        e.preventDefault();

        // Validasi klien sederhana untuk custom kategori
        const finalKategori = showCustomKategori ? customKategori : data.kategori;
        if (!finalKategori.trim()) {
            toast.error('Kategori harus diisi.');
            return;
        }

        // Kirim data. Transform akan berjalan sebelum POST dikirimkan.
        post('/laporan/pengeluaran', {
            onSuccess: () => {
                toast.success('Data pengeluaran berhasil ditambahkan');
            },
            onError: (err) => {
                // Opsional: Log error dari server
                console.error('Server Errors:', err);
                toast.error('Gagal menambahkan data pengeluaran');
            },
        });
    };

    return (
        <Layout breadcrumbs={breadcrumbs}>
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="rounded border bg-white p-6 shadow-md">
                    {/* Header */}
                    <div className="mb-6">
                        <h1 className="text-2xl font-bold text-gray-800">
                            Tambah Pengeluaran
                        </h1>
                        <p className="text-sm text-gray-600">
                            Tambahkan data pengeluaran baru
                        </p>
                    </div>

                    <Card>
                        <CardContent className="pt-6">
                            <form onSubmit={handleSubmit} className="space-y-5">
                                {/* Tanggal */}
                                <div className='max-w-xs'>
                                    <label className="mb-2 block text-sm font-medium text-gray-700">
                                        Tanggal <span className="text-red-500">*</span>
                                    </label>
                                    <Input
                                        type="date"
                                        value={data.tanggal}
                                        onChange={(e) =>
                                            setData('tanggal', e.target.value)
                                        }
                                        className={
                                            errors.tanggal ? 'border-red-500' : ''
                                        }
                                        required
                                    />
                                    {errors.tanggal && (
                                        <p className="mt-1 text-sm text-red-500">
                                            {errors.tanggal}
                                        </p>
                                    )}
                                </div>

                                {/* Kategori dengan Combobox/Input Manual */}
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
                                                    } else {
                                                        setData('kategori', value);
                                                    }
                                                }}
                                            >
                                                <SelectTrigger
                                                    className={
                                                        errors.kategori
                                                            ? 'border-red-500'
                                                            : ''
                                                    }
                                                >
                                                    <SelectValue placeholder="Pilih atau ketik kategori" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {kategoriList.map((kat) => (
                                                        <SelectItem key={kat} value={kat}>
                                                            {kat}
                                                        </SelectItem>
                                                    ))}
                                                    <SelectItem
                                                        value="custom"
                                                        className="font-medium text-blue-600"
                                                    >
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
                                                onChange={(e) =>
                                                    setCustomKategori(e.target.value)
                                                }
                                                // Menerapkan error style dari Inertia (key-nya tetap 'kategori')
                                                className={
                                                    errors.kategori
                                                        ? 'border-red-500'
                                                        : 'border-blue-500'
                                                }
                                                required
                                            />
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => {
                                                    setShowCustomKategori(false);
                                                    setCustomKategori('');
                                                }}
                                                className="text-xs text-gray-600"
                                            >
                                                ← Kembali ke pilihan kategori
                                            </Button>
                                        </div>
                                    )}

                                    {/* Error message ditampilkan terlepas dari mode input */}
                                    {errors.kategori && (
                                        <p className="mt-1 text-sm text-red-500">
                                            {errors.kategori}
                                        </p>
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
                                        onChange={(e) =>
                                            setData('deskripsi', e.target.value)
                                        }
                                        className={
                                            errors.deskripsi ? 'border-red-500' : ''
                                        }
                                        required
                                    />
                                    {errors.deskripsi && (
                                        <p className="mt-1 text-sm text-red-500">
                                            {errors.deskripsi}
                                        </p>
                                    )}
                                </div>

                                {/* Toggle Gunakan Satuan */}
                                <div className="flex items-center justify-between rounded-lg border border-gray-200 bg-gray-50 p-4">
                                    <div className="space-y-0.5">
                                        <Label className="text-sm font-medium">
                                            Gunakan Perhitungan Satuan
                                        </Label>
                                        <p className="text-xs text-gray-500">
                                            Aktifkan jika ingin menghitung berdasarkan
                                            jumlah × harga satuan
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
                                                onChange={(e) =>
                                                    setData(
                                                        'jumlah_barang',
                                                        e.target.value,
                                                    )
                                                }
                                                className={
                                                    errors.jumlah_barang
                                                        ? 'border-red-500'
                                                        : ''
                                                }
                                                min="0"
                                                step="0.01"
                                                required
                                            />
                                            {errors.jumlah_barang && (
                                                <p className="mt-1 text-sm text-red-500">
                                                    {errors.jumlah_barang}
                                                </p>
                                            )}
                                        </div>

                                        {/* Satuan */}
                                        <div>
                                            <label className="mb-2 block text-sm font-medium text-gray-700">
                                                Satuan <span className="text-red-500">*</span>
                                            </label>
                                            <Select
                                                value={data.satuan}
                                                onValueChange={(value) =>
                                                    setData('satuan', value)
                                                }
                                            >
                                                <SelectTrigger
                                                    className={
                                                        errors.satuan
                                                            ? 'border-red-500'
                                                            : ''
                                                    }
                                                >
                                                    <SelectValue placeholder="Pilih" />
                                                </SelectTrigger>
                                                <SelectContent className="max-h-[200px]">
                                                    {satuanList.map((satuan) => (
                                                        <SelectItem
                                                            key={satuan}
                                                            value={satuan}
                                                        >
                                                            {satuan}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            {errors.satuan && (
                                                <p className="mt-1 text-sm text-red-500">
                                                    {errors.satuan}
                                                </p>
                                            )}
                                        </div>

                                        {/* Harga Satuan */}
                                        <div>
                                            <label className="mb-2 block text-sm font-medium text-gray-700">
                                                Harga/Satuan{' '}
                                                <span className="text-red-500">*</span>
                                            </label>
                                            <Input
                                                type="number"
                                                placeholder="0"
                                                value={data.harga_satuan}
                                                onChange={(e) =>
                                                    setData(
                                                        'harga_satuan',
                                                        e.target.value,
                                                    )
                                                }
                                                className={
                                                    errors.harga_satuan
                                                        ? 'border-red-500'
                                                        : ''
                                                }
                                                min="0"
                                                required
                                            />
                                            {errors.harga_satuan && (
                                                <p className="mt-1 text-sm text-red-500">
                                                    {errors.harga_satuan}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                ) : (
                                    <div>
                                        <label className="mb-2 block text-sm font-medium text-gray-700">
                                            Total Pengeluaran{' '}
                                            <span className="text-red-500">*</span>
                                        </label>
                                        <Input
                                            type="number"
                                            placeholder="Masukkan total pengeluaran"
                                            value={data.total_pengeluaran}
                                            onChange={(e) =>
                                                setData(
                                                    'total_pengeluaran',
                                                    e.target.value,
                                                )
                                            }
                                            className={
                                                errors.total_pengeluaran
                                                    ? 'border-red-500'
                                                    : ''
                                            }
                                            min="0"
                                            required
                                        />
                                        {errors.total_pengeluaran && (
                                            <p className="mt-1 text-sm text-red-500">
                                                {errors.total_pengeluaran}
                                            </p>
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
                                            {useSatuan &&
                                                data.jumlah_barang &&
                                                data.satuan &&
                                                data.harga_satuan && (
                                                    <p className="text-xs text-gray-500">
                                                        {data.jumlah_barang}{' '}
                                                        {data.satuan} ×{' '}
                                                        {formatRupiah(
                                                            parseFloat(
                                                                data.harga_satuan,
                                                            ) || 0,
                                                        )}
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
                                        {processing ? 'Menyimpan...' : 'Simpan'}
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

export default Create;