<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class LaporanPemasukanController extends Controller
{
    public function index(Request $request)
    {
        $query = DB::table('transactions')
            ->select(
                DB::raw('DATE(created_at) as tanggal'),
                DB::raw('COUNT(*) as jumlah_transaksi'),
                DB::raw('SUM(CASE WHEN metode_pembayaran = "cash" THEN total ELSE 0 END) as tunai'),
                DB::raw('SUM(CASE WHEN metode_pembayaran = "qris" THEN total ELSE 0 END) as non_tunai'),
                DB::raw('SUM(total) as total_penjualan')
            )
            ->where('status', 'completed'); // Hanya transaksi selesai

        // Filter bulan
        if ($request->has('bulan') && $request->bulan && $request->bulan !== 'semua') {
            $bulanMap = [
                'januari' => 1, 'februari' => 2, 'maret' => 3, 'april' => 4,
                'mei' => 5, 'juni' => 6, 'juli' => 7, 'agustus' => 8,
                'september' => 9, 'oktober' => 10, 'november' => 11, 'desember' => 12
            ];
            
            $bulanNumber = $bulanMap[strtolower($request->bulan)] ?? null;
            if ($bulanNumber) {
                $query->whereMonth('created_at', $bulanNumber);
            }
        }

        // Filter metode pembayaran
        if ($request->has('metode') && $request->metode && $request->metode !== 'semua') {
            $query->where('metode_pembayaran', $request->metode);
        }

        $pemasukan = $query
            ->groupBy(DB::raw('DATE(created_at)'))
            ->orderBy('tanggal', 'desc')
            ->paginate(10);

        // Hitung total untuk summary cards
        $summaryQuery = DB::table('transactions')
            ->where('status', 'completed');

        if ($request->has('bulan') && $request->bulan && $request->bulan !== 'semua') {
            $bulanMap = [
                'januari' => 1, 'februari' => 2, 'maret' => 3, 'april' => 4,
                'mei' => 5, 'juni' => 6, 'juli' => 7, 'agustus' => 8,
                'september' => 9, 'oktober' => 10, 'november' => 11, 'desember' => 12
            ];
            $bulanNumber = $bulanMap[strtolower($request->bulan)] ?? null;
            if ($bulanNumber) {
                $summaryQuery->whereMonth('created_at', $bulanNumber);
            }
        }

        if ($request->has('metode') && $request->metode && $request->metode !== 'semua') {
            $summaryQuery->where('metode_pembayaran', $request->metode);
        }

        $summary = $summaryQuery->selectRaw('
            SUM(total) as total_penjualan,
            SUM(CASE WHEN metode_pembayaran = "cash" THEN total ELSE 0 END) as total_tunai,
            SUM(CASE WHEN metode_pembayaran = "qris" THEN total ELSE 0 END) as total_non_tunai
        ')->first();

        return Inertia::render('Laporan/Pemasukan/Index', [
            'pemasukan' => $pemasukan->toArray(),
            'totalPenjualan' => $summary->total_penjualan ?? 0,
            'totalTunai' => $summary->total_tunai ?? 0,
            'totalNonTunai' => $summary->total_non_tunai ?? 0,
        ]);
    }
}