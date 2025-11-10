import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Layout from '@/components/ui/layout';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { BreadcrumbItem } from '@/types';
import { useForm } from '@inertiajs/react';
import React from 'react';

// 🧭 Breadcrumb untuk tampilan navigasi
const breadcrumbs: BreadcrumbItem[] = [
  { title: 'Kelola Stok', href: '/stok' },
  { title: 'Edit Stok', href: '/stok/edit' },
];

// ✅ Tipe aman untuk form stok
interface StokForm {
  nama_bahan: string;
  satuan: string;
  sisa_awal: number;
  sisa_sekarang: number;
  jumlah_keluar: number;
  tanggal_masuk: string;
  keterangan: string;
}

interface EditProps {
  stok: {
    id: number;
    nama_bahan: string;
    satuan: string;
    sisa_awal: number;
    sisa_sekarang: number;
    jumlah_keluar: number;
    tanggal_masuk?: string;
    keterangan?: string;
  };
}

const Edit: React.FC<EditProps> = ({ stok }) => {
  // 💡 Tambahkan tipe <StokForm> agar TypeScript tidak bingung
  const { data, setData, put, processing } = useForm<StokForm>({
    nama_bahan: stok.nama_bahan ?? '',
    satuan: stok.satuan ?? '',
    sisa_awal: stok.sisa_awal ?? 0,
    sisa_sekarang: stok.sisa_sekarang ?? 0,
    jumlah_keluar: stok.jumlah_keluar ?? 0,
    tanggal_masuk: stok.tanggal_masuk ?? '',
    keterangan: stok.keterangan ?? '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    put(`/stok/${stok.id}`);
  };

  return (
    <Layout breadcrumbs={breadcrumbs}>
      <Card className="mx-auto max-w-2xl">
        <CardContent className="p-6">
          <h2 className="mb-4 text-xl font-semibold">Edit Stok</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label>Nama Bahan</Label>
              <Input
                value={data.nama_bahan}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setData('nama_bahan', e.target.value)
                }
              />
            </div>

            <div>
              <Label>Satuan</Label>
              <Input
                value={data.satuan}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setData('satuan', e.target.value)
                }
              />
            </div>

            <div>
              <Label>Sisa Sekarang</Label>
              <Input
                type="number"
                value={data.sisa_sekarang}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setData('sisa_sekarang', Number(e.target.value))
                }
              />
            </div>

            <div>
              <Label>Keterangan</Label>
              <Input
                value={data.keterangan}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setData('keterangan', e.target.value)
                }
              />
            </div>

            <div className="flex justify-end gap-2">
              <Button type="submit" disabled={processing}>
                Simpan Perubahan
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </Layout>
  );
};

export default Edit;
