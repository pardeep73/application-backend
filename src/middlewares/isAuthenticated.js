import jwt from 'jsonwebtoken';

export const isAuthenticated = async(req,res,next) =>{
    // get the cookie tokken from the cookies
    const token = req.cookies.token;

    if(!token){
        return res.status(401).json({
            success:false,
            message:'User is not Authenticated'
        })
    }
    // verify the token with the secret key
    const decode = await jwt.verify(token,process.env.SECRET_KEY);

    if(!decode){
        return res.status(401).json({
            success:false,
            message:'Invalid Token'
        })
    }
    // setup -- req.id as a user id
    req.id = decode.userId;

    // call the next middleware
    next();

}