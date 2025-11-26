import { Router } from "express";
import { signup, login } from "../controllers/auth.controller.js";
import { gmailOnly } from "../middleware/emailRestriction.js";

const router = Router();

router.post("/signup", gmailOnly, signup);
router.post("/login", gmailOnly, login);

export default router;
