// routes/routesProducts.ts
import { Router, type Request, type Response } from "express";
import { Op } from "sequelize";
import authToken from "../middleware/authToken.js";
import { User, Review, Product, Category } from "../models/index.js";

const router = Router();

router.get("/products", async (req: Request, res: Response) => {
    const products = await Product.findAll();
    return res.status(200).json(products);
});

router.get("/products/:ProductID", async (req: Request, res: Response) => {
    const product = await Product.findByPk(req.params.ProductID);

    if (!product) return res.status(404).json({ message: "Product not found" });

    res.status(200).json(product);
});

router.get(
    "/products/search/:SearchPhase",
    async (req: Request, res: Response) => {
        const products = await Product.findAll({
            where: {
                Name: {
                    [Op.like]: `%${req.params.SearchPhase}%`,
                },
            },
        });

        res.status(200).json(products);
    }
);

interface ProductsByCategoryBody {
    CategoryID: number;
}

router.get(
    "/products",
    async (req: Request<{}, {}, ProductsByCategoryBody>, res: Response) => {
        const products = await Product.findAll({
            where: {
                CategoryID: req.body.CategoryID,
            },
        });

        res.status(200).json(products);
    }
);

router.patch(
    "/products/toggle-discontinued/:ProductID",
    authToken,
    async (req: Request, res: Response) => {
        const user = res.locals.user;

        if (!user) {
            console.log("user missing in locals");
            return res.status(500).json({ error: "Server Error" });
        }

        if (!user.IsAdmin) {
            console.log("you need to be admin");
            return res.status(403).json({ error: "Access denied" });
        }

        const target = await Product.findByPk(req.params.ProductID);

        if (!target)
            return res.status(404).json({ error: "Product not found" });

        await target.update({ Discontinued: !target.Discontinued });

        res.status(200).json({
            message: `Succesfully toggled ${target.Name} to Discontinued: ${target.Discontinued}`,
        });
    }
);

interface CreateProductBody {
    CategoryID: number;
    Name: string;
    UnitPrice: number;
    Description: string;
    Functionality: string;
    PhotoPath: string;
    UnitsInStock: number;
    Discontinued: boolean;
}

router.post(
    "/products",
    authToken,
    async (req: Request<{}, {}, CreateProductBody>, res: Response) => {
        const user = res.locals.user;

        if (!user) {
            console.log("user missing in locals");
            return res.status(500).json({ error: "Server Error" });
        }

        if (!user.IsAdmin) {
            console.log("you need to be admin");
            return res.status(403).json({ error: "Access denied" });
        }

        try {
            const {
                CategoryID,
                Name,
                UnitPrice,
                Description,
                Functionality,
                PhotoPath,
                UnitsInStock,
                Discontinued,
            } = req.body;

            const category = await Category.findByPk(CategoryID);
            if (!category)
                return res
                    .status(404)
                    .json({ error: "Given CategoryID not found" });

            await Product.create({
                CategoryID,
                Name,
                UnitPrice,
                Description,
                Functionality,
                PhotoPath,
                UnitsInStock,
                Discontinued,
            });
        } catch (error) {
            console.log(error);
            return res.status(500).json({ error: "Server Error" });
        }

        res.status(201).json({
            message: `Succesfully created product ${req.body.Name}`,
        });
    }
);

export default router;
