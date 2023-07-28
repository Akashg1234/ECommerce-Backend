import handleAsync from "async-error-handler"
import jwt from 'jsonwebtoken'
import { env } from "../index.js"
import { userModel } from "../DB/userModel.js"
import { errorThrow } from "../Utils/errorHandler.js"

export const isAuthenticated= handleAsync(async(req,res,next)=>{
    // get the jwt token from the cookie  
    const {login_token} = req.cookies
    if(!login_token){
        errorThrow(`Please log in to access this resource`,403,"Permission denied")
        
    }
    else{
        let decodedData = null
        try {
            decodedData = jwt.verify(login_token,env.JWT_SECRET_KEY)
            req.user= await userModel.findById(decodedData.jwt_id)
            next()
        } catch (error) {
            next(error);
        }
    }

    
},(err,req,res,next)=>{
    next(err);
})


export const isAuthorized=(...roles)=>{

    return (req,res,next)=>{
        // if the user role not include in role array
        if(!roles.includes(req.user.role)){
            errorThrow(`This resource is not authorized for ${req.user.role}s`,403,"Permission denied")
        }
        next()
    }
    
}