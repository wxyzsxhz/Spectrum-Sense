import { Router } from "express";
import { register, login } from "./controllers/auth.js";
import { getUserData, getChildCards, createChild } from "./controllers/dashboard.js";
import { verifyToken } from "./utils/jwt.js";

const router = Router();

//auth routes
router.post("/signup", register);
router.post("/login", login);

//
router.get("/account", verifyToken, getUserData);
router.post("/child", verifyToken, createChild);
router.get("/child-cards", verifyToken, getChildCards);

export default router;



