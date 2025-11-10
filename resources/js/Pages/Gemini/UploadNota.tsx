'use client';
import { useState } from 'react';
import { router, usePage } from '@inertiajs/react';
import Layout from '@/components/ui/layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
  { title: 'Upload Nota (Gemini AI)', href: '/gemini/upload' },
];

export default function UploadNota() {
  const { props }: any = usePage();
  const riwayat = props.riwayat ?? [];
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any | null>(null);

  const handleUpload = () => {
    if (!file) return alert('Pilih file nota dulu ya 😊');
    setLoading(true);
    // simulasi hasil analisis dari Gemini
    setTimeout(() => {
      setResult({
        amount: 'Rp 12.800',
        category: 'Food & Dining',
        description: 'Javana Jasmine Tea',
        date: '2020-11-07',
      });
      setLoading(false);
    }, 1500);
  };

  const handleSave = () => {
    if (!result) return;
    router.post('/gemini/upload', result);
    setResult(null);
    setFile(null);
  };

  return (
    <Layout breadcrumbs={breadcrumbs}>
      <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
        <Card>
          <CardHeader>
            <CardTitle>Upload Nota (Gemini AI)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <Input
                type="file"
                onChange={(e) => setFile(e.target.files?.[0] ?? null)}
              />
              <Button onClick={handleUpload} disabled={loading} className="text-white">
                {loading ? 'Mengirim...' : 'Kirim ke Gemini'}
              </Button>
            </div>
          </CardContent>
        </Card>

        {result && (
          <Card className="border-green-400">
            <CardHeader>
              <CardTitle>Hasil Analisis Nota</CardTitle>
            </CardHeader>
            <CardContent className="space-y-1 text-sm">
              <p><strong>Amount:</strong> {result.amount}</p>
              <p><strong>Category:</strong> {result.category}</p>
              <p><strong>Description:</strong> {result.description}</p>
              <p><strong>Date:</strong> {result.date}</p>
              <Button onClick={handleSave} className="mt-3 bg-green-600 hover:bg-green-700 text-white">
                Simpan ke Riwayat
              </Button>
            </CardContent>
          </Card>
        )}

        {riwayat.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle> Riwayat Upload Nota</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Deskripsi</TableHead>
                    <TableHead>Kategori</TableHead>
                    <TableHead>Tanggal</TableHead>
                    <TableHead>Jumlah</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {riwayat.map((item: any, i: number) => (
                    <TableRow key={i}>
                      <TableCell>{item.description}</TableCell>
                      <TableCell>{item.category}</TableCell>
                      <TableCell>{item.date}</TableCell>
                      <TableCell>{item.amount}</TableCell>
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