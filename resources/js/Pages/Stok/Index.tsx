import IndexPagination from '@/components/index-menu-pagination';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Layout from '@/components/ui/layout';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { BreadcrumbItem } from '@/types';
import { Link, router, usePage } from '@inertiajs/react';
import { useEffect } from 'react';
import { toast } from 'sonner';

const breadcrumbs: BreadcrumbItem[] = [
  { title: 'Kelola Stok', href: '/stok' },
  { title: 'Lihat Stok', href: '/stok' },
];

interface LinksType {
  url: string;
  label: string;
  active: boolean;
}

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

interface StokDataType {
  data: StokType[];
  links: LinksType[];
  from: number;
  to: number;
  total: number;
}

export default function Index({ stoks }: { stoks: StokDataType }) {
  const { flash } = usePage<{ flash: { message?: string } }>().props;

  useEffect(() => {
    if (flash?.message) toast.success(flash.message);
  }, [flash?.message]);

  const deleteStok = (id: number) => {
    if (confirm('Yakin ingin menghapus stok ini?')) {
      router.delete(`/stok/${id}`);
    }
  };

  return (
    <Layout breadcrumbs={breadcrumbs}>
      <div className="p-6 space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold">Lihat Stok</h1>
          <Button asChild>
            <Link href="/stok/create">Tambah Stok</Link>
          </Button>
        </div>

        <Card>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>No</TableHead>
                  <TableHead>Nama Bahan</TableHead>
                  <TableHead>Satuan</TableHead>
                  <TableHead>Sisa Awal</TableHead>
                  <TableHead>Sisa Sekarang</TableHead>
                  <TableHead>Jumlah Keluar</TableHead>
                  <TableHead>Tanggal Masuk</TableHead>
                  <TableHead>Keterangan</TableHead>
                  <TableHead>Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {stoks.data.length > 0 ? (
                  stoks.data.map((stok, index) => (
                    <TableRow key={stok.id}>
                      <TableCell>{stoks.from + index}</TableCell>
                      <TableCell>{stok.nama_bahan}</TableCell>
                      <TableCell>{stok.satuan}</TableCell>
                      <TableCell>{stok.sisa_awal}</TableCell>
                      <TableCell>{stok.sisa_sekarang}</TableCell>
                      <TableCell>{stok.jumlah_keluar}</TableCell>
                      <TableCell>{stok.tanggal_masuk || '-'}</TableCell>
                      <TableCell>{stok.keterangan || '-'}</TableCell>
                      <TableCell className="space-x-2">
                        <Button asChild size="sm" variant="outline">
                          <Link href={`/stok/${stok.id}/edit`}>Edit</Link>
                        </Button>
                        <Button
                          onClick={() => deleteStok(stok.id)}
                          size="sm"
                          variant="destructive">
                          Hapus
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center py-6">
                      Tidak ada data stok.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <IndexPagination menu={stoks} />
      </div>
    </Layout>
  );
}
