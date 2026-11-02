import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
	name:{
		type:String,
		required:true,
		minLength:2,// 'moaz'
		maxLength:40,
		trim:true
	},
	description:{
		type:String,
		required:[true,'desc is required'],
		minLength:2,// 'moaz'
		maxLength:40,
		trim:true
	},
	
	price:{
		type:Number,
		required:true,
	},
	createdBy:{
		type:mongoose.Schema.Types.ObjectId,
		ref:"User",
		required:true
	}
},{
	timestamps:true,
	toJSON:{
		virtuals:true
	}
})

export const productModel = mongoose.models.product|| mongoose.model("Product",productSchema)