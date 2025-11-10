<?php

namespace App\Http\Controllers;

use App\Models\Stok;
use Illuminate\Http\Request;
use Inertia\Inertia;

class StokController extends Controller
{
    public function index()
    {
        $stoks = Stok::paginate(10);
        return Inertia::render('Stok/Index', [
            'stoks' => $stoks,
        ]);
    }

    public function create()
    {
        return Inertia::render('Stok/Create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'nama_bahan' => 'required|string|max:255',
            'satuan' => 'required|string|max:100',
            'sisa_awal' => 'required|numeric',
            'sisa_sekarang' => 'required|numeric',
            'jumlah_keluar' => 'required|numeric',
            'tanggal_masuk' => 'nullable|date',
            'keterangan' => 'nullable|string',
        ]);

        Stok::create($validated);
        return redirect()->route('stok.index')->with('message', 'Stok berhasil ditambahkan!');
    }

    public function edit(Stok $stok)
    {
        return Inertia::render('Stok/Edit', [
            'stok' => $stok,
        ]);
    }

    public function update(Request $request, Stok $stok)
    {
        $validated = $request->validate([
            'nama_bahan' => 'required|string|max:255',
            'satuan' => 'required|string|max:100',
            'sisa_awal' => 'required|numeric',
            'sisa_sekarang' => 'required|numeric',
            'jumlah_keluar' => 'required|numeric',
            'tanggal_masuk' => 'nullable|date',
            'keterangan' => 'nullable|string',
        ]);

        $stok->update($validated);
        return redirect()->route('stok.index')->with('message', 'Stok berhasil diperbarui!');
    }

    public function destroy(Stok $stok)
    {
        $stok->delete();
        return redirect()->route('stok.index')->with('message', 'Stok berhasil dihapus!');
    }
}
