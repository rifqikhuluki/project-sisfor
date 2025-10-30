<?php

namespace App\Http\Controllers;

use App\Models\Menu;
use Illuminate\Support\Facades\Storage;
use Illuminate\Http\Request;
use Inertia\Inertia;

class MenuController extends Controller
{
    //menampilkan daftar menu
    public function index(Request $request) {
        $query = Menu::latest();

        if($request->has('search') && $request->search != null ){
            $query->whereAny(['nama_menu'], 'like', '%' . $request->search .  '%');
        }
        $menu = $query->paginate(5)->toArray();

        return Inertia::render('Menu/Index', ['menu' => $menu]);
    }

    //menampilkan form untuk menambah menu
    public function create(){
        return inertia('Menu/Create');
    }

    //menyimpan menu baru
    public function store(Request $request){

         $request->validate([
            'nama_menu' => 'required|string',
            'kategori' => 'required|string',
            'harga' => 'required|numeric',
            'is_active' => 'required|boolean',
            'image' => 'nullable|image'
        ]);
        
        //simpan gambar jika ada
        $file = $request->file('image');
        $filePath = $file->store('Menu', 'public');


        Menu::create([
            'nama_menu' => $request->nama_menu,
            'kategori' => $request->kategori,
            'harga' => $request->harga,
            'is_active' => $request->is_active,
            'image' => $filePath
        ]);

        return redirect()->route('menu.index')->with('message','Menu berhasil ditambahkan');
    }

    //menampilkan form edit menu
    public function edit(Menu $menu){
        return Inertia('Menu/Edit', ['menuData' => $menu]);
    }

    public function update(Request $request, Menu $menu){
        $request->validate([
            'nama_menu' => 'required|string',
            'kategori' => 'required|string',
            'harga' => 'required|numeric',
            'is_active' => 'required|boolean',
            'image' => 'nullable|image'
        ]);

        $filePath = $menu->image;

        if($request->hasFile('image') && $request->image != null){
            $file = $request->file('image');
            $filePath = $file->store('Menu', 'public');
            Storage::disk('public')->delete($menu->image);
        }

        $menu->update([
            'nama_menu' => $request->nama_menu,
            'kategori' => $request->kategori,
            'harga' => $request->harga,
            'is_active' => $request->is_active,
            'image' => $filePath
        ]);

        return redirect()->route('menu.index')->with('message', 'Menu berhasil diupdate');
    }

    public function destroy(Menu $menu){
        //hapus gambar
        if($menu->image){
            Storage::disk('public')->delete($menu->image);
        }
        $menu->delete();
    }

    //menampilkan detail menu
    public function show(Menu $menu){
        return Inertia::render('Menu/Show', ['menu' => $menu]);
    }
}
