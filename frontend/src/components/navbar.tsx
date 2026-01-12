import { Link } from "react-router-dom";
import { ShoppingCart, User, LogIn, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { type User as usr } from "@/types";

export const Navbar = ({ user }: { user: usr | null }) => {
    return (
        <nav className="mb-4 flex justify-center sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
            <div className="container flex h-16 items-center justify-between px-4">
                <Link
                    to="/"
                    className="flex items-center gap-2 text-2xl font-black tracking-tighter text-orange-500 hover:opacity-90 transition-opacity"
                >
                    <ShoppingBag className="h-6 w-6" />
                    Adagio
                </Link>

                <div className="flex items-center gap-2 sm:gap-4">
                    <Button
                        variant="ghost"
                        asChild
                        className="flex items-center gap-2"
                    >
                        <Link to="/cart">
                            <ShoppingCart className="h-5 w-5" />
                            <span className="hidden sm:inline font-medium">
                                Koszyk
                            </span>
                        </Link>
                    </Button>

                    <Button
                        variant="ghost"
                        asChild
                        className={`flex items-center gap-2 ${
                            user ? "" : "text-blue-600 hover:text-blue-700"
                        }`}
                    >
                        {user ? (
                            <Link to="/account">
                                <User className="h-5 w-5" />
                                <span className="hidden sm:inline font-medium">
                                    Konto
                                </span>
                            </Link>
                        ) : (
                            <Link to="/login">
                                <LogIn className="h-5 w-5" />
                                <span className="hidden sm:inline font-medium">
                                    Zaloguj się
                                </span>
                            </Link>
                        )}
                    </Button>
                </div>
            </div>
        </nav>
    );
};
