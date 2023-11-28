import  express from "express";
import { isAdmin, requireSignIn } from "../middlewares/authMiddleware.js";
import {updateProductController,
    createProductController, 
    deleteProductController, 
    getProductController, 
    getSingleProductController, 
    productPhotoController, 
    productFiltersController,
    productListController,
    productCountController,
    searchProductController,
    realtedProductController,
    productCategoryController,
    braintreeTokenController,
    brainTreePaymentController,
 } 
    from "../controller/productController.js";
import formidable from "express-formidable";

const router = express.Router()




//routes
//create
router.post('/create-product',
requireSignIn,
isAdmin,
formidable(),
createProductController);

  

//get products 
router.get('/get-product',getProductController)

//single product 
router.get('/get-product/:slug',getSingleProductController)

//get photo 
router.get('/product-photo/:pid',productPhotoController)

//delete photo
router.delete('/delete-product/:pid',deleteProductController)

//update product
router.put(
    '/update-product/:pid',
requireSignIn,
isAdmin,
formidable(),
updateProductController
)
//filter product 
router.post('/product-filters',productFiltersController)

//product count 
router.get('/product-count',productCountController)

//product per page list
router.get('/product-list/:page',productListController)

//search product routes
router.get('/search/:keyword',searchProductController)

//similar product
router.get("/related-product/:pid/:cid", realtedProductController);
//category wise product
router.get ('/product-category/:slug',productCategoryController)
//payment routes
//token
router.get('/braintree/token',braintreeTokenController)
//payment 
router.post('/braintree/payment',requireSignIn,brainTreePaymentController)
export default router