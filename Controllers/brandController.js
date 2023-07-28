import handleAsync from "async-error-handler";
import { validateMongoDbId } from "../Utils/validateMongoDbId.js";
import { brandModel } from "../DB/brandModel.js";
import { fileDeleteFromCloudinary, fileUploadToCloudinary } from "../Middlewares/uploadImage.js";
import { errorThrow } from "../Utils/errorHandler.js";

// Create Brand 
export const createBrand = handleAsync(async(req,res,next)=>{

    try {
        const brand = await brandModel.create(req.body)

        res.status(201).json({
            success:true,
            brand
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
        const brand = await brandModel.findByIdAndUpdate(id,{
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

        let brand = await brandModel.findById(id)

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
export const updateBrand = handleAsync(async(req,res,next)=>{

    try {
        const {id} = req.params
        validateMongoDbId(id)
        const {brandName} = req.body
        const brand = await brandModel.findByIdAndUpdate(id,{
            brand_name:brandName
        },{new:true})

        res.status(200).json({
            success:true,
            message:"Brand name Updated Successfully",
            brand
        })
    } catch (error) {
        next(error)
    }
},(err,req,res,next)=>{next(err)})

// Delete Category
export const deleteBrand = handleAsync(async(req,res,next)=>{

    try {
        const {id} = req.params
        validateMongoDbId(id)
        const brand = await brandModel.findByIdAndDelete(id)

        res.status(200).json({
            success:true,
            message:"Brand Deleted Successfully",
            brand
        })
    } catch (error) {
        next(error)
    }
},(err,req,res,next)=>{next(err)})

// get a category of a category
export const getABrand = handleAsync(async(req,res,next)=>{

    try {
        const {id} = req.params
        validateMongoDbId(id)
        
        const brand = await brandModel.findById(id)

        res.status(200).json({
            success:true,
            brand
        })
    } catch (error) {
        next(error)
    }
},(err,req,res,next)=>{next(err)})

// get a category of a category
export const getAllBrand = handleAsync(async(req,res,next)=>{

    try {
        const {id} = req.params
        validateMongoDbId(id)
        
        const allBrand = await brandModel.find()

        res.status(200).json({
            success:true,
            allBrand
        })
    } catch (error) {
        next(error)
    }
},(err,req,res,next)=>{next(err)})