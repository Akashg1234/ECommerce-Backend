import { Schema, model } from "./dbUtils.js";

const colorSchema = new Schema({
    
    color_name:{
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

export const colorModel = new model('Color',colorSchema)