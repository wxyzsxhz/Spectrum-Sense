import mongoose, { Schema } from "mongoose";
import user from "./user.js";

const childSchema = new Schema({
  name: { type: String, require: true },
  dateOfBirth: { type: Date, require: true },
  guardianId: { type: Schema.Types.ObjectId, ref: user, require: true },
  relationship: { type: String, requir: true },
  gender: {
    type: String,
    require: true,
    enum: {
      values: ["boy", "girl"],
      message: "{VALUE} is not a valid gender",
    },
  },
  jaundice: { type: Boolean, require: true },
  familyWithASD: { type: Boolean, require: true },
  region: { type: String },
  createdAt: { type: Date, default: Date.now },
});

const child = mongoose.model("child", childSchema);
export default child;
