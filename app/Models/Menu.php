<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Menu extends Model
{
    use HasFactory;

    protected $table = 'menus';

    protected $primaryKey = 'id_menu';

    protected $fillable = [
        'nama_menu',
        'kategori',
        'harga',
        'is_active',
        'image'
    ];

    protected $casts = [
        'harga' => 'decimal:2',
        'is_active' => 'boolean',
    ];

    public function scopeActive($query){
        return $query->where('is_active', true);
    }

    public function scopeByKategori($query, $kategori){
        return $query->where('kategori', $kategori);
    }
}
