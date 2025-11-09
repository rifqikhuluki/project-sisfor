<?php

namespace App\Http\Controllers;

use App\Models\Pengeluaran;
use Illuminate\Http\Request;
use Inertia\Inertia;

class LaporanPengeluaranController extends Controller
{
    public function index(Request $request)
    {
        $query = Pengeluaran::latest();

        if ($request->has('search') && $request->search != null) {
            $query->whereAny(['deskripsi', 'kategori'], 'like', '%' . $request->search . '%');
        }

        if ($request->has('bulan') && $request->bulan && $request->bulan !== 'semua') {
            $bulanMap = [
                'januari' => 1, 'februari' => 2, 'maret' => 3, 'april' => 4,
                'mei' => 5, 'juni' => 6, 'juli' => 7, 'agustus' => 8,
                'september' => 9, 'oktober' => 10, 'november' => 11, 'desember' => 12
            ];
            
            $bulanNumber = $bulanMap[strtolower($request->bulan)] ?? null;
            if ($bulanNumber) {
                $query->whereMonth('tanggal', $bulanNumber);
            }
        }

        if ($request->has('kategori') && $request->kategori && $request->kategori !== 'semua') {
            $query->where('kategori', $request->kategori);
        }

        $pengeluaran = $query->paginate(10)->toArray();

        $totalQuery = Pengeluaran::query();
        
        if ($request->has('bulan') && $request->bulan && $request->bulan !== 'semua') {
            $bulanMap = [
                'januari' => 1, 'februari' => 2, 'maret' => 3, 'april' => 4,
                'mei' => 5, 'juni' => 6, 'juli' => 7, 'agustus' => 8,
                'september' => 9, 'oktober' => 10, 'november' => 11, 'desember' => 12
            ];
            $bulanNumber = $bulanMap[strtolower($request->bulan)] ?? null;
            if ($bulanNumber) {
                $totalQuery->whereMonth('tanggal', $bulanNumber);
            }
        }

        if ($request->has('kategori') && $request->kategori && $request->kategori !== 'semua') {
            $totalQuery->where('kategori', $request->kategori);
        }

        $totalPengeluaran = $totalQuery->sum('total_pengeluaran');

        return Inertia::render('Laporan/Pengeluaran/Index', [
            'pengeluaran' => $pengeluaran,
            'totalPengeluaran' => $totalPengeluaran
        ]);
    }

    public function create()
    {
        return inertia('Laporan/Pengeluaran/Create');
    }

    public function store(Request $request)
    {
        // Validasi
        $validated = $request->validate([
            'tanggal' => 'required|date',
            'kategori' => 'required|string|max:100',
            'deskripsi' => 'required|string|max:255',
            'jumlah_barang' => 'nullable|numeric|min:0',
            'satuan' => 'nullable|string|max:50',
            'harga_satuan' => 'nullable|numeric|min:0',
            'total_pengeluaran' => 'nullable|numeric|min:0',
        ]);

        // Hitung total pengeluaran
        // Jika pakai satuan (jumlah & harga ada), hitung otomatis
        // Jika tidak pakai satuan, gunakan total_pengeluaran yang diinput
        if ($request->filled('jumlah_barang') && $request->filled('harga_satuan')) {
            $validated['total_pengeluaran'] = $request->jumlah_barang * $request->harga_satuan;
        } elseif (!$request->filled('total_pengeluaran')) {
            // Jika tidak ada keduanya, error
            return back()->withErrors(['total_pengeluaran' => 'Total pengeluaran harus diisi'])->withInput();
        }

        // Simpan data
        Pengeluaran::create($validated);

        return redirect()->route('laporan.pengeluaran.index')
                        ->with('message', 'Data pengeluaran berhasil ditambahkan');
    }

    public function edit(Pengeluaran $pengeluaran)
    {
        return Inertia('Laporan/Pengeluaran/Edit', ['pengeluaranData' => $pengeluaran]);
    }

    public function update(Request $request, Pengeluaran $pengeluaran)
    {
        // Validasi
        $validated = $request->validate([
            'tanggal' => 'required|date',
            'kategori' => 'required|string|max:100',
            'deskripsi' => 'required|string|max:255',
            'jumlah_barang' => 'nullable|numeric|min:0',
            'satuan' => 'nullable|string|max:50',
            'harga_satuan' => 'nullable|numeric|min:0',
            'total_pengeluaran' => 'nullable|numeric|min:0',
        ]);

        // Hitung total pengeluaran
        if ($request->filled('jumlah_barang') && $request->filled('harga_satuan')) {
            $validated['total_pengeluaran'] = $request->jumlah_barang * $request->harga_satuan;
        } elseif (!$request->filled('total_pengeluaran')) {
            return back()->withErrors(['total_pengeluaran' => 'Total pengeluaran harus diisi'])->withInput();
        }

        // Update data
        $pengeluaran->update($validated);

        return redirect()->route('laporan.pengeluaran.index')
                        ->with('message', 'Data pengeluaran berhasil diupdate');
    }

    public function destroy(Pengeluaran $pengeluaran)
    {
        $pengeluaran->delete();
        return redirect()->route('laporan.pengeluaran.index')
                        ->with('message', 'Data pengeluaran berhasil dihapus');
    }

    public function export(Request $request)
    {
        $query = Pengeluaran::query();

        if ($request->has('bulan') && $request->bulan && $request->bulan !== 'semua') {
            $bulanMap = [
                'januari' => 1, 'februari' => 2, 'maret' => 3, 'april' => 4,
                'mei' => 5, 'juni' => 6, 'juli' => 7, 'agustus' => 8,
                'september' => 9, 'oktober' => 10, 'november' => 11, 'desember' => 12
            ];
            $bulanNumber = $bulanMap[strtolower($request->bulan)] ?? null;
            if ($bulanNumber) {
                $query->whereMonth('tanggal', $bulanNumber);
            }
        }

        if ($request->has('kategori') && $request->kategori && $request->kategori !== 'semua') {
            $query->where('kategori', $request->kategori);
        }

        $data = $query->orderBy('tanggal', 'desc')->get();

        return response()->json([
            'data' => $data,
            'total' => $data->sum('total_pengeluaran')
        ]);
    }
}