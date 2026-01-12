import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ProductsService } from "../services/products";
import type { Product, Review, User, CreateOrderPayload } from "../types";
import { type SetStateAction, type Dispatch } from "react";
import {
    ShoppingCart,
    Star,
    ArrowLeft,
    Truck,
    CheckCircle2,
    XCircle,
    Minus,
    Plus,
    Loader2,
    Send,
    Pencil,
    Trash2,
    X,
    Save,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

export const ProductDetailsPage = ({
    user,
    refreshUser,
    setCart,
}: {
    user: User | null;
    refreshUser: () => Promise<void>;
    setCart: Dispatch<SetStateAction<CreateOrderPayload>>;
}) => {
    const { productId } = useParams<{ productId: string }>();
    const navigate = useNavigate();

    const [product, setProduct] = useState<Product | null>(null);
    const [categoryName, setCategoryName] = useState<string>("");
    const [reviews, setReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);

    const [isWritingReview, setIsWritingReview] = useState(false);

    const fetchData = async () => {
        if (!productId) return;
        try {
            const id = Number(productId);

            if (product) {
                const reviewsData = await ProductsService.getReviews(id);
                setReviews(reviewsData);
                return;
            }

            setLoading(true);
            const productData = await ProductsService.getById(id);
            setProduct(productData);

            const [reviewsData, categoryData] = await Promise.all([
                ProductsService.getReviews(id),
                ProductsService.getCategoryById(productData.CategoryID),
            ]);

            setReviews(reviewsData);
            setCategoryName(categoryData.CategoryName);
        } catch (err) {
            console.error("Błąd:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
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

        setCart((prev) => {
            const details: {
                ProductID: number;
                Quantity: number;
            }[] = [];

            let isUnique = true;

            for (const detail of prev.OrderDetails) {
                if (detail.ProductID === product.ProductID) {
                    detail.Quantity += quantity;
                    detail.Quantity = Math.min(
                        detail.Quantity,
                        product.UnitsInStock
                    );
                    isUnique = false;
                }
                details.push(detail);
            }

            if (isUnique)
                details.push({
                    ProductID: product.ProductID,
                    Quantity: quantity,
                });

            // const details = prev.OrderDetails.concat([
            //     { ProductID: product.ProductID, Quantity: quantity },
            // ]);
            const newCart: CreateOrderPayload = { OrderDetails: details };
            return newCart;
        });
    };

    const handleReviewAdded = () => {
        setIsWritingReview(false);
        fetchData();
    };

    const handleDeleteReview = async (reviewId: number) => {
        if (!confirm("Czy na pewno chcesz usunąć tę opinię?")) return;
        try {
            await ProductsService.deleteReviewById(reviewId);
            toast.success("Usunięto opinie");
            fetchData();
        } catch (error) {
            console.error("Nie udało się usunąć opinii", error);
            toast.error("Coś poszło nie tak");
            refreshUser();
        }
    };

    const handleUpdateReview = async (
        reviewId: number,
        content: string,
        rating: number
    ) => {
        try {
            await ProductsService.updateReview({
                ReviewID: reviewId,
                Content: content,
                Rating: rating,
            });
            toast.success("Zaktualizowano opinie");
            fetchData();
        } catch (error) {
            console.error("Nie udało się zaktualizować opinii", error);
            toast.error("Nie udało się zaktualizować opinii");
            refreshUser();
        }
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
                {/* --- SEKCJA ZDJĘCIA --- */}
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

                {/* --- SEKCJA DANYCH --- */}
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

            {/* --- SEKCJA OPINII --- */}
            <div className="mt-16">
                <div className="flex items-center justify-between mb-8">
                    <h2 className="text-3xl font-bold">Opinie klientów</h2>
                    {user && !isWritingReview && (
                        <Button onClick={() => setIsWritingReview(true)}>
                            Dodaj nową opinię
                        </Button>
                    )}
                </div>

                {isWritingReview && (
                    <div className="mb-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <ReviewForm
                            productId={product.ProductID}
                            onCancel={() => setIsWritingReview(false)}
                            onSuccess={handleReviewAdded}
                            refreshUser={refreshUser}
                        />
                    </div>
                )}

                {reviews.length === 0 && !isWritingReview ? (
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
                            {user ? (
                                <Button
                                    variant="outline"
                                    className="mt-6 cursor-pointer"
                                    onClick={() => setIsWritingReview(true)}
                                >
                                    Napisz pierwszą opinię
                                </Button>
                            ) : (
                                <p className="text-sm text-muted-foreground mt-4 italic">
                                    Zaloguj się, aby dodać opinię.
                                </p>
                            )}
                        </CardContent>
                    </Card>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {reviews.map((review) => (
                            <ReviewItem
                                key={review.ReviewID}
                                review={review}
                                user={user}
                                onDelete={handleDeleteReview}
                                onUpdate={handleUpdateReview}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

// --- KOMPONENT FORMULARZA (DODAWANIE) ---
function ReviewForm({
    productId,
    onCancel,
    onSuccess,
    refreshUser,
}: {
    productId: number;
    onCancel: () => void;
    onSuccess: () => void;
    refreshUser: () => Promise<void>;
}) {
    const [rating, setRating] = useState(5);
    const [content, setContent] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async () => {
        if (!content.trim()) return;

        setIsSubmitting(true);
        try {
            await ProductsService.createReview({
                ProductID: productId,
                Rating: rating,
                Content: content,
                Status: "Shown",
            });
            toast.success("Dodano opinie");
            onSuccess();
        } catch (error) {
            console.error("Błąd dodawania opinii:", error);
            toast.error("Coś poszło nie tak");
            refreshUser();
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Card className="h-full border-primary/50 shadow-md relative overflow-hidden">
            {isSubmitting && (
                <div className="absolute top-0 left-0 w-full h-1 bg-primary animate-pulse" />
            )}

            <CardContent className="p-6 flex flex-col h-full gap-4">
                <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm">
                            Ty
                        </div>
                        <div>
                            <span className="font-semibold text-sm block">
                                Twoja opinia
                            </span>
                            <span className="text-xs text-muted-foreground">
                                Podziel się wrażeniami
                            </span>
                        </div>
                    </div>

                    <div className="flex bg-yellow-500/10 px-2 py-1 rounded-full cursor-pointer hover:bg-yellow-500/20 transition-colors">
                        {Array.from({ length: 5 }).map((_, i) => {
                            const starValue = i + 1;
                            return (
                                <Star
                                    key={i}
                                    onClick={() => setRating(starValue)}
                                    className={`w-5 h-5 cursor-pointer transition-all hover:scale-110 ${
                                        starValue <= rating
                                            ? "fill-yellow-500 text-yellow-500"
                                            : "text-muted-foreground/30 hover:text-yellow-500/50"
                                    }`}
                                />
                            );
                        })}
                    </div>
                </div>

                <div className="flex-1 relative">
                    <Textarea
                        placeholder="Napisz co myślisz o tym produkcie..."
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        className="min-h-25 text-sm resize-none border-l-2 border-l-primary/50 pl-4 border-t-0 border-r-0 border-b-0 rounded-none focus-visible:ring-0 px-4 bg-transparent italic"
                    />
                </div>

                <div className="flex justify-end gap-2 mt-2">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={onCancel}
                        disabled={isSubmitting}
                    >
                        Anuluj
                    </Button>
                    <Button
                        size="sm"
                        onClick={handleSubmit}
                        disabled={isSubmitting || !content.trim()}
                    >
                        {isSubmitting ? (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                            <Send className="mr-2 h-3 w-3" />
                        )}
                        Dodaj opinię
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}

// --- KOMPONENT POJEDYNCZEJ OPINII (WYŚWIETLANIE / EDYCJA / USUWANIE) ---
function ReviewItem({
    review,
    user,
    onDelete,
    onUpdate,
}: {
    review: Review;
    user: User | null;
    onDelete: (id: number) => void;
    onUpdate: (id: number, content: string, rating: number) => Promise<void>;
}) {
    // Stan edycji
    const [isEditing, setIsEditing] = useState(false);
    const [editContent, setEditContent] = useState(review.Content);
    const [editRating, setEditRating] = useState(review.Rating);
    const [isSaving, setIsSaving] = useState(false);

    // Uprawnienia
    const isAuthor = user?.UserID === review.UserID;
    const isAdmin = user?.IsAdmin;
    const canDelete = isAdmin || isAuthor;
    const canEdit = isAuthor;

    const handleSave = async () => {
        setIsSaving(true);
        await onUpdate(review.ReviewID, editContent, editRating);
        setIsSaving(false);
        setIsEditing(false);
    };

    const handleCancel = () => {
        setIsEditing(false);
        setEditContent(review.Content);
        setEditRating(review.Rating);
    };

    // --- TRYB EDYCJI ---
    if (isEditing) {
        return (
            <Card className="h-full border-primary/50 shadow-md relative overflow-hidden animate-in fade-in duration-300">
                <CardContent className="p-6 flex flex-col h-full gap-4">
                    <div className="flex justify-between items-start">
                        <div className="flex items-center gap-3">
                            <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
                                {review.UserID < 1000 ? review.UserID : "..."}
                            </div>
                            <div>
                                <span className="font-semibold text-sm block">
                                    Edycja opinii
                                </span>
                            </div>
                        </div>

                        {/* Gwiazdki do edycji */}
                        <div className="flex bg-yellow-500/10 px-2 py-1 rounded-full cursor-pointer hover:bg-yellow-500/20 transition-colors">
                            {Array.from({ length: 5 }).map((_, i) => (
                                <Star
                                    key={i}
                                    onClick={() => setEditRating(i + 1)}
                                    className={`w-4 h-4 cursor-pointer transition-all ${
                                        i + 1 <= editRating
                                            ? "fill-yellow-500 text-yellow-500"
                                            : "text-muted-foreground/30 hover:text-yellow-500/50"
                                    }`}
                                />
                            ))}
                        </div>
                    </div>

                    <div className="flex-1">
                        <Textarea
                            value={editContent}
                            onChange={(e) => setEditContent(e.target.value)}
                            className="min-h-25 text-sm resize-none border-l-2 border-l-primary/50 pl-4 border-t-0 border-r-0 border-b-0 rounded-none focus-visible:ring-0 px-4 bg-transparent italic"
                        />
                    </div>

                    <div className="flex justify-end gap-2 mt-2">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleCancel}
                            disabled={isSaving}
                        >
                            <X className="mr-2 h-3 w-3" /> Anuluj
                        </Button>
                        <Button
                            size="sm"
                            onClick={handleSave}
                            disabled={isSaving || !editContent.trim()}
                        >
                            {isSaving ? (
                                <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                            ) : (
                                <Save className="mr-2 h-3 w-3" />
                            )}
                            Zapisz
                        </Button>
                    </div>
                </CardContent>
            </Card>
        );
    }

    // --- TRYB PODGLĄDU ---
    return (
        <Card className="h-full hover:shadow-sm transition-shadow group relative">
            {/* Akcje w prawym górnym rogu */}
            <div className="absolute top-4 right-4 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                {canEdit && (
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-primary"
                        onClick={() => setIsEditing(true)}
                        title="Edytuj opinię"
                    >
                        <Pencil className="h-4 w-4" />
                    </Button>
                )}
                {canDelete && (
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-destructive"
                        onClick={() => onDelete(review.ReviewID)}
                        title="Usuń opinię"
                    >
                        <Trash2 className="h-4 w-4" />
                    </Button>
                )}
            </div>

            <CardContent className="p-6 flex flex-col h-full">
                <div className="flex justify-between items-start mb-4 pr-16">
                    {" "}
                    <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
                            {review.UserID < 1000 ? review.UserID : "..."}
                        </div>
                        <div>
                            <span className="font-semibold text-sm block">
                                {isAuthor
                                    ? "Ty"
                                    : `Użytkownik #${review.UserID}`}
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
                    {/* Gwiazdki (tylko odczyt) */}
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
