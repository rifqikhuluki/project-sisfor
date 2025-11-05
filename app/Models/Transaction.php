<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Transaction extends Model
{
    use HasFactory;

    protected $fillable = [
        'nomor_invoice',
        'nama_pelanggan',
        'whatsapp_pelanggan',
        'metode_pembayaran',
        'subtotal',           
        'discount_percentage',
        'discount_amount',
        'total',
        'status',
        'is_open_bill',
        'paid_amount',
        'paid_at',
        'remaining_amount',
        'notes'
    ];

    protected $casts = [
        'subtotal' => 'decimal:2',          
        'discount_percentage' => 'decimal:2',
        'discount_amount' => 'decimal:2',    
        'total' => 'decimal:2',
        'paid_amount' => 'decimal:2',
        'remaining_amount' => 'decimal:2',
        'is_open_bill' => 'boolean',
        'paid_at' => 'datetime'
    ];

    public function items(): HasMany{
        return $this->hasMany(TransactionItem::class);
    }

    public function genereteInvoiceNumber(): string{
        $date = now()->format('Ymd');
        $latest = self::whereDate('created_at', today())
            ->latest('id')
            ->first();

        $number = $latest ? (int)substr($latest->nomor_invoice, -4) + 1 : 1;

        return 'INV-' . $date . '-' . str_pad($number, 4, '0', STR_PAD_LEFT);
    }

    public function isFullyPaid(): bool{
        return $this->paid_amount >= $this->total;
    }

    public function getRemainingBalance(): float{
        return max(0, $this->total - $this->paid_amount);
    }

    public function hasDiscount(): bool
    {
        return $this->discount_percentage > 0 || $this->discount_amount > 0;
    }

    public function calculateDiscount(): float
    {
        if ($this->discount_percentage > 0) {
            return ($this->subtotal * $this->discount_percentage) / 100;
        }
        return $this->discount_amount ?? 0;
    }

    public function getDiscountText(): string
    {
        if ($this->discount_percentage > 0) {
            return "{$this->discount_percentage}%";
        }
        if ($this->discount_amount > 0) {
            return "Rp " . number_format($this->discount_amount, 0, ',', '.');
        }
        return "0";
    }

    public function scopeOpenBills($query){
        return $query->where('is_open_bill', true)
                    ->where('status', 'pending');
    }

    public function scopeUnpaid($query){
        return $query->whereRaw('paid_amount < total');
    }

    public function scopeWithDiscount($query)
    {
        return $query->where(function($q) {
            $q->where('discount_percentage', '>', 0)
              ->orWhere('discount_amount', '>', 0);
        });
    }
}
