<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Stok extends Model
{
    use HasFactory;

    protected $fillable = [
        'nama_bahan',
        'satuan',
        'sisa_awal',
        'sisa_sekarang',
        'jumlah_keluar',
        'tanggal_masuk',
        'keterangan',
    ];
}
