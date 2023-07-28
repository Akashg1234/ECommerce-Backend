import { Schema,model } from "./dbUtils.js";
import validator from "validator";
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import {randomBytes,createHash} from 'crypto'
import { env } from "../index.js";
import { log } from "console";


// User schema 
const userSchema = new Schema({
    name:{
        type:String,
        required:[true,'Please enter your name'],
        trim:true
    },
    
    avatar:{
        public_id:{
            type:'String',
            required:true,
            default:"public_id"
        },
        url:{
            type:'String',
            required:true,
            default:"url"
        }
    },
    
    password:{
        type:String,
        required:[true,'Please enter your password'],
        minLength:[8,"Password should be atleast 8 charecter long"],
        select:false
    },
    
    // Array of contact schema
    contact:{
        phonenumber:{
            type:Number,
            required:[true,"Please enter your phone number"],
        },
        email:{
            type:String,
            unique:true,
            required:[true,'Please enter your email'],
            validate:validator.isEmail
        },
        // address schema referencing to the address field
        address:{
            city:{
                type:String,
                required:[true,'Please enter city name'],
            },
            state:{
                type:String,
                required:[true,'Please enter state name'],
            },
            pincode:{
                type:Number,
                required:[true,'Please enter pincode'],
            }
        }
    },
    wishlist:[{type:Schema.Types.ObjectId,ref:'Product'}],
    role:{
        type:'String',
        enum:['admin','user'],
        default:'user'
    },
    blocked:{
        type:Boolean,
        default:false
    },
    
    
    cart:[{type:Schema.Types.ObjectId,ref:'Product'}],
    ResetPasswordToken:String,
    ResetPasswordExpire:Date

},{timestamps:true})

// Hash the password before save it to the database
userSchema.pre('save', async function(next){
    if(!this.isModified('password')){
        next()
    }
    this.password = await bcrypt.hash(this.password,15)
    next()
})

// Get password reset token
userSchema.methods.getResetPasswordToken = async function(){

    let resetToken = randomBytes(200).toString('hex')

    this.ResetPasswordToken = createHash('sha512').update(resetToken).digest('hex')

    this.ResetPasswordExpire = Date.now()+ 1800000 // 30 min

    return resetToken
}

// get json web token for 
userSchema.methods.getJwtToken = function(){
    return jwt.sign({jwt_id:this._id}, env.JWT_SECRET_KEY,{expiresIn:'15d'})
}

// compare the given password with the hashed password comes along with the document
userSchema.methods.comparePassword = async function (givenPassword) {
    return await bcrypt.compare(givenPassword,this.password)
}

export const userModel = new model('User',userSchema)