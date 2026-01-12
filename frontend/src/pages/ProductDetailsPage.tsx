// src/pages/ProductDetailsPage.tsx
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ProductsService } from "../services/products"; // Twój serwis
import type { Product, User } from "../types"; // Twój interfejs

export const ProductDetailsPage = ({
    user,
    refreshUser,
}: {
    user: User | null;
    refreshUser: () => Promise<void>;
}) => {
    // 1. Pobieramy parametr z URL. Nazwa 'productId' musi być taka sama jak w Route w App.tsx!
    const { productId } = useParams<{ productId: string }>();

    const navigate = useNavigate();
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchProduct = async () => {
            // Zabezpieczenie: jeśli ktoś wejdzie na /products/ bez ID (choć router by to inaczej obsłużył)
            if (!productId) return;

            try {
                setLoading(true);
                // Konwertujemy string z URL na number (bo Twoje API pewnie chce number)
                const data = await ProductsService.getById(Number(productId));
                setProduct(data);
            } catch (err) {
                console.error(err);
                setError("Nie znaleziono produktu lub błąd serwera.");
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [productId]); // useEffect odpali się ponownie, jeśli zmieni się ID w URL

    // --- RENDEROWANIE STANÓW ---

    if (loading)
        return (
            <div className="p-10 text-center text-white">
                Ładowanie danych...
            </div>
        );

    if (error || !product)
        return (
            <div className="p-10 text-center text-red-500">
                <h2 className="text-2xl font-bold">Błąd</h2>
                <p>{error}</p>
                <button
                    onClick={() => navigate("/products")}
                    className="mt-4 underline"
                >
                    Wróć do listy
                </button>
            </div>
        );

    // --- RENDEROWANIE PRODUKTU (Szablon) ---

    return (
        <div className="container mx-auto p-6 text-white">
            <button
                onClick={() => navigate(-1)}
                className="mb-4 text-gray-400 hover:text-white transition"
            >
                &larr; Wróć
            </button>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-gray-800 p-8 rounded-xl shadow-lg">
                {/* Lewa kolumna: Zdjęcie */}
                <div className="flex items-center justify-center bg-gray-700 rounded-lg h-96">
                    {/* Tutaj normalnie byłby <img>, daję placeholder jeśli path jest pusty */}
                    {product.PhotoPath ? (
                        <img
                            src={product.PhotoPath}
                            alt={product.Name}
                            className="max-h-full max-w-full object-contain"
                        />
                    ) : (
                        <span className="text-gray-500">Brak zdjęcia</span>
                    )}
                </div>

                {/* Prawa kolumna: Dane */}
                <div className="flex flex-col justify-between">
                    <div>
                        <h1 className="text-4xl font-bold mb-2 text-blue-400">
                            {product.Name}
                        </h1>
                        <p className="text-sm text-gray-400 mb-6">
                            ID: {product.ProductID} | Kategoria:{" "}
                            {product.CategoryID}
                        </p>

                        <div className="text-3xl font-bold text-green-400 mb-6">
                            {product.UnitPrice} PLN
                        </div>

                        <div className="mb-6">
                            <h3 className="text-lg font-semibold border-b border-gray-600 mb-2">
                                Opis
                            </h3>
                            <p className="text-gray-300 leading-relaxed">
                                {product.Description}
                            </p>
                        </div>

                        <div className="mb-6">
                            <h3 className="text-lg font-semibold border-b border-gray-600 mb-2">
                                Funkcjonalność
                            </h3>
                            <p className="text-gray-300">
                                {product.Functionality}
                            </p>
                        </div>
                    </div>

                    <div className="mt-6">
                        {product.UnitsInStock > 0 ? (
                            <button className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 px-6 rounded-lg transition">
                                Dodaj do koszyka
                            </button>
                        ) : (
                            <div className="w-full bg-red-900/50 text-red-200 py-3 px-6 rounded-lg text-center border border-red-800">
                                Produkt niedostępny
                            </div>
                        )}
                        {product.Discontinued && (
                            <p className="mt-2 text-center text-yellow-500 text-sm">
                                Produkt wycofany ze sprzedaży
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
