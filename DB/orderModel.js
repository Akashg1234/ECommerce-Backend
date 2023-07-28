import { Schema, model } from "./dbUtils.js";

const orderSchema = new Schema({
    products:[
        {
            product:{
                type:Schema.Types.ObjectId,
                ref:'Product'
            },
            count:Number,
            color:String
        }
    ],
    paymentIntent:{},
    orderStatus:{
        type:String,
        default:"Not processed",
        enum:["Not processed","Cash on delivery","Processing","Dispatched","Cancelled","Delivered"]
    },
    orderby:{
        type:Schema.Types.ObjectId,
        ref:'User'
    },
},{timestamps:true})

export const orderModel = new model('Order',orderSchema)