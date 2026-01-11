import api from "./api";
import type {
    Product,
    // CreateProductPayload,
    ProductSearchParams,
    Review,
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
};
