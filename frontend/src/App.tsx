// src/App.tsx
import "./App.css";
import { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import { AuthService } from "./services/auth";
import {
    Home,
    Login,
    Register,
    Error404,
    Account,
    ProductDetailsPage,
    Cart,
} from "./pages/index";
import type { User, CreateOrderPayload } from "./types";
import { Navbar } from "./components/navbar";
import { Footer } from "./components/footer";

function App() {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const [cart, setCart] = useState<CreateOrderPayload>(() => {
        // localStorage.clear();
        const storedCart = localStorage.getItem("shopping-cart");
        return storedCart ? JSON.parse(storedCart) : { OrderDetails: [] };
    });

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
        console.log("Saving cart to local storage:", cart);
        localStorage.setItem("shopping-cart", JSON.stringify(cart));
    }, [cart]);

    useEffect(() => {
        const refresh = async () => {
            await refreshUser();
            setIsLoading(false);
        };
        refresh();
    }, []);

    if (isLoading) return null;

    return (
        <div className="min-h-screen flex flex-col">
            <Navbar user={user} />

            <div className="ml-1 mr-1 sm:ml-[10%] sm:mr-[10%] ">
                <Routes>
                    <Route path="/" element={<Home />} />
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
                                setCart={setCart}
                            />
                        }
                    />

                    <Route
                        path="/cart"
                        element={
                            <Cart
                                user={user}
                                refreshUser={refreshUser}
                                cart={cart}
                                setCart={setCart}
                            />
                        }
                    />

                    <Route path="*" element={<Error404 />} />
                </Routes>
            </div>

            <Footer />
        </div>
    );
}

export default App;
