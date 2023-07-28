import { blockUser, deleteUser, unblockUser, updateOrderAndItsDetails } from "../Controllers/userController.js";
import { isAuthenticated, isAuthorized } from "../Middlewares/authentication.js";
import { createBlog, deleteBlog, updateBlog, uploadBlogImages, uploadBlogTitleImage } from "../Controllers/blogController.js";
import { createProduct, deleteProduct, deleteProductImages, updateProductDetails, uploadProductImages } from "../Controllers/productController.js";
import { uploadPhoto } from "../Middlewares/uploadImage.js";
import express from "express";
import { createCategory, createSubCategory, deleteCategory, updateCategory } from "../Controllers/categoryController.js";
import { createBlogCategory, deleteBlogCategory, getABlogCategory, updateBlogCategory } from "../Controllers/blogCategoryController.js";
import { createCoupon, deleteCoupon, getAllCoupon, updateCoupon } from "../Controllers/couponController.js";
import { addBrandImage, createBrand, deleteBrand, getABrand, updateBrand, updateBrandImage } from "../Controllers/brandController.js";
import { createColor, deleteColor, getAColor, updateColor } from "../Controllers/colorController.js";
import { deleteEnq, getAEnq, getAllEnq } from "../Controllers/enqueryController.js";

const router = express.Router()
export const adminEnqRoute = router,adminColorRoute=router,adminBrandRoute = router,adminOrderRoute = router,adminUserRoute = router,adminProductRoute=router,adminBlogRoute=router,adminCategoryRoute = router,adminBlogCategoryRoute = router,adminCouponRoute = router;


adminUserRoute.put('/block-user/:id',
    isAuthenticated,
    isAuthorized('admin'),
    blockUser)

adminUserRoute.put('/unblock-user/:id',
    isAuthenticated,
    isAuthorized('admin'),
    unblockUser)

adminUserRoute.delete('/deleteuser/:id',
    isAuthenticated,
    isAuthorized('admin'),
    deleteUser)

// product route
adminProductRoute.post('/create-product',isAuthenticated,isAuthorized('admin'),createProduct)
adminProductRoute.put('/update-product/:id',isAuthenticated,isAuthorized('admin'),updateProductDetails)
adminProductRoute.delete('/delete-product/:id',isAuthenticated,isAuthorized('admin'),deleteProduct)
adminProductRoute.post('/upload-product-images/:id',isAuthenticated,isAuthorized('admin'),uploadPhoto,uploadProductImages)
adminProductRoute.delete('/delete-product-images/:productId/delete/:public_id',isAuthenticated,isAuthorized('admin'),uploadPhoto,deleteProductImages)

// Blog route
adminBlogRoute.post('/create-blog',isAuthenticated,isAuthorized('admin'),createBlog)
adminBlogRoute.put('/update-blog/:id',isAuthenticated,isAuthorized('admin'),updateBlog)
adminBlogRoute.delete('/delete-blog/:id',isAuthenticated,isAuthorized('admin'),deleteBlog)
adminBlogRoute.post('/upload-blog-title-image/:id',isAuthenticated,isAuthorized('admin'),uploadPhoto,uploadBlogTitleImage)
adminBlogRoute.post('/upload-blog-image/:id',isAuthenticated,isAuthorized('admin'),uploadPhoto,uploadBlogImages)

// category route
adminCategoryRoute.post('/create-category',isAuthenticated,isAuthorized('admin'),createCategory)
adminCategoryRoute.post('/create-sub-category/:id',isAuthenticated,isAuthorized('admin'),createSubCategory)
adminCategoryRoute.put('/update-category/:id',isAuthenticated,isAuthorized('admin'),updateCategory)
adminCategoryRoute.delete('/delete-category/:id',isAuthenticated,isAuthorized('admin'),deleteCategory)

// Blog category controller
adminBlogCategoryRoute.post('/create-blog-category',isAuthenticated,isAuthorized('admin'),createBlogCategory)
adminBlogCategoryRoute.put('/update-blog-category/:id',isAuthenticated,isAuthorized('admin'),updateBlogCategory)
adminBlogCategoryRoute.delete('/delete-blog-category/:id',isAuthenticated,isAuthorized('admin'),deleteBlogCategory)
adminBlogCategoryRoute.get('/get-blog-category/:id',isAuthenticated,isAuthorized('admin'),getABlogCategory)

// Coupun code router
adminCouponRoute.post('/create-coupon',isAuthenticated,isAuthorized('admin'),createCoupon)
adminCouponRoute.get('/get-all-coupon',isAuthenticated,isAuthorized('admin'),getAllCoupon)
adminCouponRoute.put('/update-coupon/:id',isAuthenticated,isAuthorized('admin'),updateCoupon)
adminCouponRoute.delete('/delete-coupon/:id',isAuthenticated,isAuthorized('admin'),deleteCoupon)

// Order routes
adminOrderRoute.put('/order/update-order/:id',isAuthenticated,isAuthorized('admin'),updateOrderAndItsDetails)// Get all order

// admin brand route
adminBrandRoute.get('/get-the-brand/:id',isAuthenticated,isAuthorized('admin'),getABrand)
adminBrandRoute.post('/create-brand',isAuthenticated,isAuthorized('admin'),createBrand)
adminBrandRoute.delete('/delete-the-brand/:id',isAuthenticated,isAuthorized('admin'),deleteBrand)
adminBrandRoute.post('/brand-logo/:id',uploadPhoto,isAuthenticated,isAuthorized('admin'),addBrandImage)
adminBrandRoute.put('/update-brand-logo/:id',uploadPhoto,isAuthenticated,isAuthorized('admin'),updateBrandImage)
adminBrandRoute.put('/update-brand-name/:id',isAuthenticated,isAuthorized('admin'),updateBrand)

// admin color route
adminColorRoute.get('/get-the-color/:id',isAuthenticated,isAuthorized('admin'),getAColor)
adminColorRoute.post('/create-color',isAuthenticated,isAuthorized('admin'),createColor)
adminColorRoute.delete('/delete-the-color/:id',isAuthenticated,isAuthorized('admin'),deleteColor)
adminColorRoute.put('/update-color-name/:id',isAuthenticated,isAuthorized('admin'),updateColor)
// adminColorRoute.post('/brand-logo/:id',uploadPhoto,isAuthenticated,isAuthorized('admin'),addBrandImage)
// adminColorRoute.put('/update-brand-logo/:id',uploadPhoto,isAuthenticated,isAuthorized('admin'),updateBrandImage)

// Admin enquiry route
adminEnqRoute.get('/get-all-enquiry',isAuthenticated,isAuthorized('admin'),getAllEnq)
adminEnqRoute.get('/get-the-enquiry/:id',isAuthenticated,isAuthorized('admin'),getAEnq)
adminEnqRoute.delete('/delete-the-enquiry/:id',isAuthenticated,isAuthorized('admin'),deleteEnq)
