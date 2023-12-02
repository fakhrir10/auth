import express from "express";
import { getUsers, Register,Login } from "../controller/User.js";
import {verifyToken} from "../middleware/VerifyToken.js"
import { refreshToken } from "../controller/refreshToken.js";

const router = express.Router();

router.get('/Users',verifyToken,getUsers);
router.post('/Users', Register);
router.post('/login', Login);
router.get('/token', refreshToken);

export default router;