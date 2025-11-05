export interface Transaction {
    id: number;
    nomor_invoice: string;
    nama_pelanggan: string | null;
    whatsapp_pelanggan: string;
    metode_pembayaran: string;
    total: number;
    status: TransactionStatus;
    is_open_bill: boolean;
    paid_amount: number;
    remaining_amount: number;
    paid_at: string | null;
    notes: string | null;
    created_at: string;
    updated_at: string;
    items: TransactionItem[];
}

export interface TransactionItem {
    id: number;
    transaction_id: number;
    id_menu: number;
    quantity: number;
    harga: number;
    subtotal: number;
    created_at?: string;
    updated_at?: string;
    menu: MenuItem;
}

export interface TransactionFormData {
    nama_pelanggan?: string;
    whatsapp_pelanggan: string;
    metode_pembayaran: string;
    is_open_bill: boolean;
    paid_amount: number;
    notes?: string;
    items: TransactionItemInput[];
    total: number;
}

export interface TransactionItemInput {
    id_menu: number;
    quantity: number;
    harga: number;
}

export type TransactionStatus = 'pending' | 'completed' | 'cancelled';

export interface PaymentData {
    payment_amount: number;
    metode_pembayaran: string;
    notes?: string;
}
