<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('pengeluaran', function (Blueprint $table) {
            // Tambah kolom satuan (nullable)
            $table->string('satuan', 50)->nullable()->after('jumlah_barang');
            
            // Update kolom existing jadi nullable
            $table->integer('jumlah_barang')->nullable()->change();
            $table->decimal('harga_satuan', 15, 2)->nullable()->change();
        });
    }

    public function down(): void
    {
        Schema::table('pengeluaran', function (Blueprint $table) {
            $table->dropColumn('satuan');
        });
    }
};