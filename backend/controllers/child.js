import child from "../models/child.js";
import { notFoundError, serverError, unauthorizedAccessError } from "./error.js";
import { ageInMonths } from "../utils/months.js";
import test from "../models/test.js";

export const createChild = async (req, res) => {
    try{
        const id = req.id;
        const childData = req.body;
        childData.relationship = childData.relationship.toLowerCase();
        const newChild = new child(childData);
        newChild.guardianId = id;
        await newChild.save();
        return res.status(201).json({message : "Child profile created successfully"});
    }catch(err){
        serverError(err, res);
    }
}

export const getChildCards = async (req, res) => {
    try{
        const id = req.id;
        const children = await child.find({guardianId : id}).select("name dateOfBirth");
        if(!children || children.length==0)
            notFoundError(res, "Children not found");
        const formattedChildren = children.map(child => {
            return {
              id: child._id, // Rename _id to id
              name: child.name,
              age: ageInMonths(child.dateOfBirth)
            };
        });
        return res.status(200).json({message : "Fetched successfully", children : formattedChildren});    
    }catch(err){
        serverError(err, res);
    }
}

export const getChildProfile = async (req, res) => {
    try{
        const id = req.id;
        const childId = req.params.childId;
        const c = await child.findById(childId);
        
        if (!c)
            notFoundError(res, "Child not found");
        else if(c.guardianId!=id)
            unauthorizedAccessError(res);
        else {
            const formattedChild = {
                id : c._id,
                name : c.name,
                age : ageInMonths(c.dateOfBirth),
                relationship : c.relationship,
                gender : c.gender,
                region : c.region,
                jaundice : c.jaundice,
                familyWithASD : c.familyWithASD,
                createdAt : c.createdAt,
                hasASD : c.hasASD
            } 
            return res.status(200).json({message : "Fetched successfully", child : formattedChild})
        }
    }catch(err){
        serverError(err, res);
    }
}

export const editChildProfile = async (req, res) => {
    try{
        const  id = req.id;
        const childId = req.params.childId;
        const updateData = req.body;
        console.log(updateData);
        
        const c = await child.findById(childId).lean();
        if(!c)
            notFoundError(res, "Child not found");
        else if(c.guardianId!=id)
            unauthorizedAccessError(res);
        else{
            const updatedChild = await child.findByIdAndUpdate(childId, updateData, {new : true});
            return res.status(201).json({message : "Child profile updated successfully", child : updatedChild});
        }
    }catch(err){
        serverError(err, res);
    }
}

export const deleteChildProfile = async (req, res) => {
    try{
        const id = req.id;
        const childId = req.params.childId;
        const c = await child.findById(childId).lean();
        if (!c)
            notFoundError(res, "Child not found");
        else if(c.guardianId!=id)
            unauthorizedAccessError(res);
        else {
            await child.deleteOne(c._id);
            await test.deleteMany({childId : c._id});
            return res.status(200).json({message : "Child profile deleted successfully"});
        }
    }catch(err){
        serverError(err,res)  
    }
}

