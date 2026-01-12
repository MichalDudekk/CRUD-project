// src/pages/Login.tsx
import { LoginForm } from "@/components/login-form";
import { AuthService } from "@/services/auth";
import { useNavigate } from "react-router-dom";
import { AxiosError } from "axios";
import { toast } from "sonner";
import type { ApiError } from "@/types";

export const Login = ({
    refreshUser,
}: {
    refreshUser: () => Promise<void>;
}) => {
    const navigate = useNavigate();
    const handleSubmit = async (formData: FormData) => {
        const email = formData.get("email") as string;
        const password = formData.get("password") as string;

        try {
            await AuthService.login({ email, password });

            navigate("/");
            refreshUser();
        } catch (error) {
            const axiosError = error as AxiosError;
            if (axiosError.response) {
                const newError: ApiError = axiosError.response.data as ApiError;
                toast.error(`${newError.error}`);
            }
        }
    };

    return (
        <div className="flex justify-center">
            <div className="w-full max-w-sm">
                <LoginForm onFormSubmit={handleSubmit} />
            </div>
        </div>
    );
};
