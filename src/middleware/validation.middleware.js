
import Joi from "joi";

export const generalFields = {
	firstName: Joi.string().min(3).max(100).required(),
	lastName: Joi.string().min(3).max(100).required(),
	email: Joi.string()
		.email({ maxDomainSegments: 3, tlds: { allow: ["com"] } })
		.required(),
	age: Joi.number().min(18),
	password: Joi.string().pattern( /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*]).{8,}$/).required(),
}



export const validation = (schema) => {
	return (req, res, next) => {

		// console.log(req.body);
		
		let data = {...req.body}


		
		if (!data) {
			return res.status(400).json({ message: "input is empty" });
		}
		const {error , value}= schema.validate(data)
		console.log(value
		);
		
		const errorFormat = error?.details.map(err =>{
			return {
				message: err.message,
				path : err.path
			}
		})
		if(error){
			return res.status(400).json(errorFormat)
		}
		req.body= value
		next()
	};
};
