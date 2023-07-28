import { productModel } from "../DB/productModel.js";
import handleAsync from "async-error-handler";
import { validateMongoDbId } from "../Utils/validateMongoDbId.js";
import slugify from "slugify";
import { fileDeleteFromCloudinary, fileUploadToCloudinary } from "../Middlewares/uploadImage.js";
import { errorThrow } from "../Utils/errorHandler.js";

export const getAllProduct = handleAsync(async(req,res,next)=>{

    const allProduct = await productModel.find()

    res.status(200).json({
        success:true,
        allProduct
    })

},(err,req,res,next)=>{
    next(err);
})

export const createProduct = handleAsync(async(req,res,next)=>{

    try{
        if(req.body.name){
            req.body.slug = slugify(req.body.name)
        }
        const {name,slug,brand,description,
            package_dimension,
            country_of_origin,
            manufacturer} = req.body

        const product = await productModel.create({
        name:name,
        brand:brand,
        slug:slug,
        description:description,
        
        product_details:{
            package_dimension:package_dimension,
            date_first_available:new Date(Date.now()),
            country_of_origin:country_of_origin,
            manufacturer:manufacturer
        }
        })
        res.status(201).json({
            success:true,
            product
        })
    }
    catch(error){
        next(error)
    }

    
},(err,req,res,next)=>{
    next(err);
})

// get product details
export const getProductDetails = handleAsync(async(req,res,next)=>{

    try {
        const {id} = req.params
        validateMongoDbId(id)
        const productDetails = await productModel.findById(id)

        if(!productDetails){
            let error = new Error("Product not found")
            error.name="Product error"
            error.status=404
            throw error
        }

        res.status(200).json({
            success:true,
            productDetails
        })
    } catch (error) {
        next(error)
    }
},(err,req,res,next)=>{
    next(err);
})

// update product
export const updateProductDetails = handleAsync(async(req,res,next)=>{


    try {
        if(req.body.name){
            req.body.slug = slugify(req.body.name)
        }
        const {id} = req.params
        validateMongoDbId(id)

        const {name,slug,brand,description,
            package_dimension,
            country_of_origin,
            manufacturer} = req.body
    
        let product = await productModel.findById(id)
    
        if(!product){
            let error = new Error("Product not found")
                error.name="Product error"
                error.status=404
                throw error
        }
    
        product.name=name
        product.slug=slug
        product.brand=brand
        
        product.description=description
            
        product.product_details.package_dimension=package_dimension
        product.product_details.country_of_origin=country_of_origin
        product.product_details.manufacturer=manufacturer
        
        await product.save()
    
        res.status(200).json({
            success:true,
            message:"Product Details Updated Successfully"
        })
    } catch (error) {
        next(error)
    }

},(err,req,res,next)=>{
    next(err);
})

export const deleteProduct = handleAsync(async(req,res,next)=>{

    try {
        const {id} = req.params
        validateMongoDbId(id)

        const product = await productModel.findById(id)

        
        if(!product){
            let error = new Error("Product not found")
                error.name="Product error"
                error.status=404
                throw error
        }

        await product.deleteOne()

        res.status(200).json({
            success:true,
            message:"Product Deleted Successfully"
        })
    } catch (error) {
        next(error)
    }
    
},(err,req,res,next)=>{
    next(err);
})

// Create review on a product

export const reviewProduct = handleAsync(async(req,res,next)=>{

    try {
        const {id} = req.params
        validateMongoDbId(id)

        const {rating,comment}=req.body

        const review={
            user:req.user._id,
            name:req.user.name,
            rating:Number(rating),
            comment:comment
        }

        let product = await productModel.findById(id)

        if(!product){
            let error = new Error("Product not found")
                    error.name="Product error"
                    error.status=404
                    throw error
        }

        const isReviewed = await product.reviews.find(
            (rev)=> rev.user.toString()===req.user._id.toString()
        )

        if(isReviewed){

            product.reviews.forEach(rev => {
                if(rev.user.toString()===req.user._id.toString()){
                    rev.rating=rating
                    rev.comment = comment
                }
            });
        }
        else{
            product.reviews.push({
                $each:review,
                $position:0
            })

            product.numOfReviews = product.reviews.length
        }

        let avg=0
        product.reviews.forEach(rev => {
            avg+= rev.rating
        })
        product.rating = avg / product.reviews.length

        await product.save()

        res.status(200).json({
            success:true,
            message:"Product reviewed successfully"
        })
    } catch (error) {
        next(error)
    }
},(err,req,res,next)=>{
    next(err);
})

// upload product images
export const uploadProductImages = handleAsync(async(req,res,next)=>{

    try {
        const {id} = req.params
        validateMongoDbId(id)

        let product = await productModel.findById(id)

        if(!product){
            errorThrow("Product not found",404,"Product error")
        }

        for(let file of req.files['productImages']){
            
            let result = await fileUploadToCloudinary(file.path)

            let fileObject ={public_id:result.public_id,url:result.secure_url}
            
            product.images.push(fileObject)
        }

        await product.save()

        res.status(200).json({
            success:true,
            message:"Product images uploaded successfully",
            product
        })
    } catch (error) {
        next(error)
    }
},(err,req,res,next)=>{
    next(err);
})

// delete product images
export const deleteProductImages = handleAsync(async(req,res,next)=>{

    try {
        const {productId,public_id} = req.params
        validateMongoDbId(productId)

        let product = await productModel.findById(productId)

        if(!product){
            errorThrow("Product not found",404,"Product error")
        }

        for (const img of product.images) {
            if(img.public_id===public_id.toString()){
                await fileDeleteFromCloudinary(public_id)
            }
        }

        let newImgArray=product.images.filter((fileDetails)=>{
            if(fileDetails.public_id!==public_id.toString()){
                newImgArray.push(fileDetails)
            }
        })
        
        product.images=newImgArray

        await product.save()

        res.status(200).json({
            success:true,
            message:"Product image deleted successfully",
            product
        })
    } catch (error) {
        next(error)
    }
},(err,req,res,next)=>{
    next(err);
})

// filter product in a given filter
export const filterProduct = handleAsync(async(req,res,next)=>{

    try {
        const {min_price,max_price,color,category,brand,rating,} = req.params
        
        const products = await productModel.find({
            price:{
                $gte:min_price,
                $lte:max_price
            },
            color,
            category,
            brand,
            rating:{$gte:rating}
        })

        if(!products){
            let error = new Error("Product not found")
                error.name="Product error"
                error.status=404
                throw error
        }

        res.status(200).json({
            success:true,
            filteredProducts:products
        })
    } catch (error) {
        next(error)
    }
},(err,req,res,next)=>{
    next(err);
})

