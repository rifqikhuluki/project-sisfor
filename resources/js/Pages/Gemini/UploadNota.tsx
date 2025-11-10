'use client';

import { useState, useEffect } from 'react';
import Layout from '@/components/ui/layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
  { title: 'Upload Nota (Gemini AI)', href: '/gemini/upload' },
];

interface Nota {
  id: number;
  description: string;
  category: string;
  date: string;
  amount: number;
}

export default function UploadNota() {
  const [riwayat, setRiwayat] = useState<Nota[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<Partial<Nota> | null>(null);

  const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');

  // Ambil riwayat awal
  useEffect(() => {
    fetch('/gemini/api/riwayat')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setRiwayat(data.riwayat);
        }
      });
  }, []);

  const handleUpload = async () => {
    if (!file) return alert('Pilih file nota dulu ya');

    setResult(null);
    setLoading(true);

    const formData = new FormData();
    formData.append('image', file);

    try {
      const res = await fetch('/extract-receipt', {
        method: 'POST',
        body: formData,
        headers: { 'X-CSRF-TOKEN': csrfToken ?? '' },
      });

      const data = await res.json();
      if (!data.success) return alert(data.message || 'Gagal memproses nota');

      setResult({
        amount: Number(data.amount ?? 0),
        category: data.category,
        description: data.description,
        date: data.date,
      });
    } catch (err) {
      console.error(err);
      alert('Terjadi kesalahan saat menghubungi server');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!result) return;

    try {
      const res = await fetch('/gemini/upload', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': csrfToken ?? '',
        },
        body: JSON.stringify(result),
      });

      const data = await res.json();
      if (data.success) {
        setRiwayat([data.nota, ...riwayat]);
        setResult(null);
        setFile(null);
      } else {
        alert(data.message || 'Gagal menyimpan nota');
      }
    } catch (err) {
      console.error(err);
      alert('Terjadi kesalahan saat menyimpan nota');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Yakin mau hapus nota ini?')) return;

    try {
      const res = await fetch(`/gemini/upload/${id}`, { method: 'DELETE', headers: { 'X-CSRF-TOKEN': csrfToken ?? '' } });
      const data = await res.json();
      if (data.success) setRiwayat(riwayat.filter(item => item.id !== id));
      else alert(data.message || 'Gagal menghapus nota');
    } catch (err) {
      console.error(err);
      alert('Terjadi kesalahan saat menghapus nota');
    }
  };

  return (
    <Layout breadcrumbs={breadcrumbs}>
      <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
        {/* Upload Card */}
        <Card>
          <CardHeader><CardTitle>Upload Nota (Gemini AI)</CardTitle></CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <Input type="file" accept="image/jpeg,image/png,image/jpg" onChange={e => setFile(e.target.files?.[0] ?? null)} />
              <Button onClick={handleUpload} disabled={loading} className="text-white bg-indigo-600 hover:bg-indigo-700">
                {loading ? 'Sedang diproses...' : 'Kirim ke Gemini'}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Hasil Analisis */}
        {result && (
          <Card className="border-green-400">
            <CardHeader><CardTitle>Hasil Analisis Nota</CardTitle></CardHeader>
            <CardContent className="space-y-1 text-sm">
              <p><strong>Amount:</strong> Rp {Number(result.amount ?? 0).toLocaleString('id-ID')}</p>
              <p><strong>Category:</strong> {result.category}</p>
              <p><strong>Description:</strong> {result.description}</p>
              <p><strong>Date:</strong> {result.date}</p>
              <Button onClick={handleSave} className="mt-3 bg-green-600 hover:bg-green-700 text-white">Simpan ke Riwayat</Button>
            </CardContent>
          </Card>
        )}

        {/* Riwayat Upload */}
        {riwayat.length > 0 && (
          <Card>
            <CardHeader><CardTitle>Riwayat Upload Nota</CardTitle></CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Deskripsi</TableHead>
                    <TableHead>Kategori</TableHead>
                    <TableHead>Tanggal</TableHead>
                    <TableHead>Jumlah</TableHead>
                    <TableHead>Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {riwayat.map((item: Nota) => (
                    <TableRow key={item.id}>
                      <TableCell>{item.description}</TableCell>
                      <TableCell>{item.category}</TableCell>
                      <TableCell>{item.date}</TableCell>
                      <TableCell>Rp {Number(item.amount ?? 0).toLocaleString('id-ID')}</TableCell>
                      <TableCell>
                        <Button variant="destructive" onClick={() => handleDelete(item.id)} className="bg-red-600 hover:bg-red-700 text-white">Hapus</Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
}
