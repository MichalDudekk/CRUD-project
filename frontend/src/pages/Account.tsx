// src/pages/account
import type { User } from "@/types";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { AuthService } from "../services/auth";

export const Account = ({
    user,
    refreshUser,
}: {
    user: User | null;
    refreshUser: () => Promise<void>;
}) => {
    const navigate = useNavigate();

    useEffect(() => {
        if (user === null) {
            navigate("/");
        }
    }, []);

    if (user === null) return null;

    const handleLogOut = async () => {
        await AuthService.logout();
        navigate("/");
        refreshUser();
    };

    return (
        <>
            <h1 className="text-red-500">{user.Email}</h1>{" "}
            <button onClick={handleLogOut}>Log out</button>
        </>
    );
};
