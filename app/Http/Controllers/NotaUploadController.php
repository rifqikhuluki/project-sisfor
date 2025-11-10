<?php

namespace App\Http\Controllers;

use App\Models\NotaUpload;
use Illuminate\Http\Request;
use Inertia\Inertia;

class NotaUploadController extends Controller
{
    public function index()
    {
        $riwayat = NotaUpload::latest()->get();
        return Inertia::render('Gemini/UploadNota', [
            'riwayat' => $riwayat
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'description' => 'required|string|max:255',
            'category' => 'required|string|max:255',
            'amount' => 'required|string|max:255',
            'date' => 'required|date',
        ]);

        NotaUpload::create($validated);

        return back()->with('success', 'Data nota berhasil disimpan!');
    }
}
