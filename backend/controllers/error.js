import { error } from 'console';

export const serverError = (err, res) => {
    error(err);
    return res.status(500).json({message : "Server error"});   
}

export const notFoundError = (res, message) => {
    return res.status(404).json({message});
}

export const unauthorizedAccessError = (res) => {
    return res.status(401).json({message : "Unauthorized access"});
}