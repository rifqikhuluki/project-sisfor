import axios from 'axios';

export interface CartItem {
    id: number;
    quantity: number;
    harga: number;
}

export interface TransactionPayload {
    items: CartItem[];
    nama_pelanggan?: string;
    whatsapp_pelanggan?: string;
    metode_pembayaran: 'cash' | 'qris';
    payment_type: 'now' | 'later';
}

export interface Transaction {
    id: number;
    nomor_invoice: string;
    nama_pelanggan: string;
    whatsapp_pelanggan?: string;
    metode_pembayaran: string;
    subtotal: number;
    discount_percentage: number;
    discount_amount: number;
    total: number;
    paid_amount: number;
    remaining_amount: number;
    status: string;
    is_open_bill: boolean;
    paid_at?: string;
    created_at: string;
    items: Array<{
        id: number;
        nama_menu: string;
        quantity: number;
        harga: number;
        subtotal: number;
    }>;
}

export interface ApiResponse<T> {
    success: boolean;
    message?: string;
    data?: T;
    error?: string;
}

class KasirAPI {
    private baseURL = '/kasir';

    /**
     * Buat transaksi baru (Bayar Sekarang / Bayar Nanti)
     */
    async createTransaction(
        payload: TransactionPayload,
    ): Promise<
        ApiResponse<{ transaction: Transaction; is_open_bill: boolean }>
    > {
        try {
            const response = await axios.post(
                `${this.baseURL}/transaksi`,
                payload,
            );
            return response.data;
        } catch (error: any) {
            throw new Error(
                error.response?.data?.message || 'Gagal membuat transaksi',
            );
        }
    }

    /**
     * Ambil detail transaksi
     */
    async getTransaction(id: number): Promise<ApiResponse<Transaction>> {
        try {
            const response = await axios.get(`${this.baseURL}/transaksi/${id}`);
            return response.data;
        } catch (error: any) {
            throw new Error(
                error.response?.data?.message || 'Transaksi tidak ditemukan',
            );
        }
    }

    /**
     * Ambil semua open bills
     */
    async getOpenBills(): Promise<ApiResponse<Transaction[]>> {
        try {
            const response = await axios.get(`${this.baseURL}/open-bills`);
            return response.data;
        } catch (error: any) {
            throw new Error(
                error.response?.data?.message ||
                    'Gagal mengambil data open bills',
            );
        }
    }

    /**
     * Bayar open bill (cicilan atau lunas)
     */
    async payOpenBill(
        id: number,
        paidAmount: number,
        paymentMethod: 'cash' | 'qris',
    ): Promise<ApiResponse<Transaction>> {
        try {
            const response = await axios.post(
                `${this.baseURL}/open-bill/${id}/pay`,
                {
                    paid_amount: paidAmount,
                    metode_pembayaran: paymentMethod,
                },
            );
            return response.data;
        } catch (error: any) {
            throw new Error(
                error.response?.data?.message || 'Gagal memproses pembayaran',
            );
        }
    }

    /**
     * Kirim invoice via WhatsApp
     */
    async sendWhatsApp(
        id: number,
    ): Promise<ApiResponse<{ whatsapp_url: string; phone: string }>> {
        try {
            const response = await axios.get(
                `${this.baseURL}/transaksi/${id}/whatsapp`,
            );
            return response.data;
        } catch (error: any) {
            throw new Error(
                error.response?.data?.message || 'Gagal mengirim WhatsApp',
            );
        }
    }
}

export const kasirAPI = new KasirAPI();
