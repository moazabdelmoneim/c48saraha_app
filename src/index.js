import express from "express"
import {authController} from './modules/auth/index.js'
import { productController } from "./modules/product/index.js"
import { errorHandler } from "./middleware/err.middleware.js"
import { PORT } from "./config.js"
import {connectDB} from './DB/connection.js'
import { userController } from "./modules/users/index.js"
import cookieParser from "cookie-parser"
import cors from "cors"
import { cloud_name,api_key,api_secret } from './config.js'
const app = express() 
const port =PORT
// console.log({ cloud_name,api_key,api_secret } );

await connectDB(app, port)
app.use(cookieParser())
// app.use(cors({
// 	origin:true,
// 	credentials:true,
// 	allowedHeaders:['Content-Type',"Authorization"]
// }))
// app.use('/uploads',express.static("uploads"))

// localhost:3000/uploads
app.use('/uploads',express.static("uploads"))
// localhost:3000/auth
app.use(express.json())

app.get("/",(req,res)=>{
	res.status(200).json({message:"server is running welcome to sara7a backend"})
})
app.use('/auth',authController)
app.use('/user',userController)
app.use('/product',productController)





// localhost:3000?
app.use(errorHandler)



export default app