
import userModel from "../models/userModel.js";
import OrderModel from "../models/OrderModel.js";
import { comparePassword, hashPassword } from "../helpers/authHelper.js";
import  JWT  from "jsonwebtoken";

export const registerController = async(req,res)=>{
    try {

        const {name,email,password,phone,address,answer}=req.body;
        //validation
        if(!name)
        {
            return res.send({message:'Name is required'});
        }
        if(!email){
            return res.send({message:'email is required'});
        }
        if(!password){
            return res.send({message:'password is required'});
        }
        if(!phone){
            return res.send({message:'phone is required'});
        }
        if(!address){
            return res.send({message:'address is required'});
        }
        if(!answer){
            return res.send({message:'answer is required'});
        }
     //checkuser
      const existingUser =await userModel.findOne({email});
      //existing user
      if(existingUser){
        return res.status(200).send({
            succes:false,
            message:'already registered please login',
        })
      }
      //register user
      const hashedPassword = await hashPassword(password)
      //save
      const user= await new userModel({
        name,
        email,
        phone,
        address,
        password:hashedPassword,
        answer
    }).save();

       res.status(201).send({
        success:true,
        message:'user register succesfully',
        user,
       });
    } catch(error){
       console.log(error) ;
       res.status(500).send({
        succes:false,
        message:'Error in Registration',
        error,
       });
    }


};

//POST LOGIN

export const loginController = async (req,res)=>{

    try {
        const {email,password}=req.body
        //validation
        if(!email || !password){
            return res.status(404).send({
                success:false,
                message:'Invalid email or password'
            })
        }
   //check user 
   const user = await userModel.findOne({email})
   if(!user){
   return res.status(404).send({
        success:false,
        message:'Email is not registered'
    })
   }
    const match = await comparePassword(password,user.password)
        if(!match){
            return res.status(200).send({
                success:false,
                message:'Invalid Password'
            })
        }

        //token 
        const token = await JWT.sign({ _id: user._id }, process.env.JWT_SECRET,
            {
                expiresIn: "7d",
            });
           res.status(200).send({
            success:true,
            message:'login succesfully',
            user:{
                _id:user._id,
                name:user.name,
                email:user.email,
                phone:user.phone,
                address:user.address,
                role:user.role,

            },
            token,
        });
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success:false,
            message:"Error in login",
            error
        })
    }

};


//forgot password

export const forgotPasswordController= async (req,res) => {
    try {
        const {email,answer,newPassword} = req.body
        if(!email){
            res.status(400).send({message:'Email is required'})
        }
        if(!answer){
            res.status(400).send({message:'answer is required'})
        }
        if(!newPassword){
            res.status(400).send({message:'newpassword is required'})
        }
        //check
        const user =await userModel.findOne({email,answer})
        //validation
        if(!user){
            return re.status(404).send({
                success:false,
                message:'wrong email or question'
            })
        }
        const hashed = await hashPassword(newPassword)
        await userModel.findByIdAndUpdate(user._id,{password:hashed})
        res.status(200).send({
            success:true,
            message:'Password Reset Succesfully'
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success:false,
            message:'something went wrong',
            error
        })
    }
 }

//testcontroller 
export const testController =(req,res)=>{
    
  try {
    res.send("protected Routes");
  } catch (error) {
    console.log(error);
    res.send({error});
  }
}


//update prfole
export const updateProfileController = async (req, res) => {
    try {
      const { name, email, password, address, phone } = req.body;
      const user = await userModel.findById(req.user._id);
      //password
      if (password && password.length < 6) {
        return res.json({ error: "Passsword is required and 6 character long" });
      }
      const hashedPassword = password ? await hashPassword(password) : undefined;
      const updatedUser = await userModel.findByIdAndUpdate(
        req.user._id,
        {
          name: name || user.name,
          password: hashedPassword || user.password,
          phone: phone || user.phone,
          address: address || user.address,
        },
        { new: true }
      );
      res.status(200).send({
        success: true,
        message: "Profile Updated SUccessfully",
        updatedUser,
      });
    } catch (error) {
      console.log(error);
      res.status(400).send({
        success: false,
        message: "Error WHile Update profile",
        error,
      });
    }
  };
  //orders
export const getOrdersController = async (req, res) => {
    try {
      const orders = await OrderModel
        .find({ buyer: req.user._id })
        .populate("products", "-photo")
        .populate("buyer", "name");
      res.json(orders);
    } catch (error) {
      console.log(error);
      res.status(500).send({
        success: false,
        message: "Error WHile Geting Orders",
        error,
      });
    }
  };
  //orders
  export const getAllOrdersController = async (req, res) => {
    try {
      const orders = await OrderModel
        .find({})
        .populate("products", "-photo")
        .populate("buyer", "name")
        .sort({ createdAt: "-1" });
      res.json(orders);
    } catch (error) {
      console.log(error);
      res.status(500).send({
        success: false,
        message: "Error WHile Geting Orders",
        error,
      });
    }
  };
  
  //order status
  export const orderStatusController = async (req, res) => {
    try {
      const { orderId } = req.params;
      const { status } = req.body;
      const orders = await OrderModel.findByIdAndUpdate(
        orderId,
        { status },
        { new: true }
      );
      res.json(orders);
    } catch (error) {
      console.log(error);
      res.status(500).send({
        success: false,
        message: "Error While Updateing Order",
        error,
      });
    }
  };
  