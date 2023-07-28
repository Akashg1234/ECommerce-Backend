import { Schema, model } from "./dbUtils.js";

const cartSchema = new Schema({
    products:[
        {
            product:{
                type:Schema.Types.ObjectId,
                ref:'Product'
            },
            count:Number,
            color:String,
            price:Number
        }
    ],
    cartTotal:Number,
    totalAfterDiscount:Number,
    orderby:{
        type:Schema.Types.ObjectId,
        ref:'User'
    }
},{timestamps:true})
export const cartModel = new model('Cart',cartSchema)