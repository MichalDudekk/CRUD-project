// src/services/api.ts
import axios from "axios";

const APP_PORT = import.meta.env.VITE_APP_PORT | 3000;

const API_URL = `http://localhost:${APP_PORT}/api`;

const api = axios.create({
    baseURL: API_URL,
    withCredentials: true, // żeby HttpOnly się przesyłało
    headers: {
        "Content-Type": "application/json",
    },
});

export default api;
