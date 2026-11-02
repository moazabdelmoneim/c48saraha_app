import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
	{
		firstName: {
			type: String,
			required: [true, "first name is required"],
			minLength: 2, // 'moaz'
			maxLength: 40,
			trim: true,
		},
		lastName: {
			type: String,
			required: [true, "last name is required"],
			minLength: 2, // 'moaz'
			maxLength: 40,
			trim: true,
		},
		email: {
			type: String,
			required: true,
			unique: true,
			lowercase: true,
			trim: true,
			validate: {
				validator: function (value) {
					return value.endsWith("@gmail.com");
				},
				message: "email must be a gmail address",
			},
		},
		provider: {
			type: String,
			enum: ["local", "google", "facebook"],
			default: "local",
		},
		password: {
			type: String,
			required: function () {
				return this.provider === "local"; // true false
			},
			minLength: 6,
		},
		age: {
			type: Number,
			min: 18,
		},
		profilePic:{
			public_id:String,
			secure_url:String
		},
		coverPic: [
			{
				public_id: String,
				secure_url: String,
			},
		],
	},
	{
		timestamps: true,
		toJSON: {
			virtuals: true,
		},
	},
);

userSchema.virtual("products", {
	ref: "Product",
	localField: "_id",
	foreignField: "createdBy",
});

// user { firstName , LastName}
//
//setter. ====> split fullName ==> f , l
//
// user full name
// userSchema.virtual("fullName").set(function (value) {
// 	// moaz moneim
// 	// ["moaz","moneim"]
// 	const [firstName,lastName]=value.split(" ")
// 	this.set({
// 		firstName,
// 		lastName
// 	})
// })

export const userModel =
	mongoose.models.User || mongoose.model("User", userSchema);
