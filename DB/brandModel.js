import { Schema, model } from "./dbUtils.js";

const brandSchema = new Schema({
    
    brand_name:{
        type:String,
        unique:true,
        required:true,
        index:true
    },
    brandImage:{
        public_id:{
            type:String,
            default:null
        },
        url:{
            type:String,
            default:null
        }
    }
    
},{timestamps:true})

export const brandModel = new model('Brand',brandSchema)