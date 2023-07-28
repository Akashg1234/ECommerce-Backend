import handleAsync from "async-error-handler"
import { enqModel } from "../DB/enqueryModel.js"

export const createEnq = handleAsync(async(req,res,next)=>{

    try {
        const enq = await enqModel.create(req.body)

        res.status(201).json({
            success:true,
            enq
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
        const category = await enqModel.findByIdAndUpdate(id,{
            category:categoryName
        },{new:true})

        res.status(200).json({
            success:true,
            message:"Enquiry Updated Successfully",
            category
        })
    } catch (error) {
        next(error)
    }
},(err,req,res,next)=>{next(err)})

// Delete Category
export const deleteEnq = handleAsync(async(req,res,next)=>{

    try {
        const {id} = req.params
        validateMongoDbId(id)
        const enq = await enqModel.findByIdAndDelete(id)

        res.status(200).json({
            success:true,
            message:"Enquiry Deleted Successfully",
            enq
        })
    } catch (error) {
        next(error)
    }
},(err,req,res,next)=>{next(err)})

// get a category of a category
export const getAEnq = handleAsync(async(req,res,next)=>{

    try {
        const {id} = req.params
        validateMongoDbId(id)
        
        const enq = await createEnq.findById(id)

        res.status(200).json({
            success:true,
            enq
        })
    } catch (error) {
        next(error)
    }
},(err,req,res,next)=>{next(err)})

// get a category of a category
export const getAllEnq = handleAsync(async(req,res,next)=>{

    try {
        
        const enq = await createEnq.findById()

        res.status(200).json({
            success:true,
            enq
        })
    } catch (error) {
        next(error)
    }
},(err,req,res,next)=>{next(err)})