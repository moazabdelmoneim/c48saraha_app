import { Router } from "express";
import {
	createProduct,
	getProducts,
	updateProducts,
	
} from "./product.service.js";
import { authentication } from "../../middleware/auth.middleware.js";

const router = Router();

router.post("/create", authentication, async (req, res, next) => {
	try {
		const payload = {
			...req.body,
			createdBy: req.body.createdBy || req.user?._id,
		};
		const result = await createProduct(payload);
		return res.status(201).json({
			success: true,
			message: "Product created successfully",
			result,
		});
	} catch (error) {
		return next(error);
	}
});

router.get("/all", async (req, res, next) => {
	try {
		const page = Number(req.query.page) || 1;
		const limit = Number(req.query.limit) || 6;
		const result = await getProducts(page, limit);
		return res.status(200).json({
			success: true,
			message: "All products fetched successfully",
			result,
		});
	} catch (error) {
		return next(error);
	}
});

router.patch("/update/:id", authentication, async (req, res, next) => {
	try {
		const result = await updateProducts(req.params.id, req.body);
		return res.status(200).json({
			success: true,
			message: "Product updated successfully",
			result,
		});
	} catch (error) {
		return next(error);
	}
});



export default router;
