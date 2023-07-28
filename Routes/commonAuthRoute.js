import express from "express";
import { uploadPhoto } from "../Middlewares/uploadImage.js";
import { isAuthenticated } from "../Middlewares/authentication.js";
import {loginUser, logoutUser,forgotPasswordToken,resetPasswordToken,updateUserAvater, updateUserContact, updateUserPassword, uploadUserProfilePicture,userDetails } from "../Controllers/userController.js";
import { getAllBlog, getBlog } from "../Controllers/blogController.js";
import { getACategory } from "../Controllers/categoryController.js";
import { getABrand, getAllBrand } from "../Controllers/brandController.js";
import { createEnq } from "../Controllers/enqueryController.js";

const commonAuthRoute = express.Router()

// login user
commonAuthRoute.post('/login',loginUser)
// logout user
commonAuthRoute.post('/logout',isAuthenticated,logoutUser)
// user details
commonAuthRoute.get('/me',isAuthenticated,userDetails)
// upload photo to my profile
commonAuthRoute.post('/upload-photo',
    isAuthenticated,
    uploadPhoto,
    uploadUserProfilePicture)
// update profile photo
commonAuthRoute.put('/update-photo',
    isAuthenticated,
    uploadPhoto,
    updateUserAvater)
// update profile
commonAuthRoute.put('/update-profile',
    isAuthenticated,
    updateUserContact)
// update password
commonAuthRoute.put('/update-password',
    isAuthenticated,
    updateUserPassword)
// forgot password
commonAuthRoute.post('/password/forgot-password',
    forgotPasswordToken
    )
// reset password with token
commonAuthRoute.put('/password/reset-password/:token',
    resetPasswordToken
    )

// Get a blog
commonAuthRoute.get('/blog/:id',
    getBlog
    )

// Get a blog
commonAuthRoute.get('/blog',
    getAllBlog
    )

// product category
commonAuthRoute.get('/get-the-category/:id',getACategory)

// Brand route
commonAuthRoute.get('/all-brands',getAllBrand)
commonAuthRoute.get('/get-the-brand/:id',getABrand)

// enquiry route

commonAuthRoute.post('/contact',createEnq)

export default commonAuthRoute