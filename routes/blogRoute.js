const express=require('express')

const { authMiddleware,isAdmin } = require('../middlewares/authMiddleware')
const { createBlog,updateBlog,getaBlog ,getallBlogs,deleteBlog,likeBlog, dislikeBlog} = require('../controller/blogCtrl');
const router=express.Router()

router.post('/',authMiddleware,isAdmin,createBlog)
router.put('/likes',authMiddleware,likeBlog)
router.put('/dislikes',authMiddleware,dislikeBlog)
router.put('/:id',authMiddleware,isAdmin,updateBlog)


router.get('/:id',getaBlog)
router.get('/',getallBlogs)

router.delete('/:id',deleteBlog)


module.exports=router