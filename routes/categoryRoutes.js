import express from 'express'
import { isAdmin, requireSignIn } from '../middlewares/authMiddleware.js'
 import { deleteCategoryController,singleCategoryController,categoryController,updateCateegoryController,createCategoryController } from '../controller/categoryController.js'
const router =express.Router()


//routes
//create catgeory 
 router.post('/create-category'
 ,requireSignIn,
 isAdmin,
 createCategoryController)

 //update category 
 router.put('/update-category/:id',
 requireSignIn,
  isAdmin,
   updateCateegoryController)

//get all categories

router.get ('/get-category',categoryController)

//single category 
router.get('/single-category/:slug',singleCategoryController)

//delete category 
router.delete('/delete-category/:id',requireSignIn,isAdmin,deleteCategoryController)
 export default router