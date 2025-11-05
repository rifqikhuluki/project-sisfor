export interface ApiResponse<T = any> {
    success: boolean;
    message: string;
    data?: T;
}

export interface TransactionResponse {
    success: boolean;
    message: string;
    invoice_number: string;
    invoice_url: string;
    is_open_bill: boolean;
    remaining_amount: number;
}

export interface PaymentResponse {
    success: boolean;
    message: string;
    transaction: Transaction;
}

export interface ErrorResponse {
    success: false;
    message: string;
    errors?: Record<string, string[]>;
}
