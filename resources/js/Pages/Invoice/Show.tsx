import { Card, CardContent } from '@/components/ui/card';
import { Head } from '@inertiajs/react';
import { Calendar, FileText, User2 } from 'lucide-react';

interface InvoiceItem {
    nama_menu: string;
    quantity: number;
    harga: number;
    subtotal: number;
}

interface Transaction {
    id: number;
    nomor_invoice: string;
    nama_pelanggan: string;
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
    items: InvoiceItem[];
}

interface Props {
    transaction: Transaction;
}

const Show = ({ transaction }: Props) => {
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('id-ID', {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(amount);
    };

    return (
        <>
            <Head title={`Invoice ${transaction.nomor_invoice}`} />

            <div className="min-h-screen bg-gray-100 py-12">
                <div className="mx-auto max-w-3xl px-4">
                    <Card className="overflow-hidden shadow-lg">
                        <CardContent className="p-12">
                            {/* Header dengan Logo */}
                            <div className="mb-8 text-center">
                                <div className="mb-4 flex justify-center">
                                    <img
                                        src="/storage/logo-kedai.png"
                                        alt="Kedai Kopi Bangsa Logo"
                                        className="h-24 w-auto object-contain"
                                    />
                                </div>
                                <h1 className="mb-2 text-2xl font-black text-green-950">
                                    KEDAI KOPI BANGSA
                                </h1>
                                <p className="text-sm text-gray-600">
                                    Jl. Tlogo Joyo No.34, Tlogomas, Kec.
                                    Lowokwaru, Kota Malang, Jawa Timur 65144
                                </p>
                            </div>

                            {/* Info Section */}
                            <div className="mb-8 rounded-lg bg-gray-50 p-6">
                                <div className="grid grid-cols-3 gap-6">
                                    <div className="flex items-start gap-4">
                                        <Calendar className="mt-1 h-8 w-8 text-gray-900" />
                                        <div>
                                            <p className="text-sm text-gray-600">
                                                Dibeli Pada
                                            </p>
                                            <p className="text-sm font-bold text-gray-900">
                                                {transaction.created_at}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-4">
                                        <User2 className="mt-1 h-8 w-8 text-gray-900" />
                                        <div>
                                            <p className="text-sm text-gray-600">
                                                Pelanggan
                                            </p>
                                            <p className="text-sm font-bold text-gray-900">
                                                {transaction.nama_pelanggan}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-4">
                                        <FileText className="mt-1 h-8 w-8 text-gray-900" />
                                        <div>
                                            <p className="text-sm text-gray-600">
                                                No. Invoice
                                            </p>
                                            <p className="text-sm font-bold text-gray-900">
                                                {transaction.nomor_invoice}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Items List */}
                            <div className="mb-6 space-y-3">
                                {transaction.items.map((item, index) => (
                                    <div
                                        key={index}
                                        className="flex items-center justify-between"
                                    >
                                        <div className="flex-1">
                                            <p className="text-lg font-semibold text-gray-900">
                                                {item.nama_menu}
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-12">
                                            <span className="text font-light text-gray-700">
                                                {formatCurrency(item.harga)} X{' '}
                                                {item.quantity}
                                            </span>
                                            <span className="w-24 text-right text-lg font-medium text-gray-900">
                                                {formatCurrency(item.subtotal)}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            {/* Summary */}
                            <div className="border-t pt-4">
                                <div className="mb-2 flex justify-between text-sm">
                                    <p className="text-gray-600">Subtotal</p>
                                    <p className="font-medium">
                                        {formatCurrency(transaction.subtotal)}
                                    </p>
                                </div>

                                {/* ← TAMBAH TAMPILAN DISKON */}
                                {transaction.discount_percentage > 0 && (
                                    <div className="mb-2 flex justify-between text-sm">
                                        <p className="text-green-600">
                                            Diskon (
                                            {transaction.discount_percentage}%)
                                        </p>
                                        <p className="font-medium text-green-600">
                                            -{' '}
                                            {formatCurrency(
                                                transaction.discount_amount,
                                            )}
                                        </p>
                                    </div>
                                )}

                                {transaction.is_open_bill && (
                                    <>
                                        <div className="mb-2 flex justify-between text-sm">
                                            <p className="text-gray-600">
                                                Dibayar
                                            </p>
                                            <p className="font-medium text-green-600">
                                                {formatCurrency(
                                                    transaction.paid_amount,
                                                )}
                                            </p>
                                        </div>
                                        <div className="mb-3 flex justify-between text-sm">
                                            <p className="font-semibold text-orange-600">
                                                Sisa Tagihan
                                            </p>
                                            <p className="font-bold text-orange-600">
                                                {formatCurrency(
                                                    transaction.remaining_amount,
                                                )}
                                            </p>
                                        </div>
                                    </>
                                )}

                                <div className="mb-8 rounded-lg border-2 border-gray-200 bg-white p-6">
                                    <div className="flex items-center justify-between">
                                        <span className="text-2xl font-bold text-gray-900">
                                            Total
                                        </span>
                                        <span className="text-2xl font-bold text-gray-900">
                                            {formatCurrency(transaction.total)}
                                        </span>
                                    </div>
                                </div>

                                {/* Payment Status */}
                                <div className="text-center">
                                    <p className="mb-2 text-xl font-semibold text-gray-900">
                                        {transaction.metode_pembayaran.toUpperCase()}
                                    </p>
                                    <p className="text-4xl font-bold text-gray-900">
                                        Rp. {formatCurrency(transaction.total)}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </>
    );
};

export default Show;
