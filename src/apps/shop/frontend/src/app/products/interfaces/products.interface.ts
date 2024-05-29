export interface Product {
    id: string;
    name: string;
    description: string;
    images: string[];
    price: number;
    brand: string;
    category: string;
    ean: string;
}

export const products = [
    {
        id: 1,
        name: 'Phone XL',
        price: 799,
        description: 'A large phone with one of the best screens',
    },
    {
        id: 2,
        name: 'Phone Mini',
        price: 699,
        description: 'A great phone with one of the best cameras',
    },
    {
        id: 3,
        name: 'Phone Standard',
        price: 299,
        description: '',
    },
];

export interface Author {
    id: string;
    firstname: string;
    lastname: string;
}

export interface ProductsResponse {
    status: number;
    message: string;
    data: ProductsResponseData[];
}

export interface ProductsResponseData {
    _id: string;
    id: string;
    name: string;
    description: string;
    images: string[];
    author: AuthorProductsResponse;
    price: number;
    brand: string;
    category: string;
    ean: string;
}

export interface ProductResponse {
    status: number;
    message: string;
    data: ProductsResponseData;
}

export interface ProductResponseData {
    _id: string;
    id: string;
    name: string;
    description: string;
    images: string[];
    author: AuthorProductsResponse;
    price: number;
    brand: string;
    category: string;
    ean: string;
}

export interface AuthorProductsResponse {
    _id: string;
    id: string;
    firstname: string;
    lastname: string;
}

export interface ProductsCountResponse {
    status: number;
    message: string;
    total: number;
}

export enum Operator {
    EQUAL = '=',
    NOT_EQUAL = '!=',
    GT = '>',
    LT = '<',
    CONTAINS = 'CONTAINS',
    NOT_CONTAINS = 'NOT_CONTAINS',
}
