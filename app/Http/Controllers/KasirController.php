<?php

namespace App\Http\Controllers;

use App\Models\Menu;
use App\Models\Transaction;
use App\Models\TransactionItem;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class KasirController extends Controller
{
    public function index(){

         $menus = Menu::active()
            ->get()
            ->map(function ($menu) {
                return [
                    'id' => $menu->id_menu,
                    'nama' => $menu->nama_menu,
                    'harga' => (float) $menu->harga,
                    'image' => $menu->image ? asset('storage/' . $menu->image) : null,
                    'kategori' => $menu->kategori,
                ];
            });

        return Inertia::render('Kasir/Index', [
            'menus' => $menus,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'items' => 'required|array|min:1',
            'items.*.id' => 'required|exists:menus,id_menu',
            'items.*.quantity' => 'required|integer|min:1',
            'items.*.harga' => 'required|numeric|min:0',
            'nama_pelanggan' => 'nullable|string|max:255',
            'whatsapp_pelanggan' => 'nullable|string|max:20',
            'metode_pembayaran' => 'required|in:cash,qris',
            'payment_type' => 'required|in:now,later',
            'discount_percentage' => 'nullable|numeric|min:0|max:100',
        ]);

        try {
            DB::beginTransaction();

            // Hitung subtotal
            $subtotal = 0;
            foreach ($validated['items'] as $item) {
                $menu = Menu::findOrFail($item['id']);
                $itemSubtotal = $menu->harga * $item['quantity'];
                $subtotal += $itemSubtotal;
            }

            // Hitung diskon
            $discountPercentage = $validated['discount_percentage'] ?? 0;
            $discountAmount = ($subtotal * $discountPercentage) / 100;
            $total = $subtotal - $discountAmount;

            // Generate nomor invoice
            $transaction = new Transaction();
            $nomorInvoice = $transaction->genereteInvoiceNumber();

            // Tentukan status dan paid_amount berdasarkan payment_type
            $isOpenBill = $validated['payment_type'] === 'later';
            $status = $isOpenBill ? 'pending' : 'completed';
            $paidAmount = $isOpenBill ? 0 : $total;
            $paidAt = $isOpenBill ? null : now();
            $remainingAmount = $isOpenBill ? $total : 0;

            // Buat transaksi
            $transaction = Transaction::create([
                'nomor_invoice' => $nomorInvoice,
                'nama_pelanggan' => $validated['nama_pelanggan'] ?? 'Guest',
                'whatsapp_pelanggan' => $validated['whatsapp_pelanggan'],
                'metode_pembayaran' => $validated['metode_pembayaran'],
                'subtotal' => $subtotal,                     
                'discount_percentage' => $discountPercentage,
                'discount_amount' => $discountAmount,        
                'total' => $total,
                'status' => $status,
                'is_open_bill' => $isOpenBill,
                'paid_amount' => $paidAmount,
                'paid_at' => $paidAt,
                'remaining_amount' => $remainingAmount,
            ]);

            // Buat transaction items
            foreach ($validated['items'] as $item) {
                $menu = Menu::findOrFail($item['id']);
                
                TransactionItem::create([
                    'transaction_id' => $transaction->id,
                    'id_menu' => $menu->id_menu,
                    'quantity' => $item['quantity'],
                    'harga' => $menu->harga,
                    'subtotal' => $menu->harga * $item['quantity'],
                ]);
            }

            DB::commit();

            // Load relasi untuk response
            $transaction->load(['items.menu']);

            return response()->json([
                'success' => true,
                'message' => $isOpenBill 
                    ? 'Transaksi berhasil dibuat sebagai Open Bill' 
                    : 'Pembayaran berhasil diproses',
                'data' => [
                    'transaction' => $this->formatTransactionResponse($transaction),
                    'is_open_bill' => $isOpenBill,
                ],
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();
            
            return response()->json([
                'success' => false,
                'message' => 'Terjadi kesalahan saat memproses transaksi',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function getOpenBills()
    {
        $openBills = Transaction::openBills()
            ->with(['items.menu'])
            ->latest()
            ->get()
            ->map(function ($transaction) {
                return $this->formatTransactionResponse($transaction);
            });

        return response()->json([
            'success' => true,
            'data' => $openBills,
        ]);
    }

    public function payOpenBill(Request $request, $id)
    {
        $validated = $request->validate([
            'paid_amount' => 'required|numeric|min:0',
            'metode_pembayaran' => 'required|in:cash,qris',
        ]);

        try {
            $transaction = Transaction::findOrFail($id);

            if (!$transaction->is_open_bill) {
                return response()->json([
                    'success' => false,
                    'message' => 'Transaksi ini bukan Open Bill',
                ], 400);
            }

            if ($transaction->status === 'completed') {
                return response()->json([
                    'success' => false,
                    'message' => 'Transaksi sudah lunas',
                ], 400);
            }

            $newPaidAmount = $transaction->paid_amount + $validated['paid_amount'];
            $remainingAmount = $transaction->total - $newPaidAmount;

            $transaction->update([
                'paid_amount' => $newPaidAmount,
                'remaining_amount' => max(0, $remainingAmount),
                'metode_pembayaran' => $validated['metode_pembayaran'],
                'status' => $remainingAmount <= 0 ? 'completed' : 'pending',
                'paid_at' => $remainingAmount <= 0 ? now() : $transaction->paid_at,
                'is_open_bill' => $remainingAmount > 0,
            ]);

            $transaction->load(['items.menu']);

            return response()->json([
                'success' => true,
                'message' => $remainingAmount <= 0 
                    ? 'Pembayaran lunas' 
                    : 'Pembayaran sebagian berhasil',
                'data' => $this->formatTransactionResponse($transaction),
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Terjadi kesalahan saat memproses pembayaran',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function show($id)
    {
        try {
            $transaction = Transaction::with(['items.menu'])->findOrFail($id);

            return response()->json([
                'success' => true,
                'data' => $this->formatTransactionResponse($transaction),
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Transaksi tidak ditemukan',
            ], 404);
        }
    }

    private function formatTransactionResponse($transaction)
    {
        return [
            'id' => $transaction->id,
            'nomor_invoice' => $transaction->nomor_invoice,
            'nama_pelanggan' => $transaction->nama_pelanggan,
            'whatsapp_pelanggan' => $transaction->whatsapp_pelanggan,
            'metode_pembayaran' => $transaction->metode_pembayaran,
            'subtotal' => (float) $transaction->subtotal,                     
            'discount_percentage' => (float) $transaction->discount_percentage,
            'discount_amount' => (float) $transaction->discount_amount,        
            'total' => (float) $transaction->total,
            'paid_amount' => (float) $transaction->paid_amount,
            'remaining_amount' => (float) $transaction->remaining_amount,
            'status' => $transaction->status,
            'is_open_bill' => $transaction->is_open_bill,
            'paid_at' => $transaction->paid_at?->format('d M Y, H:i'),
            'created_at' => $transaction->created_at->format('d M Y, H:i'),
            'items' => $transaction->items->map(function ($item) {
                return [
                    'id' => $item->id,
                    'nama_menu' => $item->menu->nama_menu,
                    'quantity' => $item->quantity,
                    'harga' => (float) $item->harga,
                    'subtotal' => (float) $item->subtotal,
                ];
            }),
        ];
    }

    public function sendWhatsApp($id)
    {
        try {
            $transaction = Transaction::findOrFail($id);

            if (!$transaction->whatsapp_pelanggan) {
                return response()->json([
                    'success' => false,
                    'message' => 'Nomor WhatsApp tidak tersedia',
                ], 400);
            }

            // Format nomor WhatsApp (hilangkan karakter non-digit)
            $phone = preg_replace('/[^0-9]/', '', $transaction->whatsapp_pelanggan);
            
            // Tambahkan kode negara jika belum ada
            if (substr($phone, 0, 2) !== '62') {
                $phone = '62' . ltrim($phone, '0');
            }

            // Generate URL invoice
            $invoiceUrl = route('invoice.show', $transaction->nomor_invoice);

            // Format pesan dengan link invoice
            $message = "*KEDAI KOPI BANGSA*\n\n";
            $message .= "Halo *{$transaction->nama_pelanggan}*! 👋\n\n";
            $message .= "Terima kasih atas pembelian Anda!\n";
            $message .= "Invoice: *{$transaction->nomor_invoice}*\n";
            $message .= "Total: *Rp " . number_format($transaction->total, 0, ',', '.') . "*\n\n";
            
            if ($transaction->is_open_bill) {
                $message .= "Status: _Open Bill_\n";
                $message .= "Sisa tagihan: Rp " . number_format($transaction->remaining_amount, 0, ',', '.') . "\n\n";
            } else {
                $message .= "Status: _Lunas_ ✅\n\n";
            }
            
            $message .= "📄 Lihat invoice lengkap Anda di:\n";
            $message .= $invoiceUrl . "\n\n";
            $message .= "Terima kasih atas kunjungan Anda! 🙏☕";

            // Generate WhatsApp URL
            $whatsappUrl = "https://wa.me/{$phone}?text=" . urlencode($message);

            return response()->json([
                'success' => true,
                'data' => [
                    'whatsapp_url' => $whatsappUrl,
                    'invoice_url' => $invoiceUrl,
                    'phone' => $phone,
                ],
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Terjadi kesalahan',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}

