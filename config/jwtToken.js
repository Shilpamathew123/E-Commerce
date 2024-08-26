const jwt=require('jsonwebtoken');
// const generateToken=(id)=>{
//     return jwt.sign((id),process.env.JWT_SECRET,{expiresIn:'3d'});
// }
const generateToken = (userId) => {
    return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
        expiresIn: '1h', // Token expiration time
    });
};
module.exports={generateToken};