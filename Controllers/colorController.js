import handleAsync from "async-error-handler";
import { validateMongoDbId } from "../Utils/validateMongoDbId.js";
import { colorModel } from "../DB/colorModel.js";
import { fileDeleteFromCloudinary, fileUploadToCloudinary } from "../Middlewares/uploadImage.js";
import { errorThrow } from "../Utils/errorHandler.js";

// Create Brand 
export const createColor = handleAsync(async(req,res,next)=>{

    try {
        const color = await colorModel.create(req.body)

        res.status(201).json({
            success:true,
            message:"Color created successfully",
            color
        })
    } catch (error) {
        next(error)
    }
},(err,req,res,next)=>{next(err)})

// Add brand image
export const addBrandImage = handleAsync(async(req,res,next)=>{

    try {
        const {id} = req.params
        validateMongoDbId(id)

        const myCloud = await fileUploadToCloudinary(req.files['brandImage'][0].path)
        const brand = await colorModel.findByIdAndUpdate(id,{
            brandImage:{
                public_id:myCloud.public_id,
                url:myCloud.secure_url
            }
        },{new:true})

        res.status(200).json({
            success:true,
            brand
        })
    } catch (error) {
        next(error)
    }
},(err,req,res,next)=>{next(err)})



// Update Brand Image
export const updateBrandImage = handleAsync(async(req,res,next)=>{

    try {
        const {id} = req.params
        validateMongoDbId(id)

        let brand = await colorModel.findById(id)

        if(!brand){errorThrow("Brand not exist",404,"Missing Document")}

        await fileDeleteFromCloudinary(brand.brandImage.public_id)

        const myCloud = await fileUploadToCloudinary(req.files['brandImage'][0].path)
        
        brand.brandImage.public_id=myCloud.public_id
        brand.brandImage.url=myCloud.secure_url
        
        await brand.save()

        res.status(200).json({
            success:true,
            brand
        })
    } catch (error) {
        next(error)
    }
},(err,req,res,next)=>{next(err)})

// Update Brand Name
export const updateColor = handleAsync(async(req,res,next)=>{

    try {
        const {id} = req.params
        validateMongoDbId(id)
        const {colorName} = req.body
        const color = await colorModel.findByIdAndUpdate(id,{
            color_name:colorName
        },{new:true})

        res.status(200).json({
            success:true,
            message:"Color Updated Successfully",
            color
        })
    } catch (error) {
        next(error)
    }
},(err,req,res,next)=>{next(err)})

// Delete Category
export const deleteColor = handleAsync(async(req,res,next)=>{

    try {
        const {id} = req.params
        validateMongoDbId(id)
        const color = await colorModel.findByIdAndDelete(id)

        res.status(200).json({
            success:true,
            message:"Color Deleted Successfully",
            color
        })
    } catch (error) {
        next(error)
    }
},(err,req,res,next)=>{next(err)})

// get a color
export const getAColor = handleAsync(async(req,res,next)=>{

    try {
        const {id} = req.params
        validateMongoDbId(id)
        
        const color = await colorModel.findById(id)

        res.status(200).json({
            success:true,
            color
        })
    } catch (error) {
        next(error)
    }
},(err,req,res,next)=>{next(err)})

// get all color
export const getAllColor = handleAsync(async(req,res,next)=>{

    try {
        const {id} = req.params
        validateMongoDbId(id)
        
        const allColor = await colorModel.find()

        res.status(200).json({
            success:true,
            allColor
        })
    } catch (error) {
        next(error)
    }
},(err,req,res,next)=>{next(err)})