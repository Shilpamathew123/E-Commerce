const Product=require('../models/productModel');
const asyncHandler=require('express-async-handler');
const slugify=require('slugify');

const createProduct=asyncHandler(async(req,res)=>{
try{
    if(req.body.title){
        req.body.slug=slugify(req.body.title);
    }
        const newProduct=await Product.create(req.body);
        res.json(newProduct);
    }
    catch(error){
        throw new Error('Error creating product')

    }

})

const updateProduct=asyncHandler(async(req,res)=>{
    const id=req.params.id;
    try{
        if(req.body.title){
            req.body.slug=slugify(req.body.title);
    
    }
    const updateProduct=await Product.findByIdAndUpdate(id,req.body,{new:true});
res.json(updateProduct);

}
    catch{
        throw new Error('Error updating product')
    }

})

const deleteProduct=asyncHandler(async(req,res)=>{
    const id=req.params.id;
    try{
    const deleteProduct=await Product.findByIdAndDelete(id);
    res.json(deleteProduct);

}
    catch{
        throw new Error('Error updating product')
    }

})

const getaProduct=asyncHandler(async(req,res)=>{
    const {id}=req.params;
    try{
const findProduct=await Product.findById(id);
res.json(findProduct);
    }
    catch{
        throw new Error('Error getting product')
    }

})

const getAllProduct=asyncHandler(async(req,res)=>{
    try{
        const getAllProducts=await Product.find();
        res.json(getAllProducts);

    }
    catch{
        throw new Error('Error getting all products')
    }

})



module.exports={ createProduct ,getaProduct,getAllProduct,updateProduct,deleteProduct };