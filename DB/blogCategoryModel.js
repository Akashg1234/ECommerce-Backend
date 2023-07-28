import { Schema, model } from "./dbUtils.js";

const blogCategorySchema = new Schema({
    
    category:{
        type:String,
        unique:true,
        required:true,
        index:true
    },
    
},{timestamps:true})

export const blogCategoryModel = new model('BlogCategory',blogCategorySchema)