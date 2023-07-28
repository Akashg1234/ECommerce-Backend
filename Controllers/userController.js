import { cloud, env } from "../index.js";
import { errorThrow } from "../Utils/errorHandler.js";
import { userModel } from "../DB/userModel.js";
import { sendAllToken } from "../Utils/jsonWebTokenHandler.js";
import handleAsync from "async-error-handler";
import { validateMongoDbId } from "../Utils/validateMongoDbId.js";
import { fileUploadToCloudinary, productImageResize } from "../Middlewares/uploadImage.js";
import { sendMail } from "../Utils/mailHandler.js";
import {createHash} from 'crypto'
import { cartModel } from "../DB/cartModel.js";
import { orderModel } from "../DB/orderModel.js";
import uniqueId from "uniqueid";
import { productModel } from "../DB/productModel.js";


export const userCreate= handleAsync(async(req,res,next)=>{

    try {
        const {name,email,confirmPassword,phonenumber,city,state,pincode} = req.body

        console.log(req.body);
        let user = await userModel.findOne({'contact.email':email})
        
        if(user){
            errorThrow("User Allready Exist",409,"Missing document")

        }
        else{
            user = await userModel.create({
                name:name,
                password:confirmPassword,
                contact:{
                    phonenumber:phonenumber,
                    email:email,
                    address:{
                        city:city,
                        state:state,
                        pincode:pincode
                    }
                }
            })
        
        
            // allot the token to the new created user
            sendAllToken(user,"User added successfully",res,201)
        }
    } catch (error) {
        next(error)
    }

},(err,req,res,next)=>{
    next(err);
})

// login user handler 
export const loginUser = handleAsync(async(req,res,next)=>{

    try {
        const {email,password} = req.body


        const user = await userModel.findOne({'contact.email':email}).select('+password')

        if(!user){
            errorThrow("User not found",404,"Missing document")
            
        }
        
        if(user && (await user.comparePassword(password))){

            sendAllToken(user,"Login successful",res,200)
        }
        else{
            errorThrow("Invalid Credentials",401,"Log in error")
        }
    } catch (error) {
        next(error)
    }


},(err,req,res,next)=>{
    next(err);
})

// log out user handler
export const logoutUser = handleAsync(async(req,res,next)=>{
    // set 'login_token' to null and expire it now 


    res.clearCookie('login_token',null,{
        expires:new Date(Date.now()),
        httpOnly:true,
        secure:true
    }).status(200).json({
        success:true,
        message:"Log out user"
    })

},(err,req,res,next)=>{
    next(err);
})

// user details handlers
export const userDetails = handleAsync(async(req,res,next)=>{

    try {
        const user = await userModel.findById(req.user._id)

        if(!user){
            errorThrow("User not found",404,"Missing document")
            
        }

        res.status(200).json({
            success:true,
            user
        })
    } catch (error) {
        next(error)
    }

},(err,req,res,next)=>{
    next(err);
})

// delete User
export const deleteUser = handleAsync(async(req,res,next)=>{

    try {
        const {id} = req.params.id

        validateMongoDbId(id)

        const user = await userModel.findById(id)

        if(!user){
            errorThrow("User not found",404,"Missing document")
            
        }

        await user.deleteOne()

        res.status(200).json({
            success:true,
            user
        })
    } catch (error) {
        next(error)
    }

},(err,req,res,next)=>{
    next(err);
})

// update user password handler
export const updateUserPassword = handleAsync(async(req,res,next)=>{

    try {
        const {oldPassword,newPassword} = req.body

        let user = await userModel.findById(req.user._id).select('+password')

        if(!user){
            errorThrow("User not found",404,"Missing document")
            
        }

        const isMatched = await user.comparePassword(oldPassword)

        if(!isMatched){
            errorThrow("Password not matched",401,"Password Error")
        }

        user.password = newPassword

        await user.save()

        res.status(200).json({
            success:true,
            "message":"Password changed successfully"
        })
    } catch (error) {
        next(error)
    }

},(err,req,res,next)=>{
    next(err);
})

// update user contact details
export const updateUserContact = handleAsync(async(req,res,next)=>{

    try {
        const {name,phonenumber,email,city,state,pincode} = req.body

        const user = await userModel.findById(req.user._id)

        if(!user){
            errorThrow("User not found",404,"Missing document")
            
        }

        user.name = name
        user.contact.phonenumber = phonenumber
        user.contact.email = email
        user.contact.address.city = city
        user.contact.address.state = state
        user.contact.address.pincode = pincode

        await user.save()

        res.status(200).json({
            success:true,
            "message":"User contact updated successfully"
        })
    } catch (error) {
        next(error)
    }

},(err,req,res,next)=>{
    next(err);
})

// update user avatar
export const updateUserAvater = handleAsync(async(req,res,next)=>{

    try {
        const user = await userModel.findById(req.user._id)

        if(!user){
            errorThrow("User not found",404,"Missing document")
            
        }

        // destroy the asset stored in cloud with respect to the public_id
        await cloud.uploader.destroy(user.avatar.public_id)

        // extract picture from request
        const file = req.file.path

        // upload it using cloudinary local path
        const myCloud= await cloud.uploader.upload(file)

        user.avatar={
            public_id:myCloud.public_id,
            url:myCloud.url
        }

        await user.save()

        res.status(200).json({
            success:true,
            message:"Picture updated successfully"
        })
    } catch (error) {
        next(error)
    }

},(err,req,res,next)=>{
    next(err);
})

// upload user profile picture
export const uploadUserProfilePicture = handleAsync(async(req,res,next)=>{

    try {
        let user = await userModel.findById(req.user._id)

        if(!user){
            errorThrow("User not found",404,"Missing document")
            
        }
        
        const myCloud= await fileUploadToCloudinary(req.files['profilePicture'][0].path)

        user.avatar={
            public_id:myCloud.public_id,
            url:myCloud.secure_url
        }

        await user.save()

        res.status(200).json({
            success:true,
            message:"Picture uploaded successfully"
        })
    } catch (error) {
        next(error)
    }
},(err,req,res,next)=>{
    next(err);
})

// unblock user profile 
export const unblockUser = handleAsync(async(req,res,next)=>{

    try{
        const {id} = req.params.id

        validateMongoDbId(id)

        let user = await userModel.findById(id)

        if(!user){
            errorThrow("User not found",404,"Missing document")
            
        }
            
        user.blocked= !user.blocked

        // console.log(myCloud.secure_url);

        await user.save()

        res.status(200).json({
            success:true,
            message:"User unblocked successfully"
        })
    }catch(error){
        next(error)
    }
},(err,req,res,next)=>{
    next(err);
})

// unblock user profile 
export const blockUser = handleAsync(async(req,res,next)=>{

    try {
        const {id} = req.params.id

        validateMongoDbId(id)

        let user = await userModel.findById(id)

        if(!user){
            errorThrow("User not found",404,"Missing document")
            
        }
            
        user.blocked= !user.blocked

        // console.log(myCloud.secure_url);

        await user.save()

        res.status(200).json({
            success:true,
            message:"User blocked successfully"
        })

    } catch (error) {
        next(error)
    }
},(err,req,res,next)=>{
    next(err);
})

// unblock user profile 
export const forgotPasswordToken = handleAsync(async(req,res,next)=>{

    try {
        
        const {email} = req.body

        let user = await userModel.findOne({'contact.email':email})

        
        if(!user){
            errorThrow("User not found",404,"Missing document")
            
        }
            
        const token = await user.getResetPasswordToken()

        await user.save()

        const resetUrl = `<b>Hi ${user.name} !</b><br>
                        <i>
                        <br>As per your password change request ,we have your password reset link.<br>
                        Please go through the link below to reset your password <br><br><br>
                        Hurry up! it will only valid for <b>30 minutes</b><br><br>
                        </i>
                        <a href="${env.FRONT_END_URL}/user/reset-password/${token}"> Reset Link </a>`

        const data={
            to:user.contact.email,
            subject:"Password Reset Link",
            // text:`From M's`,
            html:resetUrl
        }

        await sendMail(data)

        res.status(200).json({
            success:true,
            message:"Reset password link send successfully"
        })

    } catch (error) {
        next(error)
    }
},(err,req,res,next)=>{
    next(err);
})

// unblock user profile 
export const resetPasswordToken = handleAsync(async(req,res,next)=>{

    try {
        
        const {password} = req.body
        const {token} = req.params
        const hashedToken = createHash('sha512').update(token).digest('hex')
        
        let user = await userModel.findOne({
            ResetPasswordToken:hashedToken,
            ResetPasswordExpire:{
                $gt:Date.now()
            }
        })

        if(!user){
            errorThrow("Token has been expired",401,"Reset password token error")
        }
        
        
        user.password = password
        user.ResetPasswordToken=undefined
        user.ResetPasswordExpire=undefined

        await user.save()

        res.status(200).json({
            success:true,
            message:"Password changed successfully"
        })

    } catch (error) {
        next(error)
    }
},(err,req,res,next)=>{
    next(err);
})


// added to wishlist user profile 
export const addToWishlist = handleAsync(async(req,res,next)=>{

    try {
        const {_id} = req.user
        const {productId} = req.params
        
        const user = await userModel.findOne(_id)

        const isAddedToWishList = user.wishlist.find((prod_Id)=> prod_Id.toString()===productId.toString() )
        
        isAddedToWishList ? user.wishlist.pull(productId) : user.wishlist.push(productId)
        
        await user.save()

        res.status(200).json({
            success:true,
            message:"Product added successfully"
        })

    } catch (error) {
        next(error)
    }
},(err,req,res,next)=>{
    next(err);
})

// get wishlist user profile 
export const getWishlist = handleAsync(async(req,res,next)=>{

    try {
        const {_id} = req.user
        const user = await userModel.findById(_id).populate('wishlist')

        res.status(200).json({
            success:true,
            wishlist:user.wishlist
        })

    } catch (error) {
        next(error)
    }
},(err,req,res,next)=>{
    next(err);
})

// get user cart of the profile 
export const userCart = handleAsync(async(req,res,next)=>{

    try {
        let products=[]
        const {_id} = req.user
        const {cart} = req.body
        const isAlreadyExist = await cartModel.findOne({orderby:_id})

        if(isAlreadyExist){
            isAlreadyExist.deleteOne()
        }

        for (const cartItem of cart) {
            let object ={}
            object.product = cartItem._id
            object.count = cartItem.count
            object.color = cartItem.color
            let getPrice = await productModel.findById(cartItem._id).select('sizes').exec()
            object.price = getPrice.some((allSize)=> {
                if(allSize.size=== cartItem.size)return allSize.price
            })
            products.push(object)
        }
        let totalPrice = 0

        for (const product of products) {
            totalPrice+= product.price * product.count
        }

        let newCart = await cartModel.create({
            products:products,
            cartTotal:totalPrice,
            orderby:_id
        })

        res.status(200).json({
            success:true,
            newCart
        })

    } catch (error) {
        next(error)
    }
},(err,req,res,next)=>{
    next(err);
})

// get wishlist user profile 
export const getUserCart = handleAsync(async(req,res,next)=>{

    try {
        const {_id} = req.user
        const cart = await cartModel.findOne({orderby:_id}).populate('products.product')

        res.status(200).json({
            success:true,
            cart
        })

    } catch (error) {
        next(error)
    }
},(err,req,res,next)=>{
    next(err);
})

// empty cart 
export const emptyCart = handleAsync(async(req,res,next)=>{

    try {
        const {_id} = req.user
        const user = await userModel.findById(_id)
        const cart = await cartModel.findOneAndRemove({orderby:user._id})

        res.status(200).json({
            success:true,
            cart
        })

    } catch (error) {
        next(error)
    }
},(err,req,res,next)=>{
    next(err);
})


// Create Order
export const applyCoupon = handleAsync(async(req,res,next)=>{

    try {
        const {_id} = req.user
        const {coupon} = req.body
        const validCoupon = await couponModel.findOne({name:coupon})

        if(validCoupon===null){
            errorThrow("The code is not valid",403,"Invalid code")
        }

        const user = await userModel.findById(_id)

        let cartObject = await cartModel.findOne({orderby:user._id}).populate('products.product')

        let totalCostAfterDiscount = (cartObject.cartTotal - ((cartObject.cartTotal * validCoupon.discount)/100)).toFixed(2)

        await cartModel.findByIdAndUpdate({orderby:user._id},{totalAfterDiscount:totalCostAfterDiscount},{new:true})

        res.status(200).json({
            success:true,
            totalCostAfterDiscount
        })

    } catch (error) {
        next(error)
    }
},(err,req,res,next)=>{
    next(err);
})

// empty cart 
export const createOrder = handleAsync(async(req,res,next)=>{

    try {
        const {_id} = req.user
        const {COD,couponApplied} = req.body

        if(!COD){
            errorThrow("Create cash order failed",401,"Order failed")
        }
        const user = await userModel.findById(_id)
        const userCart = await cartModel.findOneAndRemove({orderby:user._id})

        let finalAmount = 0
        if(couponApplied && userCart.totalAfterDiscount){
            finalAmount = userCart.totalAfterDiscount
        }else{
            finalAmount = userCart.cartTotal
        }

        let newOrder = await orderModel.create({
            products:userCart.products,
            paymentIntent:{
                id:uniqueId(),
                method:"COD",
                amount:finalAmount,
                status:"Cash on delivery",
                created:Date.now(),
                currency:"usd",

            },
            orderby:user._id,
            orderStatus:"Cash on delivery",
            
        })

        let updateData = userCart.products.map((item)=>{
            return {
                updateOne:{
                    filter:{
                        _id:item.product._id
                    },
                    update:{
                        $inc:{
                            stock: -item.count,
                            sold: +item.count
                        }
                    }
                }
            }
        })

        const updateProductStock = await productModel.bulkWrite(updateData)

        res.status(200).json({
            success:true,
            updateProductStock
        })

    } catch (error) {
        next(error)
    }
},(err,req,res,next)=>{
    next(err);
})

// Get all order
export const getAllOrder = handleAsync(async(req,res,next)=>{

    try {
        const {_id} = req.user
        const userOrders = await orderModel.findOne({orderby:_id}).populate('products.product').exec()

        res.status(200).json({
            success:true,
            userOrders
        })

    } catch (error) {
        next(error)
    }
},(err,req,res,next)=>{
    next(err);
})

// Get all order
export const updateOrderAndItsDetails = handleAsync(async(req,res,next)=>{

    try {
        const {id} = req.params.id

        validateMongoDbId(id)
        const {_id} = req.user
        const {newStatus} = req.body
        const updatedOrderDetail = await orderModel.findByIdAndUpdate({id},
            {
            orderStatus:newStatus,
            paymentIntent:{
                status:newStatus
            }
        },{new:true}).populate('products.product').exec()

        res.status(200).json({
            success:true,
            updatedOrderDetail
        })

    } catch (error) {
        next(error)
    }
},(err,req,res,next)=>{
    next(err);
})