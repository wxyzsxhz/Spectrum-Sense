import user from "../models/user.js";
import { serverError } from "./error.js";

export const getUserData = async (req, res) => {
    try{
        const id = req.id;
        const accountData = await user.findById(id).select("-_id -password -createdAt -__v");
        if(!accountData){
            return res.status(404).json({message : "User not found"})
        }
        return res.status(200).json({message : "Fetched successfully", user : accountData})
    }catch(err){
        serverError(err, res);
    }
}


