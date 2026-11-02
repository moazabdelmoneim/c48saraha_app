import Joi from "joi"
import { generalFields } from "../../middleware/validation.middleware.js"

const passwordRegx = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*]).{8,}$/

export const signupSchema = Joi.object({
	firstName:generalFields.firstName.required(),
	lastName: generalFields.lastName.required(),
	email: generalFields.email.required(),
	age: Joi.number().min(18),
	password: Joi.string().pattern(passwordRegx).required(),
})