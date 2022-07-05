const User=require('../models/User');
const jwt=require('jsonwebtoken');
const {UnauthenticatedError}=require('../errors');

const auth=async(req,res,next)=>{
    //chek header
    
    const authheader=req.headers.authorization;
    if(!authheader || !authheader.startsWith('Bearer ')){
        throw new UnauthenticatedError("Authentication invalid");
    }
    const token=authheader.split(' ')[1];

    //verify token
    try{
        const payload=jwt.verify(token,process.env.JWT_SECRET);

        req.user={userId:payload._id,name:payload.name}
        next();
    }
    catch(err){
        throw new UnauthenticatedError("Authentication Invalid");
    }
}

module.exports=auth;