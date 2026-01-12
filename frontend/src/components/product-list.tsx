import { Card } from "@/components/ui/card";
import { ImageOff } from "lucide-react";
import { type Product } from "@/types";
import { Link } from "react-router-dom";

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
    const formattedPrice = new Intl.NumberFormat("pl-PL", {
        style: "currency",
        currency: "PLN",
    }).format(product.UnitPrice);

    return (
        <Link to={`/products/${product.ProductID}`}>
            <Card className="group flex flex-row items-center p-4 gap-4 hover:bg-accent/40 transition-colors cursor-pointer border-input">
                {/* 1. ZDJĘCIE - Bez zmian */}
                <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-md border bg-muted">
                    {product.PhotoPath ? (
                        <img
                            src={`/src/assets${product.PhotoPath}`}
                            alt={product.Name}
                            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                            onError={(e) => {
                                e.currentTarget.style.display = "none";
                                e.currentTarget.nextElementSibling?.classList.remove(
                                    "hidden"
                                );
                            }}
                        />
                    ) : null}

                    <div
                        className={`absolute inset-0 flex items-center justify-center text-muted-foreground ${
                            product.PhotoPath ? "hidden" : ""
                        }`}
                    >
                        <ImageOff className="h-8 w-8 opacity-50" />
                    </div>
                </div>

                {/* 2. NOWY WRAPPER: Grupuje Nazwę i Cenę */}
                <div className="flex flex-1 flex-col items-end justify-center sm:flex-row sm:justify-between sm:items-center gap-1 sm:gap-4 overflow-hidden">
                    {/* SEKJA NAZWY I OPISU */}
                    <div className="flex flex-col gap-1">
                        <h3 className="font-semibold text-lg truncate text-foreground">
                            {product.Name}
                        </h3>
                        <p className="hidden sm:line-clamp-2 text-sm text-muted-foreground leading-relaxed">
                            {product.Description}
                        </p>
                    </div>

                    {/* SEKCJA CENY */}
                    <div className="flex flex-col items-end sm:items-end justify-center shrink-0">
                        <span className="text-xl sm:text-2xl font-bold text-primary whitespace-nowrap">
                            {formattedPrice}
                        </span>

                        {product.UnitsInStock > 0 ? (
                            <span className="text-xs text-green-500 font-medium hidden sm:inline-block">
                                Dostępny ({product.UnitsInStock} szt.)
                            </span>
                        ) : (
                            <span className="text-xs text-red-500 font-medium">
                                Niedostępny
                            </span>
                        )}
                    </div>
                </div>
            </Card>
        </Link>
    );
}
