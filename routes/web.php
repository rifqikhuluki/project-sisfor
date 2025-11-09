<?php

use App\Http\Controllers\InvoiceController;
use App\Http\Controllers\KasirController;
use App\Http\Controllers\LoginController;
use App\Http\Controllers\MenuController;
use App\Http\Controllers\PermissionController;
use App\Http\Controllers\RoleController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\LaporanPengeluaranController;
use App\Http\Controllers\LaporanPemasukanController;
use App\Http\Controllers\LaporanKaryawanController;
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

    // ========================================
    // LAPORAN ROUTES
    // ========================================
    Route::prefix('laporan')->name('laporan.')->group(function () {
        
        // Laporan Pengeluaran
        Route::prefix('pengeluaran')->name('pengeluaran.')->group(function () {
            Route::get('/', [LaporanPengeluaranController::class, 'index'])->name('index');
            Route::get('/create', [LaporanPengeluaranController::class, 'create'])->name('create');
            Route::post('/', [LaporanPengeluaranController::class, 'store'])->name('store');
            Route::get('/{pengeluaran}/edit', [LaporanPengeluaranController::class, 'edit'])->name('edit');
            Route::put('/{pengeluaran}', [LaporanPengeluaranController::class, 'update'])->name('update');
            Route::delete('/{pengeluaran}', [LaporanPengeluaranController::class, 'destroy'])->name('destroy');
            Route::get('/export', [LaporanPengeluaranController::class, 'export'])->name('export');
        });

        // Laporan Pemasukan
        Route::prefix('pemasukan')->name('pemasukan.')->group(function () {
            Route::get('/', [LaporanPemasukanController::class, 'index'])->name('index');
            Route::get('/create', [LaporanPemasukanController::class, 'create'])->name('create');
            Route::post('/', [LaporanPemasukanController::class, 'store'])->name('store');
            Route::get('/{pemasukan}/edit', [LaporanPemasukanController::class, 'edit'])->name('edit');
            Route::put('/{pemasukan}', [LaporanPemasukanController::class, 'update'])->name('update');
            Route::delete('/{pemasukan}', [LaporanPemasukanController::class, 'destroy'])->name('destroy');
            Route::get('/export', [LaporanPemasukanController::class, 'export'])->name('export');
        });

        // Laporan Karyawan
        Route::prefix('karyawan')->name('karyawan.')->group(function () {
            Route::get('/', [LaporanKaryawanController::class, 'index'])->name('index');
            Route::get('/create', [LaporanKaryawanController::class, 'create'])->name('create');
            Route::post('/', [LaporanKaryawanController::class, 'store'])->name('store');
            Route::get('/{karyawan}/edit', [LaporanKaryawanController::class, 'edit'])->name('edit');
            Route::put('/{karyawan}', [LaporanKaryawanController::class, 'update'])->name('update');
            Route::delete('/{karyawan}', [LaporanKaryawanController::class, 'destroy'])->name('destroy');
            Route::get('/export', [LaporanKaryawanController::class, 'export'])->name('export');
        });
    });
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
