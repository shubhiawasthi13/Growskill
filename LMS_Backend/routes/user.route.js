import express from "express";
import upload from '../utils/multer.js'
import { register, login , getUserProfile, logOut, updateProfile} from "../controllers/user.controller.js";
import  isAuthenticated from '../middlewares/isAuthenticated.js'

const router = express.Router();
router.route("/register").post(register);
router.route("/login").post(login);
router.route("/profile").get( isAuthenticated ,getUserProfile);
router.route("/logout").get(logOut);
router.route("/profile/update").put(isAuthenticated, upload.single("profile"), updateProfile);


export default router;
