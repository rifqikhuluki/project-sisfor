<?php

namespace App\Http\Controllers;

use App\Models\NotaUpload;
use Illuminate\Http\Request;
use Inertia\Inertia;

class NotaUploadController extends Controller
{
    // Render halaman Inertia
    public function indexPage()
    {
        return Inertia::render('Gemini/UploadNota');
    }

    // API: ambil semua riwayat upload (JSON)
    public function index()
    {
        $riwayat = NotaUpload::latest()->get()->map(function($nota){
            // pastikan amount selalu number
            $nota->amount = is_numeric($nota->amount) ? (float)$nota->amount : floatval(preg_replace('/[^0-9.-]+/', '', $nota->amount));
            return $nota;
        });

        return response()->json([
            'success' => true,
            'riwayat' => $riwayat
        ]);
    }

    // Simpan nota baru
    public function store(Request $request)
    {
        $validated = $request->validate([
            'description' => 'required|string|max:255',
            'category' => 'required|string|max:100',
            'date' => 'required|date',
            'amount' => 'required|numeric',
        ]);

        $nota = NotaUpload::create($validated);

        return response()->json([
            'success' => true,
            'nota' => $nota
        ]);
    }

    // Hapus nota
    public function destroy($id)
    {
        $nota = NotaUpload::find($id);

        if (!$nota) {
            return response()->json([
                'success' => false,
                'message' => 'Nota tidak ditemukan'
            ], 404);
        }

        $nota->delete();

        return response()->json([
            'success' => true,
            'id' => $id
        ]);
    }
}
