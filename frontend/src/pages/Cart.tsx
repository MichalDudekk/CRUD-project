// src/pages/Cart.tsx
import { type User, type CreateOrderPayload, type Product } from "@/types";
import { type SetStateAction, type Dispatch, useState, useEffect } from "react";
import { ProductsService } from "@/services";

const Cart = ({
    user,
    refreshUser,
    cart,
    setCard,
}: {
    user: User | null;
    refreshUser: () => Promise<void>;
    cart: CreateOrderPayload;
    setCart: Dispatch<SetStateAction<CreateOrderPayload>>;
}) => {
    const [data, setData] = useState<
        { Product: Product; Quantity: number }[] | null
    >(null);

    useEffect(() => {
        const refresh = async () => {
            const promises = cart.OrderDetails.map(
                async ({ ProductID, Quantity }) => {
                    const res = await ProductsService.getById(ProductID);
                    return { Product: res, Quantity: Quantity };
                }
            );

            const results = await Promise.all(promises);
            setData(results);
        };
        refresh();
    }, [cart]);

    return <>Cart</>;
};

export { Cart };
