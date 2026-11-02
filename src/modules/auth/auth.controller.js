import { Router } from "express";
import { signup, login, google, facebook } from "./auth.service.js";
import { validation } from "../../middleware/validation.middleware.js";
import { signupSchema } from "./auth.validation.js";
import {
	multer_cloud,
	multer_upload,
} from "../../middleware/multer.middleware.js";
import cloudinary from "../../common/utils/cloudinary.js";
import { authentication } from "../../middleware/auth.middleware.js";
const router = Router();

// /auth/signup
router.post(
	"/signup",
	multer_cloud({type:'image'}).single('img'),
	validation(signupSchema),
	async (req, res, next) => {
		try {
			// const data = { ...req.body };
			// console.log(req.body);
			const data = {...req.body}
			console.log(data);
			
			const result = await signup(data, req.file, next);
			return res.status(201).json(result);
		} catch (error) {
			throw new Error(error);
		}
	},
);

router.post("/login", async (req, res, next) => {
	try {
		const result = await login(req.body);
		const { message, accessToken } = result;
		return res
			.status(200)
			.cookie("accessToken", accessToken, {
				httpOnly: true,
				sameSite: "strict",
				maxAge: 1000 * 60 * 60,
			})
			.json(message);
	} catch (error) {
		next(error);
	}
});

// /auth/google ===> true

router.post("/google", async (req, res, next) => {
	try {
		const result = await google(req.body);
		const { message, accessToken, status } = result;
		return res
			.status(status)
			.cookie("accessToken", accessToken, {
				httpOnly: true,
				sameSite: "strict",
				maxAge: 1000 * 60 * 60,
			})
			.json(message);
	} catch (error) {
		next(error);
	}
});

router.post("/facebook", async (req, res, next) => {
	try {
		// console.log(req.body);

		const result = await facebook(req.body);
		const { message, access_Token, status } = result;
		return res
			.status(status)
			.cookie("accessToken", access_Token, {
				httpOnly: true,
				sameSite: "strict",
				maxAge: 1000 * 60 * 60,
			})
			.json(message);
	} catch (error) {
		next(error);
	}
});

// router.post( // /auth/test
// 	"/test",
// 	multer_upload({customPath:"coverPics"}).single('img'),
// 	(req, res, next) => {
// 		// http://localhost:3000/uploads/fjdsal/dlsajl
// 		//base url
// 		// const baseUrl = `${req.protocol}://${req.host}/`;
// 		// const fullPath = baseUrl + req.file.path;
// 		// req.file.fullPath = fullPath;

// 		// http.  localhost:3000

// 		console.log(req.protocol);
// 		console.log(req.host);
		

// 		const baseUrl = `${req.protocol}://${req.host}/`
// 		console.log(baseUrl);
// 		const fullPath = baseUrl+req.file.path
// 		req.file.fullPath =fullPath
// 		return res.json({
// 			message: "done",
// 			file: req.file,
// 		});
// 	},
// );

// router.post("/array", multer_upload().array("imgs", 3), (req, res, next) => {
// 	// http://localhost:3000/uploads/fjdsal/dlsajl
// 	//base url
// 	const baseUrl = `${req.protocol}://${req.host}/`;

// 	console.log(req.files);
// 	const result = req.files.map((file) => {
// 		const fullPath = baseUrl + file.path;
// 		return {
// 			...file,
// 			fullPath,
// 		};
// 	});
// 	return res.json({
// 		message: "done",
// 		file: result,
// 	});
// });

// router.post(
// 	"/fields",
// 	multer_upload().fields([
// 		{ name: "imgs", maxCount: 1 },
// 		{ name: "attach", maxCount: 1 },
// 		{ name: "cv", maxCount: 3 },
// 	]),
// 	(req, res, next) => {
// 		return res.json({
// 			message: "done",
// 			file: req.files,
// 		});
// 	},
// );

// router.post(
// 	"/testCloud",
// 	multer_upload({ type: "image" }).single("img"),
// 	async (req, res, next) => {
// 		// http://localhost:3000/uploads/fjdsal/dlsajl
// 		//base url
// 		const result = await cloudinary.uploader.upload(req.file.path, {
// 			folder: "/sara7a",
// 		});
// 		return res.json({
// 			message: "done",
// 			file: result,
// 		});
// 	},
// );









// router.post( // /auth/test
// 	"/cloud",
// 	authentication,
// 	multer_cloud({type:"image"}).single('img'),
// 	async (req, res, next) => {

// 		const {public_id,secure_url} = await cloudinary.uploader.upload(req.file.path,{
// 			public_id:"moaz",
// 			folder:`/wedc48/${req.user._id}/profilePics`
// 		})
// 		return res.json({
// 			message: "done",
// 			file: {public_id,secure_url},
// 		});
// 	},
// );
export default router;
