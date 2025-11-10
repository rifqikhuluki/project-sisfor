<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('stoks', function (Blueprint $table) {
            $table->id();
            $table->string('nama_bahan');
            $table->string('satuan');
            $table->integer('sisa_awal')->default(0);
            $table->integer('sisa_sekarang')->default(0);
            $table->integer('jumlah_keluar')->default(0);
            $table->date('tanggal_masuk')->nullable();
            $table->text('keterangan')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('stoks');
    }
};
