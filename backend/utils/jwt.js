import jwt from "jsonwebtoken";
import { JWT_SECRET, JWT_EXPIRES_IN } from "../config.js";

const {sign, verify} = jwt;

export const genToken = ({_id}) => {
    return sign(
      { id: _id },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN || "1d" }
    );
}

export const verifyToken = async (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer "))
        return res.status(401).json({message : "Unauthorized access"});
    const token = authHeader.split(" ")[1];
    try{
        const {id} = verify(token, process.env.JWT_SECRET);
        req.id = id;
        return next();
    }catch(err){
        console.error(err);
        return res.status(500).json({message : "Server error"});
    }
  };

