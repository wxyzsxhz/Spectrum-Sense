import mongoose, { Schema } from "mongoose";

const userSchema = new Schema({
    name: {type: String, required: true},
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
}, {strict: false});

const user = mongoose.model('user', userSchema);

export default user;