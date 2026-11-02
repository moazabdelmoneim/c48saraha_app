import { v2 as cloudinary } from "cloudinary";
import { cloud_name,api_key,api_secret } from "../../config.js";

cloudinary.config({
	cloud_name,
	api_key,
	api_secret , // Click 'View API Keys' above to copy your API secret
});


export default cloudinary
