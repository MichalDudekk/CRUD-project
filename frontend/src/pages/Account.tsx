import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { type User, type Order, type Product, type OrderDetail } from "@/types";
import { ProductsService, OrdersService, AuthService } from "@/services/";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
    Loader2,
    Package,
    LogOut,
    ChevronDown,
    ChevronUp,
    User as UserIcon,
    Calendar,
    CreditCard,
} from "lucide-react";
import { toast } from "sonner";

interface AdvancedOrderDetail extends OrderDetail {
    ProductInfo?: Product;
}

export const Account = ({
    user,
    refreshUser,
}: {
    user: User | null;
    refreshUser: () => Promise<void>;
}) => {
    const navigate = useNavigate();
    const [orders, setOrders] = useState<Order[]>([]);
    const [loadingOrders, setLoadingOrders] = useState(true);

    // Cache OrderDetails
    const [expandedOrderId, setExpandedOrderId] = useState<number | null>(null);
    const [orderDetailsCache, setOrderDetailsCache] = useState<
        Record<number, AdvancedOrderDetail[]>
    >({});
    const [loadingDetails, setLoadingDetails] = useState(false);

    useEffect(() => {
        if (user === null) {
            navigate("/login");
            return;
        }

        const fetchOrders = async () => {
            try {
                const data = await OrdersService.getAll();
                setOrders(
                    data.sort(
                        (a, b) =>
                            new Date(b.OrderDate).getTime() -
                            new Date(a.OrderDate).getTime()
                    )
                );
            } catch (error) {
                console.error("Błąd pobierania zamówień:", error);
                toast.error("Błąd pobierania zamówień");
                refreshUser();
            } finally {
                setLoadingOrders(false);
            }
        };

        fetchOrders();
    }, [user, navigate, refreshUser]);

    const handleLogOut = async () => {
        try {
            await AuthService.logout();
        } catch (error) {
            console.log(error);
        }

        navigate("/");
        refreshUser();
    };

    const toggleOrderDetails = async (orderId: number) => {
        if (expandedOrderId === orderId) {
            setExpandedOrderId(null);
            return;
        }

        setExpandedOrderId(orderId);

        if (orderDetailsCache[orderId]) return;

        setLoadingDetails(true);
        try {
            const details = await OrdersService.getDetailsById(orderId);

            const enrichedDetails = await Promise.all(
                details.map(async (detail) => {
                    try {
                        const product = await ProductsService.getById(
                            detail.ProductID
                        );
                        return { ...detail, ProductInfo: product };
                    } catch {
                        return detail;
                    }
                })
            );

            setOrderDetailsCache((prev) => ({
                ...prev,
                [orderId]: enrichedDetails,
            }));
        } catch (error) {
            console.error("Błąd pobierania szczegółów:", error);
            refreshUser();
        } finally {
            setLoadingDetails(false);
        }
    };

    if (!user) return null;

    return (
        <div className="container mx-auto px-4 py-8 max-w-4xl animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
                <div className="flex items-center gap-4">
                    <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                        <UserIcon className="h-8 w-8" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold">{user.Email}</h1>
                        <p className="text-muted-foreground text-sm">
                            Panel klienta
                        </p>
                    </div>
                </div>
                <Button
                    variant="destructive"
                    onClick={handleLogOut}
                    className="gap-2"
                >
                    <LogOut className="h-4 w-4" /> Wyloguj się
                </Button>
            </div>

            <Separator className="my-6" />

            <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                <Package className="h-5 w-5" /> Historia zamówień
            </h2>

            {loadingOrders ? (
                <div className="flex justify-center py-10">
                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
            ) : orders.length === 0 ? (
                <Card className="border-dashed bg-muted/30 p-10 text-center text-muted-foreground">
                    Nie masz jeszcze żadnych zamówień.
                </Card>
            ) : (
                <div className="space-y-4">
                    {orders.map((order) => {
                        const isExpanded = expandedOrderId === order.OrderID;
                        const date = new Date(
                            order.OrderDate
                        ).toLocaleDateString("pl-PL");
                        const total = new Intl.NumberFormat("pl-PL", {
                            style: "currency",
                            currency: "PLN",
                        }).format(order.TotalCost);

                        return (
                            <Card
                                key={order.OrderID}
                                className={`transition-all duration-200 border-l-4 ${
                                    isExpanded
                                        ? "border-l-primary shadow-md"
                                        : "border-l-transparent hover:border-l-muted-foreground/30"
                                }`}
                            >
                                <div
                                    className="p-4 sm:p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center cursor-pointer gap-4"
                                    onClick={() =>
                                        toggleOrderDetails(order.OrderID)
                                    }
                                >
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-3">
                                            <span className="font-bold text-lg">
                                                Zamówienie #{order.OrderID}
                                            </span>
                                            <Badge
                                                variant={
                                                    order.Status === "Shipped"
                                                        ? "default"
                                                        : "secondary"
                                                }
                                            >
                                                {order.Status}
                                            </Badge>
                                        </div>
                                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                            <span className="flex items-center gap-1">
                                                <Calendar className="h-3 w-3" />{" "}
                                                {date}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <CreditCard className="h-3 w-3" />{" "}
                                                {total}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="self-end sm:self-center">
                                        {isExpanded ? (
                                            <ChevronUp className="h-5 w-5 text-muted-foreground" />
                                        ) : (
                                            <ChevronDown className="h-5 w-5 text-muted-foreground" />
                                        )}
                                    </div>
                                </div>

                                {isExpanded && (
                                    <div className="px-4 sm:px-6 pb-6 animate-in slide-in-from-top-2 duration-200">
                                        <Separator className="mb-4" />

                                        {loadingDetails &&
                                        !orderDetailsCache[order.OrderID] ? (
                                            <div className="flex justify-center py-4">
                                                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                                            </div>
                                        ) : (
                                            <div className="space-y-3">
                                                {orderDetailsCache[
                                                    order.OrderID
                                                ]?.map((detail, idx) => (
                                                    <div
                                                        key={idx}
                                                        className="flex justify-between items-center text-sm"
                                                    >
                                                        <div className="flex items-center gap-3">
                                                            <div className="h-10 w-10 rounded border bg-muted flex items-center justify-center overflow-hidden shrink-0">
                                                                {detail
                                                                    .ProductInfo
                                                                    ?.PhotoPath ? (
                                                                    <img
                                                                        src={`/src/assets${detail.ProductInfo.PhotoPath}`}
                                                                        alt=""
                                                                        className="h-full w-full object-cover"
                                                                    />
                                                                ) : (
                                                                    <Package className="h-5 w-5 text-muted-foreground/50" />
                                                                )}
                                                            </div>
                                                            <div>
                                                                <p className="font-medium text-foreground">
                                                                    {detail
                                                                        .ProductInfo
                                                                        ?.Name ||
                                                                        `Produkt ID: ${detail.ProductID}`}
                                                                </p>
                                                                <p className="text-muted-foreground text-xs">
                                                                    Ilość:{" "}
                                                                    {
                                                                        detail.Quantity
                                                                    }{" "}
                                                                    szt.
                                                                </p>
                                                            </div>
                                                        </div>
                                                        <span className="font-semibold">
                                                            {new Intl.NumberFormat(
                                                                "pl-PL",
                                                                {
                                                                    style: "currency",
                                                                    currency:
                                                                        "PLN",
                                                                }
                                                            ).format(
                                                                detail.UnitPrice *
                                                                    detail.Quantity
                                                            )}
                                                        </span>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                )}
                            </Card>
                        );
                    })}
                </div>
            )}
        </div>
    );
};
