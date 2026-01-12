// src/App.tsx
import "./App.css";
import { useState, useEffect } from "react";
import { Routes, Route, Link } from "react-router-dom";
import { AuthService } from "./services/auth";
import {
    Home,
    Login,
    Register,
    Error404,
    Account,
    ProductDetailsPage,
} from "./pages/index";
import type { User } from "./types";

function App() {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const refreshUser = async () => {
        console.log("fetching user");
        try {
            const newUser = await AuthService.getMe();
            setUser(newUser);
        } catch (error) {
            console.log(error);
            setUser(null);
        }
    };

    useEffect(() => {
        const refresh = async () => {
            await refreshUser();
            setIsLoading(false);
        };
        refresh();
    }, []);

    if (isLoading) return null;

    return (
        <>
            <nav className="mb-4 gap-4 flex">
                <Link to="/" className="text-blue-500">
                    Adagio
                </Link>
                {user === null ? (
                    <Link to="/login" className="text-blue-500">
                        Login
                    </Link>
                ) : (
                    <Link to="/account" className="text-red-500">
                        Account
                    </Link>
                )}
            </nav>

            <div className="ml-1 mr-1 sm:ml-[10%] sm:mr-[10%] ">
                <Routes>
                    <Route
                        path="/"
                        element={<Home user={user} refreshUser={refreshUser} />}
                    />
                    <Route
                        path="/login"
                        element={<Login refreshUser={refreshUser} />}
                    />
                    <Route path="/register" element={<Register />} />
                    <Route
                        path="/account"
                        element={
                            <Account user={user} refreshUser={refreshUser} />
                        }
                    />

                    <Route
                        path="/products/:productId"
                        element={
                            <ProductDetailsPage
                                user={user}
                                refreshUser={refreshUser}
                            />
                        }
                    />

                    <Route path="*" element={<Error404 />} />
                </Routes>
            </div>
        </>
    );
}

export default App;
