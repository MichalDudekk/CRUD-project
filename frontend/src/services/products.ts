import api from "./api";
import {
    type Category,
    type Product,
    // CreateProductPayload,
    type CreateReviewPayload,
    type ProductSearchParams,
    type Review,
    type ApiMessage,
} from "../types";

export const ProductsService = {
    // Pobierz wszystkie
    getAll: async () => {
        const response = await api.get<Product[]>("/products");
        return response.data;
    },

    // Pobierz jeden
    getById: async (id: number) => {
        const response = await api.get<Product>(`/products/${id}`);
        return response.data;
    },

    // Wyszukiwanie
    search: async (params: ProductSearchParams) => {
        const response = await api.get<Product[]>("/products/search", {
            params,
        });
        return response.data;
    },

    // Pobierz recenzje produktu
    getReviews: async (productId: number) => {
        const response = await api.get<Review[]>(
            `/products/reviews/${productId}`
        );
        return response.data;
    },

    createReview: async (review: CreateReviewPayload) => {
        const response = await api.post<ApiMessage>(
            "/products/reviews",
            review
        );
        return response.data;
    },

    getCategoryById: async (id: number) => {
        const response = await api.get<Category>(`/categories/${id}`);
        return response.data;
    },

    getCategories: async () => {
        const response = await api.get<Category[]>(`/categories`);
        return response.data;
    },
};
