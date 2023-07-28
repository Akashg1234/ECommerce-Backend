import handleAsync from "async-error-handler";
import { couponModel } from "../DB/couponModel.js";
import { validateMongoDbId } from "../Utils/validateMongoDbId.js";

export const createCoupon = handleAsync(async(req,res,next)=>{
    try {
        
        const {name,expireOn,discount}=req.body

        const createdCoupon = await couponModel.create({
            name:name,expireOn:new Date(Date.now() + expireOn*24*60*60*1000),discount:discount
        })

        res.status(201).json({
            success:true,
            message:"Coupon Created",
            createdCoupon
        })
    } catch (error) {
        next(error)
    }
},(err,req,res,next)=>{next(err)
})

// get all coupon
export const getAllCoupon = handleAsync(async(req,res,next)=>{
    try {
        const allCoupon = await couponModel.find()

        res.status(200).json({
            success:true,
            allCoupon
        })
    } catch (error) {
        next(error)
    }
},(err,req,res,next)=>{next(err)
})


// update a coupon
export const updateCoupon = handleAsync(async(req,res,next)=>{
    try {
        const {id} = req.params
        validateMongoDbId(id)
        const {name,expireOn,discount} = req.body

        const updatedCoupon = await couponModel.findByIdAndUpdate(id,{
            name:name,expireOn:new Date(Date.now() + expireOn*24*60*60*1000),discount:discount
        },{new:true})

        res.status(200).json({
            success:true,
            updatedCoupon
        })
    } catch (error) {
        next(error)
    }
},(err,req,res,next)=>{next(err)})

//delete a coupon
export const deleteCoupon = handleAsync(async(req,res,next)=>{
    try {
        const {id} = req.params
        validateMongoDbId(id)
        
        const deletedCoupon = await couponModel.findByIdAndDelete(id)

        res.status(200).json({
            success:true,
            deletedCoupon
        })
    } catch (error) {
        next(error)
    }
},(err,req,res,next)=>{next(err)})

