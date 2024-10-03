const mongoose = require('mongoose'); // Erase if already required

// Declare the Schema of the Mongo model
var orderSchema = new mongoose.Schema({

    products:[
        {
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',
        },
        quantity: Number,
        price: Number,
        total: Number,
        color:String,
        },
    ],
    paymentIntent:{
        orderStatus:{
            type:String,
            enum:['not processed',
                'Cash on Delivery',
                'processing',
                'shipped',
                'delivered',
                'cancelled']

        }
    },
    orderBy:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }

},{
    timestamps:true,
})

//Export the model
module.exports = mongoose.model('Order', orderSchema);
