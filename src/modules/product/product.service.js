import { productModel } from "../../DB/models/product.model.js";
import { userModel } from "../../DB/models/user.model.js";

export const createProduct = async (data) => {
	try {
		const { createdBy } = data;
		if (!(await userModel.findById(createdBy))) {
			throw new Error("this user not found", { cause: 404 });
		}
		const prod = await productModel.create(data);
		return prod;
	} catch (error) {
		throw new Error(error);
	}
};

export const getProducts = async (page, limit) => {
	try {
		let skip = 0; // 3 3
		skip = (page - 1) * limit;
		const products = await productModel
			.find()
			.populate("createdBy", "firstName email lastName")
			.skip(skip)
			.limit(limit);

		return { products, page, limit };
	} catch (error) {
		throw new Error(error);
	}
};

export const updateProducts = async (id, data) => {
	// find user
	// find product and upate
	const uProduct = await productModel.findByIdAndDelete(id);
	return uProduct;
};
