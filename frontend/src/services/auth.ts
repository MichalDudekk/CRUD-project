import api from "./api";
import type { AuthCredentials, User, ApiMessage } from "../types";

export const AuthService = {
    login: async (creds: AuthCredentials) => {
        const response = await api.post<ApiMessage>("/auth/login", creds);
        return response.data;
    },

    register: async (creds: AuthCredentials) => {
        const response = await api.post<User>("/auth/register", creds); // to do zmiany
        return response.data;
    },

    logout: async () => {
        const response = await api.post<ApiMessage>("/auth/logout");
        return response.data;
    },

    // whoami
    getMe: async () => {
        const response = await api.get<User>("/users/me");
        return response.data;
    },
};
