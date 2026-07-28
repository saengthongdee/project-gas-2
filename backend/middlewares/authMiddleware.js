//รับการกระทำ token ดูว่า token ใช้ได้ไหม

const jwt = require('jsonwebtoken')

const ApiError = require('../utils/ApiError');

const authMiddleware =(req,res,next)=>{
    const authHeader = req.headers.authorization;
    
    if(!authHeader){
        return next(
            new ApiError(401,'Authorization header is missing')
        )
    }
    const token = authHeader.split(' ')[1];
    
    try{
        const decoded = jwt.verify(token , process.env.JWT_SECRET );
        req.user = decoded;
        
        next();
    }catch(err){
        return next(
            new ApiError(401,'Invalid token')
        )
    }
}
module.exports = authMiddleware
