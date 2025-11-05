<?php

namespace App\Http\Controllers;

use App\Models\Transaction;
use Illuminate\Http\Request;
use Inertia\Inertia;

class InvoiceController extends Controller
{
    public function show($nomorInvoice)
    {
        try {
            $transaction = Transaction::with(['items.menu'])
                ->where('nomor_invoice', $nomorInvoice)
                ->firstOrFail();

            return Inertia::render('Invoice/Show', [
                'transaction' => [
                    'id' => $transaction->id,
                    'nomor_invoice' => $transaction->nomor_invoice,
                    'nama_pelanggan' => $transaction->nama_pelanggan,
                    'whatsapp_pelanggan' => $transaction->whatsapp_pelanggan,
                    'metode_pembayaran' => strtoupper($transaction->metode_pembayaran),
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
                            'nama_menu' => $item->menu->nama_menu,
                            'quantity' => $item->quantity,
                            'harga' => (float) $item->harga,
                            'subtotal' => (float) $item->subtotal,
                        ];
                    }),
                ],
            ]);
        } catch (\Exception $e) {
            abort(404, 'Invoice tidak ditemukan');
        }
    }
}
