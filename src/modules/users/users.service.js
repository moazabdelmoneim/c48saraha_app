// import { override } from "joi";
import cloudinary from "../../common/utils/cloudinary.js";
import { userModel } from "../../DB/models/user.model.js";
import jwt from "jsonwebtoken";
// import { TOKEN_SIGNATURE } from "../../config.js";

export const profile = async (inputs) => {
	return user;
};

export const findall = async () => {
	const users = await userModel
		.find({
			$and: [
				{
					salary: { $gt: 20000 },
				},
				{
					age: { $gt: 20 },
				},
			],
		})
		.toArray();

	return users;
};

// user id=12354 set age ==> 3
export const updateProfile = async (req) => {
	// const user = await userModel.deleteOne(
	// 	{
	// 		_id: new ObjectId(id),
	// 
	const user = await userModel.findById(req.user._id)
	await cloudinary.uploader.destroy(user.profilePic.public_id)
	user.profilePic = null
	await user.save()
	return user;
};

export const uploadPic = async (req) => {
	try {
		const user = await userModel.findById(req.user._id);
		console.log(user._id);

		console.log(user.profilePic.public_id);

		if (!user.profilePic) {
			const { public_id, secure_url } = await cloudinary.uploader.upload(
				req.file.path,
				{
					folder: `/wedc48/${user._id}/profilePics`,
				},
			);
			user.profilePic = { public_id, secure_url };
			await user.save();
			return {
				message: "profilePic uploaded success",
			};
		} else {
			const { public_id, secure_url } = await cloudinary.uploader.upload(
				req.file.path,
				{
					public_id: user.profilePic.public_id,
					overwrite: true,
				},
			);
			user.profilePic = { public_id, secure_url };
			await user.save();
			return {
				message: "profilePic updated success",
			};
		}
	} catch (error) {
		next(error);
	}
};
