// src/pages/Home.tsx
import { AuthService, ProductsService } from "@/services";
import { type Product, type User, type ProductSearchParams } from "@/types";
import { useState, useEffect } from "react";
import SearchBar from "@/components/search-bar";
import { ProductList } from "@/components/product-list";

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
                className="w-[90%] ml-[5%] mr-[5%] md:w-[60%] md:ml-[20%] md:mr-[20%] mb-4"
            />
            <div className="w-[90%] ml-[5%] mr-[5%] md:w-[80%] md:ml-[10%] md:mr-[10%] mb-4">
                <ProductList products={data} />
            </div>
        </>
    );
};
