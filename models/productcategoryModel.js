const mongoose = require('mongoose'); // Erase if already required

// Declare the Schema of the Mongo model
var productcategorySchema = new mongoose.Schema({
   title:{
        type:String,
        required:true,
        unique:true,
        index:true,
    },
    
},{
    timestamps: true,  // Include timestamps for createdAt and updatedAt fields
});

//Export the model
module.exports = mongoose.model('Category', productcategorySchema);
