// src/types/index.ts

export interface ApiError {
    error: string;
}

export interface ApiMessage {
    message: string;
}

// Users

export interface User {
    UserID: number;
    Email: string;
    IsAdmin: boolean;
}

// Payload do logowania i rejestracji
export interface AuthCredentials {
    email: string;
    password: string;
}

// Categories

export interface Category {
    CategoryID: number;
    CategoryName: string;
    Description: string;
    createdAt?: string;
    updatedAt?: string;
}

export interface Product {
    ProductID: number;
    CategoryID: number;
    Name: string;
    UnitPrice: number; // backend zwraca decimal jako number w JSON
    Description: string;
    Functionality: string;
    PhotoPath: string;
    UnitsInStock: number;
    Discontinued: boolean;
    createdAt?: string;
    updatedAt?: string;
}

export type CreateProductPayload = Omit<
    Product,
    "ProductID" | "createdAt" | "updatedAt"
>;

export interface ProductSearchParams {
    SearchPhase?: string;
    CategoryID?: string;
}

// reviews

export interface Review {
    ReviewID: number;
    ProductID: number;
    UserID: number;
    Rating: number;
    Content: string;
    Status: string; // np. "Shown"
    createdAt?: string;
    updatedAt?: string;
}

export interface CreateReviewPayload {
    ProductID: number;
    Rating: number;
    Content: string;
    Status: string;
}

export interface UpdateReviewPayload {
    ReviewID: number;
    Rating: number;
    Content: string;
}

// ShippingDetails & CreditCardDetails

export interface ShippingDetail {
    ShippingDetailID: number;
    UserID: number;
    FirstName: string;
    LastName: string;
    Country: string;
    City: string;
    Street: string;
    PostalCode: string;
    Phone: string;
}

export type CreateShippingDetailPayload = Omit<
    ShippingDetail,
    "ShippingDetailID" | "UserID"
>;

// payload do edycji wymaga dodatkowo ShippingDetailID
export type UpdateShippingDetailPayload = CreateShippingDetailPayload & {
    ShippingDetailID: number;
};

export interface CreditCard {
    CreditCardDetailID: number;
    UserID: number;
    Token: string;
    LastFourDigits: string;
    CardBrand: string;
    FirstName: string;
    LastName: string;
    ExpiryMonth: number;
    ExpiryYear: number;
}

export type CreateCreditCardPayload = Omit<
    CreditCard,
    "CreditCardDetailID" | "UserID"
>;

// Orders

export interface OrderDetail {
    OrderID: number;
    ProductID: number;
    UnitPrice: number; // cena w momencie zakupu
    Quantity: number;
    Discount: number;
}

export interface Order {
    OrderID: number;
    UserID: number;
    OrderDate: string;
    Status: string; // "Planned", "Paid", "Shipped" etc etc
    TotalCost: number;
    createdAt?: string;
    updatedAt?: string;
}

export interface CreateOrderPayload {
    OrderDetails: {
        ProductID: number;
        Quantity: number;
    }[];
}

export interface OrderWithDetails extends Order {
    OrderDetails?: OrderDetail[];
}
