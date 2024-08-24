const user=require('./models/userModel');



const createUser=async(req,res)=>{
    const email=req.body.email;
    const findUser=await user.findOne({email});
    if(!findUser){
        //create newuser
        const newUser=user.create(req.body);
        res.json(newUser);
    }
    else{
        res.json({message:'User already exists',
            success:false,
        });    
}
}
module.exports={createUser}
