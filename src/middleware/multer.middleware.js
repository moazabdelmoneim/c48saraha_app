import multer from "multer";
import fs from "fs"

// export const multer_upload =({destination,type}={destination:"profilePic",type:"image"})=>{
// 	const storage= multer.diskStorage({
// 		destination:(req,file,cb)=>{
// 			const path = `uploads/users/${destination}`
// 			if (!fs.existsSync(path)) {
// 				fs.mkdirSync(path,{recursive:true})
// 			}
// 			cb(null,path)
// 		},
// 		filename:(req,file,cb)=>{
// 			cb(null,Date.now()+file.originalname)
// 		}
// 	})
// 	const fileFilter=(req,file,cb)=>{
// 		const fileType =file.mimetype.split("/")[0]// ['image','jpeg']
// 		if (fileType==type){
// 			cb(null,true)
// 		}else{
// 			cb('invalid Type',null)
// 		}
// 	}
// 	return multer({storage,fileFilter})
// }


export const multer_upload = ({customPath}={customPath:"profilePics"})=>{

	const storage = multer.diskStorage({
		destination:(req,file,cb)=>{
			const path=`uploads/users/${customPath}`
			if (!fs.existsSync(path)) {
				fs.mkdirSync(path,{recursive:true})
			}
			cb(null,path)
		},
		filename:(req,file,cb)=>{
			cb(null,Date.now()+file.originalname)
		}
	})




	return multer({storage})
}








// export const multer_cloud =({type}={type:"image"})=>{
	
// 	const storage= multer.diskStorage({})


// 	const fileFilter=(req,file,cb)=>{
// 		const fileType =file.mimetype.split("/")[0]// ['image','jpeg']
// 		if (fileType==type){
// 			cb(null,true)
// 		}else{
// 			cb('invalid Type',null)
// 		}
// 	}
// 	return multer({storage,fileFilter})
// }


export const multer_cloud= ({type}={type:"image"})=>{

	const storage = multer.diskStorage({
		filename:(req,file,cb)=>{
			cb(null,Date.now()+file.originalname)
		}
	})
	// mimetype ====> image/jpg ====> [image,jpg]===> [0]
	const fileFilter = (req,file,cb)=>{

		const fileType = file.mimetype.split("/")[0]
		console.log(fileType);
		
		if(fileType==type){
			cb(null,true)
		}else{
			cb('invalid Type',null)
		}
	}




	return multer({storage,fileFilter})
}

