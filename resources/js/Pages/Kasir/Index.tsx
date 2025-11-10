import { useState } from 'react';
import Layout from '@/components/ui/layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Minus, Plus, Search } from 'lucide-react';
import { toast } from 'sonner';
import axios from 'axios';
import DialogInvoice from '@/components/dialog-invoice';
import { BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
  { title: 'Kelola Transaksi', href: '#' },
  { title: 'Kasir', href: '/kasir' },
];

interface Menu {
  id: number;
  nama: string;
  harga: number;
  image?: string;
  kategori: string;
}

interface CartItem extends Menu {
  quantity: number;
}

interface Transaction {
  id: number;
  nomor_invoice: string;
  nama_pelanggan: string;
  whatsapp_pelanggan?: string;
  metode_pembayaran: string;
  subtotal: number;
  discount_percentage: number;
  discount_amount: number;
  total: number;
  status: string;
  is_open_bill: boolean;
  created_at: string;
  items: Array<{
    nama_menu: string;
    quantity: number;
    harga: number;
    subtotal: number;
  }>;
}

interface Props {
  menus: Menu[];
}

const Kasir = ({ menus }: Props) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [discount, setDiscount] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [showInvoice, setShowInvoice] = useState(false);
  const [currentTransaction, setCurrentTransaction] =
    useState<Transaction | null>(null);

  // ==== Fitur Cart ====
  const filteredMenus = menus.filter((menu) =>
    menu.nama.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const addToCart = (menu: Menu) => {
    const existingItem = cart.find((item) => item.id === menu.id);
    if (existingItem) {
      setCart(
        cart.map((item) =>
          item.id === menu.id
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        ),
      );
    } else {
      setCart([...cart, { ...menu, quantity: 1 }]);
    }
    toast.success(`${menu.nama} ditambahkan ke keranjang`);
  };

  const increaseQuantity = (id: number) => {
    setCart(
      cart.map((item) =>
        item.id === id ? { ...item, quantity: item.quantity + 1 } : item,
      ),
    );
  };

  const decreaseQuantity = (id: number) => {
    const item = cart.find((i) => i.id === id);
    if (item && item.quantity > 1) {
      setCart(
        cart.map((i) =>
          i.id === id ? { ...i, quantity: i.quantity - 1 } : i,
        ),
      );
    } else {
      removeFromCart(id);
    }
  };

  const removeFromCart = (id: number) => {
    setCart(cart.filter((item) => item.id !== id));
    toast.info('Item dihapus dari keranjang');
  };

  const calculateSubtotal = () =>
    cart.reduce((sum, item) => sum + item.harga * item.quantity, 0);
  const calculateDiscount = () =>
    (calculateSubtotal() * discount) / 100;
  const calculateTotal = () => calculateSubtotal() - calculateDiscount();

  // ==== Proses Pembayaran ====
  const processPayment = async (paymentType: 'now' | 'later') => {
    if (cart.length === 0) return toast.error('Keranjang kosong!');
    if (!paymentMethod) return toast.error('Pilih metode pembayaran!');

    setLoading(true);
    try {
      const response = await axios.post('/kasir/transaksi', {
        items: cart.map((item) => ({
          id: item.id,
          quantity: item.quantity,
          harga: item.harga,
        })),
        nama_pelanggan: customerName || 'Guest',
        whatsapp_pelanggan: whatsapp,
        metode_pembayaran: paymentMethod,
        payment_type: paymentType,
        discount_percentage: discount,
      });

      if (response.data.success) {
        const transaction = response.data.data.transaction;
        setCurrentTransaction(transaction);
        setShowInvoice(true);

        toast.success(
          paymentType === 'later'
            ? 'Open Bill berhasil dibuat!'
            : 'Pembayaran berhasil!',
        );

        setCart([]);
        setCustomerName('');
        setWhatsapp('');
        setPaymentMethod('');
        setDiscount(0);
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Terjadi kesalahan!');
    } finally {
      setLoading(false);
    }
  };

  const sendWhatsApp = async () => {
    if (!currentTransaction) return;
    try {
      const response = await axios.get(
        `/kasir/transaksi/${currentTransaction.id}/whatsapp`,
      );
      if (response.data.success) {
        window.open(response.data.data.whatsapp_url, '_blank');
      }
    } catch {
      toast.error('Gagal mengirim WhatsApp');
    }
  };

  return (
    <Layout breadcrumbs={breadcrumbs}>
      <div className="flex h-screen bg-gray-50">
        {/* Produk */}
        <div className="flex flex-1 flex-col gap-4 overflow-hidden p-6">
          <div className="relative">
            <Search className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 transform text-gray-400" />
            <Input
              type="text"
              placeholder="Cari menu..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="border-gray-300 bg-white pl-10"
            />
          </div>

          <div className="grid grid-cols-3 gap-4 overflow-y-auto pb-4">
            {filteredMenus.map((menu) => (
              <Card
                key={menu.id}
                className="border-gray-200 bg-white transition-shadow hover:shadow-md"
              >
                <CardContent className="p-4">
                  <div className="mb-3 flex aspect-video items-center justify-center rounded bg-gray-100">
                    {menu.image ? (
                      <img
                        src={menu.image}
                        alt={menu.nama}
                        className="h-full w-full rounded object-cover"
                      />
                    ) : (
                      <span className="text-gray-400">No Image</span>
                    )}
                  </div>
                  <h3 className="mb-1 font-semibold text-gray-900">
                    {menu.nama}
                  </h3>
                  <p className="mb-3 text-lg font-bold text-gray-900">
                    Rp {menu.harga.toLocaleString('id-ID')}
                  </p>
                  <Button
                    onClick={() => addToCart(menu)}
                    className="w-full text-white"
                  >
                    Tambah ke Keranjang
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Checkout */}
        <div className="flex w-96 flex-col overflow-hidden border-l border-gray-200 bg-white p-6">
          <h2 className="mb-4 text-2xl font-bold text-gray-900">Checkout</h2>

          <div className="flex-1 overflow-y-auto p-6">
            {/* Keranjang */}
            <div className="mb-4 space-y-3">
              {cart.length === 0 ? (
                <p className="py-8 text-center text-gray-500">
                  Keranjang kosong
                </p>
              ) : (
                cart.map((item) => (
                  <div
                    key={item.id}
                    className="rounded-lg border border-gray-200 bg-white p-3"
                  >
                    <div className="mb-2 flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="text-sm font-semibold text-gray-900">
                          {item.nama}
                        </h3>
                        <p className="text-xs text-gray-500">
                          Rp {item.harga.toLocaleString('id-ID')} /pcs
                        </p>
                      </div>
                      <p className="text-sm font-bold text-gray-900">
                        Rp{' '}
                        {(item.harga * item.quantity).toLocaleString('id-ID')}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => decreaseQuantity(item.id)}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <div className="flex h-8 w-12 items-center justify-center rounded border text-sm font-medium">
                        {item.quantity}
                      </div>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => increaseQuantity(item.id)}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Data Pelanggan */}
            <div className="space-y-3">
              <div>
                <label className="mb-1.5 block text-sm text-gray-700">
                  Nama Pelanggan
                </label>
                <Input
                  type="text"
                  placeholder="Masukkan nama pelanggan"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="border-gray-300 bg-white"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm text-gray-700">
                  Metode Pembayaran
                </label>
                <Select
                  value={paymentMethod}
                  onValueChange={setPaymentMethod}
                >
                  <SelectTrigger className="w-full border-gray-300 bg-white">
                    <SelectValue placeholder="Pilih metode pembayaran" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cash">Cash</SelectItem>
                    <SelectItem value="qris">QRIS</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="mb-1.5 block text-sm text-gray-700">
                  No WhatsApp (Opsional)
                </label>
                <Input
                  type="text"
                  placeholder="08xxxxxxxxxx"
                  value={whatsapp}
                  onChange={(e) => setWhatsapp(e.target.value)}
                  className="border-gray-300 bg-white"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm text-gray-700">
                  Diskon (%)
                </label>
                <Input
                  type="number"
                  placeholder="0"
                  value={discount || ''}
                  onChange={(e) =>
                    setDiscount(
                      Math.min(100, Math.max(0, Number(e.target.value))),
                    )
                  }
                  min="0"
                  max="100"
                  className="border-gray-300 bg-white"
                />
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="border-t border-gray-200 bg-white p-6">
            <div className="mb-4 space-y-2">
              <div className="flex justify-between text-sm text-gray-600">
                <span>Subtotal:</span>
                <span>
                  Rp {calculateSubtotal().toLocaleString('id-ID')}
                </span>
              </div>

              {discount > 0 && (
                <div className="flex justify-between text-sm text-green-600">
                  <span>Diskon ({discount}%):</span>
                  <span>
                    - Rp {calculateDiscount().toLocaleString('id-ID')}
                  </span>
                </div>
              )}

              <div className="flex justify-between border-t pt-2 text-lg font-bold text-gray-900">
                <span>Total:</span>
                <span>
                  Rp {calculateTotal().toLocaleString('id-ID')}
                </span>
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                onClick={() => processPayment('later')}
                disabled={loading || cart.length === 0}
                variant="outline"
                className="h-11 flex-1 text-base"
              >
                Bayar Nanti
              </Button>

              <Button
                onClick={() => processPayment('now')}
                disabled={loading || cart.length === 0}
                className="h-11 flex-1 text-base text-white"
              >
                {loading ? 'Memproses...' : 'Bayar Sekarang'}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Dialog Invoice */}
      {showInvoice && currentTransaction && (
        <DialogInvoice
          open={showInvoice}
          onClose={() => {
            setShowInvoice(false);
            setCurrentTransaction(null);
          }}
          transaction={currentTransaction}
          showWhatsAppButton={!!currentTransaction.whatsapp_pelanggan}
          onSendWhatsApp={sendWhatsApp}
        />
      )}
    </Layout>
  );
};

export default Kasir;
