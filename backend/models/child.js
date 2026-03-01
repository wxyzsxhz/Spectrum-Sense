import mongoose, {Schema} from "mongoose";
import user from "./user.js";

const childSchema = new Schema({
    name : {type : String, required : true},
    dateOfBirth : {type : Date, required : true},
    guardianId : {type : Schema.Types.ObjectId, ref : user, required : true},
    relationship : {type : String, required : true},
    gender : {
        type : String,
        required : true,
        enum : {
            values : ["boy", "girl"],
            message : "{VALUE} is not a valid gender"
        }
    },
    jaundice : {type : Boolean, required : true},
    familyWithASD : {type : Boolean, required : true},
    region : {type : String, required : true},
    hasASD: {type: Number, enum: [0, 1], default: null},
    createdAt : {type : Date, default : Date.now}
})

const child = mongoose.model('child', childSchema);
export default child;