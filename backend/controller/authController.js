import uploadOnCloudinary from "../config/cloudinary";
import User from "../models/UserModel.js";
import validator from "validator";
import bcrypt from "bcryptjs";
import genToken from "../config/token.js";



export const signUp = async (req, res) => {
    try{
        const {userName, email, password} = req.body;
        let photoUrl;
        if(req.file){
            const filePath = req.file.path;
            photoUrl = await uploadOnCloudinary(filePath);
        }
        const userExists = await User.findOne({email});
        if(userExists){
            return res.status(400).json({message: "User already exists"});
        }
        if(password.length < 8 ){
            return res.status(400).json({message: "Password must be at least 8 characters long"});
        }
        if(!validator.isEmail(email)){
            return res.status(400).json({message: "Invalid email"});
        }
        const hashedPassword = await bcrypt.hash(password,10);

        const user = new User({
            userName,
            email,
            password: hashedPassword,
            photoUrl
        });

        let token =await genToken(user._id);

        res.cookie("token", token, {
            httpOnly: true,
            secure: false,
            sameSite: "strict",
            maxAge: 7*25*60*60*1000
        })

        return res.status(201).json({message: "User created successfully", user, token});

    } catch (error){
        return res.status(500).json({message: `Server error: ${error.message}`});
    }
}



export const signIn = async (req, res) => {
    try{
        const {email, password} = req.body;
        const user = await User.findOne({email});
        if(!user){
            return res.status(400).json({message: "Invalid email, user not found"});
        }
        const match = await bcrypt.compare(password, user.password);
        if(!match){
            return res.status(400).json({message: "Invalid password"});
        }

        let token = await genToken(user._id);

        res.cookie("token", token, {
            httpOnly: true,
            secure: false,
            sameSite: "strict",
            maxAge: 7*25*60*60*1000
        })

        return res.status(201).json({message: "User Logged in", user, token})
    } 
    catch (error){
        return res.status(500).json({message: `Server error: ${error.message}`});
    }
}



export const signOut = async(req, res) => {
    try{
        await res.clearCookie("token")
        return res.status(200).json({message: "User logged out successfully"}); 

    }
    catch (error){
        return res.status(500).json({message: `Server error: ${error.message}`});
    }
}