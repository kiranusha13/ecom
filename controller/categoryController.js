import CategoryModel from "../models/CategoryModel.js"
import slugify from "slugify"

export const createCategoryController = async(req,res) =>{
    try {
        const {name} = req.body
        if(!name){
            return res.status(401).send({message:'Name is required'})
        }
        const existingCategory =await CategoryModel.findOne({name})
        if(existingCategory){
            return res.status(200).send({
                success: true,
                message:"Category Already exists"
            })
        }
        const category = await new CategoryModel({name,slug:slugify(name)}).save()
        res.status(201).send({
            success:true,
            message:"new Category Created",
            category,
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success:false,
            message:'Error in Category',
            error,
        })
    }
}


// update category

export const updateCateegoryController = async(req,res) =>{
    try {
        const {name} = req.body
        const {id} = req.params
        const category= await CategoryModel.findByIdAndUpdate(
            id,
            {name,slug : slugify(name)},
            {new : true}
        );
        res.status(200).send({
            success:true,
            message:'Category Updated Succesfully',
            category,
        })
        
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success:false,
            error,
            message:'Error while Updating Category'
        })
    }
}

//category controller

export const categoryController = async(req,res) => {
    try {
        const category = await CategoryModel.find({});
        res.status(200).send({
            success:true,
            message:"All Categories List",
            category
        });
        
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success:false,
            error,
            message:"Error While getting all categories"
        });
    }
}

//single category controller
export const singleCategoryController = async (req,res) =>{
    try {
        
        const category = await CategoryModel.findOne({slug:req.params.slug})
        res.status(200).send({
            success:true,
            message:'Get single Category succesfully',
            category
        })
    } catch (error) {
        console.log(error),
        res.status(500).send({
            success:false,
            error,
            message:"Error While getting Single Category"
        })
    }
}

//delete controller
export const deleteCategoryController=async(req,res)=>{
    try {
        const {id} = req.params
        await CategoryModel.findByIdAndDelete(id)
        res.status(200).send({
            success:true,
            message:"category deleted succesfully"
        });
        
    } catch (error) {
        console.log(error),
        res.status(500).send({
            success:false,
            error,
            message:"Error While deleting Category"
        })
    }
}
