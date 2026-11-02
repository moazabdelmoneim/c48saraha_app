import mongoose from "mongoose";
import { DB_URI } from "../config.js";

export const connectDB = async (app, port) => {
	try {
		await mongoose.connect(DB_URI);
		app.listen(port, () => {
			console.log("app is running on port "+port);
		});
		console.log("db connected succesfully");
	} catch (error) {
		console.log("failed to connect to the db ad the err is " + error);
	}
};
