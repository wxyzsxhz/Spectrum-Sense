import { Router } from "express";
import { register, login, forgetPassword, resetPassword } from "./controllers/auth.js";
import { getUserData } from "./controllers/dashboard.js";
import { verifyToken } from "./utils/jwt.js";
import { getChildProfile, getChildCards, createChild, deleteChildProfile, editChildProfile} from "./controllers/child.js";
import { testASD, getHistory, getTest } from "./controllers/prediction.js";

const router = Router();

//auth routes
router.post("/signup", register);
router.post("/login", login);
router.post("/forgot-password", forgetPassword)
router.post("/reset-password/:token", resetPassword)

//dashboard routes
router.get("/account", verifyToken, getUserData);
router.post("/child", verifyToken, createChild);
router.get("/child-cards", verifyToken, getChildCards);


//child profile routes
router.get("/child/:childId", verifyToken, getChildProfile);
router.put("/child/:childId", verifyToken, editChildProfile);
router.delete("/child/:childId", verifyToken, deleteChildProfile);
router.post("/child/:childId", verifyToken, testASD);

//test routes
router.get("/tests/:childId", verifyToken, getHistory);
router.get("/tests", verifyToken, getHistory);
router.get("/tests/:childId", verifyToken, getHistory);
router.get("/test/:testId", verifyToken, getTest);

export default router;



