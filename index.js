import {config} from 'dotenv' // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
import express from "express";
import cookieParser from "cookie-parser";
import { dbConnect } from "./DB/dbUtils.js";
import { v2 as cloudinary } from 'cloudinary'
import {userRoute,productRoute, userBlogRoute} from './Routes/userAuthRoute.js';
import { ErrorHandler, ErrorLogger } from './Utils/errorHandler.js';
import morgan from 'morgan';
import {adminUserRoute,adminProductRoute, adminBlogRoute, adminCategoryRoute, adminBlogCategoryRoute, adminCouponRoute, adminColorRoute, adminBrandRoute, adminEnqRoute} from './Routes/adminAuthRoute.js';
import commonAuthRoute from './Routes/commonAuthRoute.js';

config({
    path:'./config.env'
})


export const env=process.env

dbConnect()

const middleWares = [
    express.json(),
    express.urlencoded({extended:true}),
    cookieParser(),
    ];

cloudinary.config({
        cloud_name:env.CLOUD_NAME,
        api_key:env.CLOUDINARY_API_KEY,
        api_secret:env.CLOUDINARY_API_SECRET,
        secure:true
    })

export const cloud=cloudinary

const mainApp = express()
const userApp = express()
const adminApp = express()

mainApp.use(morgan('dev'))

mainApp.use(middleWares)

mainApp.use('/',commonAuthRoute)

mainApp.use('/user',userApp)
mainApp.use('/admin',adminApp)

// User App configuration
userApp.use('/product',productRoute)
userApp.use('/blog',userBlogRoute)
userApp.use('/',userRoute)

// Admin App configuration
adminApp.use('/product',adminProductRoute)
adminApp.use('/blog',adminBlogRoute)
adminApp.use('/blog/category',adminBlogCategoryRoute)
adminApp.use('/category',adminCategoryRoute)
adminApp.use('/coupon',adminCouponRoute)
adminApp.use('/color',adminColorRoute)
adminApp.use('/brand',adminBrandRoute)
adminApp.use('/enquiry',adminEnqRoute)
adminApp.use('/',adminUserRoute)

mainApp.use([ErrorLogger,ErrorHandler])

mainApp.listen(env.PORT,()=>{
    console.log("\x1b[1m\x1b[97m","Server running on","\x1b[1m\x1b[3m\x1b[33m",`${env.PORT}`,"\x1b[0m")
})
