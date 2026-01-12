import { Card } from "@/components/ui/card";
import { ImageOff } from "lucide-react"; // Ikona dla braku zdjęcia
import { type Product } from "@/types";

interface ProductListProps {
    products: Product[];
}

export function ProductList({ products }: ProductListProps) {
    if (products.length === 0) {
        return (
            <div className="text-center py-12 text-muted-foreground border rounded-md border-dashed">
                Nie znaleziono produktów spełniających kryteria.
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-4 w-full">
            {products.map((product) => (
                <ProductItem key={product.ProductID} product={product} />
            ))}
        </div>
    );
}

function ProductItem({ product }: { product: Product }) {
    // Formatowanie ceny (zakładam PLN, możesz zmienić na USD/EUR)
    const formattedPrice = new Intl.NumberFormat("pl-PL", {
        style: "currency",
        currency: "PLN",
    }).format(product.UnitPrice);

    return (
        <Card className="group flex flex-row items-center p-4 gap-4 hover:bg-accent/40 transition-colors cursor-pointer border-input">
            {/* 1. ZDJĘCIE (100x100px) */}
            <div className="relative h-25 w-25 shrink-0 overflow-hidden rounded-md border bg-muted">
                {product.PhotoPath ? (
                    <img
                        src={`/src/assets${product.PhotoPath}`}
                        alt={product.Name}
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                        onError={(e) => {
                            // Fallback jeśli link do zdjęcia jest uszkodzony
                            e.currentTarget.style.display = "none";
                            e.currentTarget.nextElementSibling?.classList.remove(
                                "hidden"
                            );
                        }}
                    />
                ) : null}

                {/* Placeholder widoczny gdy brak PhotoPath lub błąd ładowania */}
                <div
                    className={`absolute inset-0 flex items-center justify-center text-muted-foreground ${
                        product.PhotoPath ? "hidden" : ""
                    }`}
                >
                    <ImageOff className="h-8 w-8 opacity-50" />
                </div>
            </div>

            {/* 2. TREŚĆ (Nazwa + Opis) */}
            <div className="flex flex-1 flex-col justify-center overflow-hidden gap-1">
                <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-lg truncate text-foreground pr-2">
                        {product.Name}
                    </h3>
                </div>

                <p className="hidden sm:line-clamp-2 text-sm text-muted-foreground leading-relaxed">
                    {product.Description}
                </p>
            </div>

            {/* 3. CENA (Duża, po prawej) */}
            <div className="flex flex-col items-end justify-center pl-2 shrink-0">
                <span className="text-xl sm:text-2xl font-bold text-primary whitespace-nowrap">
                    {formattedPrice}
                </span>
                {/* Opcjonalny status dostępności */}
                {product.UnitsInStock > 0 ? (
                    <span className="text-xs text-green-600 font-medium hidden sm:inline-block">
                        Dostępny ({product.UnitsInStock} szt.)
                    </span>
                ) : (
                    <span className="text-xs text-destructive font-medium">
                        Niedostępny
                    </span>
                )}
            </div>
        </Card>
    );
}
