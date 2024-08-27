const mongoose = require('mongoose'); // Erase if already required

// Declare the Schema of the Mongo model
var userSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true,
        trim:true,
        
    },
   slug:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
        
    },
    description:{
        type:String,
        required:true,
    },
    price:{
        type:Number,
        required:true,
    },
    category:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Category',
        required:true,
    },
    brand:{
        type:String,
        enum:['Apple','samsung','lenovo'],
    },
    quantity:number,
    sold:{
        type:Number,
        default:0,
    },
    images:{
        type:Array,
        
    },color:{
        type:String,
        enum:['Black','brown','red'],
    },
    ratings:[{
        start: number,
        postedBy: {
            type: mongoose.Schema.Types.ObjectId, ref: 'User'}
    }]
},{timestamps:true});

//Export the model
module.exports = mongoose.model('Product', productSchema);