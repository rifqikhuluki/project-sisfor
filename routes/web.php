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
use App\Http\Controllers\StokController;

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

    // Halaman Kasir
    Route::get('/kasir', [KasirController::class, 'index'])->name('kasir.index');

    // Kelola Stok Barang
    Route::prefix('stok')->name('stok.')->group(function () {
    Route::get('/', [StokController::class, 'index'])->name('index');
    Route::get('/create', [StokController::class, 'create'])->name('create');
    Route::post('/', [StokController::class, 'store'])->name('store');
    Route::get('/{stok}/edit', [StokController::class, 'edit'])->name('edit');
    Route::put('/{stok}', [StokController::class, 'update'])->name('update');
    Route::delete('/{stok}', [StokController::class, 'destroy'])->name('destroy');
    });


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
