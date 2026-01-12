// src/pages/Register.tsx
import { RegisterForm } from "@/components/register-form";
import { AuthService } from "@/services/auth";
import { useNavigate } from "react-router-dom";
import { AxiosError } from "axios";
import { toast } from "sonner";
import type { ApiError } from "@/types";

export const Register = () => {
    const navigate = useNavigate();
    const handleSubmit = async (formData: FormData) => {
        const email = formData.get("email") as string;
        const password = formData.get("password") as string;

        try {
            await AuthService.register({ email, password });
            toast.success("Zarejestrowano");

            navigate("/login");
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
                <RegisterForm onFormSubmit={handleSubmit} />
            </div>
        </div>
    );
};
