// routes/routesProducts.ts
import { Router, type Request, type Response } from "express";
import { Op, type WhereOptions } from "sequelize";
import authToken from "../middleware/authToken.js";
import { User, Review, Product, Category } from "../models/index.js";

const router = Router();

router.get("/products", async (req: Request, res: Response) => {
    const products = await Product.findAll();
    return res.status(200).json(products);
});

interface SearchQuery {
    SearchPhase?: string;
    CategoryID?: string;
}

router.get(
    "/products/search",
    async (req: Request<{}, {}, {}, SearchQuery>, res: Response) => {
        const { SearchPhase, CategoryID } = req.query;
        const whereClause: WhereOptions = {};

        if (SearchPhase) whereClause.Name = { [Op.like]: `%${SearchPhase}%` };

        if (CategoryID) whereClause.CategoryID = Number(CategoryID);

        console.log(whereClause);

        const products = await Product.findAll({
            where: whereClause,
        });

        res.status(200).json(products);
    }
);

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

router.get(
    "/products/categories/:CategoryID",
    async (req: Request, res: Response) => {
        const products = await Product.findAll({
            where: {
                CategoryID: req.params.CategoryID,
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

// Categories

router.get("/categories", async (req: Request, res: Response) => {
    const categories = await Category.findAll();
    return res.status(200).json(categories);
});

router.get("/categories/:CategoryID", async (req: Request, res: Response) => {
    const categorie = await Category.findByPk(req.params.CategoryID);

    if (!categorie)
        return res.status(404).json({ message: "Category not found" });

    res.status(200).json(categorie);
});

interface CreateCategoryBody {
    CategoryName: string;
    Description: string;
}

router.post(
    "/categories",
    authToken,
    async (req: Request<{}, {}, CreateCategoryBody>, res: Response) => {
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
            const { CategoryName, Description } = req.body;

            const category = await Category.findOne({
                where: { CategoryName: CategoryName },
            });
            if (category)
                return res
                    .status(400)
                    .json({ error: "Given Category already exist" });

            await Category.create({
                CategoryName,
                Description,
            });
        } catch (error) {
            console.log(error);
            return res.status(500).json({ error: "Server Error" });
        }

        res.status(201).json({
            message: `Succesfully created category ${req.body.CategoryName}`,
        });
    }
);

// Reviews

router.get(
    "/products/reviews/:ProductID",
    async (req: Request, res: Response) => {
        const reviews = await Review.findAll({
            where: { ProductID: req.params.ProductID },
        });
        return res.status(200).json(reviews);
    }
);

interface CreateReviewBody {
    ProductID: number;
    Rating: number;
    Content: string;
    Status: string;
}

router.post(
    "/products/reviews",
    authToken,
    async (req: Request<{}, {}, CreateReviewBody>, res: Response) => {
        const user = res.locals.user;

        if (!user) {
            console.log("user missing in locals");
            return res.status(500).json({ error: "Server Error" });
        }

        try {
            const { ProductID, Rating, Content, Status } = req.body;

            const product = await Product.findByPk(ProductID);
            if (!product)
                return res.status(404).json({ error: "Product not found" });

            await Review.create({
                ProductID,
                Rating: Number(Rating),
                Content,
                Status,
                UserID: user.UserID,
            });
        } catch (error) {
            console.log(error);
            return res.status(500).json({ error: "Server Error" });
        }

        res.status(201).json({
            message: `Succesfully created review`,
        });
    }
);

interface UpdateReviewBody {
    ReviewID: number;
    Rating: number;
    Content: string;
}

router.patch(
    "/products/reviews",
    authToken,
    async (req: Request<{}, {}, UpdateReviewBody>, res: Response) => {
        const user = res.locals.user;

        if (!user) {
            console.log("user missing in locals");
            return res.status(500).json({ error: "Server Error" });
        }

        try {
            const { Rating, Content, ReviewID } = req.body;

            const review = await Review.findByPk(ReviewID);

            if (!review) {
                return res.status(404).json({ error: "Review not found" });
            }

            if (review.UserID !== user.UserID) {
                return res
                    .status(403)
                    .json({ error: "Access denied: You are not the author" });
            }

            await review.update({
                Rating: Rating,
                Content: Content,
            });

            return res.status(200).json({
                message: "Successfully updated review",
            });
        } catch (error) {
            console.log(error);
            return res.status(500).json({ error: "Server Error" });
        }
    }
);

router.delete(
    "/products/reviews/:ReviewID",
    authToken,
    async (req: Request, res: Response) => {
        const user = res.locals.user;

        if (!user) {
            console.log("user missing in locals");
            return res.status(500).json({ error: "Server Error" });
        }

        try {
            const ReviewID = Number(req.params.ReviewID);
            const review = await Review.findByPk(ReviewID);

            if (!review) {
                return res.status(404).json({ error: "Review not found" });
            }

            if (!user.IsAdmin && review.UserID !== user.UserID) {
                console.log("you need to be admin or author");
                return res.status(403).json({ error: "Access denied" });
            }

            await review.destroy();

            return res.status(200).json({
                message: "Successfully deleted review",
            });
        } catch (error) {
            console.log(error);
            return res.status(500).json({ error: "Server Error" });
        }
    }
);

export default router;
