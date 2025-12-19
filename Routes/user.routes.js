import express from "express";

import { hashPassword } from "../utils/hash.js";
import { signupSchema, loginSchema } from "../validations/request.validation.js";
import { findUserByEmail, createUser, authenticateUser } from "../services/user.service.js";
import { generateToken } from "../utils/token.js";
const router = express.Router();

router.post("/signup", async (req, res) => {
    try {
        const validatedData = await signupSchema.safeParseAsync(req.body);
        if (!validatedData.success) {
            return res.status(400).json({ message: validatedData.error.issues[0]?.message || "Validation failed" });
        }

        const { name, email, password } = validatedData.data;

        const existingUser = await findUserByEmail(email);
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        const { salt, hashedPassword } = hashPassword(password);
        const user = await createUser({ name, email, password: hashedPassword, salt });

        return res.status(201).json({ message: "User created successfully", userId: user.id });
    } catch (error) {
        console.error("Signup error:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
});

router.post("/login", async (req, res) => {
    try {
        const validatedData = await loginSchema.safeParseAsync(req.body);
        if (!validatedData.success) {
            return res.status(400).json({ message: validatedData.error.issues[0]?.message || "Validation failed" });
        }

        const { email, password } = validatedData.data;
        const user = await authenticateUser(email, password);

        if (!user) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        const token = await generateToken({ id: user.id });
        return res.status(200).json({ message: "Login successful", token });

    } catch (error) {
        console.error("Login error:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
});

export default router;
