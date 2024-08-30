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

const getAllProduct = asyncHandler(async (req, res) => {
    try {
        //Filter
        // Clone req.query to avoid modifying the original request object
        let queryObj1 = { ...req.query };

        // Exclude fields that are not meant for filtering
        const excludeFields = ['page', 'limit', 'sort', 'fields'];
        excludeFields.forEach(el => delete queryObj1[el]);

        // Convert the query object to a string for regex replacement
        let queryStr = JSON.stringify(queryObj1);
        queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);

        // Parse the string back into a query object
        let query=Product.find(JSON.parse(queryStr));

        //sorting 

        if(req.query.sort){
            const sortBy=req.query.sort.split(',').join(" ")
            query=query.sort(sortBy);
        }else{
            query=query.sort('-createdAt');

        }

        //limiting the feilds
        if(req.query.fields){
            const fields=req.query.fields.split(',').join(' ');
            query=query.select(fields);

        }else{
            query=query.select('-__v')
        }

        // paginations

        const page=req.query.page;
        const limit=req.query.limit;
        const skip=(page-1)*limit;
        query=query.skip(skip).limit(limit);
        if(req.query.page){
            const productCount=await Product.countDocuments();
            if(skip>=productCount) throw new Error('this page does not exist');
        }
        console.log(page, limit, skip);
      

        const product=await query;
       
        res.json(product);
        
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});




module.exports={ createProduct ,getaProduct,getAllProduct,updateProduct,deleteProduct };