const mongoose = require('mongoose'); 
const crypto=require('crypto')// Erase if already required
const bcrypt = require('bcrypt');


// Declare the Schema of the Mongo model
const userSchema = new mongoose.Schema({
    firstname:{
        type:String,
        required:true,
        
    },
    lastname:{
        type:String,
        required:true,
        
    },
    email:{
        type:String,
        required:true,
        unique:true,
    },
    mobile:{
        type:String,
        required:true,
        unique:true,
    },
    password:{
        type:String,
        required:true,
    },

    role:{
        type:String,
        default:"user",
    },
    isBlocked:{
        type:Boolean,
        default:false,
    },
    cart:{
        type: Array,
        default:[],
    },
    address:[{
        type:String,
    }],
    wishlist:[{type:mongoose.Schema.Types.ObjectId, ref:"Product"  }],
    refreshToken:{
        type:String,
    
    },
    passwordChangedAt:Date,
    PasswordResetToken:String,
    passwordrResetExpires:Date,
}, 
{ timestamps: true 
});

userSchema.pre('save', async function(next) {
    if(!this.isModified("password")){
        next();
    }
    const salt =await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);

});

userSchema.methods.isPasswordMatched = async function (enteredPassword) {
    console.log('Entered Password:', enteredPassword);
    console.log('Stored Hashed Password:', this.password);
    if (!enteredPassword || !this.password) {
        throw new Error('data and hash arguments required');
    }
    return bcrypt.compare(enteredPassword, this.password);
};
// userSchema.methods.createPasswordResetToken= async function(){
//     const resetToken=crypto.randomBytes(32).toString('hex');
//     this.passwordResetToken=crypto
//     .createHash('sha256')
//     .update(resetToken)
//     .digest('hex');
//     this.passwordResetExpires=Date.now()+30*60*1000; //10 minutes
//     await this.save({validateBeforeSave:false});
//     return resetToken;
// }
userSchema.methods.createPasswordResetToken = function () {
    const resetToken = crypto.randomBytes(32).toString('hex');
    this.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    this.resetPasswordExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
    return resetToken;
};
//Export the model
const User = mongoose.model('User', userSchema);
module.exports=User;