import { Schema, model } from "./dbUtils.js";

const enqSchema = new Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    phone:{
        type:Number,
        required:true
    },
    comment:{
        type:String,
        required:true
    },
    status:{
        type:String,
        default:"Submited",
        enum:["Submited","In Progress","Contacted"]
    }
})

export const enqModel = new model('enquiry',enqSchema)