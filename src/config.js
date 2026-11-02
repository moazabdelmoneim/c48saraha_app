import { CONNREFUSED } from "dns";
import { config } from "dotenv";
import path from "path"

config({path:path.resolve('./.env')})


export const PORT= process.env.PORT

export const DB_URI = process.env.DB_URI

export const TOKEN_SIGNATURE = process.env.TOKEN_SIGNATURE

export const WEB_CLIENT_ID = process.env.WEB_CLIENT_ID

// export const cloud_name = process.env.CLOUD_NAME

// export const api_key= process.env.API_KEY

// export const api_secret = process.env.API_SECRET

export const cloud_name = process.env.CLOUD_NAME

export const api_key = process.env.API_KEY

export const api_secret = process.env.API_SECRET