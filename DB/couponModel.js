import { Schema, model } from "./dbUtils.js";

const couponSchema = new Schema({
    name:{
        type:String,
        uppercase:true,
        unique:true,
        required:true
    },
    expireOn:{
        type:Date,
        default:new Date(Date.now() + 7*24*60*60*1000)
    },
    discount:{
        type:Number,
        default:0,
        required:true
    },
})

export const couponModel = new model('Coupon',couponSchema)