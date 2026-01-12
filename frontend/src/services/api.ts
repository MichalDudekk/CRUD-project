// src/services/api.ts
import axios from "axios";

const API_URL = "http://localhost:3000/api";

const api = axios.create({
    baseURL: API_URL,
    withCredentials: true, // żeby HttpOnly się przesyłało
    headers: {
        "Content-Type": "application/json",
    },
});

export default api;
