import mongoose from "mongoose";
import { Schema } from "mongoose";
import child from "./child.js";

const testSchema = new Schema({
    childId : {type : Schema.Types.ObjectId, ref : child, required : true},
    model_used : {type : String, required : true},              // Which model was used
    age: {type : Number, required : true},                           // Age from input
    age_unit: {
        type : String, 
        required : true, 
        enum : {
           values : ["months", "years"]},
           message : '{VALUE} is not a valid unit'
       },                // months or years
    prediction: {
        type : Number, 
        required : true, 
        enum : {
           values : [0, 1]},
           message : '{VALUE} is not a valid number'
        },                     // 0 = No ASD, 1 = ASD
    prediction_label: {type : String, required : true},           // Human-readable
    confidence: {type : Number, required : true},                  // Model confidence (0-1)
    risk_percentage: {type : Number, required : true},             // Risk as percentage (0-100)
    risk_category: {
        type : String,
        required : true,
        enum : {
            values : ["Low Risk", "Medium Risk", "High Risk"],
            message : '{VALUE} is not a valid category'
        }
    },        // Low Risk, Medium Risk, or High Risk
    probabilities: {
        no_asd: {type : Number, required : true},                    // Probability of no ASD
        asd: {type : Number, required : true},                     // Probability of ASD
    },
    percentPerCategory: {type : Object, required : true},
    createdAt : {type : Date, default : Date.now}
}, {strict : false});

const test = mongoose.model('test', testSchema);
export default test;