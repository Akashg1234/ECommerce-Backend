import handleAsync from "async-error-handler";
import { blogCategoryModel } from "../DB/blogCategoryModel.js";

export const createBlogCategory = handleAsync(async(req,res,next)=>{
    try {
        const category = await blogCategoryModel.create(req.body)

        res.status(201).json({
            success:true,
            category
        })
    } catch (error) {
        next(error)
    }
},(err,req,res,next)=>{
    next(err)
})

export const updateBlogCategory = handleAsync(async(req,res,next)=>{

    try {
        const {id} = req.params
        validateMongoDbId(id)
        const {categoryName} = req.body
        const category = await blogCategoryModel.findByIdAndUpdate(id,{
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
export const deleteBlogCategory = handleAsync(async(req,res,next)=>{

    try {
        const {id} = req.params
        validateMongoDbId(id)

        const category = await blogCategoryModel.findByIdAndDelete(id)

        res.status(200).json({
            success:true,
            message:"Category Deleted Successfully",
            deletedCategory:category
        })
    } catch (error) {
        next(error)
    }
},(err,req,res,next)=>{next(err)})

// get a category of the blogs
export const getABlogCategory = handleAsync(async(req,res,next)=>{

    try {
        const {id} = req.params
        validateMongoDbId(id)
        const category = await blogCategoryModel.findById(id)

        res.status(200).json({
            success:true,
            category
        })
    } catch (error) {
        next(error)
    }
},(err,req,res,next)=>{next(err)})