const Blog=require('../models/blogModel')
const user=require('../models/userModel')
const asynchandler=require('express-async-handler')
const validateMongoDbId = require("../utils/validateMongodbId");
const cloudinaryUploadImg=require('../utils/cloudinary')



const createBlog= asynchandler(async(req,res)=>{
    try{
        const newBlog=await Blog.create(req.body)
        res.json({newBlog
        });
    }
    catch(error){
        throw new Error(error)
    }

})

const updateBlog= asynchandler(async(req,res)=>{
    const{id}=req.params
    validateMongoDbId(id);
    try{
        const updateBlog=await Blog.findByIdAndUpdate(id,req.body,{new:true})
        res.json({updateBlog
        });
    }
    catch(error){
        throw new Error(error)
    }

})

const getaBlog= asynchandler(async(req,res)=>{
    
    const{id}=req.params
    validateMongoDbId(id);
    try{
        const getaBlog=await Blog.findById(id).populate('likes')
       const updateViews= await Blog.findByIdAndUpdate(id,
            {
                $inc:{numViews:1},
            },{new:true}
        )
        res.json(getaBlog);
    }
    catch(error){
        throw new Error(error)
    }

})

const getallBlogs= asynchandler(async(req,res)=>{
    
    try{
        const getallBlogs=await Blog.find()
       res.json(getallBlogs);
    }
    catch(error){
        throw new Error(error)
    }

})

const deleteBlog= asynchandler(async(req,res)=>{
    const{id}=req.params;
    validateMongoDbId(id);
    
    try{
        const deleteBlog=await Blog.findByIdAndDelete(id,req.body)
       res.json(deleteBlog);
    }
    catch(error){
        throw new Error(error)
    }

})

const likeBlog= asynchandler(async(req,res)=>{
    const{blogId}=req.body;
    console.log(req.body)
    validateMongoDbId(blogId);

    //find the blog which you want to liked
    const blog=await Blog.findById(blogId);

    //find the login user
    const loginUserId=req?.user?._id;

    //find if the user has liked the blog
    const isLiked=blog?.isLiked;
//find the user if the user has disliked the blog
const isdisLiked=blog?.dislikes?.find((userId) => userId?.toString()===loginUserId?.toString())
if(isdisLiked){
    const blog=await Blog.findByIdAndUpdate(blogId,{
        $pull:{dislikes:loginUserId},
        isDisliked:false
    },{
        new:true
    }
)
res.json(blog)
}

//if the user has not liked the blog
if(isLiked){
    const updatedBlog=await Blog.findByIdAndUpdate(blogId,{
        $pull:{likes:loginUserId},
        isLiked:false
    },{
        new:true
    }
)
return res.json(updatedBlog);

}
else{
    const updatedBlog=await Blog.findByIdAndUpdate(blogId,{
        $push:{likes:loginUserId},
        isLiked:true
    },{
        new:true
    }
)
return res.json(updatedBlog);

}
})

const dislikeBlog= asynchandler(async(req,res)=>{
    const{blogId}=req.body;
    console.log(req.body)
    validateMongoDbId(blogId);

    //find the blog which you want to liked
    const blog=await Blog.findById(blogId);

    //find the login user
    const loginUserId=req?.user?._id;

    //find if the user has liked the blog
    const isDisLiked=blog?.isdisLiked;
//find the user if the user has disliked the blog
const Liked=blog?.dislikes?.find((userId) => userId?.toString()===loginUserId?.toString())
if(Liked){
    const blog=await Blog.findByIdAndUpdate(blogId,{
        $pull:{likes:loginUserId},
        isLiked:false
    },{
        new:true
    }
)
res.json(blog)
}

//if the user has not liked the blog
if(isDisLiked){
    const updatedBlog=await Blog.findByIdAndUpdate(blogId,{
        $pull:{dislikes:loginUserId},
        isDisliked:false
    },{
        new:true
    }
)
return res.json(updatedBlog);

}
else{
    const updatedBlog=await Blog.findByIdAndUpdate(blogId,{
        $push:{dislikes:loginUserId},
        isDisliked:true
    },{
        new:true
    }
)
return res.json(updatedBlog);

}
})

const uploadImages=asynchandler(async(req,res)=>{
    const {id}=req.params;
    validateMongoDbId(id);
    console.log(req.files)
    try{
        const uploader=(path)=>cloudinaryUploadImg(path,'images')
        const urls=[];
        const files=req.files;
        for(const file of files){
          const {path}=file;
          const newpath=await uploader (path)
          urls.push(newpath)
          fs.unlinkSync(path)
        }
          const findBlog=await Blog.findByIdAndUpdate(id,{
            images: urls.map(file => file.url),
            new:true,
          })
          res.json(findBlog)
  
      }
  
    catch(error){
      throw new Error(error)
    }
  })
  

module.exports = {createBlog,updateBlog,getaBlog,getallBlogs,deleteBlog,likeBlog,dislikeBlog,uploadImages}