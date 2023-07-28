import express from "express";
import {  addToWishlist, applyCoupon, createOrder, emptyCart, getUserCart, getWishlist, userCart, userCreate } from "../Controllers/userController.js";
import { isAuthenticated, isAuthorized } from "../Middlewares/authentication.js";
import { uploadPhoto } from "../Middlewares/uploadImage.js";
import { reviewProduct ,getAllProduct, getProductDetails, } from "../Controllers/productController.js";
import { disLikeBlog, likeBlog } from "../Controllers/blogController.js";

const router = express.Router()
export const userRoute = router,productRoute=router,userBlogRoute = router

const upload = uploadPhoto
// register a user
userRoute.post('/register',userCreate)
userRoute.get('/wishlist',isAuthenticated,isAuthorized('user'),getWishlist)
userRoute.put('/wishlist-product/:productId',isAuthenticated,isAuthorized('user'),addToWishlist)
userRoute.post('/cart',isAuthenticated,isAuthorized('user'),userCart)
userRoute.get('/cart',isAuthenticated,isAuthorized('user'),getUserCart)
userRoute.delete('/empty-cart',isAuthenticated,isAuthorized('user'),emptyCart)
userRoute.post('/cart/apply-coupon',isAuthenticated,isAuthorized('user'),applyCoupon)
userRoute.post('/cart/place-order',isAuthenticated,isAuthorized('user'),createOrder)
userRoute.get('/orders',isAuthenticated,isAuthorized('user'),getAllProduct)
// product route
productRoute.get('/get-all-product',getAllProduct)
productRoute.get('/product-details/:id',getProductDetails)
productRoute.put('/review-product/:id',isAuthenticated,isAuthorized('user'),reviewProduct)

// Blog routes
// likes a blog
userBlogRoute.put('like/:id',isAuthenticated,isAuthorized('user'),likeBlog)
// dislikes a blog
userBlogRoute.put('dislike/:id',isAuthenticated,isAuthorized('user'),disLikeBlog)