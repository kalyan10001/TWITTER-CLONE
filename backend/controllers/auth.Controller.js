import { generateTokenAndSetCookie } from "../lib/utils/generateToken.js";
import bcrypt from "bcryptjs";
import User from "../models/user.model.js";
export const signup=async(req,res)=>{
       try {
        const {fullName,username,email,password}=req.body;

        const emailRegex= /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if(!emailRegex.test(email))
            {
            return res.json({error:"invalid email format"});
            }

            const existingUser=await User.findOne({username});
            if(existingUser)
                {
                    return res.json({error:"username is already taken"});
                }

                const existingEmail=await User.findOne({email});
                if(existingEmail)
                    {
                        return res.json({error:"email is already used"});
                    
                    }
                    if(password.length<6)
                        {
                        return res.status(200).json({error:"password must be 6  characters long"});
                        }



        const salt=await bcrypt.genSalt(10);
        const hashedPassword=await bcrypt.hash(password,salt);

        const newUser=new User({
            fullName,
            username,
            email,
            password:hashedPassword
       })

       if(newUser){
        generateTokenAndSetCookie(newUser._id,res);
        await newUser.save();

        res.status(201).json({
            _id:newUser._id,
            fullName:newUser.fullName,
            username:newUser.username,
            email:newUser.email,
            followers:newUser.followers,
            following:newUser.following,
            profileImg:newUser.profileImg,
            coverImg:newUser.coverImg,
        })
       }
       else{
        res.status(200).json({error:"invalid user data"});
       }
        
       } catch (error) {
        console.log("error in signup controller",error.message);
        res.status(400).json({error:"internal server error"});
       }
}

export const login=async(req,res)=>{
    try {
        const {username,password}=req.body;
        const user=await User.findOne({username});
        if(!user)
            {
                return res.status(200).json({error:"no user found"});
            }
        const isPasswordCorrect=await bcrypt.compare(password,user?.password || "");
        if(!isPasswordCorrect)
            {
                return res.status(200).json({error:"invalid username or password"});
            }
        generateTokenAndSetCookie(user._id,res);
        res.status(201).json({
            _id:user._id,
            fullName:user.fullName,
            username:user.username,
            email:user.email,
            followers:user.followers,
            following:user.following,
            profileImg:user.profileImg,
            coverImg:user.coverImg,
        })
        
    } catch (error) {
        console.log("error in login controller",error.message);
        res.status(400).json({error:"internal server error"});
    }
}


export const logout=async(req,res)=>{
    try {
        res.cookie("jwt","",{maxAge:0})
        res.status(200).json("logout successful");
    } catch (error) {
        console.log("error in logout controller",error.message);
        res.status(400).json({error:"internal server error"});
    }
}


export const getMe=async(req,res)=>{
    try {
        const user=await User.findById(req.user._id).select("-password");
        res.status(200).json(user);
    } catch (error) {
        console.log("error in getMe controller",error.message);
        res.status(400).json({error:"internal server error"});
    }
}