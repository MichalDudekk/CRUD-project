import { type User, type CreateOrderPayload, type Product } from "@/types";
import { type SetStateAction, type Dispatch, useState, useEffect } from "react";
import { ProductsService, OrdersService } from "@/services";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
    ImageOff,
    Minus,
    Plus,
    ShoppingBag,
    Trash2,
    Loader2,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";

export const Cart = ({
    user,
    refreshUser,
    cart,
    setCart,
}: {
    user: User | null;
    refreshUser: () => Promise<void>;
    cart: CreateOrderPayload;
    setCart: Dispatch<SetStateAction<CreateOrderPayload>>;
}) => {
    const navigate = useNavigate();
    const [data, setData] = useState<
        { Product: Product; Quantity: number }[] | null
    >(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const refresh = async () => {
            setIsLoading(true);
            try {
                const promises = cart.OrderDetails.map(
                    async ({ ProductID, Quantity }) => {
                        const res = await ProductsService.getById(ProductID);
                        return { Product: res, Quantity: Quantity };
                    }
                );

                const results = await Promise.all(promises);
                setData(results);
            } catch (error) {
                console.error("Błąd odświeżania koszyka", error);
            } finally {
                setIsLoading(false);
            }
        };

        if (cart.OrderDetails.length > 0) {
            refresh();
        } else {
            setData([]);
            setIsLoading(false);
        }
    }, [cart]);

    // Funkcje pomocnicze do modyfikacji koszyka
    const updateQuantity = (productId: number, delta: number) => {
        setCart((prev) => {
            const newDetails = prev.OrderDetails.map((item) => {
                if (item.ProductID === productId) {
                    return {
                        ...item,
                        Quantity: Math.max(1, item.Quantity + delta),
                    };
                }
                return item;
            });
            return { ...prev, OrderDetails: newDetails };
        });
    };

    const removeItem = (productId: number) => {
        setCart((prev) => ({
            ...prev,
            OrderDetails: prev.OrderDetails.filter(
                (item) => item.ProductID !== productId
            ),
        }));
    };

    const handlePlaceOrder = async () => {
        if (!user) {
            navigate("/login");
            return;
        }

        console.log("Składanie zamówienia:", cart);

        try {
            await OrdersService.create(cart);
            setCart({ OrderDetails: [] });
            console.log("Successfully added order");
            toast.success("Dodano zamówienie");
            navigate("/");
        } catch (error) {
            console.log(error);
            toast.error("Coś poszło nie tak");
            refreshUser();
        }
    };

    const totalCost = data
        ? data.reduce(
              (acc, item) => acc + item.Product.UnitPrice * item.Quantity,
              0
          )
        : 0;

    const formattedTotal = new Intl.NumberFormat("pl-PL", {
        style: "currency",
        currency: "PLN",
    }).format(totalCost);

    // --- RENDER ---

    if (isLoading && !data) {
        return (
            <div className="flex justify-center items-center h-64">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    if (!data || data.length === 0) {
        return (
            <div className="text-center py-16 space-y-4">
                <div className="flex justify-center">
                    <ShoppingBag className="w-16 h-16 text-muted-foreground/50" />
                </div>
                <h2 className="text-2xl font-semibold text-foreground">
                    Twój koszyk jest pusty
                </h2>
                <p className="text-muted-foreground">
                    Dodaj produkty, aby zobaczyć je tutaj.
                </p>
                <Button onClick={() => navigate("/")} variant="outline">
                    Wróć do sklepu
                </Button>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8 max-w-4xl space-y-8 animate-in fade-in duration-500">
            <h1 className="text-3xl font-bold mb-6">
                Twój Koszyk ({data.length})
            </h1>

            {/* LISTA PRODUKTÓW */}
            <div className="flex flex-col gap-4">
                {data.map(({ Product, Quantity }) => {
                    const formattedPrice = new Intl.NumberFormat("pl-PL", {
                        style: "currency",
                        currency: "PLN",
                    }).format(Product.UnitPrice);

                    const totalPrice = new Intl.NumberFormat("pl-PL", {
                        style: "currency",
                        currency: "PLN",
                    }).format(Product.UnitPrice * Quantity);

                    return (
                        <Card
                            key={Product.ProductID}
                            className="group flex flex-row items-center p-4 gap-4 border-input hover:border-primary/50 transition-colors"
                        >
                            {/* 1. ZDJĘCIE */}
                            <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-md border bg-muted">
                                {Product.PhotoPath ? (
                                    <img
                                        src={`/src/assets${Product.PhotoPath}`}
                                        alt={Product.Name}
                                        className="h-full w-full object-cover"
                                        onError={(e) => {
                                            e.currentTarget.style.display =
                                                "none";
                                            e.currentTarget.nextElementSibling?.classList.remove(
                                                "hidden"
                                            );
                                        }}
                                    />
                                ) : null}
                                <div
                                    className={`absolute inset-0 flex items-center justify-center text-muted-foreground ${
                                        Product.PhotoPath ? "hidden" : ""
                                    }`}
                                >
                                    <ImageOff className="h-8 w-8 opacity-50" />
                                </div>
                            </div>

                            {/* 2. DANE PRODUKTU + CENA + ILOŚĆ */}
                            <div className="flex flex-1 flex-col sm:flex-row justify-between items-center gap-4 overflow-hidden">
                                {/* Nazwa i Link */}
                                <div className="flex flex-col gap-1 flex-1 w-full text-center sm:text-left">
                                    <Link
                                        to={`/products/${Product.ProductID}`}
                                        className="hover:underline"
                                    >
                                        <h3 className="font-semibold text-lg truncate text-foreground">
                                            {Product.Name}
                                        </h3>
                                    </Link>
                                    <p className="text-sm text-muted-foreground">
                                        Cena jedn.: {formattedPrice}
                                    </p>
                                </div>

                                {/* Kontrolki ilości */}
                                <div className="flex items-center gap-3 bg-muted/30 p-1 rounded-md border">
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8"
                                        onClick={() =>
                                            updateQuantity(
                                                Product.ProductID,
                                                -1
                                            )
                                        }
                                        disabled={Quantity <= 1}
                                    >
                                        <Minus className="h-4 w-4" />
                                    </Button>
                                    <span className="w-8 text-center font-semibold tabular-nums">
                                        {Quantity}
                                    </span>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8"
                                        onClick={() =>
                                            updateQuantity(Product.ProductID, 1)
                                        }
                                        disabled={
                                            Quantity >= Product.UnitsInStock
                                        }
                                    >
                                        <Plus className="h-4 w-4" />
                                    </Button>
                                </div>

                                {/* Cena całkowita za pozycję + Usuń */}
                                <div className="flex flex-col items-end gap-2 min-w-25">
                                    <span className="text-xl font-bold text-primary whitespace-nowrap">
                                        {totalPrice}
                                    </span>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="text-muted-foreground hover:text-destructive h-auto p-0 hover:bg-transparent"
                                        onClick={() =>
                                            removeItem(Product.ProductID)
                                        }
                                    >
                                        <Trash2 className="h-4 w-4 mr-1" /> Usuń
                                    </Button>
                                </div>
                            </div>
                        </Card>
                    );
                })}
            </div>

            {/* PODSUMOWANIE */}
            <Card className="bg-muted/30 border-dashed">
                <CardContent className="p-6">
                    <div className="flex flex-col gap-4">
                        <div className="flex justify-between items-center text-lg">
                            <span className="text-muted-foreground">
                                Suma częściowa:
                            </span>
                            <span className="font-semibold">
                                {formattedTotal}
                            </span>
                        </div>

                        <Separator />

                        <div className="flex justify-between items-center text-2xl font-bold text-primary">
                            <span>Do zapłaty:</span>
                            <span>{formattedTotal}</span>
                        </div>

                        <div className="mt-4 flex justify-end">
                            {user ? (
                                <Button
                                    size="lg"
                                    className="w-full sm:w-auto text-lg px-8"
                                    onClick={handlePlaceOrder}
                                >
                                    Złóż zamówienie
                                </Button>
                            ) : (
                                <div className="flex flex-col items-end gap-2 w-full sm:w-auto">
                                    <Button
                                        disabled
                                        size="lg"
                                        className="w-full sm:w-auto text-lg px-8 opacity-50 cursor-not-allowed"
                                    >
                                        Złóż zamówienie
                                    </Button>
                                    <p className="text-xs text-muted-foreground text-center sm:text-right">
                                        Musisz być{" "}
                                        <Link
                                            to="/login"
                                            className="underline text-primary"
                                        >
                                            zalogowany
                                        </Link>
                                        , aby złożyć zamówienie.
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};
