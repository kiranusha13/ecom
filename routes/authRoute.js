import  express from 'express';
import {registerController,
    loginController,
    forgotPasswordController,
    updateProfileController,
    getOrdersController,
    getAllOrdersController,
    orderStatusController,
   } from '../controller/authController.js';
import { testController } from '../controller/authController.js';
import {requireSignIn,isAdmin} from '../middlewares/authMiddleware.js'
   //rouetr object
const router =express.Router();


//routing 
//register || method post

router.post('/register',registerController );

//LOGIN || POST
router.post('/login',loginController)
//forgot password
router.post('/forgot-password',forgotPasswordController)

//test routes
router.get('/test',requireSignIn, isAdmin ,testController)

//protected user route authentication

router.get('/user-auth',requireSignIn, (req,res) => {
    res.status(200).send({ok:true});
})
//protected Admin route auth
router.get('/Admin-auth',requireSignIn,isAdmin ,(req,res) => {
    res.status(200).send({ok:true});
})

//update profile
router.put('/profile',requireSignIn,updateProfileController)

//orders
router.get('/orders',requireSignIn,getOrdersController)


//all orders
router.get("/all-orders", requireSignIn, isAdmin, getAllOrdersController);

// order status update
router.put(
  "/order-status/:orderId",
  requireSignIn,
  isAdmin,
  orderStatusController
);

export default router;
