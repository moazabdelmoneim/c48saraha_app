import jwt from 'jsonwebtoken'
import { TOKEN_SIGNATURE } from '../../config.js'


export const generateToken = ({
	payload ={},
	signature = TOKEN_SIGNATURE,
	options ={}
}={})=>{
	return jwt.sign(payload,signature,options)
}

export const decoded = ({
	token ="",
	signature = TOKEN_SIGNATURE,

}={})=>{
	return jwt.verify(token,signature)
}