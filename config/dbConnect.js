const { default: mongoose } = require("mongoose")

const dbConnect=()=>{
    try{
        const conn=mongoose.connect("mongodb://localhost:27017/digitic");
        console.log("Database connected successfully");
    }catch(err){
        throw new Error(err);
        console.log("database connection failed");
    }
}
module.exports=dbConnect;