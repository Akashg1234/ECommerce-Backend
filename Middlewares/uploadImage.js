import multer from "multer";
import sharp from "sharp";
import path from 'path'
import { cloud } from "../index.js";
import { errorThrow } from "../Utils/errorHandler.js";

const multerStorage = multer.diskStorage({})

const multerFileFilter = (req,file,cb)=>{
    // 645f591db7c518db70a8d3dd
    if(file.fieldname==='brandImage' ||file.fieldname==='blogTitleImage' ||file.fieldname==='productImages' || file.fieldname==='profilePicture'|| file.fieldname==='blogImages'){
        if(file.mimetype==='image/jpeg' || file.mimetype==='image/png')
            cb(null,true)
        else 
            cb(new Error("Unsupported file format"),false)
    }
    else{
        cb(new Error("Field does not exist"),false);
    }
}

export const productImageResize = async(req,res,next)=>{
    // check if files not exist then move forward
    if(!req.files) next()

    await Promise.all(
        req.files.map(
            async(file)=>{
                await sharp(file.path).resize(300,300).toFormat('jpeg').jpeg({quality:90}).toFile(`/Downloads/${file.filename}`)
            }
        )
    )
    next()
}

export const blogImageResize = async(req,res,next)=>{
    // check if files not exist then move forward
    if(!req.files) next()

    await Promise.all(
        req.files.map(
            async(file)=>{
                await sharp(file.path).resize(300,300).toFormat('jpeg').jpeg({quality:90}).toFile(`/Downloads/${file.filename}`)
            }
        )
    )
    next()
}

export const uploadPhoto = multer({
    storage:multerStorage,
    fileFilter:multerFileFilter,
    limits:{fieldSize:1500000000}
}).fields([
    {name:'profilePicture',maxCount:1},
    {name:'productImages',maxCount:15},
    {name:'blogImages',maxCount:15},
    {name:'blogTitleImage',maxCount:1},
    {name:'brandImage',maxCount:1},
])

export const fileUploadToCloudinary = async(localFilePath)=>{

    const myCloud= await cloud.uploader.upload(localFilePath,{resource_type:'auto'})
    return myCloud
}

export const fileDeleteFromCloudinary = async(assetPublicId)=>{

    await cloud.uploader.destroy(assetPublicId,{resource_type:'auto'})
}