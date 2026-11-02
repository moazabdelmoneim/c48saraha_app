import jwt from "jsonwebtoken"
import { userModel } from "../DB/models/user.model.js";
import { TOKEN_SIGNATURE } from "../config.js";

export const authentication = async (req, res, next) => {
	const { accessToken } = req.cookies;
	if (!accessToken) {
		throw new Error("the accessToken is required");
	}
	const decoded = jwt.verify(accessToken, TOKEN_SIGNATURE);
	if (!decoded) {
		throw new Error("invalid credintials");
	}
	// console.log(decoded);
	const user = await userModel.findById(decoded.id);

	req.user = user
	next()
};
