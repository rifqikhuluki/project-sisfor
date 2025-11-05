import { MenuItem } from './menu';
import { Transaction } from './transaction';

export interface KasirPageProps {
    menus: MenuItem[];
    categories: string[];
}

export interface InvoicePageProps {
    transaction: Transaction;
}

export interface OpenBillPageProps {
    openBills: Transaction[];
    statistics: OpenBillStatistics;
}

export interface OpenBillStatistics {
    total_open_bills: number;
    total_outstanding: number;
}

export interface MenuPageProps {
    menus: MenuItem[];
    categories?: string[];
}

export interface SalesPageProps {
    transactions: Transaction[];
    statistics: SalesStatistics;
    period: string;
}

export interface SalesStatistics {
    total_sales: number;
    total_transactions: number;
    average_transaction: number;
}
