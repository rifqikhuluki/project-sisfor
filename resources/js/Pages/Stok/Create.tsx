import { useForm, Link } from '@inertiajs/react';
import Layout from '@/components/ui/layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';

export default function Create() {
  const { data, setData, post, processing, errors } = useForm({
    nama_bahan: '',
    satuan: '',
    sisa_awal: '',
    sisa_sekarang: '',
    jumlah_keluar: '',
    tanggal_masuk: '',
    keterangan: '',
  });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    post('/stok');
  };

  return (
    <Layout breadcrumbs={[{ title: 'Tambah Stok', href: '/stok/create' }]}>
      <div className="p-6">
        <Card>
          <CardContent>
            <form onSubmit={submit} className="space-y-4">
              <div>
                <Label>Nama Bahan</Label>
                <Input
                  value={data.nama_bahan}
                  onChange={(e) => setData('nama_bahan', e.target.value)}
                />
                {errors.nama_bahan && <div className="text-red-500 text-sm">{errors.nama_bahan}</div>}
              </div>

              <div>
                <Label>Satuan</Label>
                <Input value={data.satuan} onChange={(e) => setData('satuan', e.target.value)} />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label>Sisa Awal</Label>
                  <Input value={data.sisa_awal} onChange={(e) => setData('sisa_awal', e.target.value)} />
                </div>
                <div>
                  <Label>Sisa Sekarang</Label>
                  <Input value={data.sisa_sekarang} onChange={(e) => setData('sisa_sekarang', e.target.value)} />
                </div>
                <div>
                  <Label>Jumlah Keluar</Label>
                  <Input value={data.jumlah_keluar} onChange={(e) => setData('jumlah_keluar', e.target.value)} />
                </div>
              </div>

              <div>
                <Label>Tanggal Masuk</Label>
                <Input type="date" value={data.tanggal_masuk} onChange={(e) => setData('tanggal_masuk', e.target.value)} />
              </div>

              <div>
                <Label>Keterangan</Label>
                <Input value={data.keterangan} onChange={(e) => setData('keterangan', e.target.value)} />
              </div>

              <div className="flex justify-end gap-2">
                <Button type="submit" disabled={processing}>Simpan</Button>
                <Button asChild variant="outline"><Link href="/stok">Batal</Link></Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
