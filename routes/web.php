<?php

use App\Http\Controllers\InvoiceController;
use App\Http\Controllers\KasirController;
use App\Http\Controllers\LoginController;
use App\Http\Controllers\MenuController;
use App\Http\Controllers\PermissionController;
use App\Http\Controllers\RoleController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\GeminiController;
use App\Http\Controllers\NotaUploadController;

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// Public invoice
Route::get('/invoice/{nomor_invoice}', [InvoiceController::class, 'show'])->name('invoice.show');

// Guest routes
Route::middleware('guest')->group(function () {
    Route::get('/login', [LoginController::class, 'login'])->name('login');
    Route::post('/login/process', [LoginController::class, 'process'])->name('login.process');
});

// Authenticated routes
Route::middleware(['web', 'auth'])->group(function () {
    Route::get('/', fn() => Inertia::render('Dashboard'))->name('dashboard');
    Route::post('/logout', [LoginController::class, 'logout'])->name('logout');

    Route::resource('menu', MenuController::class);
    Route::resource('user', UserController::class);
    Route::resource('roles', RoleController::class);
    Route::resource('permission', PermissionController::class);

    Route::get('/kasir', [KasirController::class, 'index'])->name('kasir.index');
    Route::post('/kasir/transaksi', [KasirController::class, 'store'])->name('kasir.store');
    Route::get('/kasir/transaksi/{id}', [KasirController::class, 'show'])->name('kasir.show');
    Route::get('/kasir/open-bills', [KasirController::class, 'getOpenBills'])->name('kasir.open-bills');
    Route::post('/kasir/open-bill/{id}/pay', [KasirController::class, 'payOpenBill'])->name('kasir.pay-open-bill');
    Route::get('/kasir/transaksi/{id}/whatsapp', [KasirController::class, 'sendWhatsApp'])->name('kasir.whatsapp');

    // Gemini Upload Nota
    Route::get('/gemini/upload', [NotaUploadController::class, 'indexPage'])->name('gemini.upload'); // render Inertia page
    Route::get('/gemini/api/riwayat', [NotaUploadController::class, 'index'])->name('gemini.api.riwayat'); // API fetch riwayat JSON
    Route::post('/gemini/upload', [NotaUploadController::class, 'store'])->name('gemini.store');
    Route::delete('/gemini/upload/{id}', [NotaUploadController::class, 'destroy'])->name('gemini.destroy');
});

// API endpoint untuk kirim gambar ke GeminiController
Route::post('/extract-receipt', [GeminiController::class, 'extractReceipt'])->name('extract.receipt');
