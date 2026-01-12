import api from "./api";
import {
    type Category,
    type Product,
    // CreateProductPayload,
    type CreateReviewPayload,
    type ProductSearchParams,
    type Review,
    type ApiMessage,
    type UpdateReviewPayload,
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

    deleteReviewById: async (ReviewID: number) => {
        const response = await api.delete<ApiMessage>(
            `/products/reviews/${ReviewID}`
        );
        return response.data;
    },

    updateReview: async (payload: UpdateReviewPayload) => {
        const response = await api.patch<ApiMessage>(
            "/products/reviews",
            payload
        );
        return response;
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
