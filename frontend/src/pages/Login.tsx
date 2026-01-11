// src/pages/Login.tsx
import { LoginForm } from "@/components/login-form";

export const Login = () => {
    return (
        <div className="flex justify-center">
            <div className="w-full max-w-sm">
                <LoginForm />
            </div>
        </div>
    );
};
