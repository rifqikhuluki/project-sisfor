export interface CartItem {
    id_menu: number;
    nama_menu: string;
    kategori: string;
    harga: number;
    quantity: number;
}

export interface CartSummary {
    items: CartItem[];
    itemCount: number;
    total: number;
}
