import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";
import { verifyGoogleToken } from "../utils/googleVerify.js";
import { ENV } from "../config/env.js";

const prisma = new PrismaClient();


function generateToken(user) {
    return jwt.sign(
        { id: user.id, email: user.email },
        ENV.JWT_SECRET,
        { expiresIn: "7d" }
    );
}

export const signup = async (req, res) => {
    try {
        const { email, password, googleToken } = req.body;

        const googleData = await verifyGoogleToken(googleToken);
        if (!googleData || googleData.email !== email)
            return res.status(400).json({ message: "Google verification failed" });

        const exists = await prisma.user.findUnique({ where: { email } });
        if (exists)
            return res.status(400).json({ message: "Account already exists" });

        const hashed = await bcrypt.hash(password, 10);

        const user = await prisma.user.create({
            data: {
                email,
                password: hashed,
                googleId: googleData.sub,
            },
        });

        const token = generateToken(user);

        res.json({ message: "Signup successful", token, user });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Signup failed" });
    }
};

export const login = async (req, res) => {
    try {
        const { email, password, googleToken } = req.body;

        const googleData = await verifyGoogleToken(googleToken);
        if (!googleData || googleData.email !== email)
            return res.status(400).json({ message: "Google verification failed" });

        const user = await prisma.user.findUnique({ where: { email } });
        if (!user)
            return res.status(404).json({ message: "Account not found" });

        const valid = await bcrypt.compare(password, user.password);
        if (!valid)
            return res.status(400).json({ message: "Incorrect password" });

        const token = generateToken(user);

        res.json({ message: "Login successful", token, user });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Login failed" });
    }
};
