export interface MenuItem {
    id_menu: number;
    nama_menu: string;
    kategori: string;
    harga: number;
    image: string | null;
    is_active: boolean;
    created_at?: string;
    updated_at?: string;
}

export interface MenuFormData {
    nama_menu: string;
    kategori: string;
    harga: number;
    image?: File | null;
    is_active: boolean;
}

export interface MenuCategory {
    kategori: string;
    count: number;
}
