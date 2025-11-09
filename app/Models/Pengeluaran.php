<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Pengeluaran extends Model
{
    use HasFactory;

    protected $table = 'pengeluaran';

    protected $primaryKey = 'id_pengeluaran';

    protected $fillable = [
        'tanggal',
        'kategori',
        'deskripsi',
        'jumlah_barang', // nullable
        'satuan',        // nullable
        'harga_satuan', // nullable
        'total_pengeluaran',
    ];

    protected $casts = [
        'tanggal' => 'date',
        'jumlah_barang' => 'integer',
        'harga_satuan' => 'decimal:2',
        'total_pengeluaran' => 'decimal:2',
    ];

    public function scopeByKategori($query, $kategori)
    {
        return $query->where('kategori', $kategori);
    }

    public function scopeByBulan($query, $bulan)
    {
        return $query->whereMonth('tanggal', $bulan);
    }

    public function scopeByTahun($query, $tahun)
    {
        return $query->whereYear('tanggal', $tahun);
    }
}