import { userModel } from "../../DB/models/user.model.js";
import jwt from "jsonwebtoken";
import { TOKEN_SIGNATURE } from "../../config.js";
// import { generateToken } from "../../common/security/token.js";
import { OAuth2Client } from "google-auth-library";
import { WEB_CLIENT_ID } from "../../config.js";
import axios from "axios";
import cloudinary from "../../common/utils/cloudinary.js";
const client = new OAuth2Client();

async function verify(idToken) {
	const ticket = await client.verifyIdToken({
		idToken: idToken,
		audience: WEB_CLIENT_ID,
	});
	const payload = ticket.getPayload();
	return payload;
}

/**
{
  iss: 'https://accounts.google.com',
  azp: '177839770166-ddtn322rk679kma0v4n7sneb1j4j3l5i.apps.googleusercontent.com',
  aud: '177839770166-ddtn322rk679kma0v4n7sneb1j4j3l5i.apps.googleusercontent.com',
  sub: '101325649884572445156',
  email: 'moazabdelmoneim315@gmail.com',
  email_verified: true,
  nbf: 1791826235,
  name: 'Moaz Abdelmoneim',
  picture: 'https://lh3.googleusercontent.com/a/ACg8ocKg3_V4Q8wQMk6NU-6JDR6xdI3E7jEpaCacTaFbTSr_VfePLg=s96-c',
  given_name: 'Moaz',
  family_name: 'Abdelmoneim',
  iat: 1791826535,
  exp: 1791830135,
  jti: 'aa97f62bdb0cc1425860e7d2ec9457984ef195dd'
}
 */

export const signup = async (data, profilePic,next) => {
	try {
		
		const { email } = data;
		const existUser = await userModel.findOne({ email });
		if (existUser) {
			throw new Error("user already exist", { cause: 409 });
		}
		const user = await userModel.create(data)
		if (!profilePic) {
			return user
		}
		const {public_id,secure_url} = await cloudinary.uploader.upload(profilePic.path,{
			folder:`/wedc48/${user._id}/profilePics`
		})

		user.profilePic={public_id,secure_url}
		await user.save()


		return user;
	} catch (error) {
		next(error);
	}
};

// login endpoint

export const login = async (data) => {
	try {
		// console.log(data);

		const { email, password } = data;

		// check email exists or not ==== > not exist ====> signup ===> login
		const existUser = await userModel.findOne({ email }); // user.password
		if (!existUser) {
			throw new Error("email or password are incorrect", { cause: 401 });
		}
		// check password == db password
		if (password != existUser.password) {
			throw new Error("email or password are incorrect", { cause: 401 });
		}
		//token

		const accessToken = jwt.sign(
			{ id: existUser._id, isMoaz: true },
			TOKEN_SIGNATURE,
			{
				expiresIn: "1h",
			},
		);
		// const accessToken = generateToken({id:existUser._id},TOKEN_SIGNATURE,{
		// 	expiresIn:"1h"
		// })
		return { message: "loggedIn successgully", accessToken };
	} catch (error) {
		throw new Error(error);
	}
};

// login with google

export const google = async (data) => {
	try {
		// console.log(data);

		const { credential } = data;
		if (!credential) {
			throw new Error("credential is required", { cause: 400 });
		}
		const payload = await verify(credential);
		if (!payload) {
			throw new Error("Invalid credential", { cause: 400 });
		}
		const { email, given_name, family_name } = payload;
		const existUser = await userModel.findOne({ email });
		if (existUser) {
			if (existUser.provider !== "google") {
				throw new Error("User already exists with a different provider", {
					cause: 409,
				});
			}
			const accessToken = jwt.sign(
				{ id: existUser._id, isMoaz: true },
				TOKEN_SIGNATURE,
				{
					expiresIn: "1h",
				},
			);
			// const accessToken = generateToken({id:existUser._id},TOKEN_SIGNATURE,{
			// 	expiresIn:"1h"
			// })
			return { message: "loggedIn successgully", accessToken, status: 200 };
		}
		const newUser = await userModel.create({
			firstName: given_name,
			lastName: family_name,
			email,
			provider: "google",
		});
		const accessToken = jwt.sign(
			{ id: newUser._id, isMoaz: true },
			TOKEN_SIGNATURE,
			{
				expiresIn: "1h",
			},
		);
		// const accessToken = generateToken({id:existUser._id},TOKEN_SIGNATURE,{
		// 	expiresIn:"1h"
		// })
		return { message: "signed up successfully", accessToken, status: 201 };

		// // check email exists or not ==== > not exist ====> signup ===> login
		// const existUser = await userModel.findOne({ email }); // user.password
		// if (!existUser) {
		// 	throw new Error("email or password are incorrect", { cause: 401 });
		// }
		// // check password == db password
		// if (password != existUser.password ){
		// 	throw new Error("email or password are incorrect", { cause: 401 });
		// }
		// //token

		// const accessToken = jwt.sign({id:existUser._id ,isMoaz : true},TOKEN_SIGNATURE,{
		// 	expiresIn:'1h'
		// })
		// // const accessToken = generateToken({id:existUser._id},TOKEN_SIGNATURE,{
		// // 	expiresIn:"1h"
		// // })
		// return {message:'loggedIn successgully',accessToken}
	} catch (error) {
		throw new Error(error);
	}
};

export const facebook = async (inputs) => {
	try {
		// console.log(data);
		// console.log();

		const { accessToken } = inputs;
		if (!accessToken) {
			throw new Error("Access token is required", { cause: 400 });
		}
		console.log(accessToken);
		// axois.get(`https://graph.facebook.com/me?access_token=${accessToken}&fields=id,name,email`)
		const { data } = await axios.get(
			`https://graph.facebook.com/me?access_token=${accessToken}&fields=id,name,email`,
		);
		console.log(data);
		const [firstName, lastName] = data.name.split(" ");

		const existUser = await userModel.findOne({ email: data.email });
		if (existUser) {
			if (existUser.provider !== "facebook") {
				throw new Error("User already exists with a different provider", {
					cause: 409,
				});
			}
			const access_Token = jwt.sign(
				{ id: existUser._id, isMoaz: true },
				TOKEN_SIGNATURE,
				{
					expiresIn: "1h",
				},
			);
			// const accessToken = generateToken({id:existUser._id},TOKEN_SIGNATURE,{
			// 	expiresIn:"1h"
			// })
			return { message: "loggedIn successgully", access_Token, status: 200 };
		}
		const newUser = await userModel.create({
			firstName,
			lastName,
			email: data.email,
			provider: "facebook",
		});
		const access_Token = jwt.sign(
			{ id: newUser._id, isMoaz: true },
			TOKEN_SIGNATURE,
			{
				expiresIn: "1h",
			},
		);
		// const access_Token = generateToken({id:existUser._id},TOKEN_SIGNATURE,{
		// 	expiresIn:"1h"
		// })
		return { message: "signed up successfully", access_Token, status: 201 };

		// // check email exists or not ==== > not exist ====> signup ===> login
		// const existUser = await userModel.findOne({ email }); // user.password
		// if (!existUser) {
		// 	throw new Error("email or password are incorrect", { cause: 401 });
		// }
		// // check password == db password
		// if (password != existUser.password ){
		// 	throw new Error("email or password are incorrect", { cause: 401 });
		// }
		// //token

		// const accessToken = jwt.sign({id:existUser._id ,isMoaz : true},TOKEN_SIGNATURE,{
		// 	expiresIn:'1h'
		// })
		// // const accessToken = generateToken({id:existUser._id},TOKEN_SIGNATURE,{
		// // 	expiresIn:"1h"
		// // })
		// return {message:'loggedIn successgully',accessToken}
	} catch (error) {
		throw new Error(error);
	}
};
