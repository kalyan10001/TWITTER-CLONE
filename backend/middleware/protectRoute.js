import User from "../models/user.model.js";
import jwt from "jsonwebtoken";

export const protectRoute=async(req,res,next)=>{
    try {
        const token=req.cookies.jwt;

        if(!token)
            {
            return res.status(200).json({error:"unauthorized no token provided"});
            }

         const decoded=jwt.verify(token,process.env.JWT_SECRET);

         if(!decoded)
            {
                return res.status(200).json({error:"unauthorized token expired"});
            }

        const user=await User.findById(decoded.userId).select("-password");

        if(!user)
            {
                return res.status(200).json({error:"user not found"});
            }


            req.user=user;
            next();
    } catch (error) {
        console.log("error in protectRouter middleware",error.message);
        res.status(400).json({error:"internal server error"});
    }
}