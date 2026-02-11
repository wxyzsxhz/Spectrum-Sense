import child from "../models/child.js";
import user from "../models/user.js";

export const getUserData = async (req, res) => {
  try {
    const id = req.id;
    const accountData = await user
      .findById(id)
      .select("-_id -password -createdAt -__v");
    if (!accountData) {
      return res.status(404).json({ message: "User not found" });
    }
    return res
      .status(200)
      .json({ message: "Fetched successfully", user: accountData });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};

export const createChild = async (req, res) => {
  try {
    const id = req.id;
    const childData = req.body;
    const newChild = new child(childData);
    newChild.guardianId = id;
    await newChild.save();
    return res
      .status(201)
      .json({ message: "Child profile created successfully" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};

export const getChildCards = async (req, res) => {
  try {
    const id = req.id;
    const children = await child.find({ guardianId: id }).select("name dateOfBirth");
    if (!children || children.length == 0)
      return res.status(404).json({ message: "Children not found" });
    const formattedChildren = children.map(child => {
      const today = new Date();
      let months = (today.getFullYear() - child.dateOfBirth.getFullYear()) * 12;
      months += today.getMonth() - child.dateOfBirth.getMonth();
      if (today.getDate() < child.dateOfBirth.getDate()) {
        months--;
      }
      return {
        id: child._id, // Rename _id to id
        name: child.name,
        age: months
      };
    });
    return res.status(200).json({ message: "Fetched successfully", children: formattedChildren });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
}