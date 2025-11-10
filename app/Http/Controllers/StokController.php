<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Stok;

class StokController extends Controller
{
    public function index()
    {
        $stoks = Stok::all();
        return Inertia::render('Stok/Index', [
            'stoks' => $stoks
        ]);
    }

    public function create()
    {
        return Inertia::render('Stok/Create');
    }

    public function store(Request $request)
    {
        Stok::create($request->all());
        return redirect()->route('stok.index');
    }

    public function edit($id)
    {
        $stok = Stok::findOrFail($id);
        return Inertia::render('Stok/Edit', ['stok' => $stok]);
    }

    public function update(Request $request, $id)
    {
        $stok = Stok::findOrFail($id);
        $stok->update($request->all());
        return redirect()->route('stok.index');
    }

    public function destroy($id)
    {
        $stok = Stok::findOrFail($id);
        $stok->delete();
        return redirect()->route('stok.index');
    }
}
