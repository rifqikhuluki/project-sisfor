import { Button } from './ui/button';
import { Dialog, DialogContent, DialogDescription } from './ui/dialog';
import { ScrollArea } from './ui/scroll-area';

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
    paid_amount?: number;
    remaining_amount?: number;
    status: string;
    is_open_bill: boolean;
    created_at: string;
    paid_at?: string;
    items: Array<{
        nama_menu: string;
        quantity: number;
        harga: number;
        subtotal: number;
    }>;
}

interface DialogInvoiceProps {
    open: boolean;
    onClose?: () => void;
    transaction: Transaction;
    showWhatsAppButton?: boolean;
    onSendWhatsApp?: () => void;
}

const DialogInvoice = ({
    open,
    onClose,
    transaction,
    showWhatsAppButton = false,
    onSendWhatsApp,
}: DialogInvoiceProps) => {
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(amount);
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="max-h-[90vh] max-w-sm p-0">
                {/* Header - Fixed */}
                <div className="border-b bg-white px-6 py-4 text-center">
                    <div className="mb-2">
                        <img
                            src="/storage/logo-kedai.png"
                            alt="Logo"
                            className="mx-auto h-12 w-12 object-contain"
                        />
                    </div>
                    <h1 className="text-lg font-bold text-gray-900">
                        Kedai Kopi Bangsa
                    </h1>
                </div>

                {/* Scrollable Content */}
                <ScrollArea className="max-h-[calc(90vh-240px)]">
                    <DialogDescription className="px-6 py-4">
                        <div className="space-y-4">
                            {/* Invoice Status Badge */}
                            {transaction.is_open_bill ? (
                                <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-2 text-center">
                                    <p className="text-xs font-semibold text-yellow-800">
                                        OPEN BILL
                                    </p>
                                </div>
                            ) : (
                                <div className="rounded-lg border border-green-200 bg-green-50 p-2 text-center">
                                    <p className="text-xs font-semibold text-green-800">
                                        LUNAS
                                    </p>
                                </div>
                            )}

                            {/* Info Grid */}
                            <div className="grid grid-cols-2 gap-4 text-xs">
                                <div>
                                    <p className="mb-1 text-gray-500">
                                        Dibeli pada
                                    </p>
                                    <p className="font-semibold text-gray-900">
                                        {transaction.created_at}
                                    </p>
                                </div>
                                <div>
                                    <p className="mb-1 text-gray-500">
                                        Nomor Invoice
                                    </p>
                                    <p className="font-semibold text-gray-900">
                                        {transaction.nomor_invoice}
                                    </p>
                                </div>
                                <div>
                                    <p className="mb-1 text-gray-500">
                                        Pelanggan
                                    </p>
                                    <p className="font-semibold text-gray-900">
                                        {transaction.nama_pelanggan}
                                    </p>
                                </div>
                                <div>
                                    <p className="mb-1 text-gray-500">
                                        Pembayaran
                                    </p>
                                    <p className="font-semibold text-gray-900 uppercase">
                                        {transaction.metode_pembayaran}
                                    </p>
                                </div>
                            </div>

                            {/* Items */}
                            <div className="border-t border-gray-200 pt-3">
                                <p className="mb-2 text-xs font-semibold text-gray-500">
                                    Detail Pesanan
                                </p>
                                {transaction.items.map((item, index) => (
                                    <div
                                        key={index}
                                        className="mb-2 flex justify-between text-sm"
                                    >
                                        <div className="flex-1">
                                            <p className="font-medium text-gray-900">
                                                {item.nama_menu}
                                            </p>
                                            <p className="text-xs text-gray-500">
                                                {formatCurrency(item.harga)} x{' '}
                                                {item.quantity}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-semibold text-gray-900">
                                                {formatCurrency(item.subtotal)}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Totals */}
                            <div className="space-y-2 border-t border-gray-200 pt-3 text-sm">
                                <div className="flex justify-between text-gray-600">
                                    <span>Subtotal</span>
                                    <span>
                                        {formatCurrency(transaction.subtotal)}
                                    </span>
                                </div>

                                {/* ← TAMBAH TAMPILAN DISKON */}
                                {transaction.discount_percentage > 0 && (
                                    <div className="flex justify-between text-green-600">
                                        <span>
                                            Diskon (
                                            {transaction.discount_percentage}%)
                                        </span>
                                        <span>
                                            -{' '}
                                            {formatCurrency(
                                                transaction.discount_amount,
                                            )}
                                        </span>
                                    </div>
                                )}

                                {transaction.is_open_bill && (
                                    <>
                                        <div className="flex justify-between text-gray-600">
                                            <span>Dibayar</span>
                                            <span>
                                                {formatCurrency(
                                                    transaction.paid_amount ||
                                                        0,
                                                )}
                                            </span>
                                        </div>
                                        <div className="flex justify-between font-bold text-orange-600">
                                            <span>Sisa Tagihan</span>
                                            <span>
                                                {formatCurrency(
                                                    transaction.remaining_amount ||
                                                        0,
                                                )}
                                            </span>
                                        </div>
                                    </>
                                )}

                                <div className="flex justify-between border-t pt-2 text-base font-bold text-gray-900">
                                    <span>Total</span>
                                    <span>
                                        {formatCurrency(transaction.total)}
                                    </span>
                                </div>
                            </div>
                            {/* Payment Status */}
                            <div
                                className={`rounded-lg border p-3 text-center ${
                                    transaction.is_open_bill
                                        ? 'border-yellow-200 bg-yellow-50'
                                        : 'border-green-200 bg-green-50'
                                }`}
                            >
                                <p className="mb-1 text-xs text-gray-600">
                                    {transaction.metode_pembayaran.toUpperCase()}
                                </p>
                                <p
                                    className={`text-xl font-bold ${
                                        transaction.is_open_bill
                                            ? 'text-yellow-600'
                                            : 'text-green-600'
                                    }`}
                                >
                                    {transaction.is_open_bill
                                        ? formatCurrency(
                                              transaction.remaining_amount || 0,
                                          )
                                        : formatCurrency(transaction.total)}
                                </p>
                                {transaction.is_open_bill && (
                                    <p className="mt-1 text-xs text-gray-500">
                                        Belum Lunas
                                    </p>
                                )}
                            </div>

                            {/* Footer */}
                            <div className="pt-2 text-center text-xs text-gray-500">
                                <p>
                                    Dilayani oleh{' '}
                                    <span className="font-semibold">
                                        Kedai Kopi Bangsa
                                    </span>
                                </p>
                            </div>
                        </div>
                    </DialogDescription>
                </ScrollArea>

                {/* Action Buttons - Fixed at Bottom */}
                <div className="border-t bg-white px-6 py-4">
                    <div className="flex gap-2">
                        {onClose && (
                            <Button
                                onClick={onClose}
                                variant="outline"
                                className="flex-1"
                            >
                                Tutup
                            </Button>
                        )}

                        {showWhatsAppButton && onSendWhatsApp && (
                            <Button
                                onClick={onSendWhatsApp}
                                className="flex-1 bg-green-600 text-white hover:bg-green-700"
                            >
                                <svg
                                    className="mr-2 h-4 w-4"
                                    fill="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                                </svg>
                                Kirim via WA
                            </Button>
                        )}
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default DialogInvoice;
