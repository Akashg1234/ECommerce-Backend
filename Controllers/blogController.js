import { blogModel } from "../DB/blogModel.js";
import handleAsync from "async-error-handler";
import { fileUploadToCloudinary } from "../Middlewares/uploadImage.js";
import { validateMongoDbId } from "../Utils/validateMongoDbId.js";
import { errorThrow } from "../Utils/errorHandler.js";

export const createBlog = handleAsync(async(req,res,next)=>{
    try {
        const {headline,category,author,description} = req.body

        let imgData=null

        let blog = await blogModel.create({
            headline:headline,
            category:category,
            author:author,
            description:description,
        })

        if(req.file){
            const myCloud = await fileUploadToCloudinary(req.file.path)
            imgData = {
                public_id:myCloud.public_id,
                url:myCloud.secure_url
            }
            blog.image=imgData

            await blog.save()
        }

        res.status(201).json({
            success:true,
            message:"Blog Created Successfully",
            blog
        })
    } catch (error) {
        next(error)
    }
},(err,req,res,next)=>{
    next(err)
})
import { userModel } from "../DB/userModel.js";
// update Blog Image
export const updateBlog = handleAsync(async(req,res,next)=>{
    try {
        const {id} = req.params
        validateMongoDbId(id)

        const {headline,category,author,description} = req.body

        let blog = await blogModel.findById(id)

        if(!blog){
            errorThrow("Blog not found",404,"Missing document")
        }

        blog.headline=headline,
        blog.category=category,
        blog.author=author,
        blog.description=description,
                // image:imgData

        await blog.save()

        res.status(200).json({
            success:true,
            message:"Blog Updated Successfully",
            blog
        })
    } catch (error) {
        next(error)
    }
},(err,req,res,next)=>{
    next(err)
})


// get Blog
export const getBlog = handleAsync(async(req,res,next)=>{
    try {
        const {id} = req.params
        validateMongoDbId(id)

        const blog = await blogModel.findById(id).populate('likes').populate('disLikes')

        if(!blog){
            errorThrow("Blog not found",404,"Missing document")
        }

        await blogModel.findByIdAndUpdate(id,{
            $inc:{num_of_views:1}
        })

        res.status(200).json({
            success:true,
            blog
        })
    } catch (error) {
        next(error)
    }
},(err,req,res,next)=>{
    next(err)
})

// get all blog
export const getAllBlog = handleAsync(async(req,res,next)=>{
    try {
        
        const blog = await blogModel.find()
        
        res.status(200).json({
            success:true,
            blog
        })
    } catch (error) {
        next(error)
    }
},(err,req,res,next)=>{
    next(err)
})
// delete Blog 
export const deleteBlog = handleAsync(async(req,res,next)=>{
    try {
        const {id} = req.params
        validateMongoDbId(id)

        const blog = await blogModel.findById(id)

        if(!blog){
            errorThrow("Blog not found",404,"Missing document")
        }

        await blog.deleteOne()

        res.status(200).json({
            success:true,
            message:"Blog Deleted Successfully",
        })
    } catch (error) {
        next(error)
    }
},(err,req,res,next)=>{
    next(err)
})

// like a blog
export const likeBlog = handleAsync(async(req,res,next)=>{

    
    try {
        const {id} = req.params
        validateMongoDbId(id)
        const userId = req.user._id
        const checkBlog = await blogModel.findById(id)

        const isLiked = checkBlog.isLiked
        
        // find if the user liked it
        const isUserDisLiked = checkBlog.likes.find((user_id)=>{
            return user_id.toString()===userId.toString()
        })

        
        const operationData = isUserDisLiked ? {
            $pull:{disLikes:userId},
            $push:{likes:userId},
            isDisLiked:false,
            isLiked:true
        } :( isLiked ? {
            $pull:{likes:userId},
            isLiked:false
            } 
            : {
            $push:{likes:userId},
            isLiked:true
        })
        
        const blog = await blogModel.findByIdAndUpdate(id,operationData,{new:true})

        res.status(200).json({
            success:true,
            blog
        })
    } catch (error) {
        next(error)
    }
},(err,req,res,next)=>{
    next(err)
})


// dislike a blog
export const disLikeBlog = handleAsync(async(req,res,next)=>{

    
    try {
        const {id} = req.params
        validateMongoDbId(id)
        const userId = req.user._id
        const checkBlog = await blogModel.findById(id)

        const isDisLiked = checkBlog.isDisLiked
        
        // find if the user disliked it
        const isUserLiked = checkBlog.disLikes.find((user_id)=>{
            return user_id.toString()===userId.toString()
        })

        
        const operationData = isUserLiked ? {
            $pull:{likes:userId},
            $push:{disLikes:userId},
            isDisLiked:true,
            isLiked:false
        } :( isDisLiked ? {
            $pull:{disLikes:userId},
            isLiked:false
            } 
            : {
            $push:{disLikes:userId},
            isLiked:true
        })
        
        const blog = await blogModel.findByIdAndUpdate(id,operationData,{new:true})

        res.status(200).json({
            success:true,
            blog
        })
    } catch (error) {
        next(error)
    }
},(err,req,res,next)=>{
    next(err)
})


// Upload Blog image
export const uploadBlogImages = handleAsync(async(req,res,next)=>{

    try {
        const {id} = req.params
        validateMongoDbId(id)

        let blog = await blogModel.findById(id)

        if(!blog){
            errorThrow("Blog not found",404,"Missing error")
        }

        for(let file of req.files['blogImages']){
            
            let result = await fileUploadToCloudinary(file.path)

            console.log(result);

            let fileObject ={public_id:result.public_id,url:result.secure_url}
            
            blog.showcaseImages.push(fileObject)
        }

        await blog.save()

        res.status(200).json({
            success:true,
            message:"Blog images uploaded successfully",
            blog
        })
    } catch (error) {
        next(error)
    }
},(err,req,res,next)=>{
    next(err);
})


// Upload Blog image
export const uploadBlogTitleImage = handleAsync(async(req,res,next)=>{

    try {
        const {id} = req.params
        validateMongoDbId(id)

        let blog = await blogModel.findById(id)
        
        if(!blog){
            errorThrow("Blog not found",404,"Missing document")
        }

        const file =req.files['blogTitleImage'][0]
            
        const result = await fileUploadToCloudinary(file.path)

        blog.image.public_id=result.public_id
        blog.image.url=result.secure_url
        
        await blog.save()

        res.status(200).json({
            success:true,
            message:"Blog title image uploaded successfully",
            blog
        })
    } catch (error) {
        next(error)
    }
},(err,req,res,next)=>{
    next(err);
})
