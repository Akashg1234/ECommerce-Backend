import handleAsync from "async-error-handler";
import { categoryModel } from "../DB/categoryModel.js";
import { validateMongoDbId } from "../Utils/validateMongoDbId.js";

export const createCategory = handleAsync(async(req,res,next)=>{

    try {
        const category = await categoryModel.create(req.body)

        res.status(201).json({
            success:true,
            category
        })
    } catch (error) {
        next(error)
    }
},(err,req,res,next)=>{next(err)})

// Create sub category of a category
export const createSubCategory = handleAsync(async(req,res,next)=>{

    try {
        const {id} = req.params
        validateMongoDbId(id)
        const {subcategory} = req.body
        const category = await categoryModel.findByIdAndUpdate(id,{
            $push:{
                subCategorySection:{
                    $each:subcategory
                }
            }
        },{new:true})

        res.status(201).json({
            success:true,
            category
        })
    } catch (error) {
        next(error)
    }
},(err,req,res,next)=>{next(err)})

// Create sub category of a category
export const updateCategory = handleAsync(async(req,res,next)=>{

    try {
        const {id} = req.params
        validateMongoDbId(id)
        const {categoryName} = req.body
        const category = await categoryModel.findByIdAndUpdate(id,{
            category:categoryName
        },{new:true})

        res.status(200).json({
            success:true,
            message:"Category Updated Successfully",
            category
        })
    } catch (error) {
        next(error)
    }
},(err,req,res,next)=>{next(err)})

// Delete Category
export const deleteCategory = handleAsync(async(req,res,next)=>{

    try {
        const {id} = req.params
        validateMongoDbId(id)
        const category = await categoryModel.findByIdAndDelete(id)

        res.status(200).json({
            success:true,
            message:"Category Deleted Successfully",
            category
        })
    } catch (error) {
        next(error)
    }
},(err,req,res,next)=>{next(err)})

// get a category of a category
export const getACategory = handleAsync(async(req,res,next)=>{

    try {
        const {id} = req.params
        validateMongoDbId(id)
        
        const category = await categoryModel.findById(id)

        res.status(200).json({
            success:true,
            category
        })
    } catch (error) {
        next(error)
    }
},(err,req,res,next)=>{next(err)})

// upload a category of a category
export const getACategory = handleAsync(async(req,res,next)=>{

    try {
        const {id} = req.params
        validateMongoDbId(id)
        
        const category = await categoryModel.findById(id)

        res.status(200).json({
            success:true,
            category
        })
    } catch (error) {
        next(error)
    }
},(err,req,res,next)=>{next(err)})