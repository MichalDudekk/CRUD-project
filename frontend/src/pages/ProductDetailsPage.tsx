import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ProductsService } from "../services/products";
import type { Product, Review, User } from "../types";
import {
    ShoppingCart,
    Star,
    ArrowLeft,
    Truck,
    CheckCircle2,
    XCircle,
    Minus,
    Plus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export const ProductDetailsPage = ({
    user,
}: {
    user: User | null;
    refreshUser: () => Promise<void>;
}) => {
    const { productId } = useParams<{ productId: string }>(); // pobvranie id z url
    const navigate = useNavigate();

    const [product, setProduct] = useState<Product | null>(null);
    const [categoryName, setCategoryName] = useState<string>("");
    const [reviews, setReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);

    useEffect(() => {
        const fetchData = async () => {
            if (!productId) return;
            try {
                setLoading(true);
                const id = Number(productId);

                const productData = await ProductsService.getById(id);
                setProduct(productData);

                const [reviewsData, categoryData] = await Promise.all([
                    ProductsService.getReviews(id),
                    ProductsService.getCategoryById(productData.CategoryID),
                ]); // optymalizacja

                setReviews(reviewsData);
                setCategoryName(categoryData.CategoryName);
            } catch (err) {
                console.error("Błąd podczas pobierania danych:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [productId]);

    const handleQuantityChange = (delta: number) => {
        setQuantity((prev) => {
            const newValue = prev + delta;
            if (newValue < 1) return 1;
            if (product && newValue > product.UnitsInStock)
                return product.UnitsInStock;
            return newValue;
        });
    };

    const handleAddToCart = () => {
        if (!product) return;
        console.log(`Dodano do koszyka: ${product.Name}, Ilość: ${quantity}`);
    };

    // --- LOADING STATE ---
    if (loading) {
        return (
            <div className="container mx-auto p-6 space-y-8">
                <Skeleton className="h-8 w-32" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    <Skeleton className="h-100 w-full rounded-xl" />
                    <div className="space-y-4">
                        <Skeleton className="h-10 w-3/4" />
                        <Skeleton className="h-6 w-1/4" />
                        <Skeleton className="h-32 w-full" />
                    </div>
                </div>
            </div>
        );
    }

    if (!product)
        return <div className="p-10 text-center">Nie znaleziono produktu.</div>;

    const averageRating =
        reviews.length > 0
            ? (
                  reviews.reduce((acc, r) => acc + r.Rating, 0) / reviews.length
              ).toFixed(1)
            : "Brak ocen";

    // Internationalization API
    const formattedPrice = new Intl.NumberFormat("pl-PL", {
        style: "currency",
        currency: "PLN",
    }).format(product.UnitPrice);

    return (
        <div className="container mx-auto px-4 py-8 animate-in fade-in duration-500">
            <Button
                variant="ghost"
                className="mb-6 pl-0 hover:pl-2 transition-all"
                onClick={() => navigate(-1)}
            >
                <ArrowLeft className="mr-2 h-4 w-4" /> Wróć do listy
            </Button>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
                <div className="relative aspect-square overflow-hidden rounded-xl border bg-muted flex items-center justify-center">
                    {product.PhotoPath ? (
                        <img
                            src={`/src/assets${product.PhotoPath}`}
                            alt={product.Name}
                            className={`object-cover w-full h-full transition-transform duration-500 hover:scale-105 ${
                                product.UnitsInStock === 0
                                    ? "grayscale opacity-80"
                                    : ""
                            }`}
                        />
                    ) : (
                        <div className="text-muted-foreground flex flex-col items-center">
                            <span className="mt-4">Brak zdjęcia</span>
                        </div>
                    )}
                </div>

                <div className="flex flex-col justify-center space-y-6">
                    <div>
                        <div className="flex items-center justify-between mb-2">
                            <Badge
                                variant="secondary"
                                className="text-sm px-3 py-1"
                            >
                                {categoryName || "Kategoria"}
                            </Badge>

                            <div className="flex items-center text-yellow-500">
                                <Star className="fill-current w-5 h-5" />
                                <span className="ml-1 font-semibold text-foreground">
                                    {averageRating}
                                </span>
                                <span className="text-muted-foreground text-sm ml-1">
                                    ({reviews.length} opinii)
                                </span>
                            </div>
                        </div>

                        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight lg:text-5xl mb-4 text-foreground">
                            {product.Name}
                        </h1>

                        <div className="text-3xl font-bold text-primary">
                            {formattedPrice}
                        </div>
                    </div>

                    <Separator />

                    <div className="space-y-4">
                        <h3 className="font-semibold text-lg">Opis</h3>
                        <p className="text-muted-foreground leading-relaxed">
                            {product.Description}
                        </p>
                    </div>

                    <div className="space-y-2">
                        <h3 className="font-semibold text-sm text-foreground/80">
                            Kluczowe funkcje:
                        </h3>
                        <p className="text-sm text-muted-foreground bg-muted/50 p-3 rounded-md border">
                            {product.Functionality}
                        </p>
                    </div>

                    <div className="pt-6">
                        {product.UnitsInStock > 0 ? (
                            <div className="flex flex-col sm:flex-row gap-4">
                                <div className="flex items-center border rounded-md w-fit bg-background">
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => handleQuantityChange(-1)}
                                        disabled={quantity <= 1}
                                    >
                                        <Minus className="h-4 w-4" />
                                    </Button>
                                    <Input
                                        type="number"
                                        className="w-14 text-center border-0 focus-visible:ring-0 px-0 h-10 bg-transparent"
                                        value={quantity}
                                        readOnly
                                    />
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => handleQuantityChange(1)}
                                        disabled={
                                            quantity >= product.UnitsInStock
                                        }
                                    >
                                        <Plus className="h-4 w-4" />
                                    </Button>
                                </div>

                                <Button
                                    className="flex-1 h-10 text-lg shadow-md cursor-pointer"
                                    onClick={handleAddToCart}
                                >
                                    <ShoppingCart className="mr-2 h-5 w-5" />
                                    Dodaj do koszyka
                                </Button>
                            </div>
                        ) : (
                            <Button
                                variant="outline"
                                disabled
                                className="w-full h-12 border-destructive/50 text-destructive bg-destructive/5"
                            >
                                <XCircle className="mr-2 h-5 w-5" /> Produkt
                                chwilowo niedostępny
                            </Button>
                        )}

                        <div className="mt-4 flex items-center text-sm text-muted-foreground">
                            {product.UnitsInStock > 0 ? (
                                <>
                                    <CheckCircle2 className="h-4 w-4 mr-2 text-green-500" />{" "}
                                    W magazynie: {product.UnitsInStock} szt.
                                </>
                            ) : (
                                <>
                                    <XCircle className="h-4 w-4 mr-2 text-red-500" />{" "}
                                    Brak w magazynie
                                </>
                            )}
                            <span className="mx-2 text-border">|</span>
                            <Truck className="h-4 w-4 mr-2" /> Wysyłka w 24h
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-16">
                <h2 className="text-3xl font-bold mb-8">Opinie klientów</h2>

                {reviews.length === 0 ? (
                    <Card className="bg-muted/30 border-dashed max-w-2xl mx-auto">
                        <CardContent className="flex flex-col items-center justify-center p-12 text-center">
                            <Star className="h-12 w-12 text-muted-foreground mb-4 opacity-50" />
                            <h3 className="text-xl font-semibold mb-2">
                                Brak opinii dla tego produktu
                            </h3>
                            <p className="text-muted-foreground max-w-sm">
                                Nikt jeszcze nie ocenił tego produktu. Jeśli go
                                kupiłeś, podziel się swoją opinią!
                            </p>
                            {user && (
                                <Button
                                    variant="outline"
                                    className="mt-6 cursor-pointer"
                                >
                                    Napisz pierwszą opinię
                                </Button>
                            )}
                        </CardContent>
                    </Card>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {reviews.map((review) => (
                            <ReviewItem key={review.ReviewID} review={review} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

function ReviewItem({ review }: { review: Review }) {
    return (
        <Card className="h-full hover:shadow-sm transition-shadow">
            <CardContent className="p-6 flex flex-col h-full">
                <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
                            {review.UserID < 1000 ? review.UserID : "..."}
                        </div>
                        <div>
                            <span className="font-semibold text-sm block">
                                Użytkownik #{review.UserID}
                            </span>
                            <span className="text-xs text-muted-foreground">
                                {review.createdAt
                                    ? new Date(
                                          review.createdAt
                                      ).toLocaleDateString()
                                    : "Data nieznana"}
                            </span>
                        </div>
                    </div>
                    <div className="flex bg-yellow-500/10 px-2 py-1 rounded-full">
                        {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                                key={i}
                                className={`w-3.5 h-3.5 ${
                                    i < review.Rating
                                        ? "fill-yellow-500 text-yellow-500"
                                        : "text-muted-foreground/30"
                                }`}
                            />
                        ))}
                    </div>
                </div>

                <p className="text-sm text-foreground/80 leading-relaxed italic border-l-2 pl-4 border-muted">
                    "{review.Content}"
                </p>
            </CardContent>
        </Card>
    );
}
