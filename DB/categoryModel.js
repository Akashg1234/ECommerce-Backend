import { Schema, model } from "./dbUtils.js";

const categorySchema = new Schema({
    
    category:{
        type:String,
        unique:true,
        required:true,
        index:true
    },
    subCategorySection:[
        {
            type:String,
            unique:true,
            required:true,
            index:true
    }
    ]
    
},{timestamps:true})

export const categoryModel = new model('Category',categorySchema)