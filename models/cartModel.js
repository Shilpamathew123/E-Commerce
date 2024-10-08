const mongoose = require('mongoose'); // Erase if already required

// Declare the Schema of the Mongo model
var cartSchema = new mongoose.Schema({

    products:[
        {
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',
        },
        quantity: Number,
        price: Number,
        color:String,
        },
    ],
    cartTotal:Number,
    totalAfterDiscount:Number,
    
    orderBy:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }

},{
    timestamps:true,
});

//Export the model
module.exports = mongoose.model('Cart', cartSchema);