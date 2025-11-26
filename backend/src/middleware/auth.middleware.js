import jwt from "jsonwebtoken";
import { ENV } from "../config/env.js";

export const authGuard = (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) return res.status(401).json({ message: "No token provided" });

    try {
        const decoded = jwt.verify(token, ENV.JWT_SECRET);
        req.user = decoded; // { id, email }
        next();
    } catch (error) {
        return res.status(401).json({ message: "Invalid or expired token" });
    }
};
