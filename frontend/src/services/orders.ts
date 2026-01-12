// src/services/orders.ts
import api from "./api";
import type {
    Order,
    OrderDetail,
    CreateOrderPayload,
    ApiMessage,
} from "../types";

export const OrdersService = {
    getAll: async () => {
        const response = await api.get<Order[]>("/orders");
        return response.data;
    },

    create: async (payload: CreateOrderPayload) => {
        const response = await api.post<ApiMessage>("/orders", payload);
        return response.data;
    },

    getDetailsById: async (orderId: number) => {
        const response = await api.get<OrderDetail[]>(
            `/orders/details/${orderId}`
        );
        return response.data;
    },
};
