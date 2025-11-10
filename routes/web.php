<?php

use App\Http\Controllers\InvoiceController;
use App\Http\Controllers\KasirController;
use App\Http\Controllers\LoginController;
use App\Http\Controllers\MenuController;
use App\Http\Controllers\PermissionController;
use App\Http\Controllers\RoleController;
use App\Http\Controllers\UserController;
use App\Http\Middleware\Loggedin;
use App\Http\Middleware\LoginCheck;

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;
use Spatie\Permission\Contracts\Permission;


// Public invoice
Route::get('/invoice/{nomor_invoice}', [InvoiceController::class, 'show'])->name('invoice.show');

Route::middleware('guest')->group(function () {
    Route::get('/login', [LoginController::class, 'login'])->name('login');
    Route::post('/login/process', [LoginController::class, 'process'])->name('login.process');
});

Route::middleware(['web', 'auth'])->group(function () {
    Route::get('/', fn() => Inertia::render('Dashboard'))->name('dashboard');
    Route::post('/logout', [LoginController::class, 'logout'])->name('logout');
    Route::resource('menu', MenuController::class);
    Route::resource('user', UserController::class);
    Route::resource('roles', RoleController::class);
    Route::resource('permission', PermissionController::class);
    Route::get('/kasir', [KasirController::class, 'index']);
    Route::get('/gemini/upload', function () {
        return Inertia::render('Gemini/UploadNota');
    })->name('gemini.upload');

    // Halaman Kasir
    Route::get('/kasir', [KasirController::class, 'index'])->name('kasir.index');
    
    // Proses transaksi (Bayar Sekarang & Bayar Nanti)
    Route::post('/kasir/transaksi', [KasirController::class, 'store'])->name('kasir.store');
    
    // Lihat detail transaksi
    Route::get('/kasir/transaksi/{id}', [KasirController::class, 'show'])->name('kasir.show');
    
    // List Open Bills
    Route::get('/kasir/open-bills', [KasirController::class, 'getOpenBills'])->name('kasir.open-bills');
    
    // Bayar Open Bill (cicilan/lunas)
    Route::post('/kasir/open-bill/{id}/pay', [KasirController::class, 'payOpenBill'])->name('kasir.pay-open-bill');
    
    // Kirim invoice via WhatsApp
    Route::get('/kasir/transaksi/{id}/whatsapp', [KasirController::class, 'sendWhatsApp'])->name('kasir.whatsapp');
});

use App\Http\Controllers\GeminiController;
Route::post('/extract-receipt', [GeminiController::class, 'extractReceipt'])->name('extract.receipt');
Route::get('/upload-nota', function () {
});

use App\Http\Controllers\NotaUploadController;

Route::get('/gemini/upload', [NotaUploadController::class, 'index'])->name('gemini.upload');
Route::post('/gemini/upload', [NotaUploadController::class, 'store'])->name('gemini.store');



// Route::get('/', function () {
//     return Inertia::render('welcome', [
//         'canRegister' => Features::enabled(Features::registration()),
//     ]);
// })->name('home');

// Route::middleware(['auth', 'verified'])->group(function () {
//     Route::get('dashboard', function () {
//         return Inertia::render('dashboard');
//     })->name('dashboard');
// });

// require __DIR__.'/settings.php';
