import {Product} from '../../products/interfaces/products.interface';

export interface Order {
    id: string;
    userId: string;
    status: string;
    name: string;
    address: string;
    total: number;
    items: Array<OrderLine>;
}

export interface OrderLine {
    product: Product;
    qty: number;
    price: number;
}
