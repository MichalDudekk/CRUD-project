// src/pages/Home.tsx
import { AuthService, ProductsService } from "@/services";
import { type Product, type User, type ProductSearchParams } from "@/types";
import { useState, useEffect } from "react";
import SearchBar from "@/components/search-bar";

export const Home = ({
    user,
    refreshUser,
}: {
    user: User | null;
    refreshUser: () => Promise<void>;
}) => {
    const [data, setData] = useState<Product[] | null>(null);
    const [searchPhase, setSearchPhase] = useState("");
    const [categoryID, setCategoryID] = useState<number | null>(null);

    useEffect(() => {
        const fetch = async () => {
            const search: ProductSearchParams = { SearchPhase: searchPhase };
            if (categoryID !== null) search.CategoryID = String(categoryID);

            const newData = await ProductsService.search(search);
            setData(newData);
            console.log(newData);
        };
        fetch();
    }, [searchPhase, categoryID]);

    const onSearch = (query: string, category: number | null) => {
        setCategoryID(category);
        setSearchPhase(query);
    };

    if (data === null) return null;

    return (
        <>
            <SearchBar
                type="text"
                placeholder="Search..."
                onSearch={onSearch}
            />
        </>
    );
};
