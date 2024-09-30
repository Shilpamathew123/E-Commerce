const Category=require('../models/brandModel')
const asyncHandler=require('express-async-handler')
const validateMongoDbId=require('../utils/validateMongoDbId')

const createCategory=asyncHandler(async(req,res)=>{
    try{
        const newCategory=await Category.create(req.body)
        res.json({
            "message":"Category created successfully",
            data:newCategory
        })
    }catch(error){
        throw new Error(error)
    }
})


const updateCategory=asyncHandler(async(req,res)=>{
    const {id}=req.params;
    validateMongoDbId(id);
    try{
        const updatedCategory=await Category.findByIdAndUpdate(id,req.body,{new:true});
        res.json({
            "message":"Category updated successfully",
            data:updatedCategory
        })
    }catch(error){
        throw new Error(error)
    }
})

const deleteCategory=asyncHandler(async(req,res)=>{
    const {id}=req.params;
    validateMongoDbId(id);
    try{
        const deletedCategory=await Category.findByIdAndDelete(id,req.body,{new:true});
        res.json({
            "message":"Category deleted successfully",
            data:deletedCategory
        })
    }catch(error){
        throw new Error(error)
    }
})

const getCategory=asyncHandler(async(req,res)=>{
    const {id}=req.params;
    validateMongoDbId(id);
    try{
        const getCategory=await Category.findById(id)
        res.json({
            data:getCategory
        })
    }catch(error){
        throw new Error(error)
    }
})

const getAllCategory=asyncHandler(async(req,res)=>{
    try{
        const getAllCategory=await Category.find()
        res.json({
            data:getAllCategory
        })
    }catch(error){
        throw new Error(error)
    }
})










module.exports={
createCategory,
updateCategory,
deleteCategory,
getCategory,
getAllCategory
}